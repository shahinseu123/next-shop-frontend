// app/checkout/page.tsx
"use client";

import { useCartStore } from "@/store/cartStore";
import type { CartItem } from "@/services/cartService";
import { orderService, type OrderCreateDto, type OrderResponse } from "@/services/orderServices";
import { useToastNotifications } from "@/hook/useToast";

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
  Wallet,
  Banknote,
  CheckCircle,
  ShoppingCart,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function CheckoutPage() {
  const { 
    items, 
    cart,
    cartId,
    getSubtotal, 
    getShippingCost, 
    getTotal, 
    getTotalItems,
    clearCart,
    hasItems,
    isLoading: cartLoading
  } = useCartStore();
  const { showError, showSuccess} = useToastNotifications()
  
  const [mounted, setMounted] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null);
  const [orderError, setOrderError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH_ON_DELIVERY" | "ONLINE_PAYMENT">("CASH_ON_DELIVERY");

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

  // Card payment state
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
  const totalItems = getTotalItems();
  const discount = cart?.discountAmount || 0;
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const getItemImage = (item: CartItem): string => {
    return item.productImage || 'https://placehold.co/400x400/EEE/31343C';
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
    
    if (name === "cardNumber") {
      const cleaned = value.replace(/\s/g, '');
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
      setCardData(prev => ({ ...prev, [name]: formatted.slice(0, 19) }));
    } else if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        const formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        setCardData(prev => ({ ...prev, [name]: formatted }));
      } else {
        setCardData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === "cvv") {
      const cleaned = value.replace(/\D/g, '');
      setCardData(prev => ({ ...prev, [name]: cleaned.slice(0, 4) }));
    } else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
    
    if (cardErrors[name]) {
      setCardErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    
    setErrors(newErrors);
    
    if (paymentMethod === "ONLINE_PAYMENT") {
      const newCardErrors: Record<string, string> = {};
      if (!cardData.cardNumber.trim()) newCardErrors.cardNumber = "Card number required";
      else if (cardData.cardNumber.replace(/\s/g, '').length < 16) newCardErrors.cardNumber = "Invalid card number";
      
      if (!cardData.cardName.trim()) newCardErrors.cardName = "Name on card required";
      if (!cardData.expiryDate.trim()) newCardErrors.expiryDate = "Expiry date required";
      if (!cardData.cvv.trim()) newCardErrors.cvv = "CVV required";
      else if (cardData.cvv.length < 3) newCardErrors.cvv = "Invalid CVV";
      
      setCardErrors(newCardErrors);
      return Object.keys(newErrors).length === 0 && Object.keys(newCardErrors).length === 0;
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (!cartId) {
      setOrderError("No cart found. Please add items to your cart first.");
      return;
    }
    
    setIsPlacingOrder(true);
    setOrderError("");
    
    try {
      // Prepare order data matching the backend DTO
      const orderData: OrderCreateDto = {
        cartId: cartId,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country,
        paymentMethod: paymentMethod === "CASH_ON_DELIVERY" ? "CASH_ON_DELIVERY" : "ONLINE_PAYMENT",
      };

      // Add card details if online payment
      if (paymentMethod === "ONLINE_PAYMENT") {
        orderData.cardDetails = {
          cardNumber: cardData.cardNumber.replace(/\s/g, ''),
          cardName: cardData.cardName.trim(),
          expiryDate: cardData.expiryDate.trim(),
          cvv: cardData.cvv.trim(),
        };
      }

      // Call the actual API
      const response = await orderService.createOrder(orderData);
      
      setOrderResponse(response);
      setOrderPlaced(true);
      
      // Clear the cart after successful order
      await clearCart();
      
    } catch (error: any) {
      console.error('Failed to place order:', error);
      showError("Failed to place order")
      setOrderError(error?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading checkout...</span>
        </div>
      </div>
    );
  }

  // Order success state
  if (orderPlaced && orderResponse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-sm text-gray-500 mb-1">
            Order #{orderResponse.orderNumber}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Thank you for your purchase, {formData.firstName}!
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {paymentMethod === "cod" 
              ? "Your order has been confirmed. You will pay BDT " + total.toFixed(2) + " upon delivery."
              : "Your payment of BDT " + total.toFixed(2) + " has been processed successfully."}
          </p>
          <div className="space-y-2">
            <Link href={`/orders/${orderResponse.id}`} className="block">
              <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all">
                Track Order
              </button>
            </Link>
            <Link href="/" className="block">
              <button className="w-full py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!hasItems() || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-sm text-gray-500 mb-6">Add some items to proceed with checkout</p>
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
          <Link 
            href="/cart" 
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors text-sm mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-500 mt-0.5">Complete your purchase securely</p>
        </div>

        {/* Error Alert */}
        {orderError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{orderError}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-5">
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
                      errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'
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
                      errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'
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
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
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
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="+880 1234 567890"
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-5">
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
                      errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="123 Main Street, Apartment 4B"
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
                        errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'
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
                        errors.postalCode ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="1200"
                    />
                    {errors.postalCode && <p className="text-[10px] text-red-500 mt-0.5">{errors.postalCode}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  >
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="India">India</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                  <Wallet className="w-4 h-4 text-indigo-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === "cod" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH_ON_DELIVERY"
                      checked={paymentMethod === "CASH_ON_DELIVERY"}
                      onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Banknote className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                      <p className="text-[10px] text-gray-500">Pay when you receive your order</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">No fee</span>
                </label>

                {/* Online Payment */}
                <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === "ONLINE_PAYMENT" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE_PAYMENT"
                      checked={paymentMethod === "ONLINE_PAYMENT"}
                      onChange={() => setPaymentMethod("ONLINE_PAYMENT")}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Online Payment</p>
                      <p className="text-[10px] text-gray-500">Credit/Debit card</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-7 h-4 bg-blue-600 rounded text-[8px] text-white flex items-center justify-center font-medium">VISA</span>
                    <span className="w-7 h-4 bg-red-500 rounded text-[8px] text-white flex items-center justify-center font-medium">MC</span>
                    <span className="w-7 h-4 bg-green-600 rounded text-[8px] text-white flex items-center justify-center font-medium">AMEX</span>
                  </div>
                </label>

                {/* Card Details */}
                {paymentMethod === "ONLINE_PAYMENT" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <Lock className="w-3 h-3" />
                      Card Details
                    </p>
                    <div>
                      <label className="block text-[10px] text-gray-600 mb-1">Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                          cardErrors.cardNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {cardErrors.cardNumber && <p className="text-[10px] text-red-500 mt-0.5">{cardErrors.cardNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-600 mb-1">Name on Card *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={handleCardChange}
                        placeholder="John Doe"
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                          cardErrors.cardName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {cardErrors.cardName && <p className="text-[10px] text-red-500 mt-0.5">{cardErrors.cardName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-600 mb-1">Expiry Date *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardData.expiryDate}
                          onChange={handleCardChange}
                          placeholder="MM/YY"
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                            cardErrors.expiryDate ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          }`}
                        />
                        {cardErrors.expiryDate && <p className="text-[10px] text-red-500 mt-0.5">{cardErrors.expiryDate}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-600 mb-1">CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardChange}
                          placeholder="123"
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                            cardErrors.cvv ? 'border-red-300 bg-red-50' : 'border-gray-200'
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
            <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-5 sticky top-24">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Items List */}
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {items.map((item) => {
                  const itemTotal = item.totalPrice || (item.price * item.quantity);
                  const imageUrl = getItemImage(item);
                  
                  return (
                    <div key={item.id} className="flex gap-2">
                      <div className="w-10 h-10 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={imageUrl}
                          alt={item.productName}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          unoptimized={true}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 line-clamp-1">{item.productName}</p>
                        <div className="flex justify-between items-center mt-0.5">
                          <span className="text-[10px] text-gray-500">Qty: {item.quantity}</span>
                          <span className="text-xs font-semibold text-gray-900">BDT {itemTotal.toFixed(2)}</span>
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
                  <span className="text-gray-900 font-medium">BDT {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-600 font-medium" : "text-gray-900 font-medium"}>
                    {shipping === 0 ? "Free" : `BDT ${shipping.toFixed(2)}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-emerald-600 font-medium">-BDT {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-indigo-600">BDT {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Free Shipping Message */}
              {remainingForFreeShipping > 0 && (
                <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3 h-3 text-amber-600" />
                    <p className="text-[10px] text-amber-700">
                      Add BDT {remainingForFreeShipping.toFixed(2)} more for free shipping
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Method Badge */}
              <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-[10px] text-gray-500 text-center">
                  Paying via: <span className="font-medium text-gray-700">
                    {paymentMethod === "CASH_ON_DELIVERY" ? "Cash on Delivery" : "Online Payment"}
                  </span>
                </p>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || cartLoading}
                className="w-full mt-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
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
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] text-gray-400">Secure</span>
                </div>
                <div className="w-0.5 h-0.5 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] text-gray-400">Encrypted</span>
                </div>
                <div className="w-0.5 h-0.5 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] text-gray-400">Fast Delivery</span>
                </div>
              </div>

              <p className="text-center text-[10px] text-gray-400 mt-2">
                By placing your order, you agree to our Terms
              </p>
            </div>

            {/* Free Shipping Reminder */}
            {remainingForFreeShipping > 0 && (
              <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    Add <span className="font-semibold">BDT {remainingForFreeShipping.toFixed(2)}</span> more for free shipping!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}