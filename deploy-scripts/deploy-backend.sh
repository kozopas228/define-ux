#!/bin/bash

USER="ec2-user"
HOST="111.111.111.111"
SOURCE_CODE_DIR="<YOUR DIRECTORY WITH THE SOURCE CODE>"

cd "$SOURCE_CODE_DIR"

pwd
zip -r ./backend.zip ./backend -x -x "*/node_modules/*" "*/dist/*"
scp -i ../DefineUXKeyPair.pem -r ./backend.zip "$USER@$HOST":/home/ec2-user
rm ./backend.zip

ssh "$USER@$HOST" -i ../DefineUXKeyPair.pem << EOF
  sudo pm2 kill
  cd app
  sudo rm -rf ./*
  cd ..
  mv backend.zip app/
  cd app
  unzip backend.zip
  cd backend/
  sudo npm install
  sudo npm run build
  sudo NODE_ENV=production pm2 start ./dist/main.js
EOF

