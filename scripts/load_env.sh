#!/bin/bash

# Run with `source load_env.sh [env file]`

# Path to your .env file
ENV_FILE="../env/$1"
echo $ENV_FILE
# Check if the file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE file not found!"
    exit 1
fi

# Export each variable in the .env file to the current environment
while IFS='=' read -r key value; do
    echo $key
    echo $value
    # Ignore empty lines or lines starting with '#'
    if [[ -n "$key" && "$key" != \#* ]]; then
        # Remove any surrounding whitespace and quotes from the value
        value=$(echo "$value" | xargs | sed -e 's/^"//' -e 's/"$//')
        export "$key"="$value"
    fi
done < "$ENV_FILE"

echo "Environment variables loaded from $ENV_FILE."
