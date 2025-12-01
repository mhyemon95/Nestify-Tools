const fs = require('fs');

const filePath = 'src/pages/Index.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const newTools = `,
  {
    name: "Image Cropper",
    description: "Crop images with custom aspect ratios and precision controls",
    icon: Crop,
    path: "/image-cropper",
    color: "from-amber-500 to-orange-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "Watermark Tool",
    description: "Add text or image watermarks to protect your photos",
    icon: Droplet,
    path: "/watermark-tool",
    color: "from-cyan-500 to-blue-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "Image Filter Editor",
    description: "Apply professional filters and adjustments to images",
    icon: Sparkles,
    path: "/image-filter-editor",
    color: "from-violet-500 to-purple-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "Favicon Generator",
    description: "Create favicons in multiple sizes for your website",
    icon: Globe,
    path: "/favicon-generator",
    color: "from-emerald-500 to-teal-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "Meme Generator",
    description: "Create memes with customizable text and styling",
    icon: Smile,
    path: "/meme-generator",
    color: "from-pink-500 to-rose-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "Image Metadata Viewer",
    description: "View EXIF data and detailed image information",
    icon: Info,
    path: "/image-metadata-viewer",
    color: "from-slate-500 to-gray-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "SVG to PNG Converter",
    description: "Convert SVG files to PNG with custom sizing",
    icon: FileImage,
    path: "/svg-to-png-converter",
    color: "from-indigo-500 to-blue-500",
    category: "Utility & Productivity Tools"
  }`;

// Find the CSV Viewer entry and add after it
const csvEntry = `  {
    name: "CSV Viewer & Converter",
    description: "View CSV files and convert to JSON",
    icon: FileText,
    path: "/csv-viewer",
    color: "from-green-500 to-emerald-500",
    category: "Utility & Productivity Tools"
  }`;

content = content.replace(csvEntry, csvEntry + newTools);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully added new tools to Index.tsx!');
