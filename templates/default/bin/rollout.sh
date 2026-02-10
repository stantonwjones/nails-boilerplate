# make sure no one can run the script on their local machine
stage=$1
if [ "$stage" = "" ]; then
  stage="live"
fi

if [ "$stage" != "live" ] &&
    [ "$stage" != "development" ] &&
    [ "$stage" != "staging_qa" ] &&
    [ "$stage" != "staging_prod" ] &&
    [ "$stage" != "production" ]; then
  echo "$stage is not a valid release stage"
  exit 1
fi

current_hostname=$(hostname)

# TODO: find a better way to do this rather than listing them all out. Maybe some kind of dynamic list checking.
com_suffix=".com"
dev_suffix=".dev"
app_suffix=".app"
net_suffix=".net"
org_suffix=".org"


if [[ $current_hostname != *$com_suffix &&
      $current_hostname != *$dev_suffix &&
      $current_hostname != *$app_suffix &&
      $current_hostname != *$net_suffix &&
      $current_hostname != *$org_suffix ]]; then
    echo "This script cannot be run on your local machine and must be run on a server"
    exit 1
fi

echo "Running checkout_live.sh version $stage on `date`"

# check if the repo is up to date by comparing hashes for the live tag
remote_hash=$(git ls-remote --tags origin "$stage" | awk '{ print $1 }')
local_hash=$(git rev-list -n 1 $stage)

# get the latest updates from the repo if out of date
if [ $remote_hash != $local_hash ]; then
    date=`date`
    echo "Checkout $NAME running at: $date"
    echo "Checkout $NAME running at: $date" 1>&2 # write date to stderr as well
    echo "`dirname $0`"
    echo "`dirname $0`" 1>&2
    git fetch --all --tags --force
    git checkout tags/$stage
    npm install
else
    echo "Repository is not out of date. Exiting..."
    exit 0
fi

# TODO: add conditional when real test added

# test
npm test # currently an echo noop

# restart parkway
/usr/sbin/service $NAME-$stage restart

changelog=`git log $local_hash..$remote_hash --oneline`

# send email
user=$(whoami)
message="The latest $NAME changes have been deployed to $stage at $date by $user\n$changelog"
recipient="eng@projectinvicta.com"
subject="Automated deploy of $NAME: $stage"
echo $message | mail -s "$subject" $recipient
echo "Mail sent"

exit 0