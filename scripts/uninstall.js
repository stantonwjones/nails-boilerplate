// The uninstall script for removing executables// The install script to add executables
var execute = require('child_process').exec;
var os = process.platform;

execute('npm bin -g', deleteSymlinks);

function deleteSymlinks(error, stdout, stderr){
    var symloc = stdout.replace(/\s/g, '');

    if ( os.match(/win32/i) ) {
        command = 'del ' + symloc + '\\nails.bat';
        console.log(command);
        execute(command, handleDeletion);
    } else {
        execute('rm ' + symloc + '/nails', handleDeletion);
    }

}

function handleDeletion(error, stdout, stderr) {
    if (error) console.log('error removing symbolic link');
    else console.log('successfully removed symbolic link');
}