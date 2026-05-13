// app/dashboard/payment-methods/page.tsx
"use client";

import { useState } from "react";
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Shield, 
  Smartphone,
  Wallet,
  Banknote,
  Check,
  X,
  AlertCircle,
  Clock,
  ChevronRight
} from "lucide-react";

// Mock payment methods
const initialPaymentMethods = [
  {
    id: 1,
    type: "card",
    cardType: "visa",
    cardNumber: "4242",
    cardHolder: "John Doe",
    expiryDate: "12/28",
    isDefault: true,
    color: "from-blue-600 to-blue-700",
    bg: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    id: 2,
    type: "card",
    cardType: "mastercard",
    cardNumber: "5555",
    cardHolder: "John Doe",
    expiryDate: "06/27",
    isDefault: false,
    color: "from-red-500 to-orange-500",
    bg: "bg-red-50",
    textColor: "text-red-600",
  },
  {
    id: 3,
    type: "mobile",
    provider: "bKash",
    accountNumber: "01XXXXXXXXX",
    isDefault: false,
    color: "from-pink-500 to-pink-600",
    bg: "bg-pink-50",
    textColor: "text-pink-600",
  },
  {
    id: 4,
    type: "mobile",
    provider: "Nagad",
    accountNumber: "01XXXXXXXXX",
    isDefault: false,
    color: "from-red-600 to-red-700",
    bg: "bg-red-50",
    textColor: "text-red-600",
  },
];

interface CardFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface MobileFormData {
  provider: string;
  accountNumber: string;
}

const emptyCardForm: CardFormData = {
  cardNumber: "",
  cardHolder: "",
  expiryDate: "",
  cvv: "",
};

const emptyMobileForm: MobileFormData = {
  provider: "bKash",
  accountNumber: "",
};

const cardTypeConfig: Record<string, { name: string; icon: any; color: string }> = {
  visa: { name: "Visa", icon: CreditCard, color: "text-blue-600" },
  mastercard: { name: "Mastercard", icon: CreditCard, color: "text-red-600" },
  amex: { name: "American Express", icon: CreditCard, color: "text-green-600" },
};

