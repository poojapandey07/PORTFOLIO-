import fitz
import os

doc = fitz.open(r"C:\Users\DELL\Downloads\Version 2.0 - 2025-2026.pdf")
os.makedirs("extracted_pages", exist_ok=True)
os.makedirs("extracted_images", exist_ok=True)

for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=200)
    pix.save(f"extracted_pages/page_{i+1}.png")
    print(f"Saved page_{i+1}.png")

img_count = 0
for i, page in enumerate(doc):
    image_list = page.get_images(full=True)
    for img_index, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        w = base_image["width"]
        h = base_image["height"]
        img_count += 1
        filepath = f"extracted_images/img_p{i+1}_{img_index+1}_{w}x{h}.{image_ext}"
        with open(filepath, "wb") as f:
            f.write(image_bytes)
        print(f"Extracted {filepath}")
