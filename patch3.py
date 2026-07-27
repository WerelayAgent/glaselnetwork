import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove residual translateY from framer motion
html = re.sub(r'transform:translateY\([^\)]+\)', 'transform:translateY(0px)', html)

# Fix background opacity
html = html.replace('transition-opacity duration-1000 opacity-0', 'transition-opacity duration-1000 opacity-100')

# Inject custom JS
if '<script src="custom.js"></script>' not in html:
    html = html.replace('</body>', '<script src="custom.js"></script></body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
