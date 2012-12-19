// The entry point for the nails executable
var exec = require('child_process').exec;
var args = process.argv[2].split(" ");

var command = 'node ' + __dirname + '/' + args[0] + '.js';

for (var i = 1; i < args.length; i++) {
    command = command + " " + args[i];
}

exec( command, function callback(error, stdout, stderr) {
    console.log(stdout);
    if (error) {
        console.log(error);
    }
});
