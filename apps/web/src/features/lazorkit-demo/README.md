# LazorKit Passkey Wallet Demo

A standalone demonstration module showcasing LazorKit's passkey-based wallet infrastructure for Solana.

## Overview

This demo showcases:
- 🔐 **Passkey Authentication** - Create wallets using FaceID, TouchID, or Windows Hello
- ⛽ **Gasless Transactions** - Send SOL without paying gas fees via Paymaster
- 🔄 **Session Persistence** - Automatic reconnection across devices and page refreshes
- 🔒 **Smart Wallets** - Program Derived Addresses (PDAs) with programmable logic

## Architecture

This feature is **completely isolated** from the main NorthFall codebase:

```
apps/web/src/features/lazorkit-demo/
├── README.md                           # This file
├── config.ts                           # LazorKit configuration
├── providers/
│   └── LazorKitDemoProvider.tsx       # Isolated provider wrapper
├── components/
│   ├── LazorKitDemoModal.tsx          # Main modal container
│   ├── PasskeyWalletConnect.tsx       # Wallet connection UI
│   ├── GaslessTransactionDemo.tsx     # Transaction demo
│   ├── DemoFeatureShowcase.tsx        # Feature explanation panel
│   └── SessionPersistenceDemo.tsx     # Session persistence demo
└── hooks/
    └── useLazorKitDemo.ts             # Custom demo hook
```

## Integration Points

The demo integrates with the main app in only **two places**:

1. **Navbar** (`apps/web/src/components/nav/Navbar.tsx`)
   - Adds "LazorKit Demo" button to navigation
   - Renders the demo modal

2. **Layout** (`apps/web/app/layout.tsx`)
   - Adds Buffer polyfill for browser compatibility

## How to Remove

To completely remove this demo feature:

### 1. Delete the demo folder
```bash
rm -rf apps/web/src/features/lazorkit-demo
```

### 2. Remove navbar integration
Edit `apps/web/src/components/nav/Navbar.tsx`:
- Remove the "LazorKit Demo" item from `navItems` array
- Remove the `LazorKitDemoModal` import and component

### 3. Remove Buffer polyfill (optional)
Edit `apps/web/app/layout.tsx`:
- Remove the Buffer polyfill code block

### 4. Remove dependencies (optional)
```bash
pnpm remove @lazorkit/wallet @coral-xyz/anchor buffer --filter web
```

## Configuration

The demo uses **Solana Devnet** and LazorKit's test infrastructure:

- **RPC URL**: `https://api.devnet.solana.com`
- **Portal URL**: `https://portal.lazor.sh`
- **Paymaster**: `https://kora.devnet.lazorkit.com`

⚠️ **No real funds are involved** - this is a Devnet-only demonstration.

## Features Demonstrated

### Passkey Wallet Creation
- Click "Create Wallet" to trigger WebAuthn passkey creation
- Authenticate with biometrics (FaceID/TouchID/Windows Hello)
- Smart wallet address is generated and displayed
- No seed phrases required

### Gasless Transactions
- Send SOL to any address without holding SOL for gas
- Paymaster sponsors transaction fees
- Sign transactions with passkey authentication
- View transaction on Solana Explorer

### Session Persistence
- Wallet automatically reconnects on page refresh
- WebAuthn credentials sync across devices (via iCloud Keychain, etc.)
- No need to re-authenticate for each session

## Technical Details

### WebAuthn Integration
LazorKit uses the WebAuthn standard for passkey authentication:
- Private keys stored in device's Secure Enclave
- Biometric authentication required for signing
- No key material exposed to JavaScript

### Smart Wallet Architecture
- Wallets are Program Derived Addresses (PDAs)
- Controlled by LazorKit on-chain program
- Support for recovery, policies, and session keys

### Paymaster Service
- Relayer service that sponsors transaction fees
- Enables gasless user experience
- Rate-limited for demo purposes

## Resources

- [LazorKit Documentation](https://docs.lazorkit.com/)
- [LazorKit GitHub](https://github.com/lazor-kit/lazor-kit)
- [WebAuthn Specification](https://www.w3.org/TR/webauthn/)
- [Solana Devnet Explorer](https://explorer.solana.com/?cluster=devnet)

## Support

For issues or questions about LazorKit:
- [LazorKit Telegram](https://t.me/lazorkit)
- [LazorKit Twitter](https://twitter.com/lazorkit)

---

**Note**: This is a demonstration module for educational purposes. For production use, review LazorKit's documentation and security considerations.
