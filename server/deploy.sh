#!/bin/bash
# Compiles using build.sh and deploys into azure vm
BUILD_SCRIPT="./build.sh"
OUTPUT_FILE="server.jar"
VM_USER="azureuser"
VM_URL="$VM_USER@ferafera.ddns.net"

echo "Building $OUTPUT_FILE with $BUILD_SCRIPT..."
if [ -f "$BUILD_SCRIPT" ]; then
    "$BUILD_SCRIPT"
else
    echo "Error: Build script not found."
    exit 1
fi

if [ ! -f "$OUTPUT_FILE" ]; then
    echo "Error: $OUTPUT_FILE not created."
    exit 1
fi

echo "Transferring $OUTPUT_FILE to $VM_URL..."
scp "$OUTPUT_FILE" "$VM_URL:/home/$VM_USER"
if [ $? -ne 0 ]; then
    echo "Error: File transfer failed."
    exit 1
fi

echo "Killing previous $OUTPUT_FILE..."
ssh "$VM_URL" "
    sudo pkill -f \"$OUTPUT_FILE\"
    echo 'Existing server stopped, if any.'
"

echo "Starting $OUTPUT_FILE on the VM..."
ssh "$VM_URL" "
    sudo nohup java -jar $OUTPUT_FILE > server.out 2>&1 &
    echo 'Server started successfully!'
"
if [ $? -ne 0 ]; then
    echo "Error: Failed to start server.jar on the VM."
    exit 1
fi

echo "Press any key to continue."
read -n 1
