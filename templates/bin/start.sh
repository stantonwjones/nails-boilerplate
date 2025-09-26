SCRIPT_DIR=$(dirname "$0")
echo "Script directory (relative): $SCRIPT_DIR"


SCRIPT_PATH=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")
echo "Script directory (absolute, resolved): $SCRIPT_DIR"

npm --prefix=$SCRIPT_DIR/.. start