version=$1
if [ "$version" == "" ]; then
  version="live"
fi

if [ "$version" != "live" ] &&
    [ "$version" != "development" ] &&
    [ "$version" != "staging_qa" ] &&
    [ "$version" != "staging_prod" ] &&
    [ "$version" != "production" ]; then
  echo "$version is not a valid version"
  exit 1
fi

# TODO: make sure we're on the master branch
git pull origin master
git tag -d $version
git push origin --delete $version
git tag $version
git push origin $version