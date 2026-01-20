# Architecture & Data Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Frontend (HTML/CSS/JavaScript)                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ • Login Button                                     │  │  │
│  │  │ • User Profile Display                             │  │  │
│  │  │ • Price Alert Modal                                │  │  │
│  │  │ • Email Notification Checkbox                      │  │  │
│  │  │ • Toast Notifications                              │  │  │
│  │  │ • Wishlist Management                              │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER (Node.js)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Express.js Application                                   │  │
│  │                                                          │  │
│  │ ┌─────────────────────────────────────────────────────┐ │  │
│  │ │ Authentication Layer (Passport.js)                 │ │  │
│  │ │ • Google OAuth 2.0 Strategy                        │ │  │
│  │ │ • Session Management (express-session)            │ │  │
│  │ │ • User Serialization/Deserialization              │ │  │
│  │ └─────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │ ┌─────────────────────────────────────────────────────┐ │  │
│  │ │ Email Layer (Nodemailer)                           │ │  │
│  │ │ • Gmail SMTP Configuration                         │ │  │
│  │ │ • Email Template Generation                        │ │  │
│  │ │ • Email Sending                                    │ │  │
│  │ └─────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │ ┌─────────────────────────────────────────────────────┐ │  │
│  │ │ API Routes                                         │ │  │
│  │ │ • GET /auth/google                                 │ │  │
│  │ │ • GET /auth/google/callback                        │ │  │
│  │ │ • GET /api/auth/user                               │ │  │
│  │ │ • POST /api/auth/logout                            │ │  │
│  │ │ • POST /api/alerts/email                           │ │  │
│  │ │ • GET /api/offers                                  │ │  │
│  │ │ • POST /api/chat                                   │ │  │
│  │ └─────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │ ┌─────────────────────────────────────────────────────┐ │  │
│  │ │ Business Logic                                     │ │  │
│  │ │ • Price Alert Management                           │ │  │
│  │ │ • Price Monitoring (30-sec interval)               │ │  │
│  │ │ • Offer Management                                 │ │  │
│  │ │ • Chatbot Integration                              │ │  │
│  │ └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         ↓                              ↓
    ┌─────────┐                   ┌──────────┐
    │ Google  │                   │ Gmail    │
    │ OAuth   │                   │ SMTP     │
    │ Service │                   │ Service  │
    └─────────┘                   └──────────┘
```

---

## Login Flow Diagram

```
┌─────────────────┐
│  User Opens App │
└────────┬────────┘
         │
         ↓
┌──────────────────────────┐
│ Frontend checks auth     │
│ GET /api/auth/user       │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    │          │
    ↓          ↓
 LOGGED IN   NOT LOGGED IN
    │          │
    │          ↓
    │    ┌──────────────────────────┐
    │    │ Show "Login with Google" │
    │    │ button in header         │
    │    └────────┬─────────────────┘
    │             │
    │             ↓
    │    ┌──────────────────────────┐
    │    │ User clicks button       │
    │    └────────┬─────────────────┘
    │             │
    │             ↓
    │    ┌──────────────────────────┐
    │    │ Frontend redirects to:   │
    │    │ /auth/google             │
    │    └────────┬─────────────────┘
    │             │
    │             ↓
    │    ┌──────────────────────────┐
    │    │ Backend initiates        │
    │    │ Google OAuth flow        │
    │    └────────┬─────────────────┘
    │             │
    │             ↓
    │    ┌──────────────────────────┐
    │    │ User redirected to       │
    │    │ Google consent screen    │
    │    └────────┬─────────────────┘
    │             │
    │             ↓
    │    ┌──────────────────────────┐
    │    │ User logs in with Google │
    │    │ and approves permissions │
    │    └────────┬─────────────────┘
    │             │
    │             ↓
    │    ┌──────────────────────────┐
    │    │ Google redirects to:     │
    │    │ /auth/google/callback    │
    │    │ with auth code           │
    │    └────────┬─────────────────┘
    │             │
    │             ↓
    │    ┌──────────────────────────┐
    │    │ Backend exchanges code   │
    │    │ for access token         │
    │    └────────┬─────────────────┘
    │             │
    │             ↓
    │    ┌──────────────────────────┐
    │    │ Backend gets user        │
    │    │ profile from Google      │
    │    └────────┬─────────────────┘
    │             │
    │             ↓
    │    ┌──────────────────────────┐
    │    │ Backend creates session  │
    │    │ with user data           │
    │    └────────┬─────────────────┘
    │             │
    │             ↓
    │    ┌──────────────────────────┐
    │    │ Backend redirects to     │
    │    │ home page (/)            │
    │    └────────┬─────────────────┘
    │             │
    │             ↓
    │    ┌──────────────────────────┐
    │    │ Frontend checks auth     │
    │    │ GET /api/auth/user       │
    │    └────────┬─────────────────┘
    │             │
    └─────────────┘
         │
         ↓
