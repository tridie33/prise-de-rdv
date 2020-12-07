#!/bin/sh

if yarn isBranch master; then 
  yarn build:production
  git add ../ui/public/assets/bundle.js
fi
if yarn isBranch recette; then 
  yarn build:recette
  git add ../ui/public/assets/bundle.js
fi
if yarn isBranch v0; then 
  yarn build:recette
  git add ../ui/public/assets/bundle.js
fi