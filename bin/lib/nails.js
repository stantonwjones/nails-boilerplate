#!/usr/bin/env node

// The entry point for the nails executable
var exec = require('child_process').exec;
console.log('nailsargs are: ', process.argv);
var args = process.argv.splice(2);

var command = 'node ' + __dirname + '/' + args[0] + '.js';

for (var i = 1; i < args.length; i++) {
    command = command + " " + args[i];
}

//TODO can use require for this
exec( command, function(error, stdout, stderr) {
    console.log(stdout);
    if (error) {
        console.log(error);
    }
});
