var net = require('net'),
    config_path = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "/.fracker/",
    fs = require("fs"),
    networking = require("./networking");

function createClient(connection, item) {
  var client = net.connect({port: item.map_to});

  client.once('error', function() {
    var plugin = require("./plugins/" + item.plugin),
        child = plugin.start(item);

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

    if (!config.plugin) {
      console.error("Plugin not set for: " + file);
      return;
    }

    var server = net.createServer(function(connection) {
      createClient(connection, config);
    });

    console.log(config.ip + ":" + config.port);

    if (config.ip)
      networking.addLo(config.ip);

    server.listen(config.port, config.ip);
  });
}
