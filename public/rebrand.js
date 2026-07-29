(function() {
    const replacements = [
        { regex: /\bEthereum\b/g, new: "Robinhood Chain" },
        { regex: /\bethereum\b/g, new: "robinhoodchain" },
        { regex: /\bETH\b/g, new: "SOL" },
        { regex: /0xf90C73ad8D700115afd8175eB2C1953C80d45157/g, new: "coming soon on ponsfamily.com" },
        { regex: /0xf90C…5157/g, new: "coming soon on ponsfamily.com" },
        { regex: /Glasel — Private computation on a public chain\./g, new: "Glasel Network — Private computation on Robinhood Chain." },
        
        { regex: /Glasel Network/g, new: "Glasel" },
        { regex: /Glaselxyz/g, new: "TEMPXYZ" },
        { regex: /GlaselOS/g, new: "TEMPOS" },
        { regex: /glasel-network/g, new: "TEMPURL" },
        { regex: /Glasel/g, new: "Glasel Network" },
        { regex: /TEMPXYZ/g, new: "Glaselxyz" },
        { regex: /TEMPOS/g, new: "GlaselOS" },
        { regex: /TEMPURL/g, new: "glasel-network" },
        
        { regex: /createPublicClient, http, defineChain/g, new: "Connection, PublicKey" },
        { regex: /publicClient: createPublicClient\(\{\s*chain: robinhoodchain,\s*transport: http\(\)\s*\}\),/g, new: "connection: new Connection('https://api.mainnet-beta.robinhoodchain.com')," },
        { regex: /publicClient: createPublicClient\(\{\s*chain: robinhood,\s*transport: http\(\)\s*\}\),/g, new: "connection: new Connection('https://api.mainnet-beta.robinhoodchain.com')," },
        { regex: /nativeCurrency: \{\s*name: \\?"SOL\\?",\s*symbol: \\?"SOL\\?",\s*decimals: 18\s*\},/g, new: "// Robinhood Chain mainnet-beta endpoint" },
        { regex: /nativeCurrency: \{\s*name: \\?"Ether\\?",\s*symbol: \\?"ETH\\?",\s*decimals: 18\s*\},/g, new: "// Robinhood Chain mainnet-beta endpoint" },
        { regex: /await commission\(mxeId, compDefId, encInputs\);/g, new: "await program.methods.commission(mxeId, encInputs).rpc();" },
        { regex: /"viem"/g, new: '"@robinhoodchain/web3.js"' }
    ];

    function replaceTextInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let val = node.nodeValue;
            let original = val;
            
            if (!val.trim()) return;
            
            for (let r of replacements) {
                if (r.regex.test(val)) {
                    val = val.replace(r.regex, r.new);
                }
            }
            
            if (val !== original) {
                node.nodeValue = val;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.tagName === 'NOSCRIPT') return;
            
            if (node.hasAttribute('alt')) {
                let alt = node.getAttribute('alt');
                if (alt && alt.includes('Glasel') && alt !== 'Glasel Network') {
                    node.setAttribute('alt', alt.replace(/Glasel/g, 'Glasel Network'));
                }
            }
            
            // Rebrand Twitter/X links
            if (node.tagName === 'A' && node.hasAttribute('href')) {
                let href = node.getAttribute('href');
                if (href && (href.includes('twitter.com') || href.includes('x.com'))) {
                    if (href !== 'https://x.com/glaselnetwork') {
                        node.setAttribute('href', 'https://x.com/glaselnetwork');
                    }
                }
            }
            
            for (let child of Array.from(node.childNodes)) {
                replaceTextInNode(child);
            }
        }
    }

    function runRebranding() {
        replaceTextInNode(document.body);
        
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        replaceTextInNode(node);
                    });
                } else if (mutation.type === 'characterData') {
                    replaceTextInNode(mutation.target);
                }
            }
        });
        
        observer.observe(document.body, { 
            childList: true, 
            subtree: true, 
            characterData: true 
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            runRebranding();
            setTimeout(() => replaceTextInNode(document.body), 50);
            setTimeout(() => replaceTextInNode(document.body), 500);
            setTimeout(() => replaceTextInNode(document.body), 2000); // extra pass for slow chunks
        });
    } else {
        runRebranding();
        setTimeout(() => replaceTextInNode(document.body), 50);
        setTimeout(() => replaceTextInNode(document.body), 500);
        setTimeout(() => replaceTextInNode(document.body), 2000); // extra pass for slow chunks
    }
})();
