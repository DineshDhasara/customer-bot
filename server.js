require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const nodemailer = require('nodemailer');
const { Groq } = require('groq-sdk');

// All offers are now included in the main offers array

// In-memory storage for notifications (in production, use a database)
const notifications = new Map(); // userId -> notifications array

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'offer-alert-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Sample offers data with real e-commerce links
const offers = [
  {
    id: 1,
    title: "iPhone 15 Pro Max - Mega Discount",
    description: "Latest iPhone 15 Pro Max with 256GB storage",
    originalPrice: 159900,
    discountedPrice: 134900,
    discount: 16,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
    link: "https://www.amazon.in/s?k=iphone+15+pro+max",
    rating: 4.8,
    reviews: 2340
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra",
    description: "Flagship Samsung phone with S Pen",
    originalPrice: 129999,
    discountedPrice: 109999,
    discount: 15,
    category: "Electronics",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
    link: "https://www.flipkart.com/search?q=samsung+galaxy+s24+ultra",
    rating: 4.7,
    reviews: 1890
  },
  {
    id: 3,
    title: "Nike Air Max 270 - Limited Edition",
    description: "Premium sports shoes with air cushioning",
    originalPrice: 12995,
    discountedPrice: 7999,
    discount: 38,
    category: "Fashion",
    platform: "Myntra",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    link: "https://www.myntra.com/nike-shoes",
    rating: 4.6,
    reviews: 3450
  },
  {
    id: 4,
    title: "Adidas Ultraboost Running Shoes",
    description: "Comfortable running shoes with boost technology",
    originalPrice: 14999,
    discountedPrice: 9999,
    discount: 33,
    category: "Fashion",
    platform: "Myntra",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400",
    link: "https://www.myntra.com/adidas-shoes",
    rating: 4.7,
    reviews: 2890
  },
  {
    id: 5,
    title: "MacBook Air M2 - Student Offer",
    description: "Powerful MacBook Air with M2 chip, 8GB RAM",
    originalPrice: 114900,
    discountedPrice: 99900,
    discount: 13,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    link: "https://www.amazon.in/s?k=macbook+air+m2",
    rating: 4.9,
    reviews: 1567
  },
  {
    id: 6,
    title: "Sony WH-1000XM5 Headphones",
    description: "Premium noise cancelling wireless headphones",
    originalPrice: 29990,
    discountedPrice: 24990,
    discount: 17,
    category: "Electronics",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
    link: "https://www.flipkart.com/search?q=sony+wh-1000xm5",
    rating: 4.8,
    reviews: 4230
  },
  {
    id: 7,
    title: "Levi's Denim Jacket - Classic Blue",
    description: "Timeless denim jacket for all seasons",
    originalPrice: 4999,
    discountedPrice: 2999,
    discount: 40,
    category: "Fashion",
    platform: "Myntra",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    link: "https://www.myntra.com/levis-jackets",
    rating: 4.5,
    reviews: 1890
  },
  {
    id: 8,
    title: "OnePlus 12 5G Smartphone",
    description: "Flagship killer with Snapdragon 8 Gen 3",
    originalPrice: 64999,
    discountedPrice: 54999,
    discount: 15,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    link: "https://www.amazon.in/s?k=oneplus+12",
    rating: 4.6,
    reviews: 2340
  },
  {
    id: 9,
    title: "Puma Sports T-Shirt Combo",
    description: "Pack of 3 premium sports t-shirts",
    originalPrice: 2997,
    discountedPrice: 1499,
    discount: 50,
    category: "Fashion",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    link: "https://www.flipkart.com/search?q=puma+tshirts",
    rating: 4.4,
    reviews: 5670
  },
  {
    id: 10,
    title: "Boat Airdopes 141 TWS Earbuds",
    description: "True wireless earbuds with 42H playback",
    originalPrice: 2999,
    discountedPrice: 1299,
    discount: 57,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
    link: "https://www.amazon.in/s?k=boat+airdopes+141",
    rating: 4.3,
    reviews: 8900
  },
  {
    id: 11,
    title: "H&M Casual Shirt - Premium Cotton",
    description: "Comfortable casual shirt for everyday wear",
    originalPrice: 1999,
    discountedPrice: 999,
    discount: 50,
    category: "Fashion",
    platform: "Myntra",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
    link: "https://www.myntra.com/hm-shirts",
    rating: 4.5,
    reviews: 3210
  },
  {
    id: 12,
    title: "Fire-Boltt Smart Watch",
    description: "Feature-rich smartwatch with health tracking",
    originalPrice: 4999,
    discountedPrice: 1999,
    discount: 60,
    category: "Electronics",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    link: "https://www.flipkart.com/search?q=fire+boltt+smartwatch",
    rating: 4.2,
    reviews: 12340
  },
  // NEW PRODUCTS ADDED
  {
    id: 13,
    title: "iPad Air 5th Generation - 64GB",
    description: "Powerful tablet with M1 chip, 10.9-inch display",
    originalPrice: 59900,
    discountedPrice: 49900,
    discount: 17,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    link: "https://www.amazon.in/s?k=ipad+air+5th+gen",
    rating: 4.7,
    reviews: 3450
  },
  {
    id: 14,
    title: "Nike Air Jordan 1 Retro High",
    description: "Iconic basketball shoes with premium leather",
    originalPrice: 18999,
    discountedPrice: 14999,
    discount: 21,
    category: "Fashion",
    platform: "Myntra",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
    link: "https://www.myntra.com/nike-air-jordan",
    rating: 4.8,
    reviews: 5670
  },
  {
    id: 15,
    title: "Samsung Galaxy Tab S8",
    description: "Premium Android tablet with S Pen included",
    originalPrice: 64999,
    discountedPrice: 54999,
    discount: 15,
    category: "Electronics",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    link: "https://www.flipkart.com/search?q=samsung+galaxy+tab+s8",
    rating: 4.6,
    reviews: 2340
  },
  {
    id: 16,
    title: "Puma RS-X³ Sneakers",
    description: "Retro-inspired running shoes with modern comfort",
    originalPrice: 8999,
    discountedPrice: 5999,
    discount: 33,
    category: "Fashion",
    platform: "Myntra",
    image: "https://images.unsplash.com/photo-1600185365483-26e7e1a8c3c6?w=400",
    link: "https://www.myntra.com/puma-rsx3",
    rating: 4.5,
    reviews: 1890
  },
  {
    id: 17,
    title: "Dell XPS 13 Laptop",
    description: "Ultra-thin laptop with Intel i7, 16GB RAM",
    originalPrice: 149900,
    discountedPrice: 119900,
    discount: 20,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    link: "https://www.amazon.in/s?k=dell+xps+13",
    rating: 4.8,
    reviews: 1560
  },
  {
    id: 18,
    title: "Adidas Originals Hoodie",
    description: "Classic 3-Stripes hoodie with soft cotton",
    originalPrice: 3499,
    discountedPrice: 2499,
    discount: 29,
    category: "Fashion",
    platform: "Myntra",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a1?w=400",
    link: "https://www.myntra.com/adidas-hoodie",
    rating: 4.6,
    reviews: 3210
  },
  {
    id: 19,
    title: "Sony PlayStation 5 Console",
    description: "Next-gen gaming console with 4K gaming",
    originalPrice: 49990,
    discountedPrice: 44990,
    discount: 10,
    category: "Electronics",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
    link: "https://www.flipkart.com/search?q=playstation+5",
    rating: 4.9,
    reviews: 8900
  },
  {
    id: 20,
    title: "U.S. Polo Assn. Chinos",
    description: "Classic fit chinos for men, premium fabric",
    originalPrice: 2999,
    discountedPrice: 1999,
    discount: 33,
    category: "Fashion",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
    link: "https://www.flipkart.com/search?q=us+polo+chinos",
    rating: 4.4,
    reviews: 4560
  },
  {
    id: 21,
    title: "Microsoft Surface Laptop 4",
    description: "Touchscreen laptop with AMD Ryzen 7 processor",
    originalPrice: 129900,
    discountedPrice: 109900,
    discount: 15,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1603302576837-37561b5ea46e?w=400",
    link: "https://www.amazon.in/s?k=surface+laptop+4",
    rating: 4.7,
    reviews: 2340
  },
  {
    id: 22,
    title: "Reebok Classic Leather Shoes",
    description: "Vintage-style sneakers with premium leather",
    originalPrice: 6999,
    discountedPrice: 4999,
    discount: 29,
    category: "Fashion",
    platform: "Myntra",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    link: "https://www.myntra.com/reebok-classic",
    rating: 4.5,
    reviews: 3450
  },
  {
    id: 23,
    title: "LG OLED55C3 Smart TV",
    description: "55-inch 4K OLED TV with webOS",
    originalPrice: 149900,
    discountedPrice: 119900,
    discount: 20,
    category: "Electronics",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400",
    link: "https://www.flipkart.com/search?q=lg+oled+55c3",
    rating: 4.8,
    reviews: 1230
  },
  {
    id: 24,
    title: "Tommy Hilfiger Polo Shirt",
    description: "Classic fit polo with embroidered logo",
    originalPrice: 3999,
    discountedPrice: 2999,
    discount: 25,
    category: "Fashion",
    platform: "Myntra",
    image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400",
    link: "https://www.myntra.com/tommy-polo",
    rating: 4.6,
    reviews: 2890
  },
  {
    id: 25,
    title: "Canon EOS R6 Mark II",
    description: "Professional mirrorless camera with 4K video",
    originalPrice: 239900,
    discountedPrice: 219900,
    discount: 8,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1516035069375-84cc8540d724?w=400",
    link: "https://www.amazon.in/s?k=canon+eos+r6+mark+ii",
    rating: 4.9,
    reviews: 890
  },
  {
    id: 26,
    title: "Vanilla Star Backpack",
    description: "Stylish backpack with laptop compartment",
    originalPrice: 2499,
    discountedPrice: 1499,
    discount: 40,
    category: "Fashion",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    link: "https://www.flipkart.com/search?q=vanilla+star+backpack",
    rating: 4.3,
    reviews: 5670
  },
  {
    id: 27,
    title: "Apple Watch Series 9",
    description: "Advanced health tracking with GPS",
    originalPrice: 44900,
    discountedPrice: 39900,
    discount: 11,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400",
    link: "https://www.amazon.in/s?k=apple+watch+series+9",
    rating: 4.8,
    reviews: 3450
  },
  {
    id: 28,
    title: "Calvin Klein Jeans Denim",
    description: "Slim fit jeans with stretch comfort",
    originalPrice: 4999,
    discountedPrice: 3499,
    discount: 30,
    category: "Fashion",
    platform: "Myntra",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    link: "https://www.myntra.com/calvin-klein-jeans",
    rating: 4.5,
    reviews: 4230
  },
  {
    id: 29,
    title: "JBL Flip 6 Bluetooth Speaker",
    description: "Portable waterproof speaker with powerful bass",
    originalPrice: 8999,
    discountedPrice: 6999,
    discount: 22,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e5e9?w=400",
    link: "https://www.amazon.in/s?k=jbl+flip+6",
    rating: 4.6,
    reviews: 6780
  },
  {
    id: 30,
    title: "Flying Machine Jacket",
    description: "Stylish bomber jacket for men",
    originalPrice: 3999,
    discountedPrice: 2499,
    discount: 38,
    category: "Fashion",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1551488831-00ddc6c66084?w=400",
    link: "https://www.flipkart.com/search?q=flying+machine+jacket",
    rating: 4.4,
    reviews: 3210
  },
  // ADDITIONAL OFFERS FROM additional-offers.js
  {
    id: 31,
    title: "Samsung 55-inch QLED 4K Smart TV",
    description: "Premium 4K QLED TV with Quantum HDR",
    originalPrice: 119990,
    discountedPrice: 79990,
    discount: 33,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
    link: "https://www.amazon.in/s?k=samsung+qled+tv",
    rating: 4.7,
    reviews: 1230
  },
  {
    id: 32,
    title: "Apple iPad Pro 12.9-inch",
    description: "M2 chip, 256GB storage, Wi-Fi + Cellular",
    originalPrice: 129900,
    discountedPrice: 114900,
    discount: 12,
    category: "Electronics",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    link: "https://www.flipkart.com/search?q=ipad+pro+12.9",
    rating: 4.9,
    reviews: 890
  },
  {
    id: 33,
    title: "Dyson V15 Detect Vacuum Cleaner",
    description: "Powerful cordless vacuum with laser detection",
    originalPrice: 65900,
    discountedPrice: 54900,
    discount: 17,
    category: "Home Appliances",
    platform: "Dyson Official",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400",
    link: "https://www.dyson.in/vacuum-cleaners/cordless/v15-detect",
    rating: 4.8,
    reviews: 560
  },
  {
    id: 34,
    title: "Nike Air Jordan 1 High OG",
    description: "Iconic basketball shoes in limited colorway",
    originalPrice: 16995,
    discountedPrice: 12995,
    discount: 24,
    category: "Fashion",
    platform: "Nike",
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400",
    link: "https://www.nike.com/in/w/air-jordan-1-shoes-5sj3yzy7ok",
    rating: 4.9,
    reviews: 3450
  },
  {
    id: 35,
    title: "Sony PlayStation 5 Console",
    description: "Next-gen gaming console with DualSense controller",
    originalPrice: 54990,
    discountedPrice: 49990,
    discount: 9,
    category: "Gaming",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400",
    link: "https://www.amazon.in/s?k=playstation+5+console",
    rating: 4.8,
    reviews: 2340
  },
  {
    id: 36,
    title: "Bose QuietComfort Ultra Headphones",
    description: "Premium noise cancelling headphones with spatial audio",
    originalPrice: 34900,
    discountedPrice: 29900,
    discount: 14,
    category: "Electronics",
    platform: "Bose",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    link: "https://www.boseindia.com/en_in/products/headphones/noise_cancelling_headphones.html",
    rating: 4.7,
    reviews: 1120
  },
  {
    id: 37,
    title: "Zara Premium Leather Jacket",
    description: "Genuine leather jacket with modern design",
    originalPrice: 12990,
    discountedPrice: 7990,
    discount: 39,
    category: "Fashion",
    platform: "Zara",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    link: "https://www.zara.com/in/en/search?searchTerm=leather+jacket",
    rating: 4.6,
    reviews: 890
  },
  {
    id: 38,
    title: "Philips Air Purifier 3000i Series",
    description: "Smart air purifier with HEPA filter and app control",
    originalPrice: 32995,
    discountedPrice: 24995,
    discount: 24,
    category: "Home Appliances",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400",
    link: "https://www.flipkart.com/search?q=philips+air+purifier",
    rating: 4.5,
    reviews: 670
  },
  {
    id: 39,
    title: "Canon EOS R6 Mark II Camera",
    description: "Full-frame mirrorless camera with 24MP sensor",
    originalPrice: 249995,
    discountedPrice: 219995,
    discount: 12,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
    link: "https://www.amazon.in/s?k=canon+eos+r6+mark+ii",
    rating: 4.8,
    reviews: 340
  },
  {
    id: 40,
    title: "Adidas Originals Superstar Shoes",
    description: "Classic shell-toe sneakers in white and black",
    originalPrice: 8999,
    discountedPrice: 5999,
    discount: 33,
    category: "Fashion",
    platform: "Myntra",
    image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=400",
    link: "https://www.myntra.com/adidas-originals-superstar",
    rating: 4.7,
    reviews: 5670
  },
  {
    id: 41,
    title: "Apple Watch Series 9",
    description: "Latest smartwatch with health features and always-on display",
    originalPrice: 41900,
    discountedPrice: 37900,
    discount: 10,
    category: "Electronics",
    platform: "Apple",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
    link: "https://www.apple.com/in/apple-watch-series-9/",
    rating: 4.9,
    reviews: 1890
  },
  {
    id: 42,
    title: "Samsung Galaxy Tab S9 Ultra",
    description: "Premium Android tablet with 14.6-inch AMOLED display",
    originalPrice: 119999,
    discountedPrice: 99999,
    discount: 17,
    category: "Electronics",
    platform: "Samsung",
    image: "https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=400",
    link: "https://www.samsung.com/in/tablets/galaxy-tab-s/",
    rating: 4.7,
    reviews: 780
  },
  {
    id: 43,
    title: "Instant Pot Duo 7-in-1 Cooker",
    description: "Multi-functional pressure cooker, 6 liter capacity",
    originalPrice: 9995,
    discountedPrice: 6995,
    discount: 30,
    category: "Home Appliances",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400",
    link: "https://www.amazon.in/s?k=instant+pot+duo",
    rating: 4.6,
    reviews: 3450
  },
  {
    id: 44,
    title: "Ray-Ban Aviator Sunglasses",
    description: "Classic aviator style with polarized lenses",
    originalPrice: 9990,
    discountedPrice: 6990,
    discount: 30,
    category: "Fashion",
    platform: "Myntra",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    link: "https://www.myntra.com/ray-ban-aviator",
    rating: 4.8,
    reviews: 2340
  },
  {
    id: 45,
    title: "Kindle Paperwhite Signature Edition",
    description: "E-reader with 32GB storage and wireless charging",
    originalPrice: 17999,
    discountedPrice: 13999,
    discount: 22,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    link: "https://www.amazon.in/s?k=kindle+paperwhite+signature",
    rating: 4.7,
    reviews: 1560
  },
  {
    id: 46,
    title: "Sennheiser Momentum 4 Wireless",
    description: "Premium headphones with 60-hour battery life",
    originalPrice: 34990,
    discountedPrice: 26990,
    discount: 23,
    category: "Electronics",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    link: "https://www.flipkart.com/search?q=sennheiser+momentum+4",
    rating: 4.6,
    reviews: 890
  },
  {
    id: 47,
    title: "DJI Mini 3 Pro Drone",
    description: "Lightweight drone with 4K camera and obstacle avoidance",
    originalPrice: 89990,
    discountedPrice: 74990,
    discount: 17,
    category: "Electronics",
    platform: "DJI",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400",
    link: "https://store.dji.com/in/product/dji-mini-3-pro",
    rating: 4.8,
    reviews: 560
  },
  {
    id: 48,
    title: "Fossil Gen 6 Smartwatch",
    description: "Stylish smartwatch with Wear OS and health tracking",
    originalPrice: 22995,
    discountedPrice: 14995,
    discount: 35,
    category: "Fashion",
    platform: "Myntra",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400",
    link: "https://www.myntra.com/fossil-smartwatch",
    rating: 4.4,
    reviews: 1230
  },
  {
    id: 49,
    title: "Asus ROG Strix Gaming Laptop",
    description: "Powerful gaming laptop with RTX 4070 and 16GB RAM",
    originalPrice: 169990,
    discountedPrice: 139990,
    discount: 18,
    category: "Electronics",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
    link: "https://www.flipkart.com/search?q=asus+rog+strix",
    rating: 4.7,
    reviews: 890
  },
  {
    id: 50,
    title: "Puma RS-X Sneakers",
    description: "Chunky retro-style sneakers with bold colors",
    originalPrice: 8999,
    discountedPrice: 5399,
    discount: 40,
    category: "Fashion",
    platform: "Puma",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400",
    link: "https://in.puma.com/in/en/search?q=rs-x",
    rating: 4.5,
    reviews: 2340
  },
  // MORE OFFERS FROM more-offers.js
  {
    id: 51,
    title: "Dell XPS 13 Laptop Ultra",
    description: "Ultra-thin laptop with InfinityEdge display",
    originalPrice: 129990,
    discountedPrice: 109990,
    discount: 15,
    category: "Electronics",
    platform: "Dell",
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400",
    link: "https://www.dell.com/en-in/shop/laptops-2-in-1-pcs/sr/laptops/xps-laptops",
    rating: 4.7,
    reviews: 1230
  },
  {
    id: 52,
    title: "Bose QuietComfort Earbuds II",
    description: "Wireless noise cancelling earbuds with personalized sound",
    originalPrice: 29900,
    discountedPrice: 24900,
    discount: 17,
    category: "Electronics",
    platform: "Bose",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    link: "https://www.boseindia.com/en_in/products/headphones/earbuds/quietcomfort-earbuds-ii.html",
    rating: 4.8,
    reviews: 890
  },
  {
    id: 53,
    title: "IKEA BILLY Bookcase",
    description: "Versatile bookcase with adjustable shelves",
    originalPrice: 7999,
    discountedPrice: 5999,
    discount: 25,
    category: "Home & Furniture",
    platform: "IKEA",
    image: "https://images.unsplash.com/photo-1588629570566-2a4d6dc05416?w=400",
    link: "https://www.ikea.com/in/en/p/billy-bookcase-white-s69017828/",
    rating: 4.5,
    reviews: 3450
  },
  {
    id: 54,
    title: "Fitbit Sense 2 Advanced Smartwatch",
    description: "Health and fitness smartwatch with stress management",
    originalPrice: 24999,
    discountedPrice: 19999,
    discount: 20,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd6b5?w=400",
    link: "https://www.amazon.in/s?k=fitbit+sense+2",
    rating: 4.3,
    reviews: 780
  },
  {
    id: 55,
    title: "Philips Air Fryer XXL",
    description: "Large capacity air fryer with fat removal technology",
    originalPrice: 14999,
    discountedPrice: 9999,
    discount: 33,
    category: "Home Appliances",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1626074353765-511b1aa562c8?w=400",
    link: "https://www.flipkart.com/search?q=philips+air+fryer+xxl",
    rating: 4.6,
    reviews: 1120
  },
  {
    id: 56,
    title: "Lululemon Align Leggings",
    description: "Buttery-soft yoga pants for ultimate comfort",
    originalPrice: 9800,
    discountedPrice: 7840,
    discount: 20,
    category: "Fashion",
    platform: "Lululemon",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400",
    link: "https://www.lululemon.co.in/en-in/p/women-pants/Align-High-Rise-Pant-28%22/_/prod8780551",
    rating: 4.9,
    reviews: 5670
  },
  {
    id: 57,
    title: "Dyson V12 Detect Slim Vacuum",
    description: "Lightweight cordless vacuum with laser dust detection",
    originalPrice: 58900,
    discountedPrice: 49900,
    discount: 15,
    category: "Home Appliances",
    platform: "Dyson",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400",
    link: "https://www.dyson.in/vacuum-cleaners/cordless/v12-detect-slim",
    rating: 4.7,
    reviews: 890
  },
  {
    id: 58,
    title: "Weber Original Kettle Premium Charcoal Grill",
    description: "Classic charcoal grill with one-touch cleaning system",
    originalPrice: 22999,
    discountedPrice: 18999,
    discount: 17,
    category: "Home & Garden",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
    link: "https://www.amazon.in/s?k=weber+original+kettle+premium",
    rating: 4.8,
    reviews: 2340
  },
  {
    id: 59,
    title: "Casio G-Shock GA-2100 Watch",
    description: "Octagonal bezel watch with carbon core guard",
    originalPrice: 8995,
    discountedPrice: 6995,
    discount: 22,
    category: "Fashion",
    platform: "Casio",
    image: "https://images.unsplash.com/photo-1623998021446-45cd9b457d63?w=400",
    link: "https://www.casio.com/in/watches/gshock/product.GA-2100/",
    rating: 4.7,
    reviews: 1560
  },
  {
    id: 60,
    title: "Instant Pot Duo Evo Plus",
    description: "10-in-1 multi-use programmable pressure cooker",
    originalPrice: 12999,
    discountedPrice: 8999,
    discount: 31,
    category: "Home Appliances",
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400",
    link: "https://www.flipkart.com/search?q=instant+pot+duo+evo+plus",
    rating: 4.6,
    reviews: 3450
  },
  {
    id: 61,
    title: "Kindle Scribe Digital Notebook",
    description: "E-reader with writing capabilities and 10.2\" display",
    originalPrice: 34999,
    discountedPrice: 29999,
    discount: 14,
    category: "Electronics",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    link: "https://www.amazon.in/s?k=kindle+scribe",
    rating: 4.5,
    reviews: 780
  },
  {
    id: 62,
    title: "Theragun Elite Massage Gun",
    description: "Premium percussive therapy device for muscle recovery",
    originalPrice: 34999,
    discountedPrice: 29999,
    discount: 14,
    category: "Health & Fitness",
    platform: "Therabody",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
    link: "https://www.therabody.com/in/en-in/theragun-elite/",
    rating: 4.7,
    reviews: 890
  },
  {
    id: 63,
    title: "Nespresso Vertuo Next Coffee Machine",
    description: "Coffee maker with 5 cup sizes and Bluetooth connectivity",
    originalPrice: 19999,
    discountedPrice: 14999,
    discount: 25,
    category: "Home Appliances",
    platform: "Nespresso",
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400",
    link: "https://www.nespresso.com/in/en/order/machines/vertuo",
    rating: 4.6,
    reviews: 1230
  },
  {
    id: 64,
    title: "Lego Star Wars Millennium Falcon",
    description: "Ultimate collector's edition with 7,541 pieces",
    originalPrice: 69999,
    discountedPrice: 59999,
    discount: 14,
    category: "Toys & Games",
    platform: "Lego",
    image: "https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?w=400",
    link: "https://www.lego.com/en-in/product/millennium-falcon-75192",
    rating: 4.9,
    reviews: 2340
  },
  {
    id: 65,
    title: "Vitamix 5200 Blender",
    description: "Professional-grade blender with variable speed control",
    originalPrice: 54999,
    discountedPrice: 44999,
    discount: 18,
    category: "Home Appliances",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400",
    link: "https://www.amazon.in/s?k=vitamix+5200",
    rating: 4.8,
    reviews: 3450
  },
  {
    id: 66,
    title: "Sonos Arc Premium Soundbar",
    description: "Smart soundbar with Dolby Atmos and voice control",
    originalPrice: 87999,
    discountedPrice: 74999,
    discount: 15,
    category: "Electronics",
    platform: "Sonos",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400",
    link: "https://www.sonos.com/en-in/shop/arc",
    rating: 4.7,
    reviews: 1560
  },
  {
    id: 67,
    title: "Le Creuset Signature Cast Iron Round Dutch Oven",
    description: "Premium enameled cast iron cookware, 5.5 quart",
    originalPrice: 32999,
    discountedPrice: 26999,
    discount: 18,
    category: "Home & Kitchen",
    platform: "Le Creuset",
    image: "https://images.unsplash.com/photo-1585837575652-267cbc187fc3?w=400",
    link: "https://www.lecreuset.co.in/en_IN/p/cast-iron-round-dutch-oven/CI1177.html",
    rating: 4.9,
    reviews: 890
  },
  {
    id: 68,
    title: "Oculus Quest 2 VR Headset",
    description: "All-in-one virtual reality headset with 256GB storage",
    originalPrice: 44999,
    discountedPrice: 39999,
    discount: 11,
    category: "Gaming",
    platform: "Meta",
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400",
    link: "https://www.meta.com/in/quest/products/quest-2/",
    rating: 4.8,
    reviews: 5670
  },
  {
    id: 69,
    title: "Breville Barista Express Espresso Machine",
    description: "Semi-automatic espresso machine with built-in grinder",
    originalPrice: 59999,
    discountedPrice: 49999,
    discount: 17,
    category: "Home Appliances",
    platform: "Breville",
    image: "https://images.unsplash.com/photo-1612888077748-00e3bf89b56c?w=400",
    link: "https://www.breville.in/products/espresso/the-barista-express",
    rating: 4.7,
    reviews: 2340
  },
  {
    id: 70,
    title: "Patagonia Down Sweater Jacket",
    description: "Lightweight, windproof, and water-resistant down jacket",
    originalPrice: 16999,
    discountedPrice: 13599,
    discount: 20,
    category: "Fashion",
    platform: "Patagonia",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400",
    link: "https://www.patagonia.com/product/mens-down-sweater-jacket/84674.html",
    rating: 4.8,
    reviews: 1230
  },
  {
    id: 71,
    title: "Atomic Habits by James Clear",
    description: "Bestselling self-help book for building good habits and breaking bad ones",
    originalPrice: 799,
    discountedPrice: 499,
    discount: 37,
    category: "Books",
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400",
    link: "https://www.amazon.in/s?k=atomic+habits",
    rating: 4.8,
    reviews: 45230
  },
  {
    id: 72,
    title: "Organic Grocery Essentials Combo Pack",
    description: "Curated combo of organic staples including rice, dal, and spices",
    originalPrice: 2499,
    discountedPrice: 1799,
    discount: 28,
    category: "Grocery",
    platform: "BigBasket",
    image: "https://images.unsplash.com/photo-1580915411954-282cb1c9c450?w=400",
    link: "https://www.bigbasket.com/ps/?q=organic+combo",
    rating: 4.5,
    reviews: 3890
  },
  {
    id: 73,
    title: "Nykaa Luxe Skin Care Kit",
    description: "Premium skin care combo with cleanser, serum, and moisturizer",
    originalPrice: 3999,
    discountedPrice: 2699,
    discount: 33,
    category: "Beauty & Personal Care",
    platform: "Nykaa",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400",
    link: "https://www.nykaa.com/search/result/?q=skin+care+kit",
    rating: 4.6,
    reviews: 5640
  },
  {
    id: 74,
    title: "Decathlon Home Workout Starter Kit",
    description: "All-in-one home workout kit with dumbbells, resistance bands, and yoga mat",
    originalPrice: 6999,
    discountedPrice: 4999,
    discount: 29,
    category: "Sports & Fitness",
    platform: "Decathlon",
    image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400",
    link: "https://www.decathlon.in/search?query=home+workout+kit",
    rating: 4.7,
    reviews: 2430
  }
];

