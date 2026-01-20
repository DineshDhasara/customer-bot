# .env Configuration Template

## Current .env File Location
`d:\Projects\alert bot\.env`

## How to Update

1. Open `.env` file in your text editor
2. Replace placeholder values with your actual credentials
3. Save the file
4. Restart the server

---

## Complete .env Template

```env
# Server Configuration
PORT=5003

# Gemini AI Configuration
GEMINI_API_KEY=AIzaSyDW7t0CWuw_h3r1cfz72ktm97gXxCHhN_E
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

# Google OAuth Configuration
# Get these from: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=http://localhost:5003/auth/google/callback

# Session Configuration
# Change this to a random string for security
SESSION_SECRET=your-super-secret-session-key-change-this

# Email Configuration (Gmail SMTP)
# Get App Password from: https://myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=Offer Alert <your-email@gmail.com>
```

---

## Step-by-Step Fill-In Guide

### 1. Google OAuth Credentials
**Where to get:**
- Go to https://console.cloud.google.com/
- Create project → Enable Google+ API → Create OAuth credentials

**What to replace:**
```env
# BEFORE:
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE

# AFTER (example):
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
```

### 2. Gmail SMTP Credentials
**Where to get:**
- Go to https://myaccount.google.com/security
- Enable 2-Step Verification
- Generate App Password for Mail

**What to replace:**
```env
# BEFORE:
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=Offer Alert <your-email@gmail.com>

# AFTER (example):
SMTP_USER=john.doe@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
FROM_EMAIL=Offer Alert <john.doe@gmail.com>
```

### 3. Session Secret
**What to replace:**
```env
# BEFORE:
SESSION_SECRET=your-super-secret-session-key-change-this

# AFTER (any random string):
SESSION_SECRET=my-super-secret-key-12345-xyz-abc-random
```

---

## Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5003` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `GEMINI_API_URL` | Gemini API endpoint | `https://generativelanguage...` |
| `GOOGLE_CLIENT_ID` | OAuth Client ID | `123456789-abc...` |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret | `GOCSPX-abc...` |
| `GOOGLE_CALLBACK_URL` | OAuth redirect URL | `http://localhost:5003/auth/google/callback` |
| `SESSION_SECRET` | Session encryption key | `my-secret-key` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_SECURE` | Use TLS encryption | `false` |
| `SMTP_USER` | Gmail address | `user@gmail.com` |
| `SMTP_PASS` | Gmail app password | `abcd efgh ijkl mnop` |
| `FROM_EMAIL` | Email sender name | `Offer Alert <user@gmail.com>` |

---

## Validation Checklist

After filling in .env, verify:

- [ ] `GOOGLE_CLIENT_ID` is not empty and starts with numbers
- [ ] `GOOGLE_CLIENT_SECRET` starts with `GOCSPX-`
- [ ] `GOOGLE_CALLBACK_URL` is exactly `http://localhost:5003/auth/google/callback`
- [ ] `SESSION_SECRET` is a random string (not placeholder)
- [ ] `SMTP_USER` is your Gmail address
- [ ] `SMTP_PASS` is 16 characters (from App Password)
- [ ] `FROM_EMAIL` contains your Gmail address
- [ ] No placeholder text remains (like `YOUR_...` or `your-...`)

---

## Common Mistakes

❌ **Don't do this:**
```env
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE  # ← Still placeholder!
SMTP_PASS=myregularpassword  # ← Use App Password, not regular password!
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback  # ← Wrong port!
```

✅ **Do this:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
SMTP_PASS=abcd efgh ijkl mnop  # ← 16-char App Password
GOOGLE_CALLBACK_URL=http://localhost:5003/auth/google/callback  # ← Correct port!
```

---

## Testing Your Configuration

After updating .env:

1. **Restart server:**
   ```bash
   npm start
   ```

2. **Check console output:**
   - Should see: `✅ Google OAuth strategy configured`
   - Should see: `Server running on http://localhost:5003`

3. **Test login:**
   - Open http://localhost:5003
   - Click "Login with Google"
   - Should work without errors

4. **Test email:**
   - Set a price alert with email enabled
   - Should receive email in Gmail

---

## Production Deployment

For production, use environment variables instead of .env:

```bash
# Set environment variables
export GOOGLE_CLIENT_ID=your-production-client-id
export GOOGLE_CLIENT_SECRET=your-production-secret
export SMTP_USER=your-production-email@gmail.com
export SMTP_PASS=your-production-app-password
# ... etc

# Start server
npm start
```

Or use your hosting platform's environment variable settings (Heroku, AWS, etc.)

---

## Security Best Practices

🔐 **Important:**
- Never commit `.env` to Git
- Never share credentials in chat or email
- Use strong `SESSION_SECRET`
- Rotate credentials periodically
- Use App Password for Gmail (not regular password)
- Keep `.env` file private and secure

---

## Troubleshooting

**If server won't start:**
- Check all variables are filled in
- Check for typos in variable names
- Check for missing quotes or special characters

**If login doesn't work:**
- Check `GOOGLE_CLIENT_ID` is correct
- Check `GOOGLE_CLIENT_SECRET` is correct
- Check `GOOGLE_CALLBACK_URL` matches Google Cloud Console

**If email doesn't send:**
- Check `SMTP_USER` is your Gmail
- Check `SMTP_PASS` is App Password (16 chars)
- Check 2-Step Verification is enabled
- Check Gmail allows "Less secure apps" (if using regular password)

---

## Quick Copy-Paste Template

```env
PORT=5003
GEMINI_API_KEY=AIzaSyDW7t0CWuw_h3r1cfz72ktm97gXxCHhN_E
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5003/auth/google/callback
SESSION_SECRET=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=
```

Fill in the empty values with your credentials!

---

## Next Steps

1. ✅ Fill in all values in `.env`
2. ✅ Save the file
3. ✅ Restart server: `npm start`
4. ✅ Test login and email
5. 🚀 Deploy to production

Done! 🎉
