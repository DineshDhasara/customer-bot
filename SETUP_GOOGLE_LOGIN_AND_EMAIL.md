# Setup Guide: Google Login & Email Notifications

## Overview
This guide will help you set up Google OAuth login and email notifications for the Offer Alert Bot.

---

## Step 1: Get Google OAuth Credentials

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **NEW PROJECT**
4. Enter project name: `Offer Alert Bot`
5. Click **CREATE**
6. Wait for the project to be created

### 1.2 Enable Google+ API
1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for `Google+ API`
3. Click on it and press **ENABLE**

### 1.3 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, click **CONFIGURE CONSENT SCREEN** first:
   - Choose **External** user type
   - Fill in:
     - App name: `Offer Alert Bot`
     - User support email: Your email
     - Developer contact: Your email
   - Click **SAVE AND CONTINUE**
   - Skip optional scopes, click **SAVE AND CONTINUE**
   - Click **BACK TO DASHBOARD**

4. Now create the OAuth client ID:
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `Offer Alert Bot Web Client`
   - Under **Authorized JavaScript origins**, add:
     - `http://localhost:5003`
   - Under **Authorized redirect URIs**, add:
     - `http://localhost:5003/auth/google/callback`
   - Click **CREATE**

5. Copy the credentials:
   - **Client ID** → Copy this
   - **Client Secret** → Copy this

### 1.4 Update .env File
Open `.env` and replace:
```
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
```

With your actual credentials:
```
GOOGLE_CLIENT_ID=abc123def456...
GOOGLE_CLIENT_SECRET=xyz789abc456...
```

---

## Step 2: Setup Gmail SMTP for Email Notifications

### 2.1 Enable 2-Step Verification
1. Go to [Google Account](https://myaccount.google.com/)
2. Click **Security** in the left sidebar
3. Scroll to **How you sign in to Google**
4. Click **2-Step Verification**
5. Follow the steps to enable it

### 2.2 Generate App Password
1. Go to [Google Account](https://myaccount.google.com/)
2. Click **Security** in the left sidebar
3. Scroll down to **App passwords** (only visible if 2-Step Verification is enabled)
4. Select:
   - App: **Mail**
   - Device: **Windows Computer** (or your device)
5. Click **GENERATE**
6. Copy the 16-character password shown

### 2.3 Update .env File
Replace in `.env`:
```
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=Offer Alert <your-email@gmail.com>
```

Example:
```
SMTP_USER=john.doe@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
FROM_EMAIL=Offer Alert <john.doe@gmail.com>
```

---

## Step 3: Verify Configuration

Your `.env` should now look like:
```env
PORT=5003
GEMINI_API_KEY=AIzaSyDW7t0CWuw_h3r1cfz72ktm97gXxCHhN_E
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET
GOOGLE_CALLBACK_URL=http://localhost:5003/auth/google/callback

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=Offer Alert <your-email@gmail.com>
```

---

## Step 4: Start the Server

```bash
npm install
npm start
```

You should see:
```
✅ Google OAuth strategy configured
📊 API Endpoints:
   GET  /api/offers - Get all offers
   ...
Server running on http://localhost:5003
```

---

## Step 5: Test Google Login

1. Open `http://localhost:5003` in your browser
2. Click **Login with Google** button in the header
3. Sign in with your Google account
4. You should be redirected back and see your name/avatar in the header

---

## Step 6: Test Email Notifications

### Test 1: Set Price Alert with Email
1. Make sure you're logged in (see Step 5)
2. Click the **bell icon** on any offer card
3. A modal will appear - check **"Notify by Email"**
4. Set a target price (e.g., lower than current price)
5. Click **Set Alert**
6. You should see a toast: `✅ Email confirmation for this alert has been sent`
7. Check your Gmail inbox - you should receive an email

### Test 2: Simulate Price Drop Alert
1. Wait about 30 seconds after setting an alert
2. The system will simulate a price drop
3. You should receive another email: `Price dropped for [Product Name]!`

---

## Troubleshooting

### Issue: "Cannot GET /auth/google"
**Solution:** 
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env`
- Restart the server after updating `.env`
- Check console for: `✅ Google OAuth strategy configured`

### Issue: "redirect_uri_mismatch" error
**Solution:**
- Go to Google Cloud Console → Credentials
- Edit the OAuth client
- Verify **Authorized redirect URIs** includes: `http://localhost:5003/auth/google/callback`
- Make sure `GOOGLE_CALLBACK_URL` in `.env` matches exactly

### Issue: Email not sending
**Solution:**
- Verify 2-Step Verification is enabled on your Google Account
- Use an **App Password** (not your regular password)
- Check that `SMTP_USER` matches your Gmail address
- Restart the server after updating `.env`
- Check browser console for error messages

### Issue: "OAuth2Strategy requires a clientID option"
**Solution:**
- This means `GOOGLE_CLIENT_ID` is not set
- Add it to `.env` and restart the server

---

## Features Enabled

✅ **Google Login**
- Users can log in with their Google account
- Session persists across page refreshes
- User profile displayed in header

✅ **Email Notifications**
- Users receive email when they set a price alert
- Users receive email when a price drop is detected
- Emails sent via Gmail SMTP

✅ **Wishlist Alerts**
- Users can set price alerts on offers
- Alerts are stored in browser localStorage
- Email notifications trigger when conditions are met

---

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to Git
- Never share your `GOOGLE_CLIENT_SECRET` or `SMTP_PASS`
- Use strong `SESSION_SECRET` in production
- For production, use environment variables instead of `.env` file

---

## Next Steps

1. ✅ Complete all steps above
2. ✅ Test Google login
3. ✅ Test email notifications
4. 📝 Customize email templates if needed
5. 🚀 Deploy to production

For support, check the console logs and browser developer tools (F12).
