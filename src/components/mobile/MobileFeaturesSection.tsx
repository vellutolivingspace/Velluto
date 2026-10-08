import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Check, 
  Phone, 
  MapPin, 
  Cpu, 
  ShieldCheck, 
  Wrench, 
  Layers, 
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
  Mail,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { submitInquiryToGoogleSheet } from '../../config/inquiry';
import { COUNTRIES, detectUserCountryCode, formatPhoneNumberForStorage } from '../../config/countries';

export const MobileFeaturesSection: React.FC = () => {
  useScrollReveal();

  const [activeCategory, setActiveCategory] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState('91');
  const [submittedPhone, setSubmittedPhone] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'Homeowner',
    requirement: 'Modular Kitchen',
    message: '',
  });

  useEffect(() => {
    detectUserCountryCode().then((code) => {
      if (code) setCountryCode(code);
    });
  }, []);

  const productCategories = [
    {
      id: 'kitchens',
      number: '01',
      title: 'Modular Kitchens',
      subtitle: 'Complete factory-built kitchen carcases and custom shutters.',
      specs: [
        'Waterproof HDHMR & Marine Ply carcases with moisture-resistant PUR edge sealing',
        'Shutters in PU paint (matte/gloss), acrylic, laminate, or fluted panels',
        'Precision pre-drilled hinge cups compatible with soft-close hardware',
        'Built-in provisions for sinks, hobs, built-in ovens, and pantry units',
      ],
    },
    {
      id: 'wardrobes',
      number: '02',
      title: 'Wardrobes & Walk-Ins',
      subtitle: 'Full-height openable, sliding, and profile glass wardrobes.',
      specs: [
        'Floor-to-ceiling panels cut on automated beam saws with zero chipping',
        'Slim aluminum frame shutters with tinted, fluted, or clear toughened glass',
        'Internal drawer units, trouser racks, and jewelry organizers',
        'Pre-routed channels for concealed vertical warm LED light strips',
      ],
    },
    {
      id: 'living',
      number: '03',
      title: 'Living Units & TV Consoles',
      subtitle: 'Wall-mounted TV consoles, display cabinets, and credenzas.',
      specs: [
        'Heavy-duty concealed wall-mount brackets tested for 150 kg load',
        'Clean internal wire conduits and electrical box cutouts',
        'Soft-close push-to-open or discreet aluminum profile J-pull handles',
        'Seamless continuous grain matching across adjacent doors and drawers',
      ],
    },
    {
      id: 'paneling',
      number: '04',
      title: 'Fluted Panels & Doors',
      subtitle: 'Architectural wall cladding and room divider pivot doors.',
      specs: [
        'CNC-grooved acoustic fluted wood panels (6mm, 12mm, or 18mm fluting)',
        'Direct import from CAD drawings ensures perfect fit with zero trimming',
        'Matching flush-fit interior doors with concealed magnetic lock cases',
        'Pre-finished panels ready for rapid installation without on-site dust',
      ],
    },
  ];

  const machineryPillars = [
    {
      icon: Cpu,
      title: 'Beam Saw',
      metric: '±0.2 mm',
      desc: 'Cuts multiple large sheets simultaneously with zero diagonal slant or rough edge chipping.',
    },
    {
      icon: Wrench,
      title: '4-Axis CNC',
      metric: 'CAD Direct',
      desc: 'Automatically routs, grooves, and drills all holes from 3D CAD files with 100% repetitive accuracy.',
    },
    {
      icon: Layers,
      title: 'PUR Edge Bander',
      metric: 'Waterproof',
      desc: 'Polyurethane hot-melt adhesive at high heat/pressure creates zero visible glue line.',
    },
    {
      icon: ShieldCheck,
      title: 'Multi-Spindle Boring',
      metric: 'System 32',
      desc: 'Drills line-boring hole patterns in a single pass so every drawer and shelf sits dead-level.',
    },
  ];

  const rawMaterials = [
    {
      name: 'MR HDHMR',
      grade: '> 850 kg/m³',
      desc: 'High-density fiber core designed for humid kitchens & bathrooms. Never swells or bends.',
    },
    {
      name: 'Marine Plywood',
      grade: 'IS:710 BWR',
      desc: 'Calibrated uniform thickness across the full sheet ensures warp-free wardrobe shutters.',
    },
    {
      name: 'PU & Acrylic',
      grade: 'Cleanroom Spray',
      desc: 'Polyurethane paint or 2mm scratch-resistant acrylic pressed with high-tonnage rollers.',
    },
    {
      name: 'Precision Hardware',
      grade: '200k+ Cycles',
      desc: 'Tested for over 200,000 smooth opening cycles with lifetime soft-close operation.',
    },
  ];

  const factoryMetrics = [
    { val: '200k+', unit: 'Cycles', label: 'Soft-Close Tested' },
    { val: '±0.2', unit: 'mm', label: 'CNC Tolerance' },
    { val: '100%', unit: 'Machine', label: 'Zero Hand Cut' },
    { val: '5', unit: 'Years', label: 'Factory Warranty' },
  ];

  const comparisonItems = [
    {
      title: 'Edge Banding',
      factory: 'Automated PUR hot-melt, waterproof, zero glue line',
      carpenter: 'Hand-glued edge tape, peels off in heat & moisture',
    },
    {
      title: 'Panel Cutting',
      factory: 'Computerized beam saw, ±0.2 mm square cutting',
      carpenter: 'Hand circular saw, visible chipping & slant',
    },
    {
      title: 'Hole Drilling',
      factory: 'CNC multi-spindle boring, 100% exact alignment',
      carpenter: 'Manual hand drill, doors rub against frame',
    },
    {
      title: 'Site Installation',
      factory: 'Clean flat-pack assembly in 3–5 days, zero wood dust',
      carpenter: 'Weeks of noisy sawing & toxic chemical polish',
    },
  ];

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const formattedPhone = formatPhoneNumberForStorage(formData.phone, countryCode);
    setSubmittedPhone(formattedPhone);

    try {
      await submitInquiryToGoogleSheet({
        name: formData.name.trim(),
        phone: formattedPhone,
        email: formData.email.trim() || undefined,
        role: formData.role,
        requirement: formData.requirement,
        message: formData.message.trim() || undefined,
      });

      setFormSubmitted(true);
    } catch (err: any) {
      console.error('Inquiry submission error:', err);
      setSubmitError(
        err?.message || 'Unable to submit right now. Please call our direct desk at +91 92135 18005.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      role: 'Homeowner',
      requirement: 'Modular Kitchen',
      message: '',
    });
    setSubmittedPhone('');
    setFormSubmitted(false);
    setSubmitError(null);
  };

  return (
    <div className="bg-transparent text-[#2c1f18] px-4 space-y-12 pt-8 pb-20">

      {/* ========================================================================= */}
      {/* 01. PRODUCTS & CATALOGUE */}
      {/* ========================================================================= */}
      <section id="products" className="scroll-reveal pt-4">
        {/* Header Badge & Title */}
        <div className="space-y-1.5 mb-5 text-left">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8c4c1d] animate-pulse" />
            <span className="text-[9px] font-mono tracking-widest text-[#8c4c1d] uppercase font-semibold">
              GANDHINAGAR PLANT • MADE IN INDIA
            </span>
          </div>

          <h2 className="font-serif text-2xl font-normal text-[#26170f] leading-tight">
            Precision Modular Furniture. <br />
            <span className="rich-brown-gradient font-normal">
              Engineered to Perfection.
            </span>
          </h2>

          <p className="text-xs text-[#5c493d] font-normal leading-relaxed pt-1">
            Manufactured in Sector 25, GIDC Gandhinagar. Cut, drilled, and PUR edge-banded with micron accuracy on computerized machines.
          </p>
        </div>

        {/* Compact Horizontal Category Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {productCategories.map((cat, idx) => {
            const isActive = activeCategory === idx;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(idx)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 border cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-[#8c4c1d] text-white border-[#8c4c1d] shadow-sm font-medium'
                    : 'bg-white/70 text-[#5c493d] border-[#decbb8] hover:bg-white'
                }`}
              >
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* Compact Product Details Card */}
        <div className="mt-3 bg-white/85 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-[#decbb8] shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#e8ded3] pb-2.5">
            <span className="text-[9px] font-mono tracking-wider text-[#8c4c1d] uppercase font-semibold">
              PRODUCT // {productCategories[activeCategory].number}
            </span>
            <span className="text-[9px] font-mono text-[#7d6859] uppercase">
              100% Machine Built
            </span>
          </div>

          <div>
            <h3 className="font-serif text-lg text-[#26170f] font-normal">
              {productCategories[activeCategory].title}
            </h3>
            <p className="text-xs text-[#5c493d] mt-0.5">
              {productCategories[activeCategory].subtitle}
            </p>
          </div>

          {/* Compact Specs Grid */}
          <div className="space-y-2 pt-1">
            {productCategories[activeCategory].specs.map((spec, sIdx) => (
              <div
                key={sIdx}
                className="p-2.5 rounded-xl bg-[#faf7f2] border border-[#e8ded3] flex items-start gap-2 text-[11px] text-[#3d2c22] leading-snug"
              >
                <Check className="w-3.5 h-3.5 text-[#8c4c1d] shrink-0 mt-0.5" />
                <span>{spec}</span>
              </div>
            ))}
          </div>

          {/* Card Footer */}
          <div className="pt-2 border-t border-[#e8ded3] flex items-center justify-between text-[11px]">
            <span className="font-mono text-[9px] text-[#7d6859] uppercase">
              Lead Time: 15–21 Days
            </span>
            <a
              href="#contact"
              className="inline-flex items-center gap-1 text-[#8c4c1d] font-mono text-[10px] tracking-wider uppercase font-semibold"
            >
              <span>Get Quotation</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02. AUTOMATED MACHINERY (WHY NO HANDMADE) */}
      {/* ========================================================================= */}
      <section id="machinery" className="scroll-reveal space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8c4c1d]" />
            <span className="text-[9px] font-mono tracking-widest text-[#8c4c1d] uppercase font-semibold">
              COMPUTERIZED PLANT WORKFLOW
            </span>
          </div>
          <h2 className="font-serif text-xl text-[#26170f] font-normal">
            Automated Machinery. <br />
            <span className="rich-brown-gradient">Zero Manual Guesswork.</span>
          </h2>
          <p className="text-xs text-[#5c493d] leading-relaxed">
            Every component is machined with computerized precision for perfect wall alignment and silent soft-close gliding.
          </p>
        </div>

        {/* Compact 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {machineryPillars.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-[#decbb8] space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-[#ede3d5] flex items-center justify-center text-[#8c4c1d]">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-mono text-[#8c4c1d] font-semibold">
                    {m.metric}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif text-xs font-medium text-[#26170f]">
                    {m.title}
                  </h4>
                  <p className="text-[10px] text-[#5c493d] mt-1 leading-snug">
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. TESTED MATERIALS & FINISHES */}
      {/* ========================================================================= */}
      <section id="materials" className="scroll-reveal space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8c4c1d]" />
            <span className="text-[9px] font-mono tracking-widest text-[#8c4c1d] uppercase font-semibold">
              CERTIFIED BOARDS & SURFACES
            </span>
          </div>
          <h2 className="font-serif text-xl text-[#26170f] font-normal">
            Tested Boards & Luxury Finishes
          </h2>
          <p className="text-xs text-[#5c493d]">
            Certified substrates with high water resistance and cleanroom spray coatings.
          </p>
        </div>

        {/* Compact 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {rawMaterials.map((mat, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-[#decbb8] space-y-1.5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[8px] font-mono text-[#8c4c1d] uppercase block font-semibold">
                  {mat.grade}
                </span>
                <h4 className="font-serif text-xs font-medium text-[#26170f] mt-0.5">
                  {mat.name}
                </h4>
                <p className="text-[10px] text-[#5c493d] mt-1 leading-snug">
                  {mat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. BENCHMARK COMPARISON (FACTORY VS CARPENTER) - SIDE BY SIDE */}
      {/* ========================================================================= */}
      <section id="comparison" className="scroll-reveal space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8c4c1d]" />
            <span className="text-[9px] font-mono tracking-widest text-[#8c4c1d] uppercase font-semibold">
              BENCHMARK COMPARISON
            </span>
          </div>
          <h2 className="font-serif text-xl text-[#26170f] font-normal">
            Factory Precision vs Carpentry
          </h2>
          <p className="text-xs text-[#5c493d]">
            Direct side-by-side comparison between automated plant build and local carpentry.
          </p>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-[#decbb8] overflow-hidden shadow-xs">
          {/* Top Column Headers */}
          <div className="grid grid-cols-2 border-b border-[#e8ded3] bg-gradient-to-b from-[#fbf8f4] to-[#f5ede3] text-center">
            {/* Left Header: Velluto Plant */}
            <div className="p-2.5 sm:p-3 border-r border-[#e8ded3] flex flex-col items-center justify-center gap-1">
              <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-700">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono text-[10px] sm:text-[11px] uppercase font-bold text-emerald-800 tracking-wider">
                Velluto Plant
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-[#7d6859] uppercase">
                Automated CNC
              </span>
            </div>

            {/* Right Header: Local Carpenter */}
            <div className="p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1 bg-[#ede4d8]/40">
              <div className="w-6 h-6 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-600">
                <span className="text-[10px] font-bold">✕</span>
              </div>
              <span className="font-mono text-[10px] sm:text-[11px] uppercase font-semibold text-neutral-700 tracking-wider">
                Local Carpenter
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-neutral-500 uppercase">
                Manual Handmade
              </span>
            </div>
          </div>

          {/* Side-by-Side Rows */}
          <div className="divide-y divide-[#ece2d6]">
            {comparisonItems.map((item, idx) => (
              <div key={idx} className="p-2.5 sm:p-3 space-y-1.5">
                {/* Parameter Tag Badge */}
                <div className="text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#8c4c1d]/10 text-[#8c4c1d] font-mono text-[9px] uppercase tracking-wider font-semibold">
                    {item.title}
                  </span>
                </div>

                {/* 2-Column Side-by-Side Comparison */}
                <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] leading-snug">
                  {/* Left: Velluto Automated Plant */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[#1a3820] flex flex-col justify-between">
                    <p className="font-medium text-[#1a3820]">
                      {item.factory}
                    </p>
                  </div>

                  {/* Right: Local Carpenter */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-neutral-100/90 border border-neutral-200/90 text-neutral-600 flex flex-col justify-between">
                    <p className="text-neutral-600">
                      {item.carpenter}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. FACTORY NUMBERS */}
      {/* ========================================================================= */}
      <section className="scroll-reveal">
        <div className="grid grid-cols-2 gap-2.5">
          {factoryMetrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-[#decbb8] text-center space-y-0.5 shadow-xs"
            >
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-serif text-2xl text-[#26170f] font-normal">
                  {m.val}
                </span>
                <span className="font-mono text-[10px] text-[#8c4c1d] uppercase font-semibold">
                  {m.unit}
                </span>
              </div>
              <p className="text-[9px] font-mono uppercase tracking-wider text-[#7d6859]">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06. FACTORY VISIT & INQUIRY FORM */}
      {/* ========================================================================= */}
      <section id="contact" className="scroll-reveal space-y-4 pt-2">
        {/* Plant Overview Card */}
        <div className="bg-gradient-to-br from-white via-[#fbf8f4] to-[#f4ece0] p-4 sm:p-5 rounded-2xl border border-[#decbb8] shadow-sm space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ede3d5] text-[#8c4c1d] font-mono text-[9px] uppercase tracking-wider font-semibold">
            <Sparkles className="w-3 h-3" />
            DIRECT FACTORY DESK
          </div>

          <h2 className="font-serif text-xl text-[#26170f] font-normal leading-snug">
            Visit Our Plant in Gandhinagar. <br />
            <span className="rich-brown-gradient">
              Inspect Machines & Finishes.
            </span>
          </h2>

          <p className="text-xs text-[#5c493d] leading-relaxed">
            Architects, designers, and homeowners are welcome to tour our factory floor, inspect mock-ups, and review production samples.
          </p>

          {/* Quick Contact Info */}
          <div className="space-y-2 pt-1 font-mono text-xs">
            <div className="flex items-center gap-2.5 text-[#38271e]">
              <Phone className="w-3.5 h-3.5 text-[#8c4c1d] shrink-0" />
              <a href="tel:+919213518005" className="hover:text-[#8c4c1d] font-medium text-xs">
                +91 92135 18005
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-[#38271e]">
              <Mail className="w-3.5 h-3.5 text-[#8c4c1d] shrink-0" />
              <a href="mailto:info@vellutolivingspace.com" className="hover:text-[#8c4c1d] text-[11px]">
                info@vellutolivingspace.com
              </a>
            </div>

            <div className="flex items-start gap-2.5 text-[#5c493d]">
              <MapPin className="w-3.5 h-3.5 text-[#8c4c1d] shrink-0 mt-0.5" />
              <span className="text-[11px] leading-snug">
                Plot No. A-55, GIDC, Sector 25, Gandhinagar, Gujarat 382024
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-[#7d6859] pt-1">
              <Clock className="w-3.5 h-3.5 text-[#8c4c1d] shrink-0" />
              <span className="text-[10px]">Mon – Sat, 9:30 AM – 7:00 PM</span>
            </div>
          </div>
        </div>

        {/* Compact Mobile Inquiry Form */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#decbb8] shadow-sm space-y-3">
          <h4 className="font-serif text-base text-[#26170f] font-normal">
            Schedule Visit or Submit Drawing
          </h4>

          {formSubmitted ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-700 mx-auto" />
              <h5 className="font-serif text-sm text-[#26170f] font-medium">
                Inquiry Recorded
              </h5>
              <p className="text-xs text-[#5c493d]">
                Thank you, <strong className="text-[#26170f]">{formData.name}</strong>. Our factory team will call you on +{submittedPhone || formData.phone} shortly.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#8c4c1d]/10 text-[#8c4c1d] font-mono text-[11px] font-medium"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Submit Another</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleForm} className="space-y-2.5">
              {submitError && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="text-[9px] font-mono tracking-wider text-[#7d6859] uppercase block mb-1">
                  Full Name <span className="text-[#8c4c1d]">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder="e.g. Rajesh Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#decbb8] focus:border-[#8c4c1d] focus:bg-white text-[16px] outline-none"
                />
              </div>

              {/* Mobile Phone with Country Code */}
              <div>
                <label className="text-[9px] font-mono tracking-wider text-[#7d6859] uppercase block mb-1">
                  Mobile Number <span className="text-[#8c4c1d]">*</span>
                </label>
                <div className="flex rounded-xl bg-[#faf7f2] border border-[#decbb8] focus-within:border-[#8c4c1d] focus-within:bg-white overflow-hidden">
                  <div className="relative flex items-center bg-[#f3ece2]/70 border-r border-[#decbb8]">
                    <select
                      disabled={isSubmitting}
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="appearance-none bg-transparent pl-2 pr-5 py-2 text-[16px] sm:text-xs font-mono outline-none cursor-pointer"
                      aria-label="Country Code"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.iso} value={c.code} className="text-[#26170f] bg-white font-sans text-xs">
                          {c.flag} +{c.code}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-[#7d6859] absolute right-1 pointer-events-none" />
                  </div>
                  <input
                    type="tel"
                    required
                    disabled={isSubmitting}
                    placeholder="98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-2.5 py-2 bg-transparent text-[16px] outline-none font-mono"
                  />
                </div>
              </div>

              {/* Role & Requirement (2 cols) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-mono tracking-wider text-[#7d6859] uppercase block mb-1">
                    You Are
                  </label>
                  <select
                    disabled={isSubmitting}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl bg-[#faf7f2] border border-[#decbb8] text-[16px] sm:text-xs outline-none"
                  >
                    <option value="Homeowner">Homeowner</option>
                    <option value="Architect">Architect</option>
                    <option value="Interior Designer">Interior Designer</option>
                    <option value="Contractor">Builder</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-mono tracking-wider text-[#7d6859] uppercase block mb-1">
                    Requirement
                  </label>
                  <select
                    disabled={isSubmitting}
                    value={formData.requirement}
                    onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl bg-[#faf7f2] border border-[#decbb8] text-[16px] sm:text-xs outline-none"
                  >
                    <option value="Modular Kitchen">Modular Kitchen</option>
                    <option value="Wardrobes">Wardrobes</option>
                    <option value="Full Home">Full Home</option>
                    <option value="Factory Visit">Factory Visit</option>
                  </select>
                </div>
              </div>

              {/* Project Notes */}
              <div>
                <label className="text-[9px] font-mono tracking-wider text-[#7d6859] uppercase block mb-1">
                  Project Notes (Optional)
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  placeholder="e.g. 3BHK flat, drawing ready"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#decbb8] focus:border-[#8c4c1d] focus:bg-white text-[16px] outline-none"
                />
              </div>

              {/* Compact Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 rounded-xl bg-[#8c4c1d] hover:bg-[#723c14] text-white font-medium text-xs font-mono tracking-wider uppercase shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-transform"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Inquiry to Factory</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
