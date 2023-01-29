#!/bin/sh

# Build public (calendar) webpack
echo "Building /public"
npm run build-dev

# Build game webpack
echo "Building /game"
cd game && npm run build && cd ..
