#!/bin/bash

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
    echo "env SBMT_DIR is not set or is empty, aborting restore"
    exit 1
fi

env=Development

case "$environment" in
    dev)
        echo "Restoring Development db...."
        env=Development
    ;;
    stg)
        echo "Restoring Staging db...."
        env=Staging
    ;;
    prod)
        echo "Restoring Prod db...."
        env=Production
    ;;
    *)
        echo "Restoring Development db...."
        env=Development
esac

dbPass=$(grep -oP '"dbPass":\s*"\K[^"]+' $SBMT_DIR/appsettings.$env.json)
dbPort=$(grep -oP '"dbPort":\s*"\K[^"]+' $SBMT_DIR/appsettings.$env.json)
dbUser=$(grep -oP '"dbUser":\s*"\K[^"]+' $SBMT_DIR/appsettings.$env.json)
dbName=$(grep -oP '"dbName":\s*"\K[^"]+' $SBMT_DIR/appsettings.$env.json)

export PGPASSWORD=$dbPass

echo "psql -p $dbPort -U $dbUser $dbName -f $2"

read -p "Do you want to continue? (y/N):" response

# Default to 'n' if no input is provided
response=${response:-n}

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "Restoring."
    psql -p $dbPort -U $dbUser $dbName -f $2
else
    echo "Restore Aborted"
fi
