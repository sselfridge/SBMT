#!/usr/bin/bash

# git pull command from running on azure

git pull

dotnet publish -c Release

cd /home/azureuser/SBMT_TODO/bin/Release/net6.0/publish/

pm2 restart sbmt