var net = require('net'),
    spawn = require('child_process').spawn,
    config_path = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "/.fracker/",
    fs = require("fs");

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
  fs.readdirSync(config_path).forEach(function(file) {
      var config=require(config_path + file);

    var server = net.createServer(function(connection) {
      createClient(connection, config);
    });

    console.log(config.port);
    server.listen(config.port);
  });
}