┌──────────────────────────┐
│ Display user profile     │
│ • Name                   │
│ • Avatar                 │
│ • Logout button          │
└──────────────────────────┘
```

---

## Email Alert Flow Diagram

```
┌──────────────────────────┐
│ User clicks bell icon    │
│ on offer card            │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│ Price Alert Modal opens  │
│ • Price slider           │
│ • Email checkbox         │
│ • Browser notification   │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│ User sets target price   │
│ and checks email option  │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│ User clicks "Set Alert"  │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│ Frontend calls:          │
│ POST /api/alerts/email   │
│ with alert details       │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│ Backend checks:          │
│ • User is logged in      │
│ • User has email         │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    │          │
    ↓          ↓
 VALID      INVALID
    │          │
    │          ↓
    │    ┌──────────────────────────┐
    │    │ Return 401 error         │
    │    │ "Not authenticated"      │
    │    └──────────────────────────┘
    │
    ↓
┌──────────────────────────┐
│ Backend generates email  │
│ • Subject: "Price alert  │
│   set for [Product]"     │
│ • Body: Alert details    │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│ Backend sends email via  │
│ Gmail SMTP               │
│ • From: FROM_EMAIL       │
│ • To: user@gmail.com     │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    │          │
    ↓          ↓
SUCCESS    FAILURE
    │          │
    │          ↓
    │    ┌──────────────────────────┐
    │    │ Return 500 error         │
    │    │ "Failed to send email"   │
    │    └──────────────────────────┘
    │
    ↓
┌──────────────────────────┐
│ Frontend shows toast:    │
│ "Email confirmation      │
│  sent"                   │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│ User receives email in   │
│ Gmail inbox              │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│ System monitors prices   │
│ every 30 seconds         │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    │          │
    ↓          ↓
PRICE DROP  NO CHANGE
    │          │
    ↓          ↓
SEND EMAIL  CONTINUE
    │          │
    ↓          ↓
┌──────────────────────────┐
│ User receives price drop │
│ email notification       │
└──────────────────────────┘
```

---

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ script.js                                            │  │
│  │ • checkAuthStatus()                                  │  │
│  │ • loginWithGoogle()                                  │  │
│  │ • logoutUser()                                       │  │
│  │ • sendEmailAlert()                                   │  │
│  │ • confirmPriceAlert()                                │  │
│  │ • checkPriceAlerts()                                 │  │
│  │ • updateAuthUI()                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                    ↓ HTTP Requests ↑
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ server.js                                            │  │
│  │                                                      │  │
│  │ ┌────────────────────────────────────────────────┐  │  │
│  │ │ Passport.js                                    │  │  │
│  │ │ • GoogleStrategy                               │  │  │
│  │ │ • serializeUser()                              │  │  │
│  │ │ • deserializeUser()                            │  │  │
│  │ └────────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │ ┌────────────────────────────────────────────────┐  │  │
│  │ │ Express Routes                                 │  │  │
│  │ │ • /auth/google                                 │  │  │
│  │ │ • /auth/google/callback                        │  │  │
│  │ │ • /api/auth/user                               │  │  │
│  │ │ • /api/auth/logout                             │  │  │
│  │ │ • /api/alerts/email                            │  │  │
│  │ └────────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │ ┌────────────────────────────────────────────────┐  │  │
│  │ │ Nodemailer                                     │  │  │
│  │ │ • transporter.sendMail()                       │  │  │
│  │ │ • Email templates                              │  │  │
│  │ └────────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │ ┌────────────────────────────────────────────────┐  │  │
│  │ │ Session Management                             │  │  │
│  │ │ • express-session                              │  │  │
│  │ │ • req.user                                     │  │  │
│  │ │ • req.session                                  │  │  │
│  │ └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         ↓                              ↓
    ┌─────────┐                   ┌──────────┐
    │ Google  │                   │ Gmail    │
    │ OAuth   │                   │ SMTP     │
    │ 2.0     │                   │ Service  │
    └─────────┘                   └──────────┘
```

