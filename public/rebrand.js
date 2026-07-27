(function() {
    const replacements = [
        { regex: /Robinhood Chain/g, new: "Solana" },
        { regex: /robinhood/g, new: "solana" },
        { regex: /Robinhood/g, new: "Solana" },
        { regex: /Ether(?!\s*net)/g, new: "SOL" },
        { regex: /\bETH\b/g, new: "SOL" },
        { regex: /0xf90C73ad8D700115afd8175eB2C1953C80d45157/g, new: "coming soon on pump.fun" },
        { regex: /0xf90C…5157/g, new: "coming soon on pump.fun" },
        { regex: /Glasel — Private computation on a public chain\./g, new: "Glasel Network — Private computation on Solana." },
        
        // Carefully replace Glasel with Glasel Network
        { regex: /Glasel Network/g, new: "Glasel" }, // Normalize existing ones if any
        { regex: /Glaselxyz/g, new: "TEMPXYZ" }, // Preserve github repo name
        { regex: /GlaselOS/g, new: "TEMPOS" },
        { regex: /glasel-network/g, new: "TEMPURL" },
        { regex: /Glasel/g, new: "Glasel Network" },
        { regex: /TEMPXYZ/g, new: "Glaselxyz" },
        { regex: /TEMPOS/g, new: "GlaselOS" },
        { regex: /TEMPURL/g, new: "glasel-network" },
        
        // Code blocks tokens (without breaking React)
        { regex: /createPublicClient, http, defineChain/g, new: "Connection, PublicKey" },
        { regex: /publicClient: createPublicClient\(\{\s*chain: solana,\s*transport: http\(\)\s*\}\),/g, new: "connection: new Connection('https://api.mainnet-beta.solana.com')," },
        { regex: /publicClient: createPublicClient\(\{\s*chain: robinhood,\s*transport: http\(\)\s*\}\),/g, new: "connection: new Connection('https://api.mainnet-beta.solana.com')," },
        { regex: /nativeCurrency: \{\s*name: \\?"SOL\\?",\s*symbol: \\?"SOL\\?",\s*decimals: 18\s*\},/g, new: "// Solana mainnet-beta endpoint" },
        { regex: /nativeCurrency: \{\s*name: \\?"Ether\\?",\s*symbol: \\?"ETH\\?",\s*decimals: 18\s*\},/g, new: "// Solana mainnet-beta endpoint" },
        { regex: /await commission\(mxeId, compDefId, encInputs\);/g, new: "await program.methods.commission(mxeId, encInputs).rpc();" },
        { regex: /"viem"/g, new: '"@solana/web3.js"' }
    ];

    function replaceTextInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let val = node.nodeValue;
            let original = val;
            
            if (!val.trim()) return; // Skip empty nodes for performance
            
            for (let r of replacements) {
                if (r.regex.test(val)) {
                    val = val.replace(r.regex, r.new);
                }
            }
            
            // Only update if changed to avoid breaking React refs unnecessarily
            if (val !== original) {
                node.nodeValue = val;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Skip script and style tags completely
            if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.tagName === 'NOSCRIPT') return;
            
            // Rebrand image alt text
            if (node.hasAttribute('alt')) {
                let alt = node.getAttribute('alt');
                if (alt && alt.includes('Glasel') && alt !== 'Glasel Network') {
                    node.setAttribute('alt', alt.replace(/Glasel/g, 'Glasel Network'));
                }
            }
            
            // Recursively process children
            for (let child of Array.from(node.childNodes)) {
                replaceTextInNode(child);
            }
        }
    }

    function runRebranding() {
        replaceTextInNode(document.body);
        
        // Start watching for React adding new elements or re-rendering components
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

    // React might take a moment to hydrate and wipe the original DOM to replace it.
    // We wait slightly after DOMContentLoaded, or wait for window.load to ensure React has booted.
    // We can also just run it multiple times initially to be safe.
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            runRebranding();
            // Fire again after 50ms and 500ms to catch late-hydrating React chunks
            setTimeout(() => replaceTextInNode(document.body), 50);
            setTimeout(() => replaceTextInNode(document.body), 500);
        });
    } else {
        runRebranding();
        setTimeout(() => replaceTextInNode(document.body), 50);
        setTimeout(() => replaceTextInNode(document.body), 500);
    }
})();
