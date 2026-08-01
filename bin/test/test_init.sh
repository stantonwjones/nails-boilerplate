#!/bin/bash

# Store the fully qualified location of the local nails module directory
NAILS_MODULE_DIR=$(pwd)

TEMPLATES=("default" "mcp" "mobile")

for TEMPLATE in "${TEMPLATES[@]}"; do
    echo "=========================================="
    echo "Testing template: $TEMPLATE"
    echo "=========================================="

    # Create a temporary directory for the test project with a datestring
    DATE_STRING=$(date +%Y%m%d%H%M%S)
    TEST_DIR="/tmp/test_project_${TEMPLATE}_$DATE_STRING"
    mkdir -p $TEST_DIR

    # Create a new nails project using the local version of nails-boilerplate and specific template
    npx $NAILS_MODULE_DIR/ init $TEST_DIR --template $TEMPLATE

    # Change directory to the test project
    cd $TEST_DIR

    # Link the local @projectinvicta/nails module
    npm link $NAILS_MODULE_DIR

    # Install other dependencies
    npm install --legacy-peer-deps

    # Run tests in the new test project (using pool=forks and passWithNoTests in case the template has no tests)
    npm test -- --pool=forks --passWithNoTests

    # Return to the original nails module directory
    cd $NAILS_MODULE_DIR

    # Unlink the local @projectinvicta/nails module
    npm unlink @projectinvicta/nails

    # Clean up the temporary directory
    rm -rf $TEST_DIR
done
