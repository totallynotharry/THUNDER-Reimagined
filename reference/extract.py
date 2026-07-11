import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from pypdf import PdfReader

reader = PdfReader(r'c:\Users\Harry\Documents\THUNDER reimagined\reference\design.pdf')

print(f"Number of pages: {len(reader.pages)}")
print(f"Metadata: {reader.metadata}")
print()

for i, page in enumerate(reader.pages):
    text = page.extract_text()
    print(f"=== PAGE {i+1} ===")
    print(text)
    print()
