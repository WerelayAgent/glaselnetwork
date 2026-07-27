module.exports = async (req, res) => {
    const TARGET = 'https://glasel.xyz';
    const targetUrl = TARGET + req.url;

    try {
        const headers = { ...req.headers };
        delete headers.host;
        delete headers['accept-encoding']; 
        
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: headers,
            body: (req.method !== 'GET' && req.method !== 'HEAD') ? req.body : undefined,
            redirect: 'manual'
        });

        res.status(response.status);

        response.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            if (lowerKey !== 'content-encoding' && lowerKey !== 'content-length' && lowerKey !== 'transfer-encoding') {
                res.setHeader(key, value);
            }
        });

        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('text/html')) {
            let text = await response.text();
            
            // 100% BULLETPROOF METHOD:
            // Do NOT touch the HTML or React JSON payloads server-side!
            // Just inject our client-side mutation script before </head>.
            // React will hydrate perfectly with zero mismatches, and then the script will do the rebranding.
            text = text.replace('</head>', '<script src="/rebrand.js" defer></script></head>');
            
            return res.send(text);
        } else {
            // Forward everything else (JS, CSS, images, etc.) untouched.
            const arrayBuffer = await response.arrayBuffer();
            return res.send(Buffer.from(arrayBuffer));
        }
    } catch (err) {
        console.error("Proxy Error:", err);
        return res.status(500).send("Proxy Error");
    }
};
