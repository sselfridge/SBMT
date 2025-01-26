#!/bin/bash
set -e

if [[ $# -ge 1 ]]; then
    case "$1" in
        dev|qa|stg|prod)
            environment="$1"
        ;;
        *)
            echo "Invalid argument: $1"
            echo "Usage: $0 [dev|stg]"
            exit 1
        ;;
    esac
fi

if [[ -n "$SBMT_DIR" ]]; then
    echo "SBMT_DIR is set to: $SBMT_DIR"
else
    echo "env SBMT_DIR is not set or is empty, aborting backup"
    exit 1
fi

env=Development

case "$environment" in
    dev)
        echo "Backing up Development db...."
        env=Development
    ;;
    stg)
        echo "Backing up Staging db...."
        env=Staging
    ;;
    prod)
        echo "Backing up Prod db...."
        env=Production
    ;;
    *)
        echo "Backing up Development db...."
        env=Development
esac



dbLocalPort=$(grep -oP '^DB_LOCAL_PORT=\K.*' $SBMT_DIR/env/$env.env)
dbUser=$(grep -oP '^DB_USER=\K.*' $SBMT_DIR/env/$env.env)
dbPass=$(grep -oP '^DB_PASS=\K.*' $SBMT_DIR/env/$env.env)
dbName=$(grep -oP '^DB_NAME=\K.*' $SBMT_DIR/env/$env.env)

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