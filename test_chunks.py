import urllib.request
import re

req = urllib.request.Request('https://glasel.xyz/', headers={'User-Agent': 'Mozilla/5.0', 'Accept-Encoding': 'identity'})
html = urllib.request.urlopen(req).read().decode('utf-8')
chunks = re.findall(r'src="(/_next/static/chunks/.*?\.js)"', html)
print('Found chunks:', len(chunks))

found_in_js = False
for chunk in chunks:
    try:
        js = urllib.request.urlopen('https://glasel.xyz' + chunk).read().decode('utf-8')
        if 'Glasel' in js:
            found_in_js = True
            print('Found Glasel in', chunk)
            idx = js.find('Glasel')
            print("Context:", js[max(0, idx-30):idx+30])
    except Exception as e:
        print(e)
if not found_in_js:
    print("No occurrences of Glasel found in JS chunks!")
