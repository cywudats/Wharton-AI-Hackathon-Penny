#!/bin/bash

# Sample Usage: ./run_categorizer.sh food 1 102

# Get the base directory for the images from the first command line argument
IMAGE_BASE_DIR=$1

# Linux commad to change the file names: cd food && ls | cat -n | while read n f; do mv "$f" "example_${n}.jpg"; done

# Get the starting and ending numbers for the image filenames from the command line arguments
START=$2
END=$3

# Define the CSV file to store the results
CSV_FILE="receipts_summary.csv"

# Add CSV headers
echo "File Name,Date,Total Expense,Main Category,Sub Category" > "$CSV_FILE"

# Loop through the sequence and process each image with receipt_categorizer.py
for ((i=START; i<=END; i++))
do
    IMAGE_FILENAME="example_$i.jpg"
    echo "Processing $IMAGE_BASE_DIR/$IMAGE_FILENAME..."
    
    # Capture the output of the script
    OUTPUT=$(python receipt_categorizer.py "$IMAGE_BASE_DIR/$IMAGE_FILENAME")
    echo "$OUTPUT"
    
    # Parse the output and extract values using awk
    DATE=$(echo "$OUTPUT" | awk -F', ' '{print $1}' | awk -F': ' '{print $2}')
    EXPENSE=$(echo "$OUTPUT" | awk -F', ' '{print $2}' | awk -F': ' '{print $2}')
    MAIN_CATEGORY=$(echo "$OUTPUT" | awk -F', ' '{print $3}' | awk -F': ' '{print $2}')
    SUB_CATEGORY=$(echo "$OUTPUT" | awk -F', ' '{print $4}' | awk -F': ' '{print $2}')

    # Check if values are not empty then append to CSV
    if [[ -n "$DATE" && -n "$EXPENSE" && -n "$MAIN_CATEGORY" && -n "$SUB_CATEGORY" ]]; then
        echo "$IMAGE_FILENAME,$DATE,$EXPENSE,$MAIN_CATEGORY,$SUB_CATEGORY" >> "$CSV_FILE"
    fi
done

echo "All images processed. Summary saved to $CSV_FILE."
