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
        
        if (contentType.includes('text/html') || contentType.includes('application/javascript') || contentType.includes('text/javascript')) {
            let text = await response.text();
            
            // VERY SAFE string replacements to avoid breaking Javascript syntax!
            const replacements = [
                { old: /Robinhood Chain/g, new: "Solana" },
                { old: /"robinhood"/g, new: '"solana"' },
                { old: /Ether(?!net)/g, new: "SOL" },
                { old: /\bETH\b/g, new: "SOL" },
                { old: /0xf90C73ad8D700115afd8175eB2C1953C80d45157/g, new: "coming soon on pump.fun" },
                { old: /0xf90C…5157/g, new: "coming soon on pump.fun" },
                { old: /Glasel — Private computation on a public chain\./g, new: "Glasel Network — Private computation on Solana." },
                { old: /createPublicClient, http, defineChain/g, new: "Connection, PublicKey" },
                { old: /"viem"/g, new: '"@solana/web3.js"' },
                { old: /publicClient: createPublicClient\({ chain: robinhood, transport: http\(\) }\),/g, new: "connection: new Connection('https://api.mainnet-beta.solana.com')," },
                { old: /publicClient: createPublicClient\({ chain: solana, transport: http\(\) }\),/g, new: "connection: new Connection('https://api.mainnet-beta.solana.com')," },
                { old: /nativeCurrency: { name: "SOL", symbol: "SOL", decimals: 18 },/g, new: "// Solana mainnet-beta endpoint" },
                { old: /nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },/g, new: "// Solana mainnet-beta endpoint" },
                { old: /await commission\(mxeId, compDefId, encInputs\);/g, new: "await program.methods.commission(mxeId, encInputs).rpc();" },
                
                // Safe Glasel Network replacements
                { old: />Glasel</g, new: ">Glasel Network<" },
                { old: />Glasel /g, new: ">Glasel Network " },
                { old: /"Glasel"/g, new: '"Glasel Network"' },
                { old: /'Glasel'/g, new: "'Glasel Network'" },
                { old: /Glasel Network Network/g, new: "Glasel Network" }
            ];

            for (let r of replacements) {
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
