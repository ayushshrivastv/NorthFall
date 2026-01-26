# FairScale Reputation Integration

## Overview

This demo showcases **FairScale's onchain reputation scoring** integrated into NorthFall's prediction markets. Users can see how their wallet's FairScore determines access to different market tiers.

## Features

### 🎯 Reputation-Based Tiers

- **Bronze Tier** (0-299): Basic market access, $100 trading limit
- **Silver Tier** (300-599): Most markets, $500 limit, 10% fee discount
- **Gold Tier** (600-849): All markets + early access, $2K limit, 25% discount
- **Platinum Tier** (850-1000): VIP markets, $10K limit, 50% discount, 2x rewards

### 🔒 Gated Market Access

Markets are locked based on reputation tier. Higher FairScore = access to more exclusive markets with better terms.

### 📊 Live Reputation Display

- Real-time FairScore visualization
- Tier progress tracking
- Badge achievements
- Social signal verification

## How to Use

1. **Click "FairScale"** in the navbar
2. **Connect a wallet** (or use demo wallet)
3. **View your FairScore** and current tier
4. **Explore gated markets** - see which ones you can access
5. **Compare tier benefits** in the benefits table

## Technical Details

### Mock Data

Currently uses deterministic mock data based on wallet address. Real FairScale API integration coming soon.

### Architecture

- **Provider**: `FairScaleProvider` - Manages state and API calls
- **Hooks**: `useTierAccess` - Access control logic
- **Components**:
  - `WalletReputationCard` - Score display
  - `TierBenefitsDisplay` - Benefits comparison
  - `ReputationGatedMarket` - Market cards with tier locks
  - `FairScaleModal` - Main demo interface

## Future Enhancements

- [ ] Real FairScale API integration
- [ ] Social signal verification (Twitter, Discord, GitHub)
- [ ] Dynamic tier thresholds
- [ ] Historical score tracking
- [ ] Tier upgrade notifications
