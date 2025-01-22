#!/bin/bash
set -e

dbLocalPort=$1

echo $1

if [ -z "$dbLocalPort" ]; then
    dbLocalPort=5553
fi


echo "port:$dbLocalPort"
fly proxy $dbLocalPort:5432 -a sbmtpostgres
