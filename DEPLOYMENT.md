# Deployment Instructions

## Before Deploying

### 1. Create Required Images

You need to create these images:

- **Icon** (1024x1024px PNG, no transparency)
  - Save as `public/icon.png`
  - Must be square, no alpha channel
  
- **Splash Screen** (200x200px PNG)
  - Save as `public/splash.png`
  - Shown when app is loading
  
- **OG Image** (1200x630px PNG, 1.91:1 aspect ratio)
  - Save as `public/og-image.png`
  - Used for social sharing

### 2. Get Account Association Signature

1. Go to https://warpcast.com/~/developers/mini-apps
2. Enter your domain name
3. Sign the message with your Farcaster account
4. Copy the generated `accountAssociation` object
5. Paste it into `public/.well-known/farcaster.json`

### 3. Update Configuration Files

Update these files with your actual domain:

**public/.well-known/farcaster.json:**
- Replace `https://your-domain.com` with your actual domain
- Add the account association from step 2
- Update iconUrl, homeUrl, splashImageUrl

**index.html:**
- Replace all instances of `your-domain.com` with your domain
- Update image URLs

## Deployment Steps

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Build the app:
```bash
npm run build
```

3. Deploy:
```bash
vercel --prod
```

4. Your app will be available at the Vercel URL

### Option 2: Netlify

1. Build the app:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify
3. Make sure `.well-known/farcaster.json` is accessible

### Option 3: Custom Server

1. Build the app:
```bash
npm run build
```

2. Serve the `dist` folder with any web server
3. Ensure HTTPS is enabled
4. Make sure `/.well-known/farcaster.json` is accessible

## Verification

After deployment, verify:

1. Your domain is accessible via HTTPS
2. `https://your-domain.com/.well-known/farcaster.json` loads correctly
3. All images load properly
4. Wallet connection works on Base network

## Publishing to Farcaster

Once deployed and verified:

1. The manifest at `/.well-known/farcaster.json` will be automatically discovered
2. Share your mini app URL in a Farcaster cast
3. It should render as a rich embed with your images and launch button
4. Users can click to open your mini app

## Testing Locally with ngrok

For local testing:

1. Start dev server:
```bash
npm run dev
```

2. In another terminal, start ngrok:
```bash
ngrok http 3000
```

3. Use the ngrok HTTPS URL for testing
4. Update farcaster.json and index.html with the ngrok URL temporarily

## Important Notes

- Domain should be stable (can't change later)
- HTTPS is required
- All images must meet size requirements
- Entry fee is hardcoded as 0.000001 ETH
- Contract address: 0xC6290FA401528f504F20aafAFEF6d9740F00E66f
- Network: Base (Chain ID 8453)
