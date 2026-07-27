const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

const app = express();
const TARGET = 'https://glasel.xyz';

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

app.use('/', createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyReq: (proxyReq, req, res) => {
        // Force the target server to send uncompressed data
        // This is CRITICAL so our responseInterceptor can do string replacement on JS chunks and HTML
        proxyReq.setHeader('accept-encoding', 'identity');
    },
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        // Only intercept HTML and Javascript files
        const contentType = proxyRes.headers['content-type'];
        if (contentType && (contentType.includes('text/html') || contentType.includes('application/javascript') || contentType.includes('text/javascript'))) {
            let response = responseBuffer.toString('utf8');
            
            // Normalize "Glasel Network" to "Glasel" so we can do a clean replace
            response = response.replace(/Glasel Network/g, "Glasel");
            
            // Apply standard replacements
            for (let r of replacements) {
                response = response.replace(r.old, r.new);
            }
            
            // Restore "Glasel" -> "Glasel Network" globally
            response = response.replace(/Glasel/g, "Glasel Network");
            
            // Restore exact names
            response = response.replace(/TEMPXYZ/g, "Glaselxyz");
            response = response.replace(/TEMPOS/g, "GlaselOS");
            
            return response;
        }
        
        // Return untouched buffer for anything else that slipped through
        return responseBuffer;
    })
}));

module.exports = app;
