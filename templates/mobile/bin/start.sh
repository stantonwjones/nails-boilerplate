SCRIPT_DIR=$(dirname "$0")
echo "Script directory (relative): $SCRIPT_DIR"

COMMAND=$1
if [[ -z "${COMMAND}" ]]; then
  COMMAND=start
else
  echo "COMMAND is NOT empty."
fi


SCRIPT_PATH=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")
echo "Script directory (absolute, resolved): $SCRIPT_DIR"

npm --prefix=$SCRIPT_DIR/.. run $COMMAND -- $2 $3 $4 $5 $6 $7 $8 $9