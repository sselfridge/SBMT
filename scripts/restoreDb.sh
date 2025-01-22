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
export PGUSER=$dbUser

echo "Restore CMD:\n\n"

echo ""
echo "psql -p $dbLocalPort -U $dbUser < $2"
echo ""

read -p "Do you want to continue? (y/N):" response

# Default to 'n' if no input is provided
response=${response:-n}

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "Droping..."
    dropdb -p $dbLocalPort -f $dbName
    echo "Creating..."
    createdb -p $dbLocalPort $dbName
    echo "Restoring."
    psql -p $dbLocalPort -U $dbUser < $2
else
    echo "Restore Aborted"
fi
