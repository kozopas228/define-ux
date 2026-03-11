#!/bin/bash

SOURCE_CODE_DIR="<YOUR DIRECTORY WITH THE SOURCE CODE>"

cd "$SOURCE_CODE_DIR"

cd ./frontend
npm run build -- --env analyzeBundle=false
aws s3 sync ./dist s3://define-ux-frontend-static --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
