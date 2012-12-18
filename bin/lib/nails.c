/* The entry point for nails console commands */
#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <cstring>

/**
 *  Helper method for trimming the whitespace from strings created from command line output
 */
char *trimwhitespace(char *str) {
  char *end;

  // Trim leading space
  while(isspace(*str)) str++;

  if(*str == 0)  // All spaces?
    return str;

  // Trim trailing space
  end = str + strlen(str) - 1;
  while(end > str && isspace(*end)) end--;

  // Write new null terminator
  *(end+1) = 0;

  return str;
}

int main( int argc, char *argv[] ) {
    if ( argc < 2 ) {
        std::cout << "Not enough arguments" << std::endl;
    } else {
        //system("echo 'system call'");
        FILE *fp;
        int status;
        char path[1035];
        char args[500];
        
        /* concatenate the args to be passed to nails.js script */
        std::strcpy(args, argv[1]);
        for (int i = 2; i < argc; i++) {
            // TODO: refractor this into a function dedicated to processing the additiional arguments
            std::strcat(args, argv[i]);
        }

        /* Open the command for reading. */
        fp = popen("npm root -g", "r");
        if (fp == NULL) {
            printf("Failed to run command\n" );
            return -1;
        }

        /* Read the output line */
        while (fgets(path, sizeof(path)-1, fp) != NULL) {
            char commandPre[] = "node ";
            char comPathSuf[] = "/nails-boilerplate/bin/lib/nails.js ";

            // Concatenate the strings into a command to run the nails script
            char command[std::strlen(commandPre) + std::strlen(path) + std::strlen(comPathSuf) + std::strlen(argv[1]) + 1];
            std::strcpy(command, commandPre);
            std::strcat(command, trimwhitespace(path));
            std::strcat(command, comPathSuf);
            std::strcat(command, argv[1]);
            /* print for testing only */
            //printf("%s", command);
            system(command);
        }

        /* close */
        pclose(fp);

        return 0;
    }
}
