#!/bin/bash

git pull

dotnet publish -c Release

cd /home/azureuser/reactAppDotnet/bin/Release/net6.0/publish/
pm2 restart sbmt