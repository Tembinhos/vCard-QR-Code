# vCard QR Code Generator

Simple web app that creates a vCard QR code from:
- Full name
- Phone number
- Organization
- Title

## Run locally

Just open `index.html` in your browser.

If you want to run a local server:

```bash
python3 -m http.server 8000
```

Then open: `http://localhost:8000`

## Features

- Generates QR code from vCard data
- Renders QR code as SVG
- Download SVG
- Share SVG (uses Web Share API when available)
