with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

tag = '<script src="ninja.js"></script>'
if tag not in html:
    html = html.replace('</body>', f'{tag}</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
