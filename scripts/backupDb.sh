#!/bin/bash
set -e

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
echo "pg_dump -p $dbLocalPort -U $dbUser $dbName > $filename"
pg_dump -p $dbLocalPort -U $dbUser $dbName > "$SBMT_DIR/backups/$filename"

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