# FairScale Deployment Checklist

## Environment Variables Required

Add these to your deployment platform (Vercel, Netlify, etc.):

```bash
NEXT_PUBLIC_FAIRSCALE_API_KEY=your_api_key_here
NEXT_PUBLIC_FAIRSCALE_API_URL=https://swagger.api.fairscale.xyz
NEXT_PUBLIC_FAIRSCALE_PROGRAM_ID=optional_program_id
```

## Deployment Steps

### 1. Vercel Deployment
```bash
# Add environment variables in Vercel dashboard
# Settings > Environment Variables

NEXT_PUBLIC_FAIRSCALE_API_KEY = cc55f9bc060e42224ecb3e393452fabd4524c3c0190f545c378cbd61c845218e
NEXT_PUBLIC_FAIRSCALE_API_URL = https://swagger.api.fairscale.xyz
```

### 2. Verify API Works
- The API uses `NEXT_PUBLIC_` prefix so it works in browser
- Falls back to mock data if API key is missing
- Has automatic error handling and retry logic

### 3. CORS Configuration
The FairScale API should allow requests from your domain. If you get CORS errors:
- Contact FairScale to whitelist your domain
- Or use a server-side proxy (not needed currently)

## Testing Deployment

After deploying, test:
1. Connect wallet
2. Check browser console for "FairScale API key not found" warning
   - If you see this, env vars aren't set correctly
3. Verify "Verified Onchain" badge appears
4. Click "View wallet on Solscan" link works

## Fallback Behavior

If API fails:
- Automatically falls back to mock data
- Shows console warning
- User experience is not broken
- Still shows 5-second loading animation