// All offers are now included in the main offers array
console.log(`Total offers available: ${offers.length}`);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
        photo: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
        provider: profile.provider
      };
      return done(null, user);
    }
  ));
  console.log('✅ Google OAuth strategy configured');
} else {
  console.warn('⚠️ GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. Google login will be disabled.');
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// API Routes
app.get('/api/offers', (req, res) => {
  const { category, platform, minDiscount, search } = req.query;
  
  let filteredOffers = [...offers];
  
  if (category) {
    filteredOffers = filteredOffers.filter(offer => 
      offer.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (platform) {
    filteredOffers = filteredOffers.filter(offer => 
      offer.platform.toLowerCase() === platform.toLowerCase()
    );
  }
  
  if (minDiscount) {
    filteredOffers = filteredOffers.filter(offer => 
      offer.discount >= parseInt(minDiscount)
    );
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredOffers = filteredOffers.filter(offer => 
      offer.title.toLowerCase().includes(searchLower) ||
      offer.description.toLowerCase().includes(searchLower) ||
      offer.category.toLowerCase().includes(searchLower) ||
      offer.platform.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({
    success: true,
    count: filteredOffers.length,
    offers: filteredOffers
  });
});

app.get('/api/offers/:id', (req, res) => {
  const offer = offers.find(o => o.id === parseInt(req.params.id));
  
  if (!offer) {
    return res.status(404).json({
      success: false,
      message: 'Offer not found'
    });
  }
  
  res.json({
    success: true,
    offer
  });
});

// Chatbot endpoint with Groq AI (with Gemini fallback)
app.post('/api/chat', async (req, res) => {
  console.log('Chat request received:', req.body);
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Create context for AI about available offers
    const offerContext = offers.map(offer => 
      `${offer.title} - ${offer.category} - ${offer.discount}% off - ₹${offer.discountedPrice} (was ₹${offer.originalPrice}) - Available on ${offer.platform}`
    ).join('\n');

    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-5) // Last 5 messages for context
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const systemPrompt = `You are a helpful shopping assistant for an Offer Alert platform. You help users find the best deals and offers.

Available Offers:
${offerContext}

Guidelines:
- Be friendly, helpful, and concise
- Recommend specific offers based on user needs
- Mention the discount percentage and platform
- If user asks about a category, suggest relevant offers
- If user asks for best deals, recommend highest discount items
- Always be enthusiastic about savings!
- Keep responses under 150 words`;

    let aiResponse = '';

    // Try Groq API first
    if (process.env.GROQ_API_KEY) {
      try {
        console.log('🚀 Calling Groq API with Kimi model...');
        const groq = new Groq({
          apiKey: process.env.GROQ_API_KEY
        });

        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: message
            }
          ],
          model: 'moonshotai/kimi-k2-instruct',
          temperature: 0.6,
          max_completion_tokens: 4096,
          top_p: 1,
          stream: false
        });

        aiResponse = chatCompletion.choices[0].message.content;
        console.log('✅ Groq API response received successfully');
      } catch (groqError) {
        console.error('❌ Groq API error:', groqError.message);
        console.log('⚠️  Falling back to Gemini API...');
        
        // Fallback to Gemini
        if (process.env.GEMINI_API_KEY) {
          const geminiResponse = await axios.post(
            `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
            {
              contents: [{
                parts: [{
                  text: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300,
                topP: 0.8,
                topK: 40
              }
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          aiResponse = geminiResponse.data.candidates[0].content.parts[0].text;
          console.log('✅ Gemini API response received');
        } else {
          throw new Error('No API keys available');
        }
      }
    } else if (process.env.GEMINI_API_KEY) {
      // Use Gemini if Groq key not available
      console.log('📱 Using Gemini API...');
      const geminiResponse = await axios.post(
        `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
            topP: 0.8,
            topK: 40
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      aiResponse = geminiResponse.data.candidates[0].content.parts[0].text;
      console.log('✅ Gemini API response received');
    } else {
      throw new Error('No AI API keys configured');
    }

    // Find relevant offers mentioned in the response
    const relevantOffers = findRelevantOffers(aiResponse, offers);
    
    // Format the response to remove any asterisks or formatting
    const cleanedResponse = aiResponse
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\s+Get\s+\d+%\s+off[,.]/gi, '')
      .replace(/\s+\(was\s+₹[\d,]+\)[,.]/gi, '')
      .replace(/\s+now\s+at\s+₹[\d,]+[,.]/gi, '');

    res.json({
      success: true,
      message: cleanedResponse,
      suggestedOffers: relevantOffers
    });

  } catch (error) {
    console.error('❌ Chat error:', error.message);
    if (error.response) {
      console.error('API response error:', error.response.data);
      console.error('API response status:', error.response.status);
    }
    
    try {
      const fallbackResponse = getFallbackResponse(req.body.message || '');
      console.log('✅ Using fallback response');
      
      res.json({
        success: true,
        message: fallbackResponse.message,
        suggestedOffers: fallbackResponse.offers
      });
    } catch (fallbackError) {
      console.error('Fallback response error:', fallbackError.message);
      res.status(500).json({
        success: false,
        message: 'Error processing your request',
        error: fallbackError.message
      });
    }
  }
});

// Fallback response function
function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('phone') || lowerMessage.includes('mobile') || lowerMessage.includes('smartphone')) {
    const phoneOffers = offers.filter(o => 
      o.category === 'Electronics' && 
      (o.title.toLowerCase().includes('phone') || o.title.toLowerCase().includes('iphone') || o.title.toLowerCase().includes('samsung'))
    );
    return {
      message: `I found some amazing phone deals for you! Check out these options from top brands. Great savings await! 📱`,
      offers: phoneOffers.slice(0, 3)
    };
  }
  
  if (lowerMessage.includes('shoe') || lowerMessage.includes('fashion') || lowerMessage.includes('clothes')) {
    const fashionOffers = offers.filter(o => o.category === 'Fashion');
    return {
      message: `Looking for fashion deals? I've got you covered! Here are some amazing fashion items with great discounts! 👟👕`,
      offers: fashionOffers.slice(0, 3)
    };
  }
  
  if (lowerMessage.includes('best') || lowerMessage.includes('top') || lowerMessage.includes('highest')) {
    const topOffers = [...offers].sort((a, b) => b.discount - a.discount).slice(0, 3);
    return {
      message: `Here are our top deals with the biggest discounts! These items have incredible savings! 🔥`,
      offers: topOffers
    };
  }
  
  // Default response
  const randomOffers = offers.sort(() => 0.5 - Math.random()).slice(0, 3);
  return {
    message: `Welcome to Offer Alert! 🎉 I can help you find amazing deals on electronics, fashion, and more. What are you looking for today?`,
    offers: randomOffers
  };
}

