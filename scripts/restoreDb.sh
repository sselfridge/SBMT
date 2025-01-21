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

dbLocalPort=$(grep -oP '^DB_LOCAL_PORT=\K.*' $SBMT_DIR/env/$env.env)
dbUser=$(grep -oP '^DB_USER=\K.*' $SBMT_DIR/env/$env.env)
dbPass=$(grep -oP '^DB_PASS=\K.*' $SBMT_DIR/env/$env.env)
dbName=$(grep -oP '^DB_NAME=\K.*' $SBMT_DIR/env/$env.env)

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
