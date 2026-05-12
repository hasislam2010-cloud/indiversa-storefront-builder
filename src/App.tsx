import React, { useState, useEffect, useMemo } from 'react';
import { Store, Phone, Plus, Trash2, Copy, ExternalLink, MessageCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: string;
  name: string;
  price: number;
}

export default function App() {
  const [phone, setPhone] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [copied, setCopied] = useState(false);

  // Load saved phone on mount
  useEffect(() => {
    const savedPhone = localStorage.getItem('wa_store_phone');
    if (savedPhone) setPhone(savedPhone);
  }, []);

  // Save phone on change
  useEffect(() => {
    localStorage.setItem('wa_store_phone', phone);
  }, [phone]);

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productPrice) return;
    
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: productName.trim(),
      price: parseFloat(productPrice),
    };

    setProducts([...products, newProduct]);
    setProductName('');
    setProductPrice('');
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const totalPrice = useMemo(() => {
    return products.reduce((acc, p) => acc + p.price, 0);
  }, [products]);

  const rawMessage = useMemo(() => {
    if (products.length === 0) {
      return "Hello! I'd like to order:\n\n...\n\nTotal: ₹0";
    }
    let text = "Hello! I'd like to order:\n";
    products.forEach(p => {
      text += `- ${p.name} (₹${p.price.toLocaleString()})\n`;
    });
    text += `\nTotal: ₹${totalPrice.toLocaleString()}`;
    return text;
  }, [products, totalPrice]);

  const generatedLink = useMemo(() => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const defaultText = "Hello! I'd like to order...";
    const textToEncode = products.length === 0 ? defaultText : rawMessage;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textToEncode)}`;
  }, [phone, products, rawMessage]);

  const handleCopyLink = async () => {
    if (!phone) {
      alert("Please enter a WhatsApp number first.");
      return;
    }
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleTestLink = () => {
    if (!phone) {
      alert("Please enter a WhatsApp number first.");
      return;
    }
    window.open(generatedLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] pb-24">
      {/* Container simulating a mobile app width for universal elegance */}
      <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Header */}
        <header className="text-center pt-8 pb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.25rem] bg-gradient-to-b from-[#25D366] to-[#128C7E] shadow-[0_8px_16px_rgba(37,211,102,0.25)] mb-4 text-white">
            <Store size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Indiversa Storefront Builder</h1>
          <p className="text-[#86868b] text-sm mt-1 font-medium">Generate your storefront magic link</p>
        </header>

        {/* Seller Info */}
        <section className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#f5f5f7]">
          <label className="block text-[13px] font-semibold text-[#86868b] mb-2 uppercase tracking-wide">
            Seller Details
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Phone size={18} className="text-[#a1a1a6]" />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: 919876543210 (Country code + Number)"
              className="w-full pl-10 pr-4 py-3.5 bg-[#f5f5f7] border-transparent rounded-2xl text-[15px] focus:bg-white focus:border-[#25D366] focus:ring-4 focus:ring-[#25D366]/10 transition-all outline-none"
            />
          </div>
        </section>

        {/* Product Manager */}
        <section className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#f5f5f7]">
          <label className="block text-[13px] font-semibold text-[#86868b] mb-4 uppercase tracking-wide">
            Products
          </label>
          
          <form onSubmit={addProduct} className="flex gap-2 isolate mb-6">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Product Name"
                className="w-full px-4 py-3 bg-[#f5f5f7] border-transparent rounded-xl text-[15px] focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none"
              />
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="Price (₹)"
                min="0"
                step="any"
                className="w-full px-4 py-3 bg-[#f5f5f7] border-transparent rounded-xl text-[15px] focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!productName || !productPrice}
              className="w-12 h-[6.5rem] bg-[#0071e3] text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:bg-[#a1a1a6] active:scale-95 transition-all shadow-sm"
            >
              <Plus size={24} />
            </button>
          </form>

          {/* Product List */}
          <div className="space-y-2 min-h-[4rem]">
            <AnimatePresence initial={false}>
              {products.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-[#a1a1a6] text-sm py-4 italic"
                >
                  No products added yet.
                </motion.div>
              ) : (
                products.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="flex items-center justify-between bg-[#f5f5f7] p-3 rounded-2xl overflow-hidden"
                  >
                    <div className="flex flex-col overflow-hidden px-2">
                      <span className="font-medium text-[15px] truncate">{p.name}</span>
                      <span className="text-[#86868b] text-[13px]">₹{p.price.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => removeProduct(p.id)}
                      className="p-2 text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-xl transition-colors shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            
            {products.length > 0 && (
              <motion.div 
                layout
                className="flex justify-between items-center px-2 pt-4 mt-2 border-t border-[#f5f5f7]"
              >
                <span className="font-semibold text-[#86868b]">Total</span>
                <span className="font-bold text-lg">₹{totalPrice.toLocaleString()}</span>
              </motion.div>
            )}
          </div>
        </section>

        {/* Live Preview */}
        <section className="mt-8">
          <label className="block text-[13px] font-semibold text-[#86868b] mb-3 uppercase tracking-wide flex items-center gap-1.5">
            <MessageCircle size={14} /> Live Preview
          </label>
          <div className="bg-[#e7f8cb] rounded-[1.25rem] rounded-tl-sm p-4 text-[#111b21] shadow-sm font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <MessageCircle size={120} />
            </div>
            <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed relative z-10">
              {rawMessage}
            </pre>
          </div>
        </section>

        {/* Action Zone */}
        <section className="pt-4 space-y-4">
          <button
            onClick={handleCopyLink}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-semibold text-lg transition-all shadow-lg active:scale-[0.98] ${
              copied 
                ? 'bg-black shadow-black/20' 
                : 'bg-[#25D366] shadow-[#25D366]/30 hover:bg-[#20bd5a]'
            }`}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            {copied ? 'Link Copied!' : 'Copy Magic Link'}
          </button>
          
          <button
            onClick={handleTestLink}
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[#1d1d1f] font-semibold bg-white border border-[#e5e5ea] hover:bg-[#f5f5f7] transition-all active:scale-[0.98]"
          >
            <ExternalLink size={18} className="text-[#86868b]" />
            Test on WhatsApp
          </button>
        </section>

      </div>
    </div>
  );
}
