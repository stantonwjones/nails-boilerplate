// The entry point for the nails executable
var exec = require('child_process').exec;
var args = process.argv.slice(2);
console.log(args);
console.log(__dirname);

var command = 'node ' + __dirname + '/' + args[0] + '.js';

exec( command, function callback(error, stdout, stderr) {
    console.log(stdout);
    if (error) {
        console.log(error);
    }
});