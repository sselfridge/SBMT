#!/bin/bash
set -e

source ~/.bash_profile

if [[ -z "$SBMT_DIR" ]]; then
    echo "env SBMT_DIR is not set or is empty, aborting backup"
fi

source "$SBMT_DIR/scripts/load_env.sh" $1

if [ $sbmtEnvLoaded != 1 ]; then
    echo "sbmt env not set properly"
    exit 1
fi


dbLocalPort=$DB_LOCAL_PORT
dbUser=$DB_USER
dbPass=$DB_PASS
dbName=$DB_NAME


# Variables to check
REQUIRED_VARS=("dbLocalPort" "dbUser" "dbPass" "dbName")

# Check if each variable is set and non-empty
for VAR in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!VAR}" ]; then
        echo "Error: Required variable '$VAR' is missing or empty."
        exit 1
    fi
done

export PGPASSWORD=$dbPass


if [ "$env" == "Production" ]; then
    fly proxy $dbLocalPort:5432 -a sbmtpostgres &
    pid=$!
    /bin/sleep 5
    echo "Fly Proxy DB to $dbLocalPort on pid:$pid"
fi

if [[ -n "$2" ]]; then
    tag=".$2"
fi

date=$(date +"%Y-%m-%d_%H%M%S")
filename="sbmt_$env.$date$tag.sql"
fullPath="$SBMT_DIR/backups/$filename"
echo "pg_dump -h localhost -p $dbLocalPort -U $dbUser $dbName > $filename"
pg_dump -h localhost -p $dbLocalPort -U $dbUser $dbName > "$fullPath"


# Check if the previous command failed
if [ $? -ne 0 ]; then
    # Delete the file specified by $fullPath if the command failed
    rm -f "$fullPath"
    echo "Previous command failed. File $fullPath has been deleted."
else
    echo "Previous command succeeded. File $fullPath was not deleted."
fi

if [[ ! -f "$fullPath" ]]; then
  echo "Error: File does not exist: $fullPath" >&2
  exit 1
fi

file_size=$(stat -c%s "$fullPath")

if (( file_size < 1024 )); then
  echo "Error: File is smaller than 1KB ($file_size bytes)" >&2
  rm $fullPath
  exit 1
fi


if [[ -n "$DROPBOX_DIR" ]]; then
    echo "DROPBOX_DIR is set to: $DROPBOX_DIR"
    cp "$SBMT_DIR/backups/$filename" "$DROPBOX_DIR/sbmt_dbBackup/$filename"
else
    echo "DROPBOX_DIR is not set or is empty, skipping dropbox backup"
fi

echo "Backed up to: $filename"
if [ "$env" == "Production" ]; then
    echo "closing fly proxy"
    kill $pid
fi

export PGPASSWORD=""