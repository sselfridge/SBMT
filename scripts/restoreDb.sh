#!/bin/bash
set -e


source "./load_env.sh" $1

$env=$1

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
