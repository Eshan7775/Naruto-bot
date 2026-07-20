#!/bin/bash

# Clear terminal screen
clear

echo "🚀 Starting Naruto Bot..."

# Loop to restart the bot automatically if it crashes
while true; do
    node index.js
    echo "⚠️ Bot stopped or crashed! Restarting in 5 seconds..."
    sleep 5
done
