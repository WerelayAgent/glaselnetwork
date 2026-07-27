(function() {
    const replacements = {
        "Robinhood Chain": "Solana",
        "robinhood": "solana",
        "Ether": "SOL",
        "ETH": "SOL",
        "0xf90C73ad8D700115afd8175eB2C1953C80d45157": "coming soon on pump.fun",
        "0xf90C…5157": "coming soon on pump.fun",
        "Glasel — Private computation on a public chain.": "Glasel Network — Private computation on Solana.",
        "createPublicClient, http, defineChain": "Connection, PublicKey",
        "\"viem\"": "\"@solana/web3.js\"",
        "publicClient: createPublicClient({ chain: robinhood, transport: http() }),": "connection: new Connection('https://api.mainnet-beta.solana.com'),",
        "nativeCurrency: { name: \"Ether\", symbol: \"ETH\", decimals: 18 },": "// Solana mainnet-beta endpoint",
        "await commission(mxeId, compDefId, encInputs);": "await program.methods.commission(mxeId, encInputs).rpc();"
    };

    function replaceInTextNode(node) {
        let text = node.nodeValue;
        if (!text || text.trim() === '') return;
        
        let original = text;
        
        // Normalize Glasel specific terms to avoid infinite growth
        text = text.replaceAll("Glasel Network", "Glasel");
        text = text.replaceAll("Glaselxyz", "TEMPXYZ");
        text = text.replaceAll("GlaselOS", "TEMPOS");
        
        for (const [key, value] of Object.entries(replacements)) {
            if (text.includes(key)) {
                text = text.replaceAll(key, value);
            }
        }
        
        // Restore normalized terms
        text = text.replaceAll("Glasel", "Glasel Network");
        text = text.replaceAll("TEMPXYZ", "Glaselxyz");
        text = text.replaceAll("TEMPOS", "GlaselOS");
        
        if (original !== text) {
            node.nodeValue = text;
        }
    }

    function walkDOM(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            replaceInTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
            for (let i = 0; i < node.childNodes.length; i++) {
                walkDOM(node.childNodes[i]);
            }
            
            // Redirect links
            if (node.tagName === 'A' && node.hasAttribute('href')) {
                const href = node.getAttribute('href');
                if (href === '/docs' || href === '/playground' || href === '/docs/quickstart' || href === '/blog' || href === '/docs/network' || href === '/docs/circuits') {
                    node.setAttribute('href', 'signup.html');
                }
            }
        }
    }

    // Run periodically to catch elements animated/rendered by Framer Motion later
    setInterval(() => {
        if (document.body) {
            walkDOM(document.body);
        }
    }, 50);
})();