const mobileProviders = [
  { id: "bKash", name: "bKash", color: "bg-pink-500", textColor: "text-pink-600" },
  { id: "Nagad", name: "Nagad", color: "bg-red-500", textColor: "text-red-600" },
  { id: "Rocket", name: "Rocket", color: "bg-purple-500", textColor: "text-purple-600" },
];

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [cardForm, setCardForm] = useState<CardFormData>(emptyCardForm);
  const [mobileForm, setMobileForm] = useState<MobileFormData>(emptyMobileForm);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleSetDefault = (id: number) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === id,
    })));
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
      setDeletingId(null);
    }, 300);
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "cardNumber") {
      const cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
      setCardForm(prev => ({ ...prev, [name]: formatted.slice(0, 19) }));
    } else if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        setCardForm(prev => ({ ...prev, [name]: `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}` }));
      } else {
        setCardForm(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === "cvv") {
      const cleaned = value.replace(/\D/g, '');
      setCardForm(prev => ({ ...prev, [name]: cleaned.slice(0, 4) }));
    } else {
      setCardForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveCard = () => {
    const newCard = {
      id: Date.now(),
      type: "card",
      cardType: "visa",
      cardNumber: cardForm.cardNumber.slice(-4),
      cardHolder: cardForm.cardHolder,
      expiryDate: cardForm.expiryDate,
      isDefault: paymentMethods.length === 0,
      color: "from-blue-600 to-blue-700",
      bg: "bg-blue-50",
      textColor: "text-blue-600",
    };
    setPaymentMethods(prev => [...prev, newCard]);
    setShowCardForm(false);
    setCardForm(emptyCardForm);
  };

  const handleSaveMobile = () => {
    const provider = mobileProviders.find(p => p.id === mobileForm.provider);
    const newMobile = {
      id: Date.now(),
      type: "mobile",
      provider: provider?.name || mobileForm.provider,
      accountNumber: mobileForm.accountNumber,
      isDefault: paymentMethods.length === 0,
      color: "from-pink-500 to-pink-600",
      bg: provider?.textColor === "text-pink-600" ? "bg-pink-50" : 
           provider?.textColor === "text-red-600" ? "bg-red-50" : "bg-purple-50",
      textColor: provider?.textColor || "text-pink-600",
    };
    setPaymentMethods(prev => [...prev, newMobile]);
    setShowMobileForm(false);
    setMobileForm(emptyMobileForm);
  };

  const getCardIcon = (cardType: string) => {
    switch (cardType) {
      case "visa":
        return (
          <svg className="w-8 h-6" viewBox="0 0 48 32">
            <rect width="48" height="32" rx="4" fill="#1A1F71"/>
            <text x="24" y="22" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">VISA</text>
          </svg>
        );
      case "mastercard":
        return (
          <svg className="w-8 h-6" viewBox="0 0 48 32">
            <rect width="48" height="32" rx="4" fill="#1A1F71"/>
            <circle cx="18" cy="16" r="8" fill="#EB001B"/>
            <circle cx="30" cy="16" r="8" fill="#F79E1B"/>
            <text x="24" y="28" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">Mastercard</text>
          </svg>
        );
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your payment options</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowCardForm(true); setShowMobileForm(false); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
          >
            <CreditCard className="w-4 h-4" />
            Add Card
          </button>
          <button
            onClick={() => { setShowMobileForm(true); setShowCardForm(false); }}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all"
          >
            <Smartphone className="w-4 h-4" />
            Add Mobile
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Methods List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Add Card Form */}
          {showCardForm && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Add Credit/Debit Card</h3>
                <button onClick={() => setShowCardForm(false)} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardForm.cardNumber}
                    onChange={handleCardInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Card Holder Name</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={cardForm.cardHolder}
                    onChange={handleCardInputChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={cardForm.expiryDate}
                      onChange={handleCardInputChange}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardForm.cvv}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
                <button onClick={() => setShowCardForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700">Cancel</button>
                <button onClick={handleSaveCard} className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
                  <Check className="w-4 h-4" /> Save Card
                </button>
              </div>
            </div>
          )}

          {/* Add Mobile Form */}
          {showMobileForm && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Add Mobile Banking</h3>
                <button onClick={() => setShowMobileForm(false)} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Select Provider</label>
                  <div className="grid grid-cols-3 gap-2">
                    {mobileProviders.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setMobileForm(prev => ({ ...prev, provider: provider.id }))}
                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                          mobileForm.provider === provider.id
                            ? `${provider.textColor} border-current bg-opacity-10`
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: mobileForm.provider === provider.id ? 
                            provider.id === 'bKash' ? '#fdf2f8' :
                            provider.id === 'Nagad' ? '#fef2f2' : '#faf5ff'
                            : 'transparent'
                        }}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${provider.color}`} />
                        {provider.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={mobileForm.accountNumber}
                    onChange={(e) => setMobileForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
                <button onClick={() => setShowMobileForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700">Cancel</button>
                <button onClick={handleSaveMobile} className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
                  <Check className="w-4 h-4" /> Save Account
                </button>
              </div>
            </div>
          )}

          {/* Payment Method Cards */}
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`bg-white rounded-xl border transition-all duration-300 ${
                method.isDefault 
                  ? 'border-indigo-300 ring-1 ring-indigo-100 shadow-sm' 
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
              } ${deletingId === method.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Card/Mobile Icon */}
                    {method.type === "card" ? (
                      <div className={`w-12 h-8 rounded bg-gradient-to-r ${method.color} flex items-center justify-center shadow-sm`}>
                        {getCardIcon(method.cardType)}
                      </div>
                    ) : (
                      <div className={`w-12 h-12 rounded-lg ${method.bg} flex items-center justify-center`}>
                        <Smartphone className={`w-6 h-6 ${method.textColor}`} />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {method.type === "card" 
                            ? `${cardTypeConfig[method.cardType]?.name || 'Card'} ending in ${method.cardNumber}`
                            : `${method.provider}`
                          }
                        </h3>
                        {method.isDefault && (
                          <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {method.type === "card" 
                          ? `${method.cardHolder} • Expires ${method.expiryDate}`
                          : `Account: ${method.accountNumber}`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {!method.isDefault && (
                      <>
                        <button
                          onClick={() => handleSetDefault(method.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                          title="Set as default"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(method.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {paymentMethods.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No payment methods</h3>
              <p className="text-xs text-gray-500">Add a card or mobile banking account</p>
            </div>
          )}
        </div>

        {/* Sidebar - Payment Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Payment Security</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Encrypted & Secure</p>
                  <p className="text-[10px] text-gray-500">Your payment info is encrypted and secure</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">24/7 Fraud Monitoring</p>
                  <p className="text-[10px] text-gray-500">We monitor transactions to prevent fraud</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">We Never Store CVV</p>
                  <p className="text-[10px] text-gray-500">Your CVV is never saved for security</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Supported Methods</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-600">Credit/Debit Cards</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">Visa, MC, Amex</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-600">Mobile Banking</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">bKash, Nagad</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-600">Cash on Delivery</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}