#!/bin/bash
set -e
# Run from root `source "./scripts/load_env.sh [env]"`

# The ugly bit we don't want to do but avoids so much of this pain
meName="load_env.sh"
sbmtEnvLoaded=0


# The test. Works are sh, bash, dash - possibly others? And on all platforms.
isSourced=0
[ "${0##*/}" != "${meName}" ] && isSourced=1

# In use
if [ $isSourced != 1 ]; then
    echo "Must run with 'source' before script"
    exit 1
else
    
    if [[ $# -ge 1 ]]; then
        case "$1" in
            dev|stg|prod)
                environment="$1"
            ;;
            *)
                echo "Invalid argument: $1"
                echo "Usage: source $0 [dev|stg]"
            ;;
        esac
    fi
    
    env=Development
    
    case "$environment" in
        dev)
            env=Development
        ;;
        stg)
            env=Staging
        ;;
        prod)
            env=Production
        ;;
        *)
            env=Development
    esac
    
    
    
    # Path to your .env file
    ENV_FILE="$SBMT_DIR/env/$env.env"
    # Check if the file exists
    if [ ! -f "$ENV_FILE" ]; then
        echo "Error: $ENV_FILE file not found!"
    fi
    
    # Export each variable in the .env file to the current environment
    while IFS='=' read -r key value; do
        # echo $key
        # echo $value
        # Ignore empty lines or lines starting with '#'
        if [[ -n "$key" && "$key" != \#* ]]; then
            # Remove any surrounding whitespace and quotes from the value
            value=$(echo "$value" | xargs | sed -e 's/^"//' -e 's/"$//')
            export "$key"="$value"
        fi
    done < "$ENV_FILE"
    
    echo -e "ENV loaded from $env \033[1;33m$env\033[0m"
    sbmtEnvLoaded=1
    
fi


