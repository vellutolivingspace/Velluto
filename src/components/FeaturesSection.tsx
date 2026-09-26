import React, { useState } from 'react';
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
  Mail
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { submitInquiryToGoogleSheet } from '../config/inquiry';

export const FeaturesSection: React.FC = () => {
  useScrollReveal();

  const [activeCategory, setActiveCategory] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'Homeowner',
    requirement: 'Modular Kitchen',
    message: '',
  });

  // What the factory manufactures
  const productCategories = [
    {
      id: 'kitchens',
      number: '01',
      title: 'Modular Kitchens',
      subtitle: 'Complete factory-built kitchen carcases and custom shutters.',
      specs: [
        'Waterproof HDHMR and Marine Ply carcases with moisture-resistant PUR edge sealing',
        'Shutters available in PU paint (matte or gloss), acrylic, laminate, or fluted panels',
        'Precision pre-drilled hinge cups and runner positions compatible with precision soft-close hardware',
        'Built-in provisions for sinks, induction hobs, built-in ovens, and pantry units',
      ],
    },
    {
      id: 'wardrobes',
      number: '02',
      title: 'Modular Wardrobes & Walk-Ins',
      subtitle: 'Full-height openable, sliding, and aluminum profile glass wardrobes.',
      specs: [
        'Floor-to-ceiling panels cut squarely on automated beam saws with zero edge chipping',
        'Slim aluminum frame shutters with tinted, fluted, or clear toughened glass',
        'Internal drawer units, trouser racks, shoe pull-outs, and jewelry trays',
        'Pre-routed channels for concealed vertical and horizontal warm LED lighting strips',
      ],
    },
    {
      id: 'living',
      number: '03',
      title: 'Living Room Units & TV Consoles',
      subtitle: 'Wall-mounted TV consoles, display cabinets, and storage credenzas.',
      specs: [
        'Heavy-duty concealed wall-mounting hardware tested for up to 150 kg load capacity',
        'Clean internal wire conduits and concealed electrical box cutouts',
        'Soft-close push-to-open or discreet aluminum profile integrated J-pull handles',
        'Seamless continuous grain matching across adjacent cabinet doors and drawers',
      ],
    },
    {
      id: 'paneling',
      number: '04',
      title: 'Fluted Wall Panels & Flush Doors',
      subtitle: 'Architectural wall cladding and room divider pivot doors.',
      specs: [
        'CNC-grooved acoustic fluted wood panels with exact 6mm, 12mm, or 18mm fluting',
        'Direct import from CAD drawings ensures perfect on-site fit with zero trimming',
        'Matching flush-fit interior doors with concealed magnetic lock cases and 3D hinges',
        'Pre-finished panels ready for rapid installation without on-site dust or polishing',
      ],
    },
  ];

  // Automated Machinery Workflow (No Handmade)
  const machineryPillars = [
    {
      icon: Cpu,
      title: 'Computerized Beam Saw',
      desc: 'Cuts multiple large board sheets simultaneously with ±0.2 mm accuracy. Eliminates diagonal distortion and rough saw marks.',
    },
    {
      icon: Wrench,
      title: '4-Axis CNC Machining Center',
      desc: 'Automatically routs, grooves, and drills all holes for hinges, shelf pins, and cam-locks directly from 3D CAD files. 100% repetitive accuracy.',
    },
    {
      icon: Layers,
      title: 'Automated PUR Edge Bander',
      desc: 'Applies polyurethane (PUR) hot-melt adhesive at high temperature and pressure. Creates a permanent waterproof bond with zero visible glue line.',
    },
    {
      icon: ShieldCheck,
      title: 'Multi-Spindle Boring Machine',
      desc: 'Drills all line-boring System 32 hole patterns in a single pass. Guarantees that every drawer slide and shelf sits perfectly level.',
    },
  ];

  // Raw Materials Processed in Factory
  const rawMaterials = [
    {
      name: 'Moisture-Resistant HDHMR',
      type: 'Core Board Substrate',
      grade: 'High Density > 850 kg/m³',
      desc: 'High-density fiber core designed specifically for humid environments like kitchens and washrooms. Holds screws securely without swelling or bending.',
    },
    {
      name: 'Calibrated Marine Plywood',
      type: 'Structural Plywood',
      grade: 'IS:710 Boiling Water Resistant',
      desc: 'Uniformly calibrated thickness across the full sheet. Ensures seamless edge-banding and flat, warp-free wardrobe shutters.',
    },
    {
      name: 'PU Lacquer & Anti-Fingerprint Acrylic',
      type: 'Surface Finishes',
      grade: 'Factory Spray & Press Applied',
      desc: 'Multi-coat polyurethane paint cured in cleanroom booths, or 2mm scratch-resistant acrylic sheets pressed with high-tonnage rollers.',
    },
    {
      name: 'Precision Architectural Hardware',
      type: 'Fittings & Mechanisms',
      grade: 'High-Durability Soft-Close Systems',
      desc: 'All carcases are pre-drilled to fit precision architectural fittings. Tested for over 200,000 smooth opening cycles with lifetime silent operation.',
    },
  ];

  // Hard Factory Numbers
  const factoryMetrics = [
    { val: '200k+', unit: 'Cycles', label: 'Tested Soft-Close Durability' },
    { val: '±0.2', unit: 'mm', label: 'CNC Cutting & Drilling Tolerance' },
    { val: '100%', unit: 'Machine-Made', label: 'Zero Manual Hand Cutting' },
    { val: '5', unit: 'Years', label: 'Factory Warranty on Board & Build' },
  ];

  // Factory vs Carpenter Comparison
  const comparison = [
    {
      parameter: 'Panel Cutting',
      factory: 'Automated computerized beam saw (accurate to ±0.2 mm, perfectly square)',
      carpenter: 'Hand-held circular saw (frequent diagonal slant, visible chipping)',
    },
    {
      parameter: 'Edge Banding',
      factory: 'Automated PUR hot-melt edge bander (heatproof, waterproof, zero glue line)',
      carpenter: 'Hand-glued edge tape with manual cutter (glue peels off in heat and moisture)',
    },
    {
      parameter: 'Drilling & Boring',
      factory: 'CNC multi-spindle boring machine (100% exact alignment for hinges and drawers)',
      carpenter: 'Manual hand drill (frequent misalignment, doors rub against frames)',
    },
    {
      parameter: 'Site Installation',
      factory: 'Clean, flat-pack assembly in 3–5 days with minimal noise and zero wood dust',
      carpenter: 'Weeks of noisy cutting, sawing, and toxic chemical polishing inside your home',
    },
  ];

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitInquiryToGoogleSheet({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        role: formData.role,
        requirement: formData.requirement,
        message: formData.message.trim() || undefined,
      });

      setFormSubmitted(true);
    } catch (err: any) {
      console.error('Inquiry submission error:', err);
      setSubmitError(
        err?.message || 'Unable to submit your inquiry at this moment. Please call our direct desk at +91 92135 18005.'
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
    setFormSubmitted(false);
    setSubmitError(null);
  };

  return (
    <section className="bg-transparent text-[#2c1f18] relative">

      {/* ========================================================================= */}
      {/* 01. FACTORY INTRODUCTION / PRODUCTS */}
      {/* ========================================================================= */}
      <div id="products" className="folio-page max-w-7xl mx-auto px-4 sm:px-10 pt-28 sm:pt-36 pb-20 border-b border-[#decbb8]/60">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-20">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8c4c1d] animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-[#8c4c1d] uppercase font-medium flex items-center gap-2 flex-wrap">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#8c4c1d]/10 text-[9px] font-semibold text-[#8c4c1d]">PROUDLY MADE IN INDIA</span>
                <span>• GANDHINAGAR MANUFACTURING PLANT</span>
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#26170f] leading-tight">
              Precision Modular Furniture. <br />
              <span className="rich-brown-gradient font-normal">
                Engineered to Perfection.
              </span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-[#5c493d] font-normal text-xs sm:text-sm leading-relaxed">
              We operate an automated modular furniture manufacturing plant in Sector 25, GIDC Gandhinagar. Proudly building in India with high-precision computerized machinery. Every panel, shutter, and carcase is cut, drilled, and edged with micron-level accuracy. Zero manual cutting on site.
            </p>
          </div>
        </div>

        {/* Product Lineup Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-3 scroll-reveal">
            {productCategories.map((cat, idx) => {
              const isActive = activeCategory === idx;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(idx)}
                  className={`group relative w-full text-left p-5 sm:p-6 rounded-2xl transition-all duration-300 border flex items-center justify-between overflow-hidden cursor-pointer select-none active:scale-[0.98] ${
                    isActive
                      ? 'bg-white border-[#b86d34] shadow-[0_12px_32px_rgba(184,109,52,0.16)] translate-x-1.5'
                      : 'bg-white/60 border-[#e5d9cd] hover:border-[#b86d34]/50 hover:bg-white/95 hover:translate-x-1 hover:shadow-sm'
                  }`}
                >
                  {/* Left Active Luxury Accent Bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#743e1d] via-[#b86d34] to-[#d8965f] rounded-l-2xl transition-all duration-300 ${
                      isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                    }`}
                  />

                  <div className="relative pl-1">
                    <span
                      className={`font-mono text-[10px] tracking-widest block mb-0.5 font-medium transition-colors duration-200 ${
                        isActive ? 'text-[#8c4c1d]' : 'text-[#8c4c1d]/70 group-hover:text-[#8c4c1d]'
                      }`}
                    >
                      PRODUCT // {cat.number}
                    </span>
                    <h3
                      className={`font-serif text-base sm:text-lg font-normal transition-colors duration-200 ${
                        isActive ? 'text-[#26170f] font-medium' : 'text-[#3d2c22] group-hover:text-[#26170f]'
                      }`}
                    >
                      {cat.title}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-[#8c4c1d]/10 text-[#8c4c1d]'
                        : 'bg-transparent text-neutral-400 group-hover:text-[#8c4c1d] group-hover:translate-x-1'
                    }`}
                  >
                    <span className="text-sm font-mono font-medium">→</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 scroll-reveal">
            <div
              key={activeCategory}
              className="animate-fade-in bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-[#decbb8] shadow-[0_12px_40px_rgba(140,90,50,0.06)] space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#e8ded3] pb-4">
                <span className="text-[10px] font-mono tracking-widest text-[#8c4c1d] uppercase font-medium">
                  MANUFACTURING SPECIFICATION // {productCategories[activeCategory].number}
                </span>
                <span className="text-[10px] font-mono text-[#7d6859] uppercase">
                  100% Machine Processed
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#26170f] font-normal">
                  {productCategories[activeCategory].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5c493d] font-normal mt-1.5">
                  {productCategories[activeCategory].subtitle}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7d6859] block font-medium">
                  Factory Processing Standards
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {productCategories[activeCategory].specs.map((spec, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-xl bg-[#faf7f2] border border-[#e8ded3] flex items-start gap-2.5 text-xs text-[#3d2c22] font-normal leading-relaxed"
                    >
                      <Check className="w-3.5 h-3.5 text-[#8c4c1d] shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#e8ded3] flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-[#7d6859] uppercase">
                  Lead Time: 15–21 Working Days
                </span>
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-1.5 text-[#8c4c1d] hover:text-[#5c3216] transition-colors font-mono text-[11px] tracking-wider uppercase font-medium"
                >
                  <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#8c4c1d] group-hover:after:w-full after:transition-all after:duration-300">
                    Submit Floor Plan For Quotation
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Edge Illumination Hairline */}
      <div className="page-edge-line w-full max-w-7xl mx-auto my-3 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 02. AUTOMATED MACHINERY: WHY NO HANDMADE */}
      {/* ========================================================================= */}
      <div id="machinery" className="folio-page max-w-7xl mx-auto px-4 sm:px-10 py-24 sm:py-32 border-b border-[#decbb8]/60">
        <div className="max-w-2xl mb-14 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8c4c1d]" />
            <span className="text-[11px] font-mono tracking-widest text-[#8c4c1d] uppercase font-medium">
              AUTOMATED PLANT WORKFLOW
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#26170f]">
            High-Precision Automated Machinery. <br />
            <span className="rich-brown-gradient font-normal">Made in India with Zero Manual Guesswork.</span>
          </h2>
          <p className="text-[#5c493d] font-normal text-xs sm:text-sm leading-relaxed">
            Every step of production is handled by computerized automated machines. This ensures every cabinet fits your wall accurately, doors close with even gaps, and drawers glide smoothly for years.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {machineryPillars.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="scroll-reveal bg-white/75 backdrop-blur-xl p-7 rounded-2xl border border-[#decbb8] space-y-3 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_35px_rgba(150,100,60,0.1)] hover:border-[#b86d34]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#ede3d5] border border-[#d6c4b2] flex items-center justify-center text-[#8c4c1d]">
                  <Icon className="w-5 h-5 text-[#8c4c1d]" />
                </div>
                <h4 className="font-serif text-lg text-[#26170f] font-normal">
                  {m.title}
                </h4>
                <p className="text-xs text-[#5c493d] font-normal leading-relaxed">
                  {m.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Page Edge Illumination Hairline */}
      <div className="page-edge-line w-full max-w-7xl mx-auto my-3 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 03. BOARD & FINISH MATERIALS */}
      {/* ========================================================================= */}
      <div id="materials" className="folio-page max-w-7xl mx-auto px-4 sm:px-10 py-24 sm:py-32 border-b border-[#decbb8]/60">
        <div className="max-w-xl mb-12 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8c4c1d]" />
            <span className="text-[11px] font-mono tracking-widest text-[#8c4c1d] uppercase font-medium">
              CERTIFIED RAW MATERIALS
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#26170f]">
            Tested Boards & Luxury Finishes
          </h2>
          <p className="text-[#5c493d] font-normal text-xs sm:text-sm">
            We stock and machine certified high-density boards, luxury surface finishes, and precision soft-close hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rawMaterials.map((mat, idx) => (
            <div
              key={idx}
              className="scroll-reveal bg-white/75 backdrop-blur-xl p-6 rounded-2xl border border-[#decbb8] space-y-3 flex flex-col justify-between hover:shadow-[0_12px_35px_rgba(150,100,60,0.08)] hover:border-[#b86d34] transition-all"
            >
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-[#8c4c1d] uppercase tracking-wider block font-medium">
                  {mat.type}
                </span>
                <h4 className="font-serif text-lg text-[#26170f] font-normal">
                  {mat.name}
                </h4>
                <p className="text-xs text-[#5c493d] font-normal leading-relaxed">
                  {mat.desc}
                </p>
              </div>
              <div className="pt-4 border-t border-[#e8ded3]">
                <span className="text-[10px] font-mono text-[#7d6859] uppercase">
                  Standard: {mat.grade}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page Edge Illumination Hairline */}
      <div className="page-edge-line w-full max-w-7xl mx-auto my-3 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 04. FACTORY VS CARPENTER (DIRECT FACTUAL COMPARISON) */}
      {/* ========================================================================= */}
      <div id="comparison" className="folio-page max-w-7xl mx-auto px-4 sm:px-10 py-24 sm:py-32 border-b border-[#decbb8]/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8c4c1d]" />
              <span className="text-[11px] font-mono tracking-widest text-[#8c4c1d] uppercase font-medium">
                BENCHMARK COMPARISON
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#26170f]">
              Factory Precision vs On-Site Carpentry
            </h2>
          </div>
          <p className="text-[#5c493d] font-normal text-xs sm:text-sm max-w-md">
            Why machine-processed modular furniture lasts significantly longer, fits your walls cleanly, and installs with zero dust or noise.
          </p>
        </div>

        <div className="scroll-reveal bg-white/80 backdrop-blur-xl rounded-3xl border border-[#decbb8] shadow-[0_10px_35px_rgba(140,90,50,0.06)] overflow-hidden divide-y divide-[#ece2d6]">
          {comparison.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 p-6 sm:p-7 gap-4 items-center hover:bg-[#faf7f2] transition-colors"
            >
              <div className="md:col-span-3">
                <span className="font-mono text-xs text-[#8c4c1d] tracking-wider uppercase block font-medium">
                  {row.parameter}
                </span>
              </div>
              <div className="md:col-span-5 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-700" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-700 tracking-wider uppercase block font-medium">
                    Velluto Factory Machine
                  </span>
                  <p className="text-xs text-[#26170f] font-normal mt-0.5">
                    {row.factory}
                  </p>
                </div>
              </div>
              <div className="md:col-span-4 flex items-start gap-3 opacity-75">
                <div className="w-5 h-5 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-2 h-0.5 bg-neutral-500 rounded-full" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-600 tracking-wider uppercase block">
                    Handmade / On-Site Carpenter
                  </span>
                  <p className="text-xs text-neutral-600 font-normal mt-0.5">
                    {row.carpenter}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page Edge Illumination Hairline */}
      <div className="page-edge-line w-full max-w-7xl mx-auto my-3 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 05. FACTORY NUMBERS */}
      {/* ========================================================================= */}
      <div className="folio-page max-w-7xl mx-auto px-4 sm:px-10 py-20 border-b border-[#decbb8]/60">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {factoryMetrics.map((m, idx) => (
            <div key={idx} className="scroll-reveal bg-white/75 backdrop-blur-xl p-6 rounded-2xl border border-[#decbb8] space-y-1 shadow-sm">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-3xl sm:text-4xl text-[#26170f] font-normal">
                  {m.val}
                </span>
                <span className="font-mono text-xs text-[#8c4c1d] uppercase font-medium">
                  {m.unit}
                </span>
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#7d6859]">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Page Edge Illumination Hairline */}
      <div className="page-edge-line w-full max-w-7xl mx-auto my-3 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 06. FACTORY VISIT & DRAWING INQUIRY */}
      {/* ========================================================================= */}
      <div id="contact" className="folio-page max-w-7xl mx-auto px-4 sm:px-10 py-24 sm:py-32">
        <div className="scroll-reveal bg-gradient-to-br from-white via-[#fbf8f4] to-[#f4ece0] rounded-3xl p-8 sm:p-14 border border-[#decbb8] shadow-[0_20px_60px_rgba(150,100,60,0.12)] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ede3d5] border border-[#d6c4b2] text-[#8c4c1d] font-mono text-[10px] uppercase tracking-wider font-medium">
                DIRECT FACTORY DESK
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#26170f] font-normal leading-tight">
                Visit Our Factory in Gandhinagar. <br />
                <span className="rich-brown-gradient font-normal">
                  Inspect Machines, Materials & Finishes.
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-[#5c493d] font-normal leading-relaxed max-w-xl">
                We invite architects, interior designers, contractors, and homeowners to visit our plant. Walk the factory floor, see our automated CNC panel machinery in operation, and review our mock-up kitchens and wardrobes.
              </p>

              <div className="pt-2 space-y-3 font-mono text-xs">
                <div className="flex items-center gap-3 text-[#38271e]">
                  <Phone className="w-4 h-4 text-[#8c4c1d] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#7d6859] uppercase block">Direct Factory Desk</span>
                    <a href="tel:+919213518005" className="hover:text-[#8c4c1d] font-medium text-sm">
                      +91 92135 18005
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-[#38271e]">
                  <MapPin className="w-4 h-4 text-[#8c4c1d] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-[#7d6859] uppercase block">Factory & Office Address</span>
                    <span className="font-medium">
                      Plot No. A-55, GIDC, Sector 25, Gandhinagar, Gujarat 382024
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[#5c493d]">
                  <Clock className="w-4 h-4 text-[#8c4c1d] shrink-0" />
                  <span>Working Hours: Monday to Saturday, 9:30 AM – 7:00 PM</span>
                </div>
              </div>
            </div>

            {/* Simple Factory Visit Form */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#decbb8] shadow-md space-y-4">
                <h4 className="font-serif text-base text-[#26170f] font-normal">
                  Schedule Factory Visit or Submit Drawing
                </h4>
                <p className="text-[11px] text-[#7d6859] font-normal">
                  Enter your details and our technical team will reach out with directions or drawing requirements.
                </p>

                {formSubmitted ? (
                  <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                    <h5 className="font-serif text-base text-[#26170f] font-normal">
                      Inquiry Stored
                    </h5>
                    <p className="text-xs text-[#5c493d] font-normal leading-relaxed">
                      Thank you, <strong className="font-medium text-[#26170f]">{formData.name}</strong>. Your request has been recorded in our production schedule.
                    </p>
                    <p className="text-[11px] text-[#7d6859] font-mono">
                      Our factory team will contact you on {formData.phone} shortly.
                    </p>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8c4c1d]/10 hover:bg-[#8c4c1d]/20 text-[#8c4c1d] font-mono text-xs font-medium transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Submit Another Inquiry</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForm} className="space-y-3">
                    {submitError && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span>{submitError}</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-mono tracking-wider text-[#7d6859] uppercase block mb-1">
                        Your Full Name <span className="text-[#8c4c1d]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        placeholder="e.g. Rajesh Patel"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#decbb8] focus:border-[#8c4c1d] focus:bg-white text-[#26170f] text-xs outline-none transition-colors disabled:opacity-50"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-mono tracking-wider text-[#7d6859] uppercase block mb-1">
                          Mobile Number <span className="text-[#8c4c1d]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          disabled={isSubmitting}
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#decbb8] focus:border-[#8c4c1d] focus:bg-white text-[#26170f] text-xs outline-none transition-colors disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono tracking-wider text-[#7d6859] uppercase block mb-1">
                          Email Address <span className="text-[#a89587] font-normal">(Optional)</span>
                        </label>
                        <input
                          type="email"
                          disabled={isSubmitting}
                          placeholder="client@gmail.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#decbb8] focus:border-[#8c4c1d] focus:bg-white text-[#26170f] text-xs outline-none transition-colors disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono tracking-wider text-[#7d6859] uppercase block mb-1">
                          You Are
                        </label>
                        <select
                          disabled={isSubmitting}
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-2.5 py-2 rounded-xl bg-[#faf7f2] border border-[#decbb8] text-[#26170f] text-xs outline-none disabled:opacity-50"
                        >
                          <option value="Homeowner">Homeowner</option>
                          <option value="Architect">Architect</option>
                          <option value="Interior Designer">Interior Designer</option>
                          <option value="Contractor">Builder / Contractor</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono tracking-wider text-[#7d6859] uppercase block mb-1">
                          Requirement
                        </label>
                        <select
                          disabled={isSubmitting}
                          value={formData.requirement}
                          onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                          className="w-full px-2.5 py-2 rounded-xl bg-[#faf7f2] border border-[#decbb8] text-[#26170f] text-xs outline-none disabled:opacity-50"
                        >
                          <option value="Modular Kitchen">Modular Kitchen</option>
                          <option value="Wardrobes">Wardrobes</option>
                          <option value="Full Home">Full Home</option>
                          <option value="Factory Visit">Factory Visit</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono tracking-wider text-[#7d6859] uppercase block mb-1">
                        Drawing / Project Notes <span className="text-[#a89587] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        disabled={isSubmitting}
                        placeholder="e.g. 3BHK flat, ready CAD drawings available"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#decbb8] focus:border-[#8c4c1d] focus:bg-white text-[#26170f] text-xs outline-none transition-colors disabled:opacity-50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-3 rounded-xl bg-[#8c4c1d] hover:bg-[#723c14] disabled:bg-[#a67451] text-white font-medium text-xs font-mono tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Sending Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Inquiries to Factory</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
