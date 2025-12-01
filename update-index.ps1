# Script to add new tools to Index.tsx

$filePath = "src/pages/Index.tsx"
$content = Get-Content $filePath -Raw

# Add new icons to imports
$oldImport = "  Eye, Pen, RefreshCw`r`n} from ""lucide-react"";"
$newImport = "  Eye, Pen, RefreshCw, Crop, Droplet, Sparkles, Globe, Smile, Info`r`n} from ""lucide-react"";"
$content = $content.Replace($oldImport, $newImport)

# Add new tools before the closing ];
$toolsToAdd = @"
  ,
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
  }
"@

$oldClosing = "    category: ""Utility & Productivity Tools""`r`n  }`r`n];"
$newClosing = "    category: ""Utility & Productivity Tools""`r`n  }$toolsToAdd`r`n];"
$content = $content.Replace($oldClosing, $newClosing)

# Write back to file
Set-Content -Path $filePath -Value $content -NoNewline

Write-Host "Successfully updated Index.tsx with new tools!"
"@
