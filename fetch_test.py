import urllib.request
import json

req = urllib.request.Request('https://glasel.xyz/', headers={'User-Agent': 'Mozilla/5.0', 'Accept-Encoding': 'identity'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        print(f'HTML length: {len(html)}')
        print(f'Occurrences of robinhood: {html.lower().count("robinhood")}')
        print(f'Occurrences of Glasel: {html.count("Glasel")}')
        
        # Check if there are any JSON payloads with robinhood
        if '"Robinhood Chain"' in html:
            print("Found exact JSON match: Robinhood Chain")
            
        if r'\"Robinhood Chain\"' in html:
            print("Found escaped JSON match: \\\"Robinhood Chain\\\"")
            
        if r'\"viem\"' in html:
            print("Found escaped JSON match: \\\"viem\\\"")
except Exception as e:
    print(e)
