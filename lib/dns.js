var dns = require('native-dns');

exports.init = function(records) {
  var server = dns.createServer();

  server.on('request', function (request, response) {
    Object.keys(records).forEach(function(hostName) {
      var ip = records[hostName];

      response.answer.push(dns.A({
        name: hostName + ".tun",
        address: ip,
        ttl: 600,
      }));
    });

    response.send();
  });

  server.on('error', function (err, buff, req, res) {
    console.log(err.stack);
  });

  server.serve(31338);
};
