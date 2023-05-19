#!/bin/sh

# Build public (calendar) webpack
echo "Building /public"
npm i
npm run build

# Build game webpack
echo "Building /game"
cd game && npm i && npm run build && cd ..
