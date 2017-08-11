const http = require('http');
const yargs = require('yargs');

const argv = yargs
  .option('port', {
    alias: 'p',
    describe: 'port to listen on',
    default: 5000
  })
  .help()
  .argv;

const portNum = argv.port;
if (!isValidPortNum(portNum)) {
  console.error('Invalid port number.');
  return;
}

http.createServer(function(request, response) {
  let body = [];
  request.on('error', (error) => {
    console.error(error);
  })
  .on('data', (chunk) => {
    body.push(chunk);
  })
  .on('end', (chunk) => {
    body = Buffer.concat(body).toString();
    console.log(request.headers);
    console.log(body);
  });
  response.writeHead(200);
  request.pipe(response);
}).listen(portNum);
console.log('Server listening on port ' + portNum)

function isValidPortNum(portNum) {
  return portNum != null && portNum >= 0 && portNum <= 65536;
}
