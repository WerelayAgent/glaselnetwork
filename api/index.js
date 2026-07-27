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
            
            // In HTML, we must aggressively replace both the raw HTML AND the JSON-escaped RSC payload
            // to ensure React Hydration perfectly matches.
            
            const htmlReplacements = [
                { old: /Robinhood Chain/g, new: "Solana" },
                { old: /robinhood/g, new: "solana" }, // Lowercase
                { old: /Ether(?!net)/g, new: "SOL" },
                { old: /\bETH\b/g, new: "SOL" },
                { old: /0xf90C73ad8D700115afd8175eB2C1953C80d45157/g, new: "coming soon on pump.fun" },
                { old: /0xf90C…5157/g, new: "coming soon on pump.fun" },
                
                // For Glasel -> Glasel Network, doing it globally in HTML is safe because it's just content/JSON data
                // We do a temporary swap to avoid doubling
                { old: /Glasel Network/g, new: "Glasel" },
                { old: /Glaselxyz/g, new: "TEMPXYZ" },
                { old: /GlaselOS/g, new: "TEMPOS" },
                { old: /Glasel/g, new: "Glasel Network" },
                
                // Restore
                { old: /TEMPXYZ/g, new: "Glaselxyz" },
                { old: /TEMPOS/g, new: "GlaselOS" },
                
                // Specific code replacements (might be inside <pre> tags or JSON payload)
                { old: /\\?"viem\\?"/g, new: '\\"@solana/web3.js\\"' },
                { old: /createPublicClient, http, defineChain/g, new: "Connection, PublicKey" },
                { old: /publicClient: createPublicClient\(\{\s*chain: solana,\s*transport: http\(\)\s*\}\),/g, new: "connection: new Connection('https://api.mainnet-beta.solana.com')," },
                { old: /nativeCurrency: \{\s*name: \\?"SOL\\?",\s*symbol: \\?"SOL\\?",\s*decimals: 18\s*\},/g, new: "// Solana mainnet-beta endpoint" },
                { old: /await commission\(mxeId, compDefId, encInputs\);/g, new: "await program.methods.commission(mxeId, encInputs).rpc();" }
            ];

            for (let r of htmlReplacements) {
                text = text.replace(r.old, r.new);
            }
            
            return res.send(text);
        } else if (contentType.includes('application/javascript') || contentType.includes('text/javascript')) {
            let text = await response.text();
            
            // In JS files, we MUST NOT replace "Glasel" globally because it breaks variables (SyntaxError)
            // But we still need to replace robinhood -> solana in the client chunks!
            // Let's do VERY conservative replacements in JS
            const jsReplacements = [
                { old: /Robinhood Chain/g, new: "Solana" },
                { old: /"robinhood"/g, new: '"solana"' },
                { old: /Ether(?!net)/g, new: "SOL" },
                { old: /\bETH\b/g, new: "SOL" },
                { old: /0xf90C73ad8D700115afd8175eB2C1953C80d45157/g, new: "coming soon on pump.fun" },
                { old: /0xf90C…5157/g, new: "coming soon on pump.fun" },
                
                // Safe string matches only
                { old: /"Glasel"/g, new: '"Glasel Network"' },
                { old: /'Glasel'/g, new: "'Glasel Network'" },
                { old: /`Glasel`/g, new: "`Glasel Network`" }
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
