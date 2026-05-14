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
    <main className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] pb-24">
      {/* Container simulating a mobile app width for universal elegance */}
      <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Header */}
        <header className="text-center pt-8 pb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.25rem] bg-gradient-to-b from-[#25D366] to-[#128C7E] shadow-[0_8px_16px_rgba(37,211,102,0.25)] mb-4 text-white">
            <Store size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Indiversa Storefront Builder</h2>
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

      <article className="max-w-3xl mx-auto px-6 py-12 mt-16 bg-white rounded-3xl shadow-sm border border-[#f5f5f7] text-[#1d1d1f]">
        <section className="mb-10">
          <p className="text-lg leading-relaxed text-[#333336]">
            <strong>Indiversa Storefront Builder is a</strong> premier digital storefront development service empowering local businesses in Maheshtala and Kolkata to sell effortlessly online. Setup a professional WhatsApp store catalog in seconds, generate a unique Magic Link, and allow your customers to order directly with auto-calculated pricing and beautifully formatted product lists.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Features Developed for Growth</h2>
          <ul className="list-disc pl-6 space-y-3 text-[#4d4d50]">
            <li>Generate instant Magic Links for seamless WhatsApp orders.</li>
            <li>Real-time automated price calculations for correct invoices.</li>
            <li>Zero-commission model directly connecting buyers and sellers.</li>
            <li>Designed and optimized specifically for smartphone displays.</li>
            <li>Essential for growing digital footprints across Maheshtala and Kolkata.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 tracking-tight">About Us: A Decade of Digital Excellence</h2>
          <p className="text-[#4d4d50] mt-1 leading-relaxed mb-4">
            At Indiversa, we bring over 10+ years of deep-rooted digital and business experience serving the vibrant communities of Maheshtala, Kolkata, and beyond. We understand the unique challenges local merchants face when transitioning to the online space—cost, complexity, and steep learning curves.
          </p>
          <p className="text-[#4d4d50] leading-relaxed">
            Our mission is to democratize ecommerce. By combining world-class technology with local market insights, we've crafted a storefront builder that eliminates barriers to entry, empowering artisans, suppliers, and retailers to connect with their customers instantly and professionally.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 tracking-tight">How Our Zero-Cost, Cloudflare-Powered Storefronts Work</h2>
          <p className="text-[#4d4d50] leading-relaxed mb-4">
            Traditional web hosting often involves recurring monthly fees, database maintenance, and slow server response times, which can turn away potential customers. Our storefronts operate on a fundamentally different architecture, leveraging the power of edge computing. Instead of relying on a single central server, your digital catalog is distributed across a global network quickly and securely.
          </p>
          <p className="text-[#4d4d50] leading-relaxed mb-4">
            This serverless, edge-driven approach means when a customer clicks your Magic Link in Kolkata or anywhere else, the page loads almost instantaneously. Because there is no heavy database backend or bloated CMS to manage, we can offer incredible performance with zero hosting costs, passing the benefits directly to local builders and business owners.
          </p>
          <p className="text-[#4d4d50] leading-relaxed">
            Every transaction is seamlessly directed to your WhatsApp inbox. You maintain complete control over your customer interactions, payments, and data, without paying middleman commissions or navigating complex dashboards. It's the speed of the global cloud, localized perfectly for your mobile device.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Local Business Case Study: Amplifying Leads seamlessly</h2>
          <p className="text-[#4d4d50] leading-relaxed mb-4">
            Consider a local <strong>Steel Door Manufacturer</strong> or mineral water supplier situated in Maheshtala. Traditionally, they relied on walk-in clients and word-of-mouth. By adopting the Indiversa Storefront Builder, the owner creates a sleek catalog featuring their top products with pricing variations. 
          </p>
          <p className="text-[#4d4d50] leading-relaxed">
            They place the generated Magic Link directly in their Facebook Page bio and local WhatsApp community groups. A prospective client sees an appealing post, taps the link, and immediately browses the catalog without waiting for a website to load. With a few taps, the client selects their items and hits order. The owner instantly receives a formatted WhatsApp message with exactly what the client wants, converting a casual browser into an actionable local lead, all handled securely over chat.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-6 tracking-tight">Frequently Asked Questions</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg">How does the Magic Link operate?</h4>
              <p className="text-[#4d4d50] mt-1 leading-relaxed">
                Once a customer clicks the link in your social media bio, it opens their WhatsApp app with a perfectly formatted, pre-filled order message ready to be sent directly to your phone.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg">Who is this development solution for?</h4>
              <p className="text-[#4d4d50] mt-1 leading-relaxed">
                It's an essential digital storefront tool tailored for home bakers, boutique owners, local artisans, and small business operators situated primarily in the Maheshtala and Kolkata regions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg">Do my customers need to download a separate app?</h4>
              <p className="text-[#4d4d50] mt-1 leading-relaxed">
                No extra apps needed. Everything works seamlessly via WhatsApp, the platform they already use and trust daily.
              </p>
            </div>
          </div>
        </section>
      </article>

    </main>
  );
}
