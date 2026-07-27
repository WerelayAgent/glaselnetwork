import re
import os

filepath = 'index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Scrub Next.js hydration scripts
html = re.sub(r'<script\b[^>]*src=[\"\']/?_next/[^>]*>.*?</script>', '', html, flags=re.DOTALL)
html = re.sub(r'<script>\(self.__next_f.*?</script>', '', html, flags=re.DOTALL)
html = re.sub(r'<script>self.__next_f.push.*?</script>', '', html, flags=re.DOTALL)

# 2. Scrub inline opacity:0 (Visibility Fix)
html = re.sub(r'style="[^"]*opacity:0[^"]*"', '', html)

# 3. Rebrand Text
html = html.replace('Robinhood Chain', 'Solana')
html = html.replace('robinhood', 'solana')
html = html.replace('Ether', 'SOL')
html = html.replace('ETH', 'SOL')
html = html.replace('0xf90C73ad8D700115afd8175eB2C1953C80d45157', 'coming soon on pump.fun')
html = html.replace('0xf90C…5157', 'coming soon')
html = html.replace('Glasel — Private computation on a public chain.', 'Glasel Network — Private computation on Solana.')
html = html.replace('Glasel', 'Glasel Network')
# Revert "Glasel NetworkOS" -> "GlaselOS" if it got renamed
html = html.replace('Glasel NetworkOS', 'GlaselOS')
# Same for "Glasel Network Network"
html = html.replace('Glasel Network Network', 'Glasel Network')

# 4. Rebrand Code Snippets
html = html.replace('createPublicClient, http, defineChain', 'Connection, PublicKey')
html = html.replace('"viem"', '"@solana/web3.js"')
html = html.replace('const solana = defineChain({ id: 4663, name: "Solana",', 'const connection = new Connection("https://api.mainnet-beta.solana.com");')
html = html.replace('nativeCurrency: { name: "SOL", symbol: "SOL", decimals: 18 },', '// Solana mainnet-beta endpoint')
html = html.replace('rpcUrls: { default: { http: ["https://rpc.mainnet.chain.solana.com"] } } });', '')
html = html.replace('publicClient: createPublicClient({ chain: solana, transport: http() }),', 'connection: connection,')
html = html.replace('await commission(mxeId, compDefId, encInputs);', 'await program.methods.commission(mxeId, encInputs).rpc();')

# 5. Redirect buttons to signup.html
html = html.replace('href="/docs"', 'href="signup.html"')
html = html.replace('href="/docs/quickstart"', 'href="signup.html"')
html = html.replace('href="/playground"', 'href="signup.html"')
html = html.replace('href="/docs/network"', 'href="signup.html"')
html = html.replace('href="/docs/circuits"', 'href="signup.html"')
html = html.replace('href="/blog"', 'href="signup.html"')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
print('Scrubbed and rebranded index.html')
