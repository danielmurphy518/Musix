#!/bin/bash

# Run npm start in the client folder
echo "Starting client..."
cd client
npm start &

# Run node server.js in the server folder
echo "Starting server..."
cd ../server
node server.js &
