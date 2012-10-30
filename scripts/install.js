// The install script to add executables
var execute = require('child_process').exec;
var fs = require('fs');
var os = process.platform;

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