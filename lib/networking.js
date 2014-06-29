var exec = require('child_process').exec;

exports.addLo = function(ip) {
  switch (process.platform) {
      // TODO: implement for OSs without ifconfig command
      case 'darwin':
        exec("ifconfig lo0 alias " + ip, function(err, stdout, stderr) {
          // Handle err
        });
        break;
      default:
        console.log("Interface adding not implemented for platform " + process.platform);
  }
};
