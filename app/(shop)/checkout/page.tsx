// app/checkout/page.tsx
"use client";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  Shield, 
  Lock, 
  User,
  MapPin,
  Phone,
  Mail,
  Banknote,
  Wallet,
  CheckCircle
} from "lucide-react";

export default function CheckoutPage() {
  const { items, getSubtotal, getShippingCost, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
  });

  // Card payment state (only for online payment)
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const total = getTotal();
  const totalItems = items.reduce((acc, item) => acc + item.cartQuantity, 0);
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const getImageUrl = (item: any) => {
    if (item.imageUrls && Array.isArray(item.imageUrls) && item.imageUrls.length > 0) {
      return item.imageUrls[0];
    }
    if (item.thumbnailUrl) {
      return item.thumbnailUrl;
    }
    return 'https://placehold.co/400x400/EEE/31343C';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const cleaned = value.replace(/\s/g, '');
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
      setCardData(prev => ({ ...prev, [name]: formatted.slice(0, 19) }));
    } 
    // Format expiry date (MM/YY)
    else if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        const formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        setCardData(prev => ({ ...prev, [name]: formatted }));
      } else {
        setCardData(prev => ({ ...prev, [name]: value }));
      }
    }
    // Limit CVV to 4 digits
    else if (name === "cvv") {
      const cleaned = value.replace(/\D/g, '');
      setCardData(prev => ({ ...prev, [name]: cleaned.slice(0, 4) }));
    }
    else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
    
    if (cardErrors[name]) {
      setCardErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.postalCode) newErrors.postalCode = "Postal code is required";
    
    setErrors(newErrors);
    
    // Validate card details if online payment
    if (paymentMethod === "online") {
      const newCardErrors: Record<string, string> = {};
      if (!cardData.cardNumber) newCardErrors.cardNumber = "Card number required";
      else if (cardData.cardNumber.replace(/\s/g, '').length < 16) newCardErrors.cardNumber = "Invalid card number";
      
      if (!cardData.cardName) newCardErrors.cardName = "Name on card required";
      if (!cardData.expiryDate) newCardErrors.expiryDate = "Expiry date required";
      if (!cardData.cvv) newCardErrors.cvv = "CVV required";
      else if (cardData.cvv.length < 3) newCardErrors.cvv = "Invalid CVV";
      
      setCardErrors(newCardErrors);
      return Object.keys(newErrors).length === 0 && Object.keys(newCardErrors).length === 0;
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setIsPlacingOrder(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setOrderPlaced(true);
    clearCart();
    setIsPlacingOrder(false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-sm text-gray-500 mb-5">
            {paymentMethod === "cod" 
              ? "Your order has been confirmed. You will pay upon delivery."
              : "Your payment has been processed successfully. Thank you for your purchase!"}
          </p>
          <Link href="/">
            <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-sm text-gray-500 mb-5">Add some items to proceed with checkout</p>
          <Link href="/">
            <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/cart" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors text-sm mb-3">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-500 mt-0.5">Complete your purchase securely</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                  <User className="w-4 h-4 text-indigo-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Contact Information</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                      errors.firstName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-[10px] text-red-500 mt-0.5">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                      errors.lastName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-[10px] text-red-500 mt-0.5">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="+880 1234 567890"
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Shipping Address</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                      errors.address ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && <p className="text-[10px] text-red-500 mt-0.5">{errors.address}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                        errors.city ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Dhaka"
                    />
                    {errors.city && <p className="text-[10px] text-red-500 mt-0.5">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="1200"
                    />
                    {errors.postalCode && <p className="text-[10px] text-red-500 mt-0.5">{errors.postalCode}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  >
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                  <Wallet className="w-4 h-4 text-indigo-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery Option */}
                <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === "cod" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Banknote className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when you receive your order</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-emerald-600 font-medium">No extra fee</span>
                  </div>
                </label>

                {/* Online Payment Option */}
                <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === "online" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Online Payment</p>
                      <p className="text-xs text-gray-500">Credit/Debit card</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-7 h-4 bg-blue-600 rounded text-[8px] text-white flex items-center justify-center">Visa</div>
                    <div className="w-7 h-4 bg-red-600 rounded text-[8px] text-white flex items-center justify-center">MC</div>
                    <div className="w-7 h-4 bg-indigo-600 rounded text-[8px] text-white flex items-center justify-center">Amex</div>
                  </div>
                </label>

                {/* Card Details - Only show if online payment selected */}
                {paymentMethod === "online" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3 border border-gray-100">
                    <p className="text-xs font-medium text-gray-700">Card Details</p>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                          cardErrors.cardNumber ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {cardErrors.cardNumber && <p className="text-[10px] text-red-500 mt-0.5">{cardErrors.cardNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Name on Card *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={handleCardChange}
                        placeholder="John Doe"
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                          cardErrors.cardName ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {cardErrors.cardName && <p className="text-[10px] text-red-500 mt-0.5">{cardErrors.cardName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Expiry Date *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardData.expiryDate}
                          onChange={handleCardChange}
                          placeholder="MM/YY"
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                            cardErrors.expiryDate ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                        {cardErrors.expiryDate && <p className="text-[10px] text-red-500 mt-0.5">{cardErrors.expiryDate}</p>}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardChange}
                          placeholder="123"
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                            cardErrors.cvv ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                        {cardErrors.cvv && <p className="text-[10px] text-red-500 mt-0.5">{cardErrors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-100 p-4 sticky top-24">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h2>
              
              {/* Items List */}
              <div className="space-y-2 max-h-64 overflow-y-auto mb-3">
                {items.map((item) => {
                  const price = item.discountPrice || item.sellingPrice;
                  const itemTotal = price * item.cartQuantity;
                  const imageUrl = getImageUrl(item);
                  
                  return (
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-2 py-1">
                      <div className="w-10 h-10 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          unoptimized={true}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <div className="flex justify-between items-center mt-0.5">
                          <span className="text-[10px] text-gray-500">Qty: {item.cartQuantity}</span>
                          <span className="text-xs font-semibold text-gray-900">${itemTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-600" : "text-gray-900"}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-900">Total</span>
                  <span className="text-base font-bold text-indigo-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Badge */}
              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-500 text-center">
                  Paying via: <span className="font-medium text-gray-700">
                    {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                  </span>
                </p>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full mt-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Place Order</span>
                  </>
                )}
              </button>

              {/* Security Badges */}
              <div className="mt-3 flex items-center justify-center gap-3">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-gray-400" />
                  <span className="text-[9px] text-gray-400">Secure</span>
                </div>
                <div className="w-0.5 h-0.5 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-gray-400" />
                  <span className="text-[9px] text-gray-400">Encrypted</span>
                </div>
              </div>

              <p className="text-center text-[9px] text-gray-400 mt-2">
                By placing your order, you agree to our Terms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import missing icon
import { ShoppingCart } from "lucide-react";