# 🎯 Offer Alert - Professional Deal Finder with AI Chatbot

A modern, professional web application that aggregates the best deals from Amazon, Flipkart, and Myntra with an AI-powered shopping assistant using Google Gemini API.

## ✨ Features

### 🛍️ Core Features
- **Real-time Offer Aggregation**: Browse 12+ curated deals from top e-commerce platforms
- **AI Shopping Assistant**: Powered by Google Gemini 2.0 Flash for personalized recommendations
- **Direct Platform Links**: Click any offer to shop directly on Amazon, Flipkart, or Myntra
- **Smart Filtering**: Filter by category, platform, and discount percentage
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

### 🤖 AI Chatbot Features
- Natural language conversation
- Personalized deal recommendations
- Context-aware responses
- Suggested offers based on user queries
- Real-time product suggestions

### 🎨 UI/UX Features
- Modern gradient design
- Smooth animations and transitions
- Interactive offer cards
- Real-time statistics dashboard
- Mobile-first responsive layout
- Professional typography and spacing

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
```bash
cd "d:\Projects\alert bot"
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
The `.env` file is already configured with:
- Gemini API Key: `AIzaSyDW7t0CWuw_h3r1cfz72ktm97gXxCHhN_E`
- API URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- Port: `3000`

4. **Start the server**
```bash
npm start
```

5. **Open your browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
alert bot/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Professional CSS styling
│   └── script.js           # Frontend JavaScript logic
├── server.js               # Express server with Gemini AI integration
├── package.json            # Project dependencies
├── .env                    # Environment variables
└── README.md              # This file
```

## 🎯 How to Use

### Browse Offers
1. Visit the homepage to see all available offers
2. Use filters to narrow down by:
   - **Category**: Electronics, Fashion
   - **Platform**: Amazon, Flipkart, Myntra
   - **Discount**: 20%, 30%, 40%, 50%+
3. Click any offer card to shop directly on the platform

### Chat with AI Assistant
1. Click the "Chat Assistant" button in the header or the floating chat button
2. Ask questions like:
   - "Show me the best phone deals"
   - "I need fashion items under ₹5000"
   - "What are the highest discounts available?"
   - "Recommend me electronics"
3. Click on suggested offers to visit the product page

### Mobile Experience
- Fully responsive design
- Touch-friendly interface
- Optimized chat experience
- Fast loading times

## 🔧 API Endpoints

### GET `/api/offers`
Get all offers with optional filters
```javascript
// Query parameters
?category=Electronics
?platform=Amazon
?minDiscount=30
```

### GET `/api/offers/:id`
Get a specific offer by ID

### POST `/api/chat`
Chat with AI assistant
```javascript
{
  "message": "Show me phone deals",
  "conversationHistory": []
}
```

### GET `/api/stats`
Get platform statistics

## 🎨 Customization

### Adding New Offers
Edit the `offers` array in `server.js`:
```javascript
{
  id: 13,
  title: "Your Product Title",
  description: "Product description",
  originalPrice: 10000,
  discountedPrice: 7000,
  discount: 30,
  category: "Electronics",
  platform: "Amazon",
  image: "image-url",
  link: "https://amazon.in/search?q=product",
  rating: 4.5,
  reviews: 1000
}
```

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    --success-color: #10b981;
}
```

### Modifying AI Behavior
Edit the system prompt in `server.js` (line ~120):
```javascript
const systemPrompt = `You are a helpful shopping assistant...`;
```

## 🌟 Features Breakdown

### Statistics Dashboard
- Total active offers
- Average discount percentage
- Total savings available

### Offer Cards
- High-quality product images
- Discount badges
- Original vs discounted prices
- Savings calculation
- Platform badges
- Star ratings and reviews
- Direct "Shop Now" buttons

### AI Chatbot
- Gemini 2.0 Flash integration
- Conversation history tracking
- Contextual responses
- Fallback responses for offline mode
- Suggested offers display
- Typing indicators

## 🔒 Security Features
- CORS enabled
- Environment variable protection
- Input validation
- Error handling
- Safe external link handling

## 📱 Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🎯 Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🚀 Performance
- Lazy loading images
- Optimized animations
- Efficient API calls
- Minimal dependencies
- Fast initial load

## 📝 Development

### Run in Development Mode
```bash
npm run dev
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## 🤝 Contributing
Feel free to fork this project and customize it for your needs!

## 📄 License
MIT License - Feel free to use this project for personal or commercial purposes.

## 🎉 Credits
- **AI**: Google Gemini 2.0 Flash
- **Icons**: Font Awesome
- **Images**: Unsplash
- **Design**: Custom modern gradient design

## 📞 Support
For issues or questions, please check:
1. Ensure Node.js is installed
2. Verify `.env` file exists
3. Check if port 3000 is available
4. Ensure internet connection for AI features

## 🔮 Future Enhancements
- [ ] User authentication
- [ ] Wishlist functionality
- [ ] Price tracking
- [ ] Email notifications
- [ ] More e-commerce platforms
- [ ] Advanced filtering options
- [ ] Product comparison
- [ ] Deal alerts

---

**Made with ❤️ using Node.js, Express, and Google Gemini AI**

🌐 **Live Demo**: http://localhost:3000
🤖 **AI Powered**: Google Gemini 2.0 Flash
🛍️ **Platforms**: Amazon | Flipkart | Myntra