// Google OAuth routes (only if configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/');
    }
  );
}

app.get('/api/auth/user', (req, res) => {
  if (!req.user) {
    return res.json({
      authenticated: false
    });
  }

  res.json({
    authenticated: true,
    user: {
      id: req.user.id,
      displayName: req.user.displayName,
      email: req.user.email,
      photo: req.user.photo
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return res.status(500).json({
        success: false
      });
    }

    req.session.destroy(() => {
      res.json({
        success: true
      });
    });
  });
});

app.post('/api/alerts/email', async (req, res) => {
  if (!req.user || !req.user.email) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated with Google or email not available'
    });
  }

  try {
    const { offerId, targetPrice, triggerType, newPrice } = req.body || {};

    if (!offerId) {
      return res.status(400).json({
        success: false,
        message: 'offerId is required'
      });
    }

    const offer = offers.find(o => o.id === parseInt(offerId));
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    const toEmail = req.user.email;
    const alertTargetPrice = targetPrice || offer.discountedPrice;
    const alertNewPrice = newPrice || offer.discountedPrice;

    let subject = `Price alert set for ${offer.title}`;
    let textBody = `Hi ${req.user.displayName || ''},\n\n` +
      `You have set a price alert for: ${offer.title}.\n` +
      `Current price: ₹${offer.discountedPrice}.\n` +
      `Target price: ₹${alertTargetPrice}.\n\n` +
      `View offer: ${offer.link}`;

    if (triggerType === 'price-drop') {
      subject = `Price dropped for ${offer.title}!`;
      textBody = `Hi ${req.user.displayName || ''},\n\n` +
        `Good news! The price for ${offer.title} has dropped.\n` +
        `Previous alert target: ₹${alertTargetPrice}.\n` +
        `New simulated price: ₹${alertNewPrice}.\n\n` +
        `Check the deal here: ${offer.link}`;
    }

    // Try to send email, but don't fail if it doesn't work
    try {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to: toEmail,
        subject,
        text: textBody
      });
      console.log('✅ Email sent successfully to:', toEmail);
    } catch (emailError) {
      console.log('⚠️  Email failed, but continuing without it:', emailError.message);
      // Continue with success response even if email fails
    }

    res.json({
      success: true,
      message: triggerType === 'price-drop' 
        ? 'Price drop notification processed' 
        : 'Price alert set successfully'
    });
  } catch (error) {
    console.error('Email alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process email alert'
    });
  }
});

