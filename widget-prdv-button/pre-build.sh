#!/bin/sh
echo "Current Working Directory: $PWD"
echo "GIT_DIR=$GIT_DIR"
# Needed to avoid "not a git repositoty" error
unset GIT_DIR

if yarn isBranch master; then
  yarn build:production
  git add ../ui/public/assets/bundle.js
fi
if yarn isBranch recette; then
  yarn build:recette
  git add ../ui/public/assets/bundle.js
fi
