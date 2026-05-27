<!-- DEPLOYMENT_GUIDE.md -->
# 🚀 Complete Deployment Guide: The 30-Day Weight Loss Blueprint

## Table of Contents
1. [PayPal Setup](#paypal-setup)
2. [GitHub Repository Setup](#github-repository-setup)
3. [Netlify Deployment](#netlify-deployment)
4. [Testing & Verification](#testing--verification)
5. [Going Live](#going-live)
6. [Troubleshooting](#troubleshooting)

---

## PayPal Setup

### Step 1: Create PayPal Developer Account

1. Go to https://developer.paypal.com
2. Click **Sign Up**
3. Choose **Business Account** (or upgrade if you have personal)
4. Complete registration with your email
5. Verify your email address

### Step 2: Create Sandbox Credentials (For Testing)

1. Log in to PayPal Developer Dashboard
2. Go to **Apps & Credentials** (left menu)
3. Make sure you're on **Sandbox** tab (top)
4. Under **Accounts**, you'll see:
   - **Merchant (Business) Account**
   - **Personal Account** (for testing)
5. Copy the following values:
   - **Client ID** (under your app name)
   - Click **Show** next to Client ID to reveal the full ID

### Step 3: Get Your Client Secret

1. In PayPal Developer Dashboard
2. Go to **Apps & Credentials** → **Sandbox**
3. Under **Client ID**, click the app name (usually "Default")
4. You'll see:
   - **Client ID**: Copy this
   - **Secret**: Click **Show** and copy this

### Step 4: Save Your Credentials

Keep these safe (in a password manager):
```
PAYPAL_CLIENT_ID = ABCD1234EFGH5678...
PAYPAL_CLIENT_SECRET = wxyz9876DCBA5432...
```

You'll need these later!

### Step 5: Test PayPal Sandbox

1. Go to https://developer.paypal.com/dashboard/accounts
2. Find your **Merchant (Business)** account
3. Click "View" to see test credentials
4. Note the Sandbox email (you'll use this to log in during testing)

---

## GitHub Repository Setup

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `weight-loss-blueprint`
3. Description: "30-Day Weight Loss Blueprint - Landing Page with PayPal Integration"
4. Choose **Public** (easier for Netlify)
5. Click **Create repository**

### Step 2: Initialize Git Locally

Open terminal/command prompt:

```bash
# Navigate to your project directory
cd weight-loss-blueprint

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Landing page with PayPal integration"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/weight-loss-blueprint.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Create .gitignore

Create `.gitignore` file in your project root:

```
# Environment variables - NEVER commit
.env
.env.local
.env*.local

# Dependencies
node_modules/
package-lock.json

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Netlify
.netlify/
```

---

## Netlify Deployment

### Step 1: Connect Netlify to GitHub

1. Go to https://netlify.com
2. Click **Sign Up**
3. Choose **Sign up with GitHub**
4. Authorize Netlify to access your GitHub account
5. Click **Authorize Netlify by Netlify**

### Step 2: Create New Site

1. In Netlify Dashboard, click **New site from Git**
2. Choose **GitHub**
3. Search for your repository: `weight-loss-blueprint`
4. Click on it
5. Configure build settings:
   - **Branch to deploy**: main
   - **Build command**: (leave blank - not needed for static site)
   - **Publish directory**: . (dot - root directory)
6. Click **Deploy site**

Netlify will deploy your site! You'll get a random URL like:
`https://quirky-newton-ab12cd.netlify.app`

### Step 3: Add Environment Variables to Netlify

1. In Netlify Dashboard for your site
2. Go to **Settings** → **Build & Deploy** → **Environment**
3. Click **Edit variables**
4. Add your PayPal credentials:

```
PAYPAL_CLIENT_ID = your_client_id_here
PAYPAL_CLIENT_SECRET = your_client_secret_here
DOWNLOAD_SECRET = your_random_secret_here
```

To generate a random secret:
- Open browser console and run: `Math.random().toString(36).substring(2, 15)`
- Use the output as your DOWNLOAD_SECRET

5. Click **Save**
6. Site will automatically redeploy

### Step 4: Configure Custom Domain (Optional)

1. In Netlify Dashboard
2. Go to **Domain settings**
3. Click **Add custom domain**
4. Enter your domain (e.g., `weightlossblueprint.com`)
5. Follow instructions to:
   - Buy domain from registrar
   - Add Netlify nameservers to your registrar
   - Wait 24-48 hours for DNS propagation

---

## Update PayPal Client ID in Frontend

### Step 1: Update index.html

In your `index.html`, find this line:

```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID_HERE"></script>
```

Replace `YOUR_CLIENT_ID_HERE` with your actual PayPal Client ID:

```html
<script src="https://www.paypal.com/sdk/js?client-id=ABCD1234EFGH5678"></script>
```

### Step 2: Commit and Push

```bash
git add index.html
git commit -m "Add PayPal Client ID"
git push
```

Netlify automatically redeploys!

---

## Upload Your Ebook PDF

### Step 1: Prepare Your PDF

1. Have your ebook PDF ready
2. Name it: `30-Day-Weight-Loss-Blueprint.pdf`
3. File size should be under 50MB

### Step 2: Create Downloads Folder

Create folder structure:
```
/public
  /downloads
    30-Day-Weight-Loss-Blueprint.pdf
```

### Step 3: Upload to Netlify

Option A: Direct Upload
1. In Netlify Dashboard
2. Go to **Files**
3. Create folder `downloads`
4. Upload PDF

Option B: Git Upload
```bash
# Add files
git add public/downloads/30-Day-Weight-Loss-Blueprint.pdf
git commit -m "Add ebook PDF"
git push
```

---

## Testing & Verification

### Step 1: Test PayPal Checkout (Sandbox)

1. Visit your Netlify site
2. Scroll to pricing section
3. Click "Start Your 30-Day Transformation"
4. You should see PayPal checkout modal
5. Click **PayPal** button
6. Log in with your **Sandbox Merchant** account email:
   - Email: your-business@example.com (from PayPal)
   - Password: Your PayPal password

### Step 2: Test Payment Flow

1. Use test card: **4111 1111 1111 1111**
2. Expiration: Any future date (e.g., 12/25)
3. CVV: Any 3 digits
4. Complete payment
5. You should be redirected to success page
6. Try downloading ebook

### Step 3: Check Netlify Logs

1. In Netlify Dashboard
2. Go to **Functions**
3. Check logs for any errors
4. Should see:
   - ✅ "Payment verified successfully"
   - ✅ "Download link generated"

### Step 4: Test Cancel Flow

1. Go back to home page
2. Click "Start Your 30-Day Transformation" again
3. In PayPal modal, click **Cancel**
4. You should see cancel page
5. Verify error messaging

---

## Going Live with PayPal

### Step 1: Switch from Sandbox to Live

⚠️ **Only do this after testing thoroughly!**

1. PayPal Developer Dashboard
2. Go to **Apps & Credentials**
3. Switch tab from **Sandbox** to **Live**
4. Copy your **Live Client ID** and **Live Secret**

### Step 2: Update Netlify Environment Variables

1. Netlify Dashboard
2. Settings → Build & Deploy → Environment
3. Update:
   - `PAYPAL_CLIENT_ID` → Your LIVE Client ID
   - `PAYPAL_CLIENT_SECRET` → Your LIVE Secret

### Step 3: Update PayPal SDK in index.html

1. Open `index.html`
2. PayPal script line should now use LIVE URL:

```html
<!-- For SANDBOX (Testing) -->
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_SANDBOX_ID"></script>

<!-- For LIVE (Production) -->
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_LIVE_ID"></script>
```

### Step 4: Update verify-payment.js for Live

In `netlify/functions/verify-payment.js`, change:

```javascript
// SANDBOX (Testing)
'https://api-m.sandbox.paypal.com/v1/oauth2/token'

// To LIVE (Production)
'https://api.paypal.com/v1/oauth2/token'
```

Also change in order verification:
```javascript
// SANDBOX
`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`

// To LIVE
`https://api.paypal.com/v2/checkout/orders/${orderId}`
```

### Step 5: Push Changes

```bash
git add .
git commit -m "Switch to live PayPal credentials"
git push
```

### Step 6: Test with Real Payment

1. Visit your live site
2. Try purchasing with real credit card
3. Verify payment appears in PayPal account
4. Check success page and download

---

## Project Structure

Your final folder structure should look like:

```
weight-loss-blueprint/
├── index.html                          # Main landing page
├── privacy-policy.html                 # Privacy Policy
├── terms-of-service.html               # Terms of Service
├── contact.html                        # Contact Page
├── success.html                        # Success page after payment
├── cancel.html                         # Cancelled payment page
├── netlify.toml                        # Netlify config
├── .env.example                        # Environment variables template
├── .gitignore                          # Git ignore rules
├── netlify/
│   └── functions/
│       ├── verify-payment.js           # PayPal verification
│       └── get-ebook-download.js       # Generate download link
├── public/
│   └── downloads/
│       └── 30-Day-Weight-Loss-Blueprint.pdf
└── cover.jpg.jpeg                      # Book cover image
```

---

## Troubleshooting

### Problem: PayPal button not showing

**Solution:**
1. Check Client ID is correct in index.html
2. Check PayPal SDK script loaded: Open DevTools → Console
3. Ensure `PAYPAL_CLIENT_ID` is set in Netlify environment

### Problem: Payment verified but no download link

**Solution:**
1. Check `PAYPAL_CLIENT_SECRET` is correct
2. Check Netlify function logs for errors
3. Ensure you're testing with correct API endpoints (sandbox vs live)

### Problem: "Order not found" error

**Solution:**
1. Verify OrderID is being passed correctly
2. Make sure you're using same API endpoint (sandbox/live) everywhere
3. Wait a few seconds after payment before download

### Problem: Download link not working

**Solution:**
1. Check PDF file is uploaded to Netlify
2. Verify file path in function is correct
3. Check browser console for errors
4. Ensure PDF file size isn't too large

### Problem: Functions timing out

**Solution:**
1. Netlify has a 10-second timeout for free tier
2. Upgrade to Pro if needed, or optimize functions
3. Check for infinite loops in function code

---

## Performance Tips

1. **Optimize Images:**
   - Compress cover.jpg.jpeg
   - Use WebP format if possible

2. **Cache Strategy:**
   - HTML: 1 hour cache
   - PDFs: 24-hour cache
   - (Already configured in netlify.toml)

3. **Monitor Function Calls:**
   - Netlify shows analytics in dashboard
   - Watch for unusual patterns

---

## Security Best Practices

1. ✅ **Never commit `.env` file**
   - Use `.env.example` as template
   - Only add to Netlify UI

2. ✅ **Keep secrets secret**
   - Rotate credentials periodically
   - Don't share in emails/chat

3. ✅ **Use HTTPS**
   - Netlify auto-enables SSL
   - All payments encrypted

4. ✅ **Validate server-side**
   - Always verify PayPal orders in backend
   - Don't trust client-side payment status

---

## Support & Resources

- PayPal Developer Docs: https://developer.paypal.com/docs/
- Netlify Docs: https://docs.netlify.com
- GitHub Help: https://docs.github.com
- PayPal Sandbox Testing: https://developer.paypal.com/docs/platforms/checkout/

---

## Summary Checklist

- [ ] Created PayPal Developer Account
- [ ] Got Sandbox Client ID & Secret
- [ ] Created GitHub Repository
- [ ] Pushed code to GitHub
- [ ] Connected Netlify to GitHub
- [ ] Added PayPal credentials to Netlify
- [ ] Updated Client ID in index.html
- [ ] Uploaded PDF to Netlify
- [ ] Tested sandbox payment flow
- [ ] Tested cancel flow
- [ ] Got live PayPal credentials
- [ ] Switched to live mode
- [ ] Tested real payment
- [ ] Domain configured (optional)
- [ ] Ready to accept orders! 🎉

---

## Questions?

If you encounter issues:

1. Check the Netlify function logs
2. Test PayPal credentials in developer dashboard
3. Verify all files are uploaded
4. Check browser console for errors
5. Make sure you're on the latest code

Good luck with your ebook business! 🚀
