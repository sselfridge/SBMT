#!/bin/bash

echo $ASPNETCORE_ENVIRONMENT

case "$ASPNETCORE_ENVIRONMENT" in
    Staging)
        DB_PORT=$DB_LOCAL_PORT
        DB_SERVER=localhost
    ;;
    Production)
        DB_PORT=$DB_LOCAL_PORT
        DB_SERVER=localhost
    ;;
    *)
        env=Development
esac


dotnet ef $1 $2 $3