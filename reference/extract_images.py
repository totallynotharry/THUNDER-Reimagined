import sys
import io
import os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from pypdf import PdfReader

reader = PdfReader(r'c:\Users\Harry\Documents\THUNDER reimagined\reference\design.pdf')

img_dir = r'c:\Users\Harry\Documents\THUNDER reimagined\reference\images'
os.makedirs(img_dir, exist_ok=True)

count = 0
for page_num, page in enumerate(reader.pages):
    try:
        images = page.images
        for i, img in enumerate(images):
            filename = f"page{page_num+1}_img{i}_{img.name}"
            filepath = os.path.join(img_dir, filename)
            with open(filepath, 'wb') as f:
                f.write(img.data)
            count += 1
            print(f"Extracted: {filename} ({len(img.data)} bytes)")
    except Exception as e:
        print(f"Page {page_num+1}: Error - {e}")

print(f"\nTotal images extracted: {count}")
