// Install script which adds commands for running nails
// to the path
var fs = require('fs');
var wrench = require('wrench');
var exec = require('child_process').exec;
var args = process.argv.slice(2);
console.log(args);
console.log(process.argv);

var appName = args[0];
var originalDir = process.cwd();
var lastDir;
var notRoot = true;

// Make sure an app name was passed
if ( !appName ) {
    console.log("Missing argument for the application name");
    process.exit(1);
}

// check to make sure this is not already a nails app directory
if ( isNailsApp(originalDir) ) {
    console.log("You are already in a Nails Application");
    process.exit(1);
}

createApp(appName);

function isNailsApp( originalDir, directory ) {
    var dir = directory || originalDir;
    process.chdir('..');
    var nextDir = process.cwd();
    var files = fs.readdirSync(dir);
    var nailsAppRootHere = files.indexOf('NAILS') >= 0;
    
    if (nextDir == dir) {
        process.chdir(originalDir);
        return nailsAppRootHere;
    } else {
        return nailsAppRootHere || isNailsApp( originalDir, nextDir );
    }
}

function createApp( name ) {
    var templateRoot =  __dirname + "/../../templates";
    fs.mkdir(name);
    fs.open(name + '/NAILS','w', 0666, function(err, fd) {
        if (err) throw err;
        fs.writeFileSync(name + '/NAILS', '/* This marks the root of the NAILS app */');
        fs.closeSync(fd);

        wrench.copyDirSyncRecursive(templateRoot + '/app', name + '/app');
        wrench.copyDirSyncRecursive(templateRoot + '/assets', name + '/assets');
        wrench.copyDirSyncRecursive(templateRoot + '/config', name + '/config');

        checkWrites();
    });

    fs.open(name + '/server.js','w', 0666, function(err, fd) {
        if (err) throw err;
        fs.readFile(templateRoot + '/server.js', 'utf8', function(err, data) {
            if (err) throw err;
            fs.writeFileSync( name + '/server.js', data );
            //fs.writeFileSync( name + '/server.js', data.replace('XXXXXXX', __dirname + '/../..') );
            fs.closeSync(fd);
            checkWrites();
        });
    });
}

var numWrites = 0;
function checkWrites() {
    numWrites++;
    if (numWrites == 2) {
        console.log("Initialized new Nails Application successfully");
        console.log("installing nails locally");
        // change into app directory
        process.chdir(appName);

        // change back to original directory
        process.chdir('..');
        process.exit(0);
    }
}
