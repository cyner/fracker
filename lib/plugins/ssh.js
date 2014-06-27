var spawn = require('child_process').spawn;

exports.start = function(item) {
  return spawn('ssh', ['-fN', '-o', 'ExitOnForwardFailure yes', '-L', item.map_to + ':' + item.destination, item.ssh_to]);
}
