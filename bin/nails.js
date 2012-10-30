// the root nails command
var exec = requier('child_process').exec;
var args = process.argv.slice(2);

exec( 'node ' + args[0] + '.js', function callback(error, stdout, stderr) {
    console.log(stdout);
});