// Statistics endpoint
app.get('/api/stats', (req, res) => {
  const stats = {
    totalOffers: offers.length,
    totalSavings: offers.reduce((sum, o) => sum + (o.originalPrice - o.discountedPrice), 0),
    avgDiscount: Math.round(offers.reduce((sum, o) => sum + o.discount, 0) / offers.length),
    maxDiscount: Math.max(...offers.map(o => o.discount)),
    totalSavings: offers.reduce((sum, o) => sum + (o.originalPrice - o.discountedPrice), 0)
  };
  
  res.json({
    success: true,
    stats
  });
});

// Get all available categories and platforms
app.get('/api/metadata', (req, res) => {
  // Extract unique categories and platforms
  const categories = [...new Set(offers.map(offer => offer.category))].sort();
  const platforms = [...new Set(offers.map(offer => offer.platform))].sort();
  
  res.json({
    success: true,
    metadata: {
      categories,
      platforms,
      priceRange: {
        min: Math.min(...offers.map(o => o.discountedPrice)),
        max: Math.max(...offers.map(o => o.discountedPrice))
      },
      discountRange: {
        min: Math.min(...offers.map(o => o.discount)),
        max: Math.max(...offers.map(o => o.discount))
      }
    }
  });
});

// Endpoint for trending offers removed

