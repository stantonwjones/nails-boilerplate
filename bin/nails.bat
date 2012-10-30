:: the root nails batch command
SET BASEDIR=%~dp0
SET SCRIPTLOC=%BASEDIR%node_modules\nails-boilerplate\bin\nails.js

::set /p SCRIPTLOC= < npm root
node %SCRIPTLOC% %1
::node nails.js %1