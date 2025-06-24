# DocSelector Component

A standalone, lightweight JavaScript component for navigating between different documentation sites. Perfect for projects with multiple documentation repositories that need cross-navigation.

## Features

- 🎨 **Automatic theme detection** - Adapts to dark/light modes
- 📱 **Responsive design** - Works on all screen sizes
- 🖱️ **Interactive animations** - Smooth hover effects and transitions
- 🔗 **Configurable links** - Easy setup for your documentation sites
- 🧹 **Zero dependencies** - Pure JavaScript, no frameworks required
- 📦 **Tiny footprint** - Minimal impact on page load times
- ☁️ **Arweave ready** - Upload to Arweave for permanent, decentralized hosting

## Quick Start

### Auto-Detection (Recommended)
The component automatically detects which documentation site it's on based on the URL:

```html
<!-- Just add this single line - no configuration needed! -->
<script src="https://arweave.net/YOUR_TRANSACTION_ID"></script>
```

**Auto-detection patterns:**
- **AO**: URLs containing `cookbook_ao`, `ao.`, `/ao/`
- **Hyperbeam**: URLs containing `hyperbeam`, `/hyperbeam/`  
- **Arweave**: URLs containing `cookbook`, `arweave`, `/cookbook/` (also default fallback)

### Manual Configuration (Optional)
Override auto-detection if needed:

```javascript
// Set configuration before loading the script (optional)
window.DocSelectorConfig = {
    currentCookbook: "ARWEAVE", // Force specific site: "AO", "HYPERBEAM", or "ARWEAVE"
    links: {
        AO: "https://cookbook_ao.arweave.net/",
        HYPERBEAM: "https://hyperbeam.arweave.net/",
        ARWEAVE: "https://cookbook.arweave.net/"
    },
    theme: {
        mode: "auto", // "auto", "light", "dark"
        colors: {
            light: {
                text: "#333",
                line: "#666", 
                background: "white"
            },
            dark: {
                text: "#e5e5e5",
                line: "#888",
                background: "black" 
            }
        }
    }
};
```

```html
<script src="https://arweave.net/YOUR_TRANSACTION_ID"></script>
```

## Configuration Options

### Auto-Detection Patterns
The component automatically detects which site it's on by checking:

| Site | Detection Patterns |
|------|-------------------|
| **AO** | URLs containing: `cookbook_ao`, `ao.`, `/ao/` |
| **Hyperbeam** | URLs containing: `hyperbeam`, `/hyperbeam/` |
| **Arweave** | URLs containing: `cookbook`, `arweave`, `/cookbook/` (also default fallback) |

### Manual Override (Optional)
| Option | Type | Description |
|--------|------|-------------|
| `currentCookbook` | String | Force specific site ("AO", "HYPERBEAM", or "ARWEAVE") |
| `links` | Object | URLs for each documentation site |
| `theme.mode` | String | Theme mode: "auto" (default), "light", or "dark" |
| `theme.colors` | Object | Custom colors for light and dark themes |

## Usage Examples

### Basic Setup
```javascript
window.DocSelectorConfig = {
    currentCookbook: "ARWEAVE",
    links: {
        AO: "https://cookbook_ao.arweave.net/",
        HYPERBEAM: "https://hyperbeam.arweave.net/",
        ARWEAVE: "https://cookbook.arweave.net/"
    }
};
```

### Theme Configuration
```javascript
// Force dark mode
window.DocSelectorConfig = {
    theme: {
        mode: "dark"
    }
};

// Force light mode
window.DocSelectorConfig = {
    theme: {
        mode: "light"
    }
};

// Custom colors (with auto detection)
window.DocSelectorConfig = {
    theme: {
        mode: "auto", // Still detects from document.documentElement
        colors: {
            light: {
                text: "#2d3748",
                line: "#4a5568",
                background: "#f7fafc"
            },
            dark: {
                text: "#f7fafc", 
                line: "#cbd5e0",
                background: "#1a202c"
            }
        }
    }
};
```

