#!/bin/bash

# Store the fully qualified location of the local nails module directory
NAILS_MODULE_DIR=$(pwd)

# Create a temporary directory for the test project with a datestring
DATE_STRING=$(date +%Y%m%d%H%M%S)
TEST_DIR="/tmp/test_project_$DATE_STRING"
mkdir -p $TEST_DIR

# Create a new nails project using the local version of nails-boilerplate
npx $NAILS_MODULE_DIR/ init $TEST_DIR

# Change directory to the test project
cd $TEST_DIR

# Link the local @projectinvicta/nails module
npm link $NAILS_MODULE_DIR

# Install other dependencies
npm install

# Run tests in the new test project
npm test

# Return to the original nails module directory
cd $NAILS_MODULE_DIR

# Unlink the local @projectinvicta/nails module
npm unlink @projectinvicta/nails

# Clean up the temporary directory
rm -rf $TEST_DIR
