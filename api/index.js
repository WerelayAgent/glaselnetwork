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
        
        // These replacements MUST be identical across both HTML and JS to prevent React Hydration Mismatch
        const sharedReplacements = [
            { old: /Robinhood Chain/g, new: "Solana" },
            { old: /robinhood/g, new: "solana" },
            { old: /Ether(?!net)/g, new: "SOL" },
            { old: /\bETH\b/g, new: "SOL" },
            { old: /0xf90C73ad8D700115afd8175eB2C1953C80d45157/g, new: "coming soon on pump.fun" },
            { old: /0xf90C…5157/g, new: "coming soon on pump.fun" },
            { old: /Glasel — Private computation on a public chain\./g, new: "Glasel Network — Private computation on Solana." }
            // Note: Massive code block replacements were removed because HTML code blocks are split by Shiki <span> tags.
            // Replacing them in the JSON payload but missing them in the HTML DOM caused the fatal hydration crash!
        ];

        if (contentType.includes('text/html')) {
            let text = await response.text();
            
            for (let r of sharedReplacements) {
                text = text.replace(r.old, r.new);
            }
            
            // HTML-specific aggressive replacement for "Glasel"
            const htmlReplacements = [
                { old: /Glasel Network/g, new: "Glasel" },
                { old: /Glaselxyz/g, new: "TEMPXYZ" },
                { old: /GlaselOS/g, new: "TEMPOS" },
                
                { old: /Glasel/g, new: "Glasel Network" },
                
                { old: /TEMPXYZ/g, new: "Glaselxyz" },
                { old: /TEMPOS/g, new: "GlaselOS" }
            ];
            
            for (let r of htmlReplacements) {
                text = text.replace(r.old, r.new);
            }
            
            return res.send(text);
        } else if (contentType.includes('application/javascript') || contentType.includes('text/javascript')) {
            let text = await response.text();
            
            for (let r of sharedReplacements) {
                text = text.replace(r.old, r.new);
            }
            
            // JS-specific CONSERVATIVE replacement for "Glasel" to avoid syntax errors
            const jsReplacements = [
                { old: /"Glasel"/g, new: '"Glasel Network"' },
                { old: /'Glasel'/g, new: "'Glasel Network'" },
                { old: /`Glasel`/g, new: "`Glasel Network`" },
                { old: /\\"Glasel\\"/g, new: '\\"Glasel Network\\"' }
            ];
            
            for (let r of jsReplacements) {
                text = text.replace(r.old, r.new);
            }
            
            return res.send(text);
        } else {
            const arrayBuffer = await response.arrayBuffer();
            return res.send(Buffer.from(arrayBuffer));
        }
    } catch (err) {
        console.error("Proxy Error:", err);
        return res.status(500).send("Proxy Error");
    }
};
