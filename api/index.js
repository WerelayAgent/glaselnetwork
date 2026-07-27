module.exports = async (req, res) => {
    const TARGET = 'https://glasel.xyz';
    // Ensure we preserve the query strings if any, though Vercel's req.url includes them
    const targetUrl = TARGET + req.url;

    try {
        // Copy headers but strip host and accept-encoding
        const headers = { ...req.headers };
        delete headers.host;
        delete headers['accept-encoding']; // Force uncompressed response from target
        
        // Fetch from original site
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: headers,
            // Only pass body if it's not GET/HEAD
            body: (req.method !== 'GET' && req.method !== 'HEAD') ? req.body : undefined,
            redirect: 'manual'
        });

        // Forward status code
        res.status(response.status);

        // Forward headers safely
        response.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            // Do not forward encoding or length because we might modify the content length
            if (lowerKey !== 'content-encoding' && lowerKey !== 'content-length' && lowerKey !== 'transfer-encoding') {
                res.setHeader(key, value);
            }
        });

        const contentType = response.headers.get('content-type') || '';
        
        // If it's HTML or JS, modify the text
        if (contentType.includes('text/html') || contentType.includes('application/javascript') || contentType.includes('text/javascript')) {
            let text = await response.text();
            
            text = text.replace(/Glasel Network/g, "Glasel");
            
            const replacements = [
                { old: /Robinhood Chain/g, new: "Solana" },
                { old: /robinhood/g, new: "solana" },
                { old: /Ether(?!net)/g, new: "SOL" },
                { old: /\bETH\b/g, new: "SOL" },
                { old: /0xf90C73ad8D700115afd8175eB2C1953C80d45157/g, new: "coming soon on pump.fun" },
                { old: /0xf90C…5157/g, new: "coming soon on pump.fun" },
                { old: /Glasel — Private computation on a public chain\./g, new: "Glasel Network — Private computation on Solana." },
                { old: /Glasel Network Network/g, new: "Glasel Network" },
                { old: /Glaselxyz/g, new: "TEMPXYZ" },
                { old: /GlaselOS/g, new: "TEMPOS" },
                { old: /createPublicClient, http, defineChain/g, new: "Connection, PublicKey" },
                { old: /"viem"/g, new: '"@solana/web3.js"' },
                { old: /publicClient: createPublicClient\({ chain: solana, transport: http\(\) }\),/g, new: "connection: new Connection('https://api.mainnet-beta.solana.com')," },
                { old: /nativeCurrency: { name: "SOL", symbol: "SOL", decimals: 18 },/g, new: "// Solana mainnet-beta endpoint" },
                { old: /await commission\(mxeId, compDefId, encInputs\);/g, new: "await program.methods.commission(mxeId, encInputs).rpc();" }
            ];

            for (let r of replacements) {
                text = text.replace(r.old, r.new);
            }
            
            text = text.replace(/Glasel/g, "Glasel Network");
            text = text.replace(/TEMPXYZ/g, "Glaselxyz");
            text = text.replace(/TEMPOS/g, "GlaselOS");
            
            return res.send(text);
        } else {
            // For other binary assets that slipped through vercel.json
            const arrayBuffer = await response.arrayBuffer();
            return res.send(Buffer.from(arrayBuffer));
        }
    } catch (err) {
        console.error("Proxy Error:", err);
        return res.status(500).send("Proxy Error");
    }
};
