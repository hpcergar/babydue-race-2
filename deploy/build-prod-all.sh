#!/bin/sh

# Build public (calendar) webpack
echo "Building /public"
npm run build

# Build game webpack
echo "Building /game"
cd game && npm run build && cd ..
