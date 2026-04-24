// components/Footer.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Mail,
  Phone,
  MapPin,
  Clock,
  Truck,
  Shield,
  RefreshCw,
  Headphones,
  ChevronRight,
  Heart,
  Gem,
  Crown,
  Lock,
  Award,
  Package,
  // Facebook,
  // Twitter,
  // Instagram,
  // Youtube,
  // Linkedin
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: "Electronics", href: "/category/electronics" },
    { name: "Fashion", href: "/category/fashion" },
    { name: "Home & Living", href: "/category/home" },
    { name: "Beauty", href: "/category/beauty" },
    { name: "Sports", href: "/category/sports" },
    { name: "Books & Media", href: "/category/books" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Track Order", href: "/track-order" },
    { name: "Returns & Exchanges", href: "/returns" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "FAQs", href: "/faqs" },
  ];

  const accountLinks = [
    { name: "My Account", href: "/account" },
    { name: "Order History", href: "/orders" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Newsletter", href: "/newsletter" },
    { name: "Settings", href: "/settings" },
    { name: "Gift Cards", href: "/gift-cards" },
  ];

  const features = [
    { icon: <Truck size={20} />, title: "Free Shipping", description: "On orders over $50" },
    { icon: <Shield size={20} />, title: "Secure Payment", description: "100% secure transactions" },
    { icon: <RefreshCw size={20} />, title: "Easy Returns", description: "30-day return policy" },
    { icon: <Headphones size={20} />, title: "24/7 Support", description: "Dedicated customer service" },
  ];

  // const socialLinks = [
  //   { icon: Facebook, href: "https://facebook.com", label: "Facebook", color: "hover:text-[#1877F2]" },
  //   { icon: Twitter, href: "https://twitter.com", label: "Twitter", color: "hover:text-[#1DA1F2]" },
  //   { icon: Instagram, href: "https://instagram.com", label: "Instagram", color: "hover:text-[#E4405F]" },
  //   { icon: Youtube, href: "https://youtube.com", label: "YouTube", color: "hover:text-[#FF0000]" },
  //   { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn", color: "hover:text-[#0A66C2]" },
  // ];

  const paymentMethods = [
    { name: "Visa", icon: "💳", color: "text-gray-400" },
    { name: "Mastercard", icon: "💳", color: "text-gray-400" },
    { name: "PayPal", icon: "💰", color: "text-gray-400" },
    { name: "American Express", icon: "💳", color: "text-gray-400" },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      {/* Features Section - Dark Theme */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="shop-container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className="p-2.5 bg-gray-700 rounded-xl text-gray-400 group-hover:bg-gray-600 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer - Dark Theme */}
      <div className="shop-container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-gray-800 p-2 rounded-xl shadow-md group-hover:bg-gray-700 transition-all duration-300">
                <Package className="text-gray-300" size={22} />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">
                  ShopHub
                </span>
                <p className="text-[10px] text-gray-500 tracking-wider">PREMIUM STORE</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Your one-stop destination for premium products. Quality assured, best prices guaranteed since 2024.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-gray-500 shrink-0 mt-0.5" />
                <span>123 Commerce Street, New York, NY 10001, USA</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={16} className="text-gray-500 shrink-0" />
                <span>+880 1307 692679</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-gray-500 shrink-0" />
                <span>support@shophub.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Clock size={16} className="text-gray-500 shrink-0" />
                <span>Mon-Sat: 9AM - 8PM EST</span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-gray-300 mb-3 text-sm uppercase tracking-wide">
                Follow Us
              </h4>
              {/* <div className="flex gap-2">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 bg-gray-800 rounded-lg text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-md hover:bg-gray-700`}
                      aria-label={social.label}
                    >
                      <IconComponent size={18} />
                    </a>
                  );
                })}
              </div> */}
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
              <Gem size={16} className="text-gray-500" />
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    href={category.href}
                    className="text-gray-400 hover:text-gray-200 text-sm transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-gray-500" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
              <Crown size={16} className="text-gray-500" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-gray-200 text-sm transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-gray-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Column */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
              <Heart size={16} className="text-gray-500" />
              My Account
            </h3>
            <ul className="space-y-2">
              {accountLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-gray-200 text-sm transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-gray-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-4 text-sm uppercase tracking-wide">
              Newsletter
            </h3>
            <p className="text-gray-400 text-sm mb-3 leading-relaxed">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <form className="mb-4">
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2.5 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-gray-700 transition-all bg-gray-800 text-white placeholder-gray-500 text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all text-sm font-medium uppercase tracking-wide"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Lock size={12} />
              <span>We never share your email</span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Award size={20} className="text-gray-500" />
                <span className="text-xs text-gray-400">Quality Guaranteed</span>
              </div>
              <div className="w-px h-4 bg-gray-700 hidden md:block"></div>
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-gray-500" />
                <span className="text-xs text-gray-400">Secure Checkout</span>
              </div>
              <div className="w-px h-4 bg-gray-700 hidden md:block"></div>
              <div className="flex items-center gap-2">
                <Truck size={20} className="text-gray-500" />
                <span className="text-xs text-gray-400">Fast Delivery</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Secure payments:</span>
              <div className="flex items-center gap-2">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="text-2xl hover:scale-110 transition-transform cursor-pointer text-gray-400">
                    {method.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              &copy; {currentYear} ShopHub. All rights reserved. | 
              <Link href="/privacy-policy" className="hover:text-gray-300 ml-1 transition-colors">Privacy Policy</Link>
              <span className="mx-1">|</span>
              <Link href="/terms-of-service" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
              <span className="mx-1">|</span>
              <Link href="/sitemap" className="hover:text-gray-300 transition-colors">Sitemap</Link>
            </p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                Made with <Heart size={12} className="text-red-500 animate-pulse" /> by ShopHub Team
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};