// Test endpoint for chatbot
app.get('/api/chat/test', (req, res) => {
  res.json({
    success: true,
    message: 'Chatbot API is working!',
    timestamp: new Date().toISOString()
  });
});

// Helper function to find relevant offers based on AI response
function findRelevantOffers(aiResponse, allOffers) {
  const response = aiResponse.toLowerCase();
  
  // Extract product names and categories from the response
  const productMatches = [];
  
  // Check for exact product matches first
  allOffers.forEach(offer => {
    const titleWords = offer.title.toLowerCase().split(' ');
    const brandName = titleWords[0]; // Usually the first word is the brand
    
    // Check for exact product name matches
    if (response.includes(offer.title.toLowerCase())) {
      productMatches.push({ offer, score: 10 }); // Highest priority
    }
    // Check for brand + product type matches
    else if (brandName && response.includes(brandName) && 
             titleWords.slice(1).some(word => response.includes(word) && word.length > 3)) {
      productMatches.push({ offer, score: 8 });
    }
    // Check for category matches
    else if (response.includes(offer.category.toLowerCase())) {
      productMatches.push({ offer, score: 5 });
    }
    // Check for platform matches
    else if (response.includes(offer.platform.toLowerCase())) {
      productMatches.push({ offer, score: 3 });
    }
  });
  
  // Sort by score and take top 3
  return productMatches
    .sort((a, b) => b.score - a.score)
    .map(match => match.offer)
    .slice(0, 3);
}

