# FairScale Integration

This directory contains the integration of FairScale onchain reputation scoring into the NorthFall application. The implementation focuses on providing a verifiable, metric-driven approach to user trust that enables dynamic access control and incentivized participation without reliance on centralized identity providers.

## Integration Overview

The core of this integration is the FairScaleProvider which manages the application-wide reputation state. By interfacing directly with the FairScale API, the provider fetches and maintains up-to-date FairScore data for connected wallets. This score serves as the fundamental metric for determining user eligibility for various platform features. The implementation leverages a modular architecture where the API layer handles data fetching and transformation, while dedicated hooks expose access controls to the frontend components.

## Reputation Gating Architecture

Market access is governed by a hierarchical tier system that maps quantitative scores to qualitative access levels. The ReputationGatedMarket component implements this logic by visually distinguishing between accessible and restricted markets based on the user's current standing. This creates a transparent environment where users can clearly understand the requirements for premium features. Instead of opaque restrictions, the system provides explicit feedback on the score requirements needed to unlock specific markets, fostering a progression-oriented user experience.

## Onchain Verification

To establish trust in the displayed metrics, the integration includes a verification mechanism that links off-chain scores to onchain data. The OnchainVerificationBadge component provides direct links to the Solana blockchain explorer, allowing users to independently verify that their reputation data is anchored onchain. This transparency is crucial for maintaining user confidence in the fairness of the scoring system and the legitimacy of the benefits rewarded.

## Dynamic Benefits System

Beyond simple access gating, the system implements a dynamic benefits structure that rewards higher reputation tiers with tangible advantages. The BenefitsComparison and TierBenefitsDisplay components visualize the specific advantages available at each tier, such as increased trading limits, fee discounts, and reward multipliers. This approach transforms reputation from a passive metric into an active utility that directly enhances the user's economic efficiency within the platform.

## Transaction History and Transparency

The activity logging system provides users with granular visibility into how their onchain actions influence their reputation. The TransactionHistory component aggregates relevant blockchain interactions and highlights the specific reputation impacts and applied benefits for each transaction. This feedback loop helps users understand the correlation between their behavior and their standing within the ecosystem, encouraging positive participation that benefits the protocol's overall health.
