const http = require("http");

const requestListener = (req, res) => {
  if (req.url.includes("/") && req.method.includes("GET")) {
    res.writeHead(200);
    res.end("Hello World");
  }
};

const server = http.createServer(requestListener);

server.listen(8080, () => {
  console.log("Server turning on : http://localhost:8080");
});
