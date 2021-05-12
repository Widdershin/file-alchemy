const http = require("http");
const fs = require("fs");
const path = require("path");

function renderFileLink(p, name) {
  return `<li><a href="${path.join(p, name)}">${name}</a></li>`;
}

const port = parseInt(process.argv[2], 10) || 3042;
const host = process.argv[3] || "127.0.0.1";
const proxy = http.createServer((req, res) => {
  let p = path.join(".", req.url);

  try {
    if (p.endsWith(".wasm")) {
      res.setHeader("Content-Type", "application/wasm");
    }
    if (p.endsWith(".js")) {
      res.setHeader("Content-Type", "text/javascript");
    }
    res.write(fs.readFileSync(p));
  } catch (e) {
    res.write(e.toString());
  }
  res.end();
});

console.log(`Listening on ${host}:${port}`);
proxy.listen(port, host);