// Notifications API endpoints
app.get('/api/notifications', (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  const userNotifications = notifications.get(req.user.id) || [];
  res.json({
    success: true,
    notifications: userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  });
});

app.post('/api/notifications', (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  const { type, title, message, data } = req.body;

  if (!type || !title || !message) {
    return res.status(400).json({
      success: false,
      message: 'Type, title, and message are required'
    });
  }

  const notification = {
    id: Date.now().toString(),
    type, // 'price-drop', 'new-offer', 'alert-created'
    title,
    message,
    data: data || {},
    read: false,
    createdAt: new Date().toISOString()
  };

  // Get or create user notifications array
  const userNotifications = notifications.get(req.user.id) || [];
  userNotifications.push(notification);
  notifications.set(req.user.id, userNotifications);

  res.json({
    success: true,
    notification
  });
});

app.put('/api/notifications/:id/read', (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  const { id } = req.params;
  const userNotifications = notifications.get(req.user.id) || [];
  
  const notification = userNotifications.find(n => n.id === id);
  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  notification.read = true;
  notifications.set(req.user.id, userNotifications);

  res.json({
    success: true,
    notification
  });
});

app.delete('/api/notifications/:id', (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  const { id } = req.params;
  const userNotifications = notifications.get(req.user.id) || [];
  
  const index = userNotifications.findIndex(n => n.id === id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  userNotifications.splice(index, 1);
  notifications.set(req.user.id, userNotifications);

  res.json({
    success: true
  });
});

// Helper function to create notifications
function createNotification(userId, type, title, message, data) {
  const notification = {
    id: Date.now().toString(),
    type,
    title,
    message,
    data: data || {},
    read: false,
    createdAt: new Date().toISOString()
  };

  const userNotifications = notifications.get(userId) || [];
  userNotifications.push(notification);
  notifications.set(userId, userNotifications);

  return notification;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Offer Alert Server running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   GET  /api/offers - Get all offers`);
  console.log(`   GET  /api/offers/:id - Get specific offer`);
  console.log(`   POST /api/chat - Chat with AI assistant`);
  console.log(`   GET  /api/stats - Get statistics`);
  console.log(`   GET  /api/notifications - Get user notifications`);
  console.log(`   POST /api/notifications - Create notification`);
});
