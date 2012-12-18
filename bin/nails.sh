# the root nails command
#basedir=$(dirname $0)
#echo $basedir
#BASEDIR=$(echo $basedir | tr -d ' ')
#echo $BASEDIR
#SCRIPTLOC="$BASEDIR/nails.js"
SCRIPTLOC=$(readlink -f $0)
echo $SCRIPTLOC
suff=.sh*
echo $suff
sl=${SCRIPTLOC%.sh*}.js
`node $sl $2`
