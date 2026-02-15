const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8000;

http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
  const extname = path.extname(filePath);
  let contentType = "text/html";

  if (extname === ".js") contentType = "text/javascript";
  else if (extname === ".css") contentType = "text/css";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
}).listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
