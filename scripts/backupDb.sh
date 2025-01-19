#!/bin/bash

if [[ $# -ge 1 ]]; then
    case "$1" in
        dev|qa|stg|prod)
            environment="$1"
        ;;
        *)
            echo "Invalid argument: $1"
            echo "Usage: $0 [dev|qa|stg]"
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
    qa)
        echo "Backing up QA db...."
        env=QA
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


dbPass=$(grep -oP '"dbPass":\s*"\K[^"]+' $SBMT_DIR/appsettings.$env.json)
dbLocalPort=$(grep -oP '"dbLocalPort":\s*"\K[^"]+' $SBMT_DIR/appsettings.$env.json)
dbUser=$(grep -oP '"dbUser":\s*"\K[^"]+' $SBMT_DIR/appsettings.$env.json)
dbName=$(grep -oP '"dbName":\s*"\K[^"]+' $SBMT_DIR/appsettings.$env.json)

export PGPASSWORD=$dbPass


if [ "$env" == "Production" ]; then
    fly proxy $dbLocalPort:5432 -a sbmtpostgres &
    pid=$!
    /bin/sleep 5
    echo "Fly Proxy DB to $dbLocalPort on pid:$pid"
fi

date=$(date +"%Y-%m-%d_%H%M%S")
filename="sbmt_$env.$date.sql"
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