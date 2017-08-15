#!/usr/bin/env node

const http = require('http');
const yargs = require('yargs');
const prettyjson = require('prettyjson')

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
  console.log("Received request . . .")
  let body = [];
  request.on('error', (error) => {
    console.error(error);
  })
  .on('data', (chunk) => {
    body.push(chunk);
  })
  .on('end', (chunk) => {
    body = Buffer.concat(body).toString();
    console.log("Headers")
    console.log(prettyjson.render(request.headers));
    console.log("Body")
    console.log(prettyFormatRequestBody(body));
  });
  response.writeHead(200);
  request.pipe(response);
}).listen(portNum);
console.log('Server listening on port ' + portNum)

function prettyFormatRequestBody(requestBody) {
  try {
    if (typeof body !== "undefined") {
      var bodyAsObject = JSON.parse(body);
      return prettyjson.render(bodyAsObject, {usePlatformEol: true});
    }
  } catch (e) {
    // ignore non json body formats
  }
  return requestBody;
}

function isValidPortNum(portNum) {
  return portNum != null && portNum >= 0 && portNum <= 65536;
}
