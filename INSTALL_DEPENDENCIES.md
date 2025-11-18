# Install New Dependencies

To use the new PDF and Document tools, you need to install the following dependencies:

## Install all dependencies at once:

```bash
npm install tesseract.js mammoth docx jszip
```

## Install TypeScript types:

```bash
npm install -D @types/jszip
```

## Individual installations (if needed):

```bash
# For PDF to Word Converter
npm install mammoth docx

# For Word to PDF Converter
npm install mammoth jspdf

# For Image to Text (OCR)
npm install tesseract.js

# For PDF to Image Converter
npm install jszip
npm install -D @types/jszip

# For eSign PDF (uses built-in canvas, no extra dependencies needed)
```

## New Tools Added:

1. **PDF to Word Converter** - Convert PDF documents to editable Word files
2. **Word to PDF Converter** - Convert Word documents to PDF format  
3. **PDF to Image Converter** - Convert PDF pages to high-quality images (enhanced existing tool)
4. **Image to Text (OCR)** - Extract text from images using optical character recognition
5. **eSign PDF** - Add digital signatures to your PDF documents (uses native canvas API)

All tools are now available in the "Document & PDF Tools" section of the application.