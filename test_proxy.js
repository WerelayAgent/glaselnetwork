const handler = require('./api/index.js');
const http = require('http');

const server = http.createServer((req, res) => {
    // Mock Vercel's res.status() and res.send()
    res.status = function(code) {
        this.statusCode = code;
        return this;
    };
    res.send = function(body) {
        this.end(body);
    };
    
    handler(req, res).catch(console.error);
});

server.listen(3000, () => {
    console.log("Listening on 3000");
    
    // Make a test request
    fetch('http://localhost:3000/')
        .then(res => res.text())
        .then(text => {
            console.log("Response starts with:", text.substring(0, 100));
            server.close();
        }).catch(err => {
            console.error(err);
            server.close();
        });
});
