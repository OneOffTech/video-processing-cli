const ConsoleOutput = require("../output/consoleOutput.js");

/**
 * Abstract command, used to run the other commands
 * 
 * @param {Function} command the command to wrap
 */
module.exports = {
  /**
   * Wrap a command to be executed with inputs and outputs
   * 
   * @param {Function} command
   */
  wrap: function(command) {
    return function(...arguments) {
      try {
        var originalCommand = arguments[arguments.length - 1];
        var commandArguments = arguments.slice(0, arguments.length - 1);

        var commandOptions = {};
        var commandInputs = {};

        if (originalCommand.options && originalCommand.options.length > 0) {
          originalCommand.options.map(function(opt) {
            var optionName = opt.long.substring(2);
            commandOptions[optionName] = originalCommand[optionName];
          });
        }

        if (originalCommand._args.length > 0) {
          for (let index = 0; index < originalCommand._args.length; index++) {
            const element = originalCommand._args[index];
            commandInputs[element.name] = commandArguments[index];
          }
        }

        // execute the command, the first parameter are the inputs, while the second the output
        // arguments are the first values in the arguments array
        // options are on the command

        return command(
          {
            arguments: commandInputs,
            options: commandOptions
          },
          ConsoleOutput
        );
      } catch (error) {
        ConsoleOutput.error(error.message);
        process.exit(1);
      }
    };
  }
};
