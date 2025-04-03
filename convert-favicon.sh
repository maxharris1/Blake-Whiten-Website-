#!/bin/bash
# Simple script to convert an image to a favicon

# Check if the input file exists
if [ ! -f "$1" ]; then
  echo "Error: Input file not found!"
  echo "Usage: $0 <input_image_file>"
  exit 1
fi

# Create a copy in the public directory
cp "$1" public/bw-logo.png

echo "Image copied to public/bw-logo.png and will be used as favicon"
echo "The index.html has already been updated to reference this file" 