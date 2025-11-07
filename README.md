# BTC Prediction Market - Base Mini App

A prediction market mini app built on Base where users predict BTC prices in 15-minute rounds and can have a chance to win ETH on Base.

## Features

- 15-minute prediction rounds
- 0.000001 ETH entry fee per prediction
- Winner receives 90% of prize pool, owner receives 10%
- Live BTC price from Chainlink oracle
- Real-time predictions display
- Round history tracking
- Wallet connection via Farcaster Mini App SDK

## Tech Stack

- **Frontend:** React + Vite
- **Blockchain:** Base (Ethereum L2)
- **Wallet:** Wagmi + Farcaster Mini App SDK
- **Design:** Base brand colors + Lexend font
- **Smart Contract:** 0xC6290FA401528f504F20aafAFEF6d9740F00E66f

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Farcaster Mini App Requirements

### Required Files
- `public/.well-known/farcaster.json` - Manifest file
- Icon (1024x1024px PNG, no alpha)
- Splash screen (200x200px)
- OG image (1200x630px, 1.91:1 ratio)

### Account Association
Use the Warpcast Mini App Manifest Tool to generate your account association:
https://warpcast.com/~/developers/mini-apps

### Deployment
Deploy to a public domain with HTTPS and serve the farcaster.json file at:
`https://your-domain.com/.well-known/farcaster.json`