---

## Data Storage Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ LocalStorage                                         │  │
│  │ • offerWishlist (JSON)                               │  │
│  │ • priceAlerts (JSON)                                 │  │
│  │ • darkMode (boolean)                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Session Storage                                      │  │
│  │ • Temporary data during session                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Backend)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Memory                                               │  │
│  │ • offers array (56 offers)                           │  │
│  │ • Session store                                      │  │
│  │ • User sessions                                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Google OAuth                                         │  │
│  │ • User profile data                                  │  │
│  │ • Access tokens                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Gmail SMTP                                           │  │
│  │ • Email messages                                     │  │
│  │ • Delivery status                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow

```
CLIENT REQUEST                  SERVER PROCESSING              RESPONSE
────────────────────────────────────────────────────────────────────────

GET /api/auth/user
                    ──────────→ Check req.user
                                Check session
                                Get user data
                    ←────────── {authenticated: true, user: {...}}

POST /api/alerts/email
{offerId, targetPrice,
 triggerType, newPrice}
                    ──────────→ Verify user logged in
                                Find offer
                                Generate email
                                Send via SMTP
                    ←────────── {success: true}

GET /auth/google
                    ──────────→ Initiate OAuth
                                Redirect to Google
                    ←────────── Redirect to Google

GET /auth/google/callback
?code=...&state=...
                    ──────────→ Exchange code for token
                                Get user profile
                                Create session
                    ←────────── Redirect to /

POST /api/auth/logout
                    ──────────→ Destroy session
                                Clear cookies
                    ←────────── {success: true}
```

---

## Error Handling Flow

```
┌──────────────────────────┐
│ Request received         │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│ Validate request         │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    │          │
    ↓          ↓
 VALID     INVALID
    │          │
    │          ↓
    │    ┌──────────────────────────┐
    │    │ Return 400 error         │
    │    │ "Bad Request"            │
    │    └──────────────────────────┘
    │
    ↓
┌──────────────────────────┐
│ Check authentication     │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    │          │
    ↓          ↓
 AUTH    NOT AUTH
    │          │
    │          ↓
    │    ┌──────────────────────────┐
    │    │ Return 401 error         │
    │    │ "Unauthorized"           │
    │    └──────────────────────────┘
    │
    ↓
┌──────────────────────────┐
│ Process request          │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    │          │
    ↓          ↓
SUCCESS    FAILURE
    │          │
    │          ↓
    │    ┌──────────────────────────┐
    │    │ Log error                │
    │    │ Return 500 error         │
    │    │ "Internal Server Error"  │
    │    └──────────────────────────┘
    │
    ↓
┌──────────────────────────┐
│ Return response          │
│ with status code         │
└──────────────────────────┘
```

---

## Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  HTML5 | CSS3 | Vanilla JavaScript | LocalStorage           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
│  Express.js | RESTful API | Middleware | Error Handling     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION LAYER                      │
│  Passport.js | Google OAuth 2.0 | express-session           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    EMAIL LAYER                              │
│  Nodemailer | Gmail SMTP | Email Templates                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                        │
│  Google OAuth | Gmail SMTP | Google Gemini API              │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION ENVIRONMENT                   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Load Balancer / Reverse Proxy                        │  │
│  │ (Nginx / Apache)                                     │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────┴─────────────────────────────────┐  │
│  │ Application Servers (Node.js)                        │  │
│  │ • Instance 1                                         │  │
│  │ • Instance 2                                         │  │
│  │ • Instance 3                                         │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────┴─────────────────────────────────┐  │
│  │ Session Store (Redis / Memcached)                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ External Services                                    │  │
│  │ • Google OAuth                                       │  │
│  │ • Gmail SMTP                                         │  │
│  │ • Google Gemini API                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

**All diagrams show the complete architecture and data flow of the Google Login and Email Alerts system.**
