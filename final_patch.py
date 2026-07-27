import re
import os

filepath = 'original.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Strip Next.js scripts
html = re.sub(r'<script\b[^>]*src=[\"\']/?_next/[^>]*>.*?</script>', '', html, flags=re.DOTALL)
html = re.sub(r'<script>\(self.__next_f.*?</script>', '', html, flags=re.DOTALL)
html = re.sub(r'<script>self.__next_f.push.*?</script>', '', html, flags=re.DOTALL)

# 2. Strip inline animations from HTML (opacity:0, transform)
# We will use CSS classes instead
html = re.sub(r'style="[^"]*opacity:0[^"]*"', 'class="scroll-animate"', html)
html = re.sub(r'transform:translateY\([^\)]+\)', '', html)

# 3. Text Rebranding
replacements = [
    ("Robinhood Chain", "Solana"),
    ("robinhood", "solana"),
    ("Ether", "SOL"),
    ("ETH", "SOL"),
    ("0xf90C73ad8D700115afd8175eB2C1953C80d45157", "coming soon on pump.fun"),
    ("0xf90C…5157", "coming soon on pump.fun"),
    ("Glasel — Private computation on a public chain.", "Glasel Network — Private computation on Solana."),
    ("createPublicClient, http, defineChain", "Connection, PublicKey"),
    ("\"viem\"", "\"@solana/web3.js\""),
    ("publicClient: createPublicClient({ chain: solana, transport: http() }),", "connection: new Connection('https://api.mainnet-beta.solana.com'),"),
    ("nativeCurrency: { name: \"SOL\", symbol: \"SOL\", decimals: 18 },", "// Solana mainnet-beta endpoint"),
    ("await commission(mxeId, compDefId, encInputs);", "await program.methods.commission(mxeId, encInputs).rpc();"),
    # Replace links
    ("href=\"/docs\"", "href=\"signup.html\""),
    ("href=\"/playground\"", "href=\"signup.html\""),
    ("href=\"/docs/quickstart\"", "href=\"signup.html\""),
    ("href=\"/blog\"", "href=\"signup.html\""),
    ("href=\"/docs/network\"", "href=\"signup.html\""),
    ("href=\"/docs/circuits\"", "href=\"signup.html\""),
]

# Normalize Glasel Network
html = html.replace("Glasel Network", "Glasel")
html = html.replace("Glaselxyz", "TEMPXYZ")
html = html.replace("GlaselOS", "TEMPOS")

for old, new in replacements:
    html = html.replace(old, new)

html = html.replace("Glasel", "Glasel Network")
html = html.replace("TEMPXYZ", "Glaselxyz")
html = html.replace("TEMPOS", "GlaselOS")

# 4. Inject High Fidelity animations
if '<link rel="stylesheet" href="animations.css">' not in html:
    html = html.replace('</head>', '<link rel="stylesheet" href="animations.css"></head>')

if '<script src="animations.js"></script>' not in html:
    html = html.replace('</body>', '<script src="animations.js"></script></body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Patched original.html -> index.html')
