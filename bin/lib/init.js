// Install script which adds commands for running nails
// to the path
import path from 'node:path';
import fs from 'node:fs';
// TODO: wrench is deprecated. check out node-fs-extra
import wrench from 'wrench';
// var wrench = require('wrench');
import {exec} from 'child_process';
// var exec = require('child_process').exec;
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
        process.chdir(originalDir);
        return nailsAppRootHere;
    } else {
        return nailsAppRootHere || isNailsApp( originalDir, nextDir );
    }
}

function createApp( name ) {
    var templateRoot =  path.resolve(import.meta.dirname, "../../templates");
    if (!fs.existsSync(name)) fs.mkdirSync(name);
    fs.open(name + '/NAILS','w', 0o666, function(err, fd) {
        if (err) throw err;
        fs.writeFileSync(name + '/NAILS', '/* This marks the root of the NAILS app */');
        fs.closeSync(fd);

        wrench.copyDirSyncRecursive(path.resolve(templateRoot, './server'), name + '/server');
        wrench.copyDirSyncRecursive(path.resolve(templateRoot, './client'), name + '/client');
        wrench.copyDirSyncRecursive(path.resolve(templateRoot, './config'), name + '/config');
        wrench.copyDirSyncRecursive(path.resolve(templateRoot, './common'), name + '/common');
        wrench.copyDirSyncRecursive(path.resolve(templateRoot, './spec'), name + '/spec');
        wrench.copyDirSyncRecursive(path.resolve(templateRoot, './bin'), name + '/bin');

        checkWrites();
    });

    //fs.copyFileSync(templateRoot + '/.babelrc', name + '/.babelrc');
    fs.copyFileSync(path.resolve(templateRoot, './vite.config.ts'), name + '/vite.config.ts');

    // fs.open(name + 'bin/server.js','w', 0o666, function(err, fd) {
    //     if (err) throw err;
    //     fs.readFile(path.resolve(templateRoot,'./bin/server.js'), 'utf8', function(err, data) {
    //         if (err) throw err;
    //         fs.writeFileSync( name + '/server.js', data );
    //         fs.closeSync(fd);
    //         checkWrites();
    //     });
    // });

    //TODO: use toJSON to dynamically create package.json
    //TODO: install dependencies after writing package.json
    fs.open(name + '/package.json','w', 0o666, function(err, fd) {
        if (err) throw err;
        fs.readFile(templateRoot + '/package.json', 'utf8', function(err, data) {
            if (err) throw err;
            fs.writeFileSync( name + '/package.json', data.replace('nails_app', name) );
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
