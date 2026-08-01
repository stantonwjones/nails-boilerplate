// Install script which adds commands for running nails
// to the path
import path from 'node:path';
import fs from 'node:fs';
import { copySync } from 'fs-extra/esm';
import { Command } from 'commander';



const program = new Command();

program
    .name('nails')
    .description('CLI to manage your webapp');

program
    .command('init <name>')
    .description('Create a new webapp')
    .option('--template <template>')
    .action((name, options) => {
        console.log('Creating new Nails app:', name, options);
    })


// program.command('init <name>')
//     .description('Create a new webapp')
//     .action((name) => {

//     })



var args = process.argv.slice(2);

var templateStyle = 'default';
var templateIndex = args.indexOf('--template');
if (templateIndex === -1) {
    templateIndex = args.indexOf('-t');
}
if (templateIndex !== -1 && args[templateIndex + 1]) {
    templateStyle = args[templateIndex + 1];
    args.splice(templateIndex, 2);
}

var appName = args[0];
var originalDir = process.cwd();

// Make sure an app name was passed
if (!appName) {
    console.log("Missing argument for the application name");
    process.exit(1);
}

// check to make sure this is not already a nails app directory
if (isNailsApp(originalDir)) {
    console.log("You are already in a Nails Application");
    process.exit(1);
}

createApp(appName, templateStyle);

function isNailsApp(originalDir, directory) {
    var dir = directory || originalDir;
    process.chdir('..');
    var nextDir = process.cwd();
    var files = fs.readdirSync(dir);
    var nailsAppRootHere = files.indexOf('NAILS') >= 0;

    if (nextDir == dir) {
        process.chdir(originalDir);
        return nailsAppRootHere;
    } else {
        return nailsAppRootHere || isNailsApp(originalDir, nextDir);
    }
}

function createApp(name, templateStyle) {
    var templateRoot = path.resolve(import.meta.dirname, `../../templates/${templateStyle}`);
    if (!fs.existsSync(name)) fs.mkdirSync(name);
    fs.open(name + '/NAILS', 'w', 0o666, function (err, fd) {
        if (err) throw err;
        fs.writeFileSync(name + '/NAILS', '/* This marks the root of the NAILS app */');
        fs.closeSync(fd);

        const foldersToCopy = ['server', 'src', 'public', 'config', 'common', 'spec', 'bin'];
        for (const folder of foldersToCopy) {
            const srcFolder = path.resolve(templateRoot, `./${folder}`);
            if (fs.existsSync(srcFolder)) {
                copySync(srcFolder, name + '/' + folder);
            }
        }

        checkWrites();
    });

    const filesToCopy = ['vite.config.ts', 'vite-mobile.config.ts', 'capacitor.config.ts'];
    for (const file of filesToCopy) {
        const srcFile = path.resolve(templateRoot, `./${file}`);
        if (fs.existsSync(srcFile)) {
            fs.copyFileSync(srcFile, name + '/' + file);
        }
    }

    //TODO: use toJSON to dynamically create package.json
    //TODO: install dependencies after writing package.json
    fs.open(name + '/package.json', 'w', 0o666, function (err, fd) {
        if (err) throw err;
        fs.readFile(templateRoot + '/package.json', 'utf8', function (err, data) {
            if (err) throw err;
            fs.writeFileSync(name + '/package.json', data.replace('nails_app', name));
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
