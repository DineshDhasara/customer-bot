# Setup Checklist: Google Login & Email Alerts

## Phase 1: Google Cloud Setup (5 minutes)

### Create Google Cloud Project
- [ ] Go to https://console.cloud.google.com/
- [ ] Click project dropdown → NEW PROJECT
- [ ] Name: "Offer Alert Bot"
- [ ] Click CREATE
- [ ] Wait for project creation

### Enable Google+ API
- [ ] Go to APIs & Services → Library
- [ ] Search: "Google+ API"
- [ ] Click on result
- [ ] Click ENABLE

### Create OAuth Credentials
- [ ] Go to APIs & Services → Credentials
- [ ] Click "+ CREATE CREDENTIALS"
- [ ] Choose "OAuth client ID"
- [ ] If prompted, configure consent screen:
  - [ ] Choose "External"
  - [ ] App name: "Offer Alert Bot"
  - [ ] User support email: [your email]
  - [ ] Developer contact: [your email]
  - [ ] Click SAVE AND CONTINUE
  - [ ] Skip optional scopes
  - [ ] Click SAVE AND CONTINUE
  - [ ] Click BACK TO DASHBOARD

### Configure OAuth Client
- [ ] Click "+ CREATE CREDENTIALS" → "OAuth client ID"
- [ ] Application type: "Web application"
- [ ] Name: "Offer Alert Bot Web Client"
- [ ] Authorized JavaScript origins:
  - [ ] Add: `http://localhost:5003`
- [ ] Authorized redirect URIs:
  - [ ] Add: `http://localhost:5003/auth/google/callback`
- [ ] Click CREATE
- [ ] Copy **Client ID** → Save it
- [ ] Copy **Client Secret** → Save it

---

## Phase 2: Gmail SMTP Setup (3 minutes)

### Enable 2-Step Verification
- [ ] Go to https://myaccount.google.com/
- [ ] Click Security (left sidebar)
- [ ] Find "How you sign in to Google"
- [ ] Click "2-Step Verification"
- [ ] Follow steps to enable

### Generate App Password
- [ ] Go to https://myaccount.google.com/
- [ ] Click Security (left sidebar)
- [ ] Scroll to "App passwords"
- [ ] Select App: **Mail**
- [ ] Select Device: **Windows Computer** (or your OS)
- [ ] Click GENERATE
- [ ] Copy the 16-character password → Save it

---

## Phase 3: Update .env File (2 minutes)

### Edit .env
- [ ] Open `.env` file in editor
- [ ] Find line: `GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE`
- [ ] Replace with your actual Client ID
- [ ] Find line: `GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE`
- [ ] Replace with your actual Client Secret
- [ ] Find line: `SMTP_USER=your-email@gmail.com`
- [ ] Replace with your Gmail address
- [ ] Find line: `SMTP_PASS=your-app-password`
- [ ] Replace with your 16-character App Password
- [ ] Find line: `FROM_EMAIL=Offer Alert <your-email@gmail.com>`
- [ ] Replace with your Gmail address
- [ ] Save file

### Verify .env
- [ ] Check GOOGLE_CLIENT_ID is not empty
- [ ] Check GOOGLE_CLIENT_SECRET is not empty
- [ ] Check SMTP_USER is your Gmail
- [ ] Check SMTP_PASS is 16 characters
- [ ] Check FROM_EMAIL has your Gmail

---

## Phase 4: Start Server (1 minute)

### Install Dependencies
- [ ] Open terminal in project folder
- [ ] Run: `npm install`
- [ ] Wait for completion

### Start Server
- [ ] Run: `npm start`
- [ ] Look for: `✅ Google OAuth strategy configured`
- [ ] Look for: `Server running on http://localhost:5003`
- [ ] If errors, check console output

---

## Phase 5: Test Google Login (2 minutes)

### Test Login
- [ ] Open http://localhost:5003 in browser
- [ ] Look for "Login with Google" button in header
- [ ] Click the button
- [ ] Google consent screen should appear
- [ ] Click "Continue" or "Allow"
- [ ] Should redirect back to app
- [ ] Your name should appear in header
- [ ] Your avatar should appear in header

