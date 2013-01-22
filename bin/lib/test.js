// a test script for npm bin functionality
console.log('This is just a test.  If you see this message, everything is working.');
var args = process.argv.slice(10);
console.log("the arguments are: ", args);
