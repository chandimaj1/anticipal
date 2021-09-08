#! /bin/bash

git add .
echo "Describe Commit:"
read COMMIT
git commit -m "$COMMIT"
git ftp push --remote-root public_html
echo "Uploaded !"