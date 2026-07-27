with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('<script src="ninja.js"></script>', '')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
