// The install script to add executables
var execute = require('child_process').exec;
var fs = require('fs');
var os = process.platform;

// Compile nails.c
// get the directories
var sourceloc = __dirname + "/../bin/lib/nails.c";
var destloc = __dirname + "/../bin/nails";

if ( os.match(/win32/i) ) {
    // use a compiler for windows
} else {
    // use the GNU compiler g++
    execute("g++ " + sourceloc + " -o " + destloc, handleCompile);    
}

function handleCompile( error, stdout, stderr ) {
    if (error) {
        console.log("Error compiling nails.c");
        console.log(error);
        process.exit(1);
    }
    console.log("Successfully compiled Nails binary");
    process.exit(0);
}

/* This is now being handled by npm
execute('npm bin -g', createSymlinks);

function createSymlinks(error, stdout, stderr){
    var symloc = stdout.replace(/\s/g, '');

    if ( os.match(/win32/i) ) {
        var command = 'mklink ' + symloc + '\\nails.bat ' +
            __dirname +"\\..\\bin\\nails.bat";
        console.log(command);
        execute(command, handleSymlink);
    } else {
        execute('ln -s ' + __dirname +"/../bin/nails.sh" +
            symloc + '/nails', handleSymlink);
    }

}

function handleSymlink(error, stdout, stderr) {
    if (error) {
        console.log('error adding symbolic link');
        console.log(error);
    }
    else console.log('successfully add symbolic link');
}
*/
