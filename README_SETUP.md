# 🎯 Offer Alert Bot - Google Login & Email Alerts Setup

## 📋 What's Included

This setup enables two critical features:

### 1. 🔐 Google OAuth Login
Users can log in with their Google account instead of creating new credentials.

```
User → Click "Login with Google" → Google Consent → Logged In ✅
```

### 2. 📧 Email Notifications
Users receive emails when:
- They set a price alert
- The price drops below their target

```
User sets alert → Email received ✅
Price drops → Email received ✅
```

---

## ⚡ Quick Setup (Choose One)

### Option A: 5-Minute Quick Start
👉 **Read:** `QUICK_START.md`
- Fastest way to get started
- Minimal explanation
- Perfect if you know what you're doing

### Option B: Step-by-Step Guide
👉 **Read:** `SETUP_GOOGLE_LOGIN_AND_EMAIL.md`
- Detailed instructions
- Screenshots and explanations
- Perfect for first-time setup

### Option C: Interactive Checklist
👉 **Read:** `SETUP_CHECKLIST.md`
- Checkbox format
- Easy to follow
- Perfect for tracking progress

---

## 🚀 TL;DR (30 seconds)

1. **Get Google OAuth credentials:**
   - Go to https://console.cloud.google.com/
   - Create project → Enable Google+ API → Create OAuth credentials
   - Copy Client ID and Secret

2. **Get Gmail App Password:**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification
   - Generate App Password for Mail

3. **Update .env:**
   ```env
   GOOGLE_CLIENT_ID=your-id
   GOOGLE_CLIENT_SECRET=your-secret
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=Offer Alert <your-email@gmail.com>
   ```

4. **Start server:**
   ```bash
   npm install
   npm start
   ```

5. **Test:**
   - Open http://localhost:5003
   - Click "Login with Google"
   - Click bell icon on offer
   - Check "Notify by Email"
   - Set alert → Check Gmail ✅

---

## 📊 How It Works

### Architecture
```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Browser)               │
│  - Login button                                     │
│  - Price alert modal                                │
│  - Email notification checkbox                      │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────┐
│                  Backend (Node.js)                  │
│  - Express.js server                                │
│  - Passport.js (Google OAuth)                       │
│  - Nodemailer (Email sending)                       │
│  - Session management                               │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
   ┌─────────┐          ┌──────────┐
   │ Google  │          │ Gmail    │
   │ OAuth   │          │ SMTP     │
   └─────────┘          └──────────┘
```

### Data Flow
```
LOGIN FLOW:
User → Google Login Button → Google Consent → Backend Auth → Session → Logged In

ALERT FLOW:
User → Click Bell → Set Price → Check Email → Send Alert → Email Sent → Price Check → Email Sent
```

---

## ✅ Features Checklist

- ✅ Google OAuth login
- ✅ Session management
- ✅ User profile display
- ✅ Logout functionality
- ✅ Price alert creation
- ✅ Email notifications
- ✅ Price drop detection
- ✅ Browser notifications
- ✅ Wishlist management
- ✅ Responsive design

---

## 🔧 Technical Stack

| Component | Technology |
|-----------|-----------|
| Backend | Node.js + Express.js |
| Authentication | Passport.js + Google OAuth 2.0 |
| Sessions | express-session |
| Email | Nodemailer + Gmail SMTP |
| Frontend | Vanilla JavaScript |
| Storage | Browser localStorage |
| API | RESTful endpoints |

---

## 📁 Files & Documentation

| File | Purpose |
|------|---------|
| `QUICK_START.md` | 5-minute setup guide |
| `SETUP_GOOGLE_LOGIN_AND_EMAIL.md` | Detailed step-by-step guide |
| `SETUP_CHECKLIST.md` | Interactive checklist |
| `FEATURES_IMPLEMENTED.md` | Complete feature documentation |
| `.env` | Configuration file (update with credentials) |
| `server.js` | Backend server code |
| `public/script.js` | Frontend code |

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot GET /auth/google" | Add GOOGLE_CLIENT_ID to .env |
| "redirect_uri_mismatch" | Check Google Cloud Console redirect URI |
| Email not sending | Use App Password, enable 2-Step Verification |
| Server won't start | Check all .env variables are set |
| Login button not working | Check console (F12) for errors |

---

## 🔐 Security Notes

⚠️ **Important:**
- Never commit `.env` to Git
- Never share Client Secret or App Password
- Use strong SESSION_SECRET
- For production, use environment variables
- Keep credentials private

---

## 📞 Support & Troubleshooting

1. **Check browser console:** Press F12 → Console tab
2. **Check server logs:** Look at terminal output
3. **Verify .env:** Make sure all variables are set
4. **Restart server:** Sometimes helps with caching
5. **Read documentation:** Check the setup guides above

---

## 🎯 Next Steps

1. ✅ Choose a setup guide (Quick Start / Detailed / Checklist)
2. ✅ Get Google OAuth credentials
3. ✅ Get Gmail App Password
4. ✅ Update .env file
5. ✅ Start server
6. ✅ Test login and email alerts
7. 🚀 Deploy to production

---

## 📈 What's New

### Before
- ❌ No login system
- ❌ No email notifications
- ❌ Server crashes on startup
- ❌ 404 errors on auth routes

### After
- ✅ Google OAuth login
- ✅ Email notifications working
- ✅ Server starts cleanly
- ✅ All routes working
- ✅ Full feature set

---

## 🎉 You're Ready!

Everything is set up and ready to go. Just follow one of the setup guides and you'll have:
- ✅ Google login working
- ✅ Email alerts working
- ✅ Price monitoring working
- ✅ Wishlist working
- ✅ Full feature set

**Estimated Setup Time: 15-20 minutes**

Let's get started! 🚀

---

**Questions?** Check the setup guides or browser console for detailed error messages.
