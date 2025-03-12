import fitz  # PyMuPDF

# Path to the PDF file
pdf_path = "C:/Users/keert/BVRITHack/SS/Saanjh/server_model/uploads/LFT.pdf"

# Open the PDF file
doc = fitz.open(pdf_path)

# Extract text from all pages
text = ""
for page in doc:
    text += page.get_text("text") + "\n"  # Extract text from each page

# Save the extracted text to a file
with open("output.txt", "w", encoding="utf-8") as txt_file:
    txt_file.write(text)

print("Text extracted and saved to output.txt")
