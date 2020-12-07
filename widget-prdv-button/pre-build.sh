#!/bin/sh

if yarn isBranch master; then yarn build:production; fi
if yarn isBranch recette; then yarn build:recette; fi
if yarn isBranch v0; then yarn build:recette; fi