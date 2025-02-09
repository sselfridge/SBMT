#!/bin/bash
set -e

# Check if the correct number of arguments is provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 {dev|stg|prod} file.sql"
    exit 1
fi

# Validate the first argument
case $1 in
    dev|stg|prod)
        # Valid argument, do nothing
        ;;
    *)
        echo "Error: The first argument must be one of 'dev', 'stg', or 'prod'."
        exit 1
        ;;
esac

# Validate the second argument
if [[ ! -f $2 ]]; then
    echo "Error: The file '$2' does not exist."
    exit 1
fi

if [[ $2 != *.sql ]]; then
    echo "Error: The file '$2' must end with '.sql'."
    exit 1
fi

echo SBMT $SBMT_DIR

source "$SBMT_DIR/scripts/load_env.sh" $1

env=$1

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
    dropdb -h localhost -p $dbLocalPort -f $dbName
    echo "Creating..."
    createdb -h localhost -p $dbLocalPort $dbName
    echo "Restoring."
    psql -h localhost -p $dbLocalPort -U $dbUser < $2
else
    echo "Restore Aborted"
fi
