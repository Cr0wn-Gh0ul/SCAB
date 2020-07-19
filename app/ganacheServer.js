const ganache = require("ganache-cli");
const server = ganache.server();

server.listen(8545, function(err, blockchain) {});
