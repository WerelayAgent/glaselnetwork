const handler = require('./api/index.js');
const http = require('http');

const server = http.createServer((req, res) => {
    // Mock Vercel response
    res.status = function(code) {
        this.statusCode = code;
        return this;
    };
    res.send = function(body) {
        this.end(body);
    };
    
    handler(req, res).catch(console.error);
});

server.listen(3001, async () => {
    console.log("Listening on 3001");
    try {
        const response = await fetch('http://localhost:3001/');
        const html = await response.text();
        require('fs').writeFileSync('proxied.html', html);
        console.log("Saved proxied.html. Length:", html.length);
    } catch (e) {
        console.error(e);
    }
    server.close();
});
