var config = require('./config.json');
var net = require('net');
var spawn = require('child_process').spawn;

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

config.forEach(function(item) {
  var server = net.createServer(function(connection) {
    createClient(connection, item);
  });

  server.listen(item.port);
});
