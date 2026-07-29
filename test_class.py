import urllib.request
import re

req = urllib.request.Request('https://glasel.xyz/', headers={'User-Agent': 'Mozilla/5.0', 'Accept-Encoding': 'identity'})
html = urllib.request.urlopen(req).read().decode('utf-8')
print("Class attributes containing Glasel:")
print(re.findall(r'class="[^"]*Glasel[^"]*"', html))
print("JSON payload properties containing Glasel:")
# Let's see all occurrences of Glasel in the JSON payload
for m in re.finditer(r'.{0,30}Glasel.{0,30}', html):
    print(m.group(0))
