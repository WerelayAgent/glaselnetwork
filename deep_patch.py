import os

replacements = [
    ("Robinhood Chain", "Solana"),
    ("robinhood", "solana"),
    ("Ether", "SOL"),
    ("ETH", "SOL"),
    ("0xf90C73ad8D700115afd8175eB2C1953C80d45157", "coming soon on pump.fun"),
    ("0xf90C…5157", "coming soon on pump.fun"),
    ("Glasel — Private computation on a public chain.", "Glasel Network — Private computation on Solana."),
    ("Glasel", "Glasel Network"),
    ("Glasel Network Network", "Glasel Network"), # Fix double replacements
    ("Glasel Networkxyz", "Glaselxyz"), # Fix repo names if any
    ("Glasel NetworkOS", "GlaselOS"), # Fix OS name
    ("glasel.network", "glasel.systems"), # Or whatever domain
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
    # For JS chunks containing JSON routing data
    ('href:"/docs"', 'href:"signup.html"'),
    ('href:"/playground"', 'href:"signup.html"'),
    ('href:"/docs/quickstart"', 'href:"signup.html"'),
    ('href:"/blog"', 'href:"signup.html"'),
    ('href:"/docs/network"', 'href:"signup.html"'),
    ('href:"/docs/circuits"', 'href:"signup.html"'),
    # For Next.js payload format
    ("\\\"/docs\\\"", "\\\"signup.html\\\""),
    ("\\\"/playground\\\"", "\\\"signup.html\\\""),
    ("\\\"/docs/quickstart\\\"", "\\\"signup.html\\\""),
    ("\\\"/blog\\\"", "\\\"signup.html\\\""),
    ("\\\"/docs/network\\\"", "\\\"signup.html\\\""),
    ("\\\"/docs/circuits\\\"", "\\\"signup.html\\\""),
]

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for old, new in replacements:
            new_content = new_content.replace(old, new)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Patched {filepath}")
    except Exception as e:
        print(f"Skipped {filepath}: {e}")

# Process index.html
process_file("index.html")

# Process all .js files in _next
for root, dirs, files in os.walk('_next'):
    for file in files:
        if file.endswith('.js'):
            process_file(os.path.join(root, file))

print("Deep patching complete.")
