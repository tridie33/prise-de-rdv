#!/bin/sh
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
