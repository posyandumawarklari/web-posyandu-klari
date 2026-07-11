import os
import re

target_dir = r"d:\document\kkn\web-posyandu\client\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to add onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-image.jpg'; }}
    # if it doesn't already have onError.
    
    # regex to find <img ... />
    # we need to be careful with jsx
    
    def replacer(match):
        img_tag = match.group(0)
        if 'onError' in img_tag:
            return img_tag
        
        # insert before the closing > or />
        if img_tag.endswith('/>'):
            return img_tag[:-2] + ' onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.jpg"; }} />'
        elif img_tag.endswith('>'):
            return img_tag[:-1] + ' onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.jpg"; }} >'
        return img_tag

    new_content = re.sub(r'<img[^>]+>', replacer, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(target_dir):
    for file in files:
        if file.endswith('.jsx'):
            process_file(os.path.join(root, file))

print("Done")
