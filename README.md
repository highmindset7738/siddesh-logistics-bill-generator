# Siddesh Logistics Bill Generator

A professional React-based bill generator for Siddesh Logistics with PDF export functionality.

## Features

- 📋 **Professional Bill Design** - Exact replica of your current bill format
- 🚛 **Multiple Shipments** - Add multiple shipment entries per bill
- 💰 **Auto Calculations** - Automatic total and balance calculations
- 📥 **PDF Export** - High-quality PDF generation and download
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Fast & Reliable** - Built with React for optimal performance

## User Input Fields

- **Date** - Bill generation date
- **Container No** - Container identification number
- **Vehicle No** - Vehicle registration number
- **Total Amount** - Service charges amount
- **Location** - From and To locations for shipment

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd siddesh-bill-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Deployment on Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from project directory**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Link to existing project or create new
   - Confirm settings
   - Deploy!

### Method 2: GitHub Integration

1. **Push code to GitHub repository**
2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings (auto-detected)
   - Deploy!

### Method 3: Direct Upload

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload to Vercel**
   - Drag and drop the `build` folder to vercel.com
   - Or use `vercel --prod` command

## Project Structure

```
siddesh-bill-generator/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── BillForm.js          # Form for bill data input
│   │   ├── BillPreview.js       # Bill preview and PDF generation
│   │   └── BillPreview.css      # Bill styling
│   ├── App.js                   # Main application component
│   ├── App.css                  # Application styles
│   ├── index.js                 # React entry point
│   └── index.css                # Global styles
├── package.json                 # Dependencies and scripts
├── vercel.json                  # Vercel deployment config
└── README.md                    # This file
```

## Key Technologies

- **React 18** - Modern React with hooks
- **jsPDF** - PDF generation library
- **html2canvas** - HTML to canvas conversion
- **CSS Grid & Flexbox** - Responsive layouts
- **Vercel** - Deployment platform

## Bill Features

- ✅ Company header with contact details
- ✅ Customer information section
- ✅ Multiple shipment entries
- ✅ Automatic calculations
- ✅ Bank account details
- ✅ Terms and conditions
- ✅ Signature section
- ✅ Professional formatting

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Support

For issues or questions:
1. Check the browser console for errors
2. Ensure all required fields are filled
3. Try refreshing the page
4. Contact support if issues persist

## License

This project is created for Siddesh Logistics internal use.

---

**🚀 Ready to generate professional bills for Siddesh Logistics!**
