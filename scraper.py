import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import time

BASE_URL = "https://glasel.xyz/"
OUTPUT_DIR = "."

def download_file(url, output_path):
    try:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        if os.path.exists(output_path):
            return
        print(f"Downloading {url} to {output_path}")
        response = requests.get(url, stream=True, timeout=10)
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
    except Exception as e:
        print(f"Failed to download {url}: {e}")

def scrape():
    response = requests.get(BASE_URL)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    with open(os.path.join(OUTPUT_DIR, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(str(soup))
    
    assets = []
    for tag in soup.find_all(['link', 'script', 'img', 'source']):
        if tag.name == 'link' and tag.get('href'):
            assets.append(tag['href'])
        elif tag.name == 'script' and tag.get('src'):
            assets.append(tag['src'])
        elif tag.name == 'img' and tag.get('src'):
            assets.append(tag['src'])
            if tag.get('srcset'):
                for src in tag['srcset'].split(','):
                    assets.append(src.strip().split(' ')[0])
        elif tag.name == 'source' and tag.get('srcset'):
            for src in tag['srcset'].split(','):
                assets.append(src.strip().split(' ')[0])
            
    for asset in set(assets):
        if asset.startswith('http'):
            continue
        if asset.startswith('/'):
            asset_url = urljoin(BASE_URL, asset)
            local_path = os.path.join(OUTPUT_DIR, asset.lstrip('/'))
            local_path = local_path.split('?')[0]
            local_path = local_path.replace('%2F', '/')
            download_file(asset_url, local_path)

if __name__ == "__main__":
    scrape()
