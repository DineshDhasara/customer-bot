# Quick Start: Google Login & Email Alerts

## ⚡ 5-Minute Setup

### Step 1: Get Google OAuth Credentials (2 minutes)
1. Go to https://console.cloud.google.com/
2. Create new project → Name it "Offer Alert Bot"
3. Go to APIs & Services → Library → Search "Google+ API" → Enable it
4. Go to Credentials → Create OAuth 2.0 credentials:
   - Type: Web application
   - Authorized origins: `http://localhost:5003`
   - Redirect URI: `http://localhost:5003/auth/google/callback`
5. Copy **Client ID** and **Client Secret**

### Step 2: Setup Gmail for Emails (2 minutes)
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to App passwords → Generate for Mail/Windows
4. Copy the 16-character password

### Step 3: Update .env File (1 minute)
Edit `.env` and fill in:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
FROM_EMAIL=Offer Alert <your-email@gmail.com>
```

### Step 4: Start Server
```bash
npm install
npm start
```

### Step 5: Test
1. Open http://localhost:5003
2. Click "Login with Google"
3. Click bell icon on any offer
4. Check "Notify by Email"
5. Set alert → Check your Gmail inbox ✅

---

## 🎯 How It Works

### Google Login Flow
```
User clicks "Login with Google"
    ↓
Redirected to Google consent screen
    ↓
User approves
    ↓
Redirected back with user profile
    ↓
Session created, user logged in
```

### Email Alert Flow
```
User sets price alert with email enabled
    ↓
Email sent: "Price alert set for [Product]"
    ↓
System checks prices every 30 seconds
    ↓
If price drops below target
    ↓
Email sent: "Price dropped for [Product]!"
```

---

## ✅ Features

- ✅ Google OAuth login with Gmail
- ✅ Email notifications for price alerts
- ✅ Email notifications for price drops
- ✅ Wishlist management
- ✅ Real-time price monitoring
- ✅ Browser notifications
- ✅ Responsive design

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot GET /auth/google" | Add GOOGLE_CLIENT_ID to .env and restart |
| "redirect_uri_mismatch" | Check Google Cloud Console redirect URI matches exactly |
| Email not sending | Use App Password (not regular password), enable 2-Step Verification |
| Login button not working | Check console for errors (F12) |

---

## 📧 Email Templates

### Alert Created Email
```
Hi [User Name],

You have set a price alert for: [Product Name]
Current price: ₹[Price]
Target price: ₹[Target]

View offer: [Link]
```

### Price Drop Email
```
Hi [User Name],

Good news! The price for [Product Name] has dropped.
Previous alert target: ₹[Target]
New simulated price: ₹[New Price]

Check the deal here: [Link]
```

---

## 🔐 Security

- Never commit `.env` to Git
- Never share Client Secret or App Password
- Use strong SESSION_SECRET
- For production, use environment variables

---

## 📞 Support

Check browser console (F12) for detailed error messages.