### Dynamic Loading
```javascript
async function loadDocSelector() {
    // Configure first
    window.DocSelectorConfig = {
        currentCookbook: "AO",
        links: {
            AO: "https://cookbook_ao.arweave.net/",
            HYPERBEAM: "https://hyperbeam.arweave.net/",
            ARWEAVE: "https://cookbook.arweave.net/"
        }
    };

    // Load the script
    const script = document.createElement('script');
    script.src = 'https://arweave.net/YOUR_TRANSACTION_ID';
    script.onload = () => console.log('DocSelector loaded');
    document.head.appendChild(script);
}

loadDocSelector();
```

## Deploying to Arweave

### Automated Deployment (Recommended)

The project includes GitHub Actions that automatically deploy to Arweave when you push changes:

1. **Set up your wallet secret**:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add a new secret named `DEPLOY_KEY`
   - **Value**: Base64 encode your Arweave wallet JSON:
     ```bash
     # Encode your wallet file to base64
     base64 -i path/to/your/wallet.json
     # Copy the output and paste as the secret value
     ```

2. **Deploy**:
   - Push changes to `dist/doc-selector.js` on the main branch
   - GitHub Actions will automatically deploy to Arweave
   - Check the Actions tab to see the deployment status and get the transaction ID

### Manual Deployment

#### Using the included script
```bash
# Method 1: Base64 encoded wallet (recommended for GitHub Actions)
export DEPLOY_KEY=$(base64 -i path/to/your/wallet.json)
bun run deploy:arweave

# Method 2: Raw JSON (for local testing)
export DEPLOY_KEY='{"your":"wallet","json":"here"}'
bun run deploy:arweave
```

#### Using Arweave CLI
```bash
# Install Arweave CLI
bun install -g arweave-deploy

# Deploy the component
arweave-deploy dist/doc-selector.js --key-file your-wallet.json
```

#### Using ArDrive
1. Visit [ArDrive](https://app.ardrive.io/)
2. Upload `dist/doc-selector.js`
3. Copy the transaction ID
4. Use `https://arweave.net/YOUR_TRANSACTION_ID` as the script source

## Development

1. Clone the repository
```bash
git clone https://github.com/dps/doc-selector-component.git
cd doc-selector-component
```

2. Install dependencies
```bash
bun install
```

3. Start the development server
```bash
bun run serve
```

4. Open http://localhost:8000 in your browser

5. Make changes to `dist/doc-selector.js`

6. Test your changes by refreshing the page

## Project Structure

```
doc-selector-component/
├── dist/
│   └── doc-selector.js          # Main standalone component
├── examples/
│   └── index.html              # Live demo and usage examples
├── docs/
│   └── (future documentation)
├── config/
│   └── (future configuration files)
└── README.md
```

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Any modern browser with ES6 support

## Customization

### Theme Configuration
The component supports three theme modes:

- **Auto** (default): Automatically detects theme by looking for a `dark` class on `document.documentElement`
- **Light**: Forces light theme regardless of system/page theme
- **Dark**: Forces dark theme regardless of system/page theme

```javascript
// Auto-detection (default behavior)
window.DocSelectorConfig = {
    theme: { mode: "auto" }
};

// Force specific theme
window.DocSelectorConfig = {
    theme: { mode: "dark" } // or "light"
};
```

### Theme Detection (Auto Mode)
```javascript 
// In auto mode, the component looks for this pattern:
document.documentElement.classList.contains("dark")
```

### Custom Styling
The component creates elements with specific classes and data attributes that you can target with CSS:

```css
/* Target the main container */
[data-doc-selector="true"] {
    /* Your custom styles */
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes to `dist/doc-selector.js`
4. Test with the example page
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check the examples folder for usage patterns
- Review the source code comments for implementation details 