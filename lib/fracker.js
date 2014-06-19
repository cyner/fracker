var net = require('net'),
    spawn = require('child_process').spawn,
    nconf = require('nconf'),
    config_path = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "/.config/fracker/config.json";;

nconf.argv()
     .env()
     .file({ file: config_path });

function createClient(connection, item) {
  var client = net.connect({port: item.map_to});

  client.once('error', function() {
    var child = spawn('ssh', ['-fN', '-o', 'ExitOnForwardFailure yes', '-L', item.map_to + ':' + item.destination, item.ssh_to]);

    child.on('exit', function() {
      createClient(connection, item);
    });
  });

  client.on('connect', function() {
    connection.on('data', function(data) {
      client.write(data);
    });

    client.on('data', function(data) {
      connection.write(data);
    });
  });
}

exports.init = function() {
  nconf.get('servers').forEach(function(item) {
    var server = net.createServer(function(connection) {
      createClient(connection, item);
    });

    server.listen(item.port);
  });
}
