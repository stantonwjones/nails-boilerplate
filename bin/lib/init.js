// Install script which adds commands for running nails
// to the path
var wrench = require('wrench');
var exec = require('child_process').exec;
var args = process.argv.slice(2);

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
        process.chdir(oringalDir);
        return nailsAppRootHere;
    } else {
        return nailsAppRootHere || isNailsApp( originalDir, nextDir );
    }
}

function createApp( name ) {
    var templateRoot =  __dirname + "/../../template";
    fs.mkdir(name);
    fs.writeFileSync('name/NAILS', '/* This marks the root of the NAILS app */');
    wrench.copyDirSyncRecursive(templateRoot + '/app', name);
    wrench.copyDirSyncRecursive(templateRoot + '/assets', name);
    wrench.copyDirSyncRecursive(templateRoot + '/config', name);

    fs.readFile(templateRoot + '/server.js', 'utf8', function(err, data) {
        if (err) throw err;
        fs.writeFileSync( 'name/server.js', data.replace('XXXXXXX', __dirname + '/../..') );
        console.log("Initialized new Nails Application successfully");
        exit(0);
    });
}