### Test Logout
- [ ] Click on your profile in header
- [ ] Click "Logout"
- [ ] Should see "Logged out successfully"
- [ ] Login button should reappear

---

## Phase 6: Test Email Alerts (3 minutes)

### Test Alert Creation Email
- [ ] Make sure you're logged in (see Phase 5)
- [ ] Find any offer card
- [ ] Click the bell icon (🔔)
- [ ] Modal should appear with price slider
- [ ] Check the checkbox: "Notify by Email"
- [ ] Adjust price slider (optional)
- [ ] Click "Set Alert" button
- [ ] Should see toast: "Email confirmation for this alert has been sent"
- [ ] Check your Gmail inbox
- [ ] Should receive email: "Price alert set for [Product]"

### Test Price Drop Email
- [ ] After setting alert, wait 30 seconds
- [ ] Should see notification: "Price Drop Alert!"
- [ ] Check your Gmail inbox
- [ ] Should receive email: "Price dropped for [Product]!"

---

## Phase 7: Verify All Features (2 minutes)

### Google Login
- [ ] Login button works
- [ ] Google consent screen appears
- [ ] User profile displays after login
- [ ] Logout button works
- [ ] Session persists on page refresh

### Email Alerts
- [ ] Can set price alerts
- [ ] Email checkbox available
- [ ] Alert creation email received
- [ ] Price drop email received
- [ ] Emails have correct content

### Other Features
- [ ] Can add offers to wishlist
- [ ] Wishlist count updates
- [ ] Can remove from wishlist
- [ ] Browser notifications work
- [ ] Toast messages display

---

## Troubleshooting Checklist

### If Login Button Shows 404
- [ ] Check GOOGLE_CLIENT_ID in .env is set
- [ ] Check GOOGLE_CLIENT_SECRET in .env is set
- [ ] Restart server: `npm start`
- [ ] Check console for: `✅ Google OAuth strategy configured`

### If "redirect_uri_mismatch" Error
- [ ] Go to Google Cloud Console
- [ ] Go to Credentials → Edit OAuth client
- [ ] Check "Authorized redirect URIs"
- [ ] Should be: `http://localhost:5003/auth/google/callback`
- [ ] Make sure it matches exactly (no typos)
- [ ] Save changes
- [ ] Restart server

### If Email Not Sending
- [ ] Check 2-Step Verification is enabled
- [ ] Check you used App Password (not regular password)
- [ ] Check SMTP_USER matches your Gmail
- [ ] Check SMTP_PASS is 16 characters
- [ ] Restart server
- [ ] Check browser console (F12) for errors

### If Server Won't Start
- [ ] Check all required .env variables are set
- [ ] Check port 5003 is not in use
- [ ] Check Node.js is installed: `node --version`
- [ ] Check npm is installed: `npm --version`
- [ ] Try: `npm install` again

---

## Success Indicators

✅ **You're Done When:**
- [ ] Server starts without errors
- [ ] Google login button works
- [ ] Can log in with Google
- [ ] User profile displays
- [ ] Can set price alerts
- [ ] Email alerts received
- [ ] Price drop emails received
- [ ] All features working

---

## Quick Reference

| Component | Status | Action |
|-----------|--------|--------|
| Google OAuth | ✅ Ready | Add credentials to .env |
| Email System | ✅ Ready | Add Gmail credentials to .env |
| Login Routes | ✅ Ready | Restart server |
| Alert System | ✅ Ready | Test with Phase 6 |
| Wishlist | ✅ Ready | No setup needed |

---

## Support

**If something doesn't work:**
1. Check the console (F12 in browser)
2. Check server terminal for errors
3. Verify all .env variables are set
4. Try restarting the server
5. Check the troubleshooting section above

**Common Issues:**
- 404 on /auth/google → Missing GOOGLE_CLIENT_ID
- Email not sending → Missing SMTP credentials
- Server won't start → Missing .env variables
- redirect_uri_mismatch → Wrong callback URL

---

## Next Steps After Setup

1. ✅ Complete all phases above
2. 📝 Customize email templates if needed
3. 🎨 Customize UI/styling
4. 🚀 Deploy to production
5. 📊 Monitor email delivery
6. 🔐 Set up database (optional)

---

**Estimated Total Time: 15-20 minutes**

Good luck! 🚀
