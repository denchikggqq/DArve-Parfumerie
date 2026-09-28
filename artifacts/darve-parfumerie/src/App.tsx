import { useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Product = {
  id: string;
  name: string;
  family: string;
  category: string;
  price: string;
  notes: string;
  description: string;
  image: string;
  edition: string;
};

const products: Product[] = [
  {
    id: 'eloria',
    name: 'D’ARVÉ ÉLORIA',
    family: 'Jemná. Svetlá. Nezabudnuteľná.',
    category: 'Dámske parfumy',
    price: '89 €',
    notes: 'Hruška · kosatec · kašmírové drevo',
    description: 'Tichá žiara na pokožke. ÉLORIA začína zábleskom zrelej hrušky a pomaly sa usádza do mäkkého kosatca, ktorý zostáva blízko pri tele.',
    image: '/eloria.jpg',
    edition: 'NOVINKA 01',
  },
  {
    id: 'noir',
    name: 'D’ARVÉ NOIR',
    family: 'Hlboká. Dymová. Svojská.',
    category: 'Pánske parfumy',
    price: '95 €',
    notes: 'Čierny čaj · koža · vetiver',
    description: 'Noir je večerný podpis pre tých, ktorí nevstupujú do miestnosti bez toho, aby zanechali stopu. Suchý vetiver, koža a dymový čaj.',
    image: '/noir.jpg',
    edition: 'NOVINKA 02',
  },
  {
    id: 'lumiere',
    name: 'D’ARVÉ LUMIÈRE',
    family: 'Čistá. Žiarivá. Voľná.',
    category: 'Unisex parfumy',
    price: '92 €',
    notes: 'Bergamot · neroli · biele pižmo',
    description: 'LUMIÈRE je ranné svetlo na bielej košeli. Bergamot a neroli sa zjemnia v oblaku čistého pižma, ktoré patrí každému.',
    image: '/lumiere.jpg',
    edition: 'NOVINKA 03',
  },
  {
    id: 'selene',
    name: 'D’ARVÉ SÉLÈNE',
    family: 'Zamatová. Slobodná. Magnetická.',
    category: 'Dámske parfumy',
    price: '98 €',
    notes: 'Slivka · ruža · ambra',
    description: 'SÉLÈNE sa rozvíja pomaly ako večer. Tmavá slivka, ruža po daždi a teplá ambra v kompozícii, ktorá sa nedá prehliadnuť.',
    image: '/selene.jpg',
    edition: 'NOVINKA 04',
  },
];

const categories = ['Všetky vône', 'Dámske parfumy', 'Pánske parfumy', 'Unisex parfumy'];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('Všetky vône');
  const [searchValue, setSearchValue] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const closeOverlays = () => {
      setMenuOpen(false);
      setSearchOpen(false);
      setAccountOpen(false);
      setBagOpen(false);
    };
    window.addEventListener('resize', closeOverlays);
    return () => window.removeEventListener('resize', closeOverlays);
  }, []);

  const visibleProducts = useMemo(() => {
    const categoryFiltered = activeCategory === 'Všetky vône'
      ? products
      : products.filter((product) => product.category === activeCategory);
    if (!searchValue.trim()) return categoryFiltered;
    return categoryFiltered.filter((product) =>
      `${product.name} ${product.notes} ${product.category}`.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [activeCategory, searchValue]);

  const goTo = (target: string) => {
    setMenuOpen(false);
    setLocation('/');
    window.setTimeout(() => document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' }), 20);
  };

  const addToBag = (product: Product) => {
    setBagCount((count) => count + 1);
    setSelectedProduct(null);
    setBagOpen(true);
  };

  return (
    <main className="darve-noise min-h-[100dvh] overflow-x-hidden bg-[#ede8dd] text-[#32171f]">
      <div className="relative z-50 border-b border-[#ead7a6]/30 bg-[#32171f] px-5 py-2.5 text-center text-[10px] font-medium uppercase tracking-[0.24em] text-[#ecdcae]">
        <span data-testid="announcement-bar">Bezplatná doprava pri nákupe nad 80 € <span className="mx-2 text-[#b9934f]">·</span> Slávnostné otvorenie v Banskej Bystrici</span>
      </div>

      <header className="absolute left-0 right-0 top-[38px] z-30 border-b border-[#ead7a6]/25 text-[#f8f2e6]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 lg:px-10">
          <button type="button" onClick={() => goTo('#intro')} className="group text-left" data-testid="button-brand-home">
            <span className="block font-display text-[25px] leading-none tracking-[0.16em]">D’ARVÉ</span>
            <span className="mt-1 block text-[8px] font-medium tracking-[0.39em] text-[#e8d8ad]">PARFUMERIE</span>
          </button>

          <nav className="hidden items-center gap-8 text-[10px] font-medium uppercase tracking-[0.2em] lg:flex" aria-label="Hlavná navigácia">
            {[
              ['ÚVOD', '#intro'],
              ['O NÁS', '#story'],
              ['PARFUMY', '#parfumes'],
              ['NOVINKY', '#new'],
              ['AKCIE', '#offers'],
              ['KONTAKT', '#contact'],
            ].map(([label, target]) => (
              <button key={label} type="button" onClick={() => goTo(target)} className="line-link text-[#f8f2e6]/85 transition-colors hover:text-[#ecdcae]" data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}>
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { setSearchOpen((open) => !open); setAccountOpen(false); setBagOpen(false); }} className="rounded-full p-2 text-[#f8f2e6]/85 transition hover:bg-[#f8f2e6]/10 hover:text-[#ecdcae]" aria-label="Hľadať" data-testid="button-open-search">
              <Search size={17} strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => { setAccountOpen((open) => !open); setSearchOpen(false); setBagOpen(false); }} className="hidden rounded-full p-2 text-[#f8f2e6]/85 transition hover:bg-[#f8f2e6]/10 hover:text-[#ecdcae] sm:block" aria-label="Môj účet" data-testid="button-open-account">
              <UserRound size={17} strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => { setBagOpen((open) => !open); setSearchOpen(false); setAccountOpen(false); }} className="relative rounded-full p-2 text-[#f8f2e6]/85 transition hover:bg-[#f8f2e6]/10 hover:text-[#ecdcae]" aria-label="Nákupná taška" data-testid="button-open-bag">
              <ShoppingBag size={17} strokeWidth={1.5} />
              {bagCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b9934f] px-1 text-[9px] text-[#32171f]" data-testid="text-bag-count">{bagCount}</span>}
            </button>
            <button type="button" className="rounded-full p-2 text-[#f8f2e6] lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Otvoriť menu" data-testid="button-open-mobile-menu">
              {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-[#ead7a6]/20 bg-[#32171f] px-5 py-6 lg:hidden">
            <nav className="flex flex-col gap-4 text-[11px] uppercase tracking-[0.23em]" aria-label="Mobilná navigácia">
              {[
                ['ÚVOD', '#intro'],
                ['O NÁS', '#story'],
                ['PARFUMY', '#parfumes'],
                ['NOVINKY', '#new'],
                ['AKCIE', '#offers'],
                ['KONTAKT', '#contact'],
              ].map(([label, target]) => (
                <button key={label} type="button" onClick={() => goTo(target)} className="border-b border-[#ead7a6]/15 pb-3 text-left text-[#f8f2e6]" data-testid={`mobile-nav-${label.toLowerCase().replace(' ', '-')}`}>{label}</button>
              ))}
            </nav>
          </div>
        )}

        {searchOpen && (
          <div className="border-t border-[#ead7a6]/20 bg-[#32171f] px-5 py-4 lg:px-10">
            <div className="mx-auto flex max-w-[1440px] items-center gap-4">
              <Search size={18} className="text-[#b9934f]" />
              <input autoFocus value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Hľadajte vôňu, tón alebo kolekciu" className="w-full bg-transparent font-display text-2xl text-[#f8f2e6] outline-none placeholder:text-[#f8f2e6]/40" data-testid="input-product-search" />
              <button type="button" onClick={() => { setSearchValue(''); setSearchOpen(false); }} className="text-[#f8f2e6]/70" aria-label="Zavrieť vyhľadávanie" data-testid="button-close-search"><X size={19} /></button>
            </div>
            {searchValue && <div className="mx-auto mt-3 max-w-[1440px] text-[10px] uppercase tracking-[0.2em] text-[#e8d8ad]" data-testid="search-feedback">{visibleProducts.length ? `${visibleProducts.length} vône nájdené` : 'Žiadna vôňa nezodpovedá hľadaniu'}</div>}
          </div>
        )}
      </header>

      {accountOpen && (
        <div className="fixed right-5 top-[102px] z-40 w-[270px] bg-[#f5f0e6] p-6 text-[#32171f] shadow-2xl lg:right-10" data-testid="account-panel">
          <div className="mb-4 flex items-start justify-between"><div><p className="text-[9px] uppercase tracking-[0.22em] text-[#8d6c42]">Súkromný salón</p><h3 className="mt-1 font-display text-2xl">Vitajte v D’Arvé</h3></div><UserRound size={18} strokeWidth={1.3} /></div>
          <p className="mb-5 text-xs leading-5 text-[#704e53]">Prihláste sa a uložte si svoje obľúbené podpisové vône.</p>
          <button type="button" onClick={() => setAccountOpen(false)} className="w-full border border-[#32171f] py-3 text-[10px] uppercase tracking-[0.2em] transition hover:bg-[#32171f] hover:text-[#f5f0e6]" data-testid="button-account-signin">Prihlásiť sa</button>
          <button type="button" onClick={() => { setAccountOpen(false); goTo('#contact'); }} className="mt-3 w-full py-2 text-[10px] uppercase tracking-[0.2em] text-[#8d6c42]" data-testid="button-account-contact">Objednať konzultáciu</button>
        </div>
      )}

      {bagOpen && (
        <div className="fixed right-5 top-[102px] z-40 w-[310px] bg-[#f5f0e6] p-6 text-[#32171f] shadow-2xl lg:right-10" data-testid="bag-panel">
          <div className="mb-5 flex items-center justify-between border-b border-[#32171f]/15 pb-4"><h3 className="font-display text-2xl">Vaša taška</h3><button type="button" onClick={() => setBagOpen(false)} aria-label="Zavrieť tašku" data-testid="button-close-bag"><X size={17} /></button></div>
          {bagCount ? <><p className="text-xs leading-5 text-[#704e53]" data-testid="text-bag-status">{bagCount} {bagCount === 1 ? 'vôňa čaká' : 'vône čakajú'} na vás.</p><button type="button" onClick={() => setBagOpen(false)} className="mt-5 w-full bg-[#32171f] py-3 text-[10px] uppercase tracking-[0.2em] text-[#f5f0e6]" data-testid="button-checkout">Pokračovať k objednávke</button></> : <div className="py-5 text-center"><ShoppingBag size={28} strokeWidth={1} className="mx-auto mb-3 text-[#b9934f]" /><p className="font-display text-xl">Taška je zatiaľ prázdna</p><button type="button" onClick={() => { setBagOpen(false); goTo('#parfumes'); }} className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#8d6c42] underline underline-offset-4" data-testid="button-bag-browse">Objaviť vône</button></div>}
        </div>
      )}

      <section id="intro" className="relative flex min-h-[730px] items-end overflow-hidden bg-[#32171f] pt-40 text-[#f8f2e6] lg:min-h-[800px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(162,121,69,.24),transparent_34%),linear-gradient(110deg,#32171f_22%,#4a202b_62%,#6b4437)]" />
        <div className="absolute right-[-8%] top-[17%] h-[580px] w-[580px] rounded-full border border-[#d3af68]/25 lg:h-[730px] lg:w-[730px]" />
        <div className="absolute right-[7%] top-[28%] h-[400px] w-[400px] rounded-full border border-[#d3af68]/20 lg:h-[520px] lg:w-[520px]" />
        <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 px-5 pb-16 lg:grid-cols-[1.05fr_.95fr] lg:items-end lg:px-10 lg:pb-24">
          <div className="reveal max-w-[690px]">
            <p className="mb-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#e8d8ad]"><span className="h-px w-8 bg-[#b9934f]" />THE ART OF FRAGRANCE</p>
            <h1 className="font-display text-[clamp(4.5rem,10vw,9.7rem)] leading-[.78] tracking-[-.045em]">Objavte<br /><em className="ml-[13%] text-[#d7b06a]">svoju</em><br />vôňu.</h1>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <button type="button" onClick={() => goTo('#parfumes')} className="group flex items-center gap-5 border border-[#ecdcae] px-6 py-4 text-[10px] uppercase tracking-[0.22em] text-[#f8f2e6] transition hover:bg-[#ecdcae] hover:text-[#32171f]" data-testid="button-hero-explore">Preskúmať kolekciu <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></button>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#f8f2e6]/55">Parfumy s charakterom</span>
            </div>
          </div>
          <div className="reveal reveal-delay-2 justify-self-end lg:max-w-[330px]">
            <div className="mb-9 flex items-center gap-4 text-[10px] uppercase tracking-[0.22em] text-[#ecdcae]"><span className="h-2 w-2 rounded-full bg-[#d7b06a]" /> Nová slovenská parfuméria</div>
            <p className="font-display text-[26px] leading-[1.1] text-[#f8f2e6]">„Vôňa je najintímnejší spôsob, ako vstúpiť do miestnosti.“</p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#f8f2e6]/50">— D’Arvé parfumerie, Banská Bystrica</p>
          </div>
        </div>
        <div className="absolute bottom-7 left-5 flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-[#f8f2e6]/45 lg:left-10"><span className="h-8 w-px bg-[#d7b06a]" /> Scrollujte a vstúpte</div>
      </section>

      <section id="story" className="relative overflow-hidden bg-[#ede8dd] px-5 py-24 lg:px-10 lg:py-36">
        <div className="mx-auto grid max-w-[1240px] gap-16 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div className="reveal">
            <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.28em] text-[#8d6c42]">01 / O NÁS</p>
            <h2 className="max-w-[430px] font-display text-[clamp(3rem,5vw,5.4rem)] leading-[.88] text-[#32171f]">Parfum ako<br /><em>podpis.</em></h2>
          </div>
          <div className="relative max-w-[570px] lg:justify-self-end">
            <span className="absolute -left-8 -top-12 font-display text-7xl text-[#b9934f]/30">“</span>
            <p className="font-display text-3xl leading-[1.1] text-[#32171f] lg:text-[42px]">D’Arvé vzniklo z presvedčenia, že luxus nemusí kričať.</p>
            <p className="mt-8 max-w-[440px] text-sm leading-7 text-[#6e4c50]">Tvoríme vône pre ľudí, ktorí si vyberajú pomaly. Každá kompozícia je malý rituál — od prvého nádychu po stopu, ktorá zostane, keď už ste dávno odišli.</p>
            <button type="button" onClick={() => goTo('#contact')} className="line-link mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.23em] text-[#32171f]" data-testid="button-story-contact">Navštíviť náš salón <ArrowUpRight size={15} /></button>
          </div>
        </div>
        <div className="mx-auto mt-24 max-w-[1240px] border-y border-[#32171f]/15 py-5">
          <div className="grid grid-cols-2 gap-8 text-[9px] uppercase tracking-[0.2em] text-[#8d6c42] sm:grid-cols-4">
            <span><strong className="block font-display text-2xl font-normal text-[#32171f]">01</strong>Slovenský pôvod</span>
            <span><strong className="block font-display text-2xl font-normal text-[#32171f]">24h</strong>Vývoj vône</span>
            <span><strong className="block font-display text-2xl font-normal text-[#32171f]">EDP</strong>Koncentrácia</span>
            <span><strong className="block font-display text-2xl font-normal text-[#32171f]">100%</strong>Váš charakter</span>
          </div>
        </div>
      </section>

      <section id="parfumes" className="bg-[#f5f0e6] px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div><p className="mb-5 text-[10px] font-medium uppercase tracking-[0.28em] text-[#8d6c42]">02 / KOLEKCIA</p><h2 className="font-display text-[clamp(3.2rem,5.8vw,6.5rem)] leading-[.82] text-[#32171f]">Vyberte si<br /><em>svoj tón.</em></h2></div>
            <div className="max-w-[300px] text-sm leading-6 text-[#704e53]">Štyri nálady, štyri príbehy. Nechajte sa viesť tým, čo chcete povedať bez jediného slova.</div>
          </div>
          <div className="mb-10 flex gap-5 overflow-x-auto border-b border-[#32171f]/15 pb-4 text-[10px] uppercase tracking-[0.18em]">
            {categories.map((category) => <button type="button" key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 pb-1 transition ${activeCategory === category ? 'border-b border-[#32171f] text-[#32171f]' : 'text-[#8d6c42] hover:text-[#32171f]'}`} data-testid={`button-filter-${category.toLowerCase().replaceAll(' ', '-')}`}>{category}</button>)}
          </div>
          <div className="grid gap-x-5 gap-y-16 sm:grid-cols-2 lg:grid-cols-4" data-testid="product-grid">
            {visibleProducts.map((product, index) => (
              <article key={product.id} className={`product-card group ${index % 2 ? 'lg:mt-16' : ''}`} data-testid={`card-product-${product.id}`}>
                <button type="button" onClick={() => setSelectedProduct(product)} className="block w-full text-left" data-testid={`button-view-${product.id}`}>
                  <div className={`relative aspect-[.78] overflow-hidden ${index % 2 ? 'bg-[#e8ded4]' : 'bg-[#e9e4d9]'}`}>
                    <img src={product.image} alt={`${product.name} Eau de Parfum`} className="product-image h-full w-full object-cover" />
                    <span className="absolute left-4 top-4 text-[9px] uppercase tracking-[0.18em] text-[#32171f]/70">{product.edition}</span>
                    <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#32171f]/25 bg-[#f5f0e6]/70 opacity-0 transition group-hover:opacity-100"><ArrowUpRight size={15} /></span>
                  </div>
                  <div className="pt-5"><div className="mb-2 flex items-start justify-between gap-3"><h3 className="font-display text-[25px] leading-none text-[#32171f]">{product.name}</h3><span className="text-xs text-[#704e53]">{product.price}</span></div><p className="text-[10px] uppercase tracking-[0.13em] text-[#8d6c42]">{product.family}</p><p className="mt-3 text-xs text-[#704e53]">{product.notes}</p></div>
                </button>
                <button type="button" onClick={() => setSelectedProduct(product)} className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#32171f]" data-testid={`button-quick-view-${product.id}`}>Objaviť vôňu <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></button>
              </article>
            ))}
          </div>
          {!visibleProducts.length && <div className="border border-dashed border-[#32171f]/25 py-20 text-center" data-testid="empty-search-state"><Sparkles className="mx-auto mb-4 text-[#b9934f]" size={24} strokeWidth={1.3} /><p className="font-display text-2xl">Skúste inú stopu.</p><p className="mt-2 text-xs text-[#704e53]">Vôňu s týmto menom zatiaľ nemáme v salóne.</p></div>}
        </div>
      </section>

      <section id="new" className="relative overflow-hidden bg-[#32171f] px-5 py-24 text-[#f8f2e6] lg:px-10 lg:py-32">
        <div className="absolute -right-20 top-0 h-[440px] w-[440px] rounded-full border border-[#b9934f]/25" />
        <div className="relative mx-auto grid max-w-[1240px] gap-16 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
          <div><p className="mb-5 text-[10px] uppercase tracking-[0.28em] text-[#e8d8ad]">03 / NOVINKY</p><h2 className="font-display text-[clamp(3.3rem,6vw,7rem)] leading-[.8]">Práve<br /><em className="text-[#d7b06a]">prichádza.</em></h2><p className="mt-8 max-w-[330px] text-sm leading-6 text-[#f8f2e6]/60">Nové kompozície, ktoré ešte voňajú po laboratóriu. Spoznajte ich ako prví.</p></div>
          <div className="grid gap-8 sm:grid-cols-2"><div className="border-l border-[#b9934f] pl-5"><span className="text-[10px] uppercase tracking-[0.2em] text-[#e8d8ad]">Kolekcia 2024</span><p className="mt-4 font-display text-3xl">ÉLORIA</p><p className="mt-2 text-xs leading-5 text-[#f8f2e6]/55">Hruška, kosatec a kašmírové drevo pre chvíle, ktoré nechcete vysvetľovať.</p></div><div className="border-l border-[#b9934f] pl-5"><span className="text-[10px] uppercase tracking-[0.2em] text-[#e8d8ad]">Kolekcia 2024</span><p className="mt-4 font-display text-3xl">NOIR</p><p className="mt-2 text-xs leading-5 text-[#f8f2e6]/55">Dymový čaj, koža a vetiver. Intenzita, ktorá nepotrebuje zvýšiť hlas.</p></div></div>
        </div>
      </section>

      <section id="offers" className="bg-[#b9934f] px-5 py-20 text-[#32171f] lg:px-10 lg:py-28">
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-10 lg:flex-row lg:items-center">
          <div><p className="mb-4 text-[10px] font-medium uppercase tracking-[0.29em]">04 / SLÁVNOSTNÉ OTVORENIE</p><h2 className="font-display text-[clamp(3rem,6vw,6.7rem)] leading-[.82]">−15 %<br /><em>na prvú vôňu.</em></h2></div>
          <div className="max-w-[370px]"><p className="text-sm leading-6">Pri príležitosti otvorenia nášho prvého salónu v Banskej Bystrici získate 15 % zľavu na prvý nákup. Stačí prísť, chvíľu zostať a nájsť svoj podpis.</p><button type="button" onClick={() => goTo('#contact')} className="mt-7 flex items-center gap-3 border border-[#32171f] px-6 py-4 text-[10px] uppercase tracking-[0.22em] transition hover:bg-[#32171f] hover:text-[#ecdcae]" data-testid="button-offer-visit">Navštíviť salón <ArrowRight size={15} /></button></div>
        </div>
      </section>

      <section id="contact" className="bg-[#ede8dd] px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[1fr_1fr]">
          <div><p className="mb-5 text-[10px] font-medium uppercase tracking-[0.28em] text-[#8d6c42]">05 / KONTAKT</p><h2 className="font-display text-[clamp(3.3rem,6vw,6.5rem)] leading-[.82] text-[#32171f]">Zastavte sa<br /><em>osobne.</em></h2><p className="mt-8 max-w-[380px] text-sm leading-6 text-[#704e53]">Svet vôní sa nedá objaviť cez obrazovku. V našom salóne vám pomôžeme nájsť tú, ktorá bude znieť ako vy.</p></div>
          <div className="grid gap-8 sm:grid-cols-2 lg:pt-12">
            <div><MapPin size={18} strokeWidth={1.3} className="mb-5 text-[#8d6c42]" /><p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#8d6c42]">Nájdete nás</p><p className="font-display text-2xl">Dolná 12<br />974 01 Banská Bystrica</p><button type="button" onClick={() => window.open('https://maps.google.com/?q=Dolná+12+Banská+Bystrica', '_blank', 'noopener,noreferrer')} className="line-link mt-5 text-[10px] uppercase tracking-[0.2em]" data-testid="button-open-map">Otvoriť mapu</button></div>
            <div><Clock3 size={18} strokeWidth={1.3} className="mb-5 text-[#8d6c42]" /><p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#8d6c42]">Otváracie hodiny</p><p className="font-display text-2xl">Po — Pi &nbsp; 10:00 — 18:00<br />So &nbsp; 10:00 — 14:00</p><p className="mt-5 text-xs text-[#704e53]">Nedeľa zatvorené</p></div>
          </div>
        </div>
      </section>

      <footer className="bg-[#32171f] px-5 py-14 text-[#f8f2e6] lg:px-10">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1fr_.8fr_.8fr]">
          <div><p className="font-display text-4xl tracking-[0.1em]">D’ARVÉ</p><p className="mt-2 text-[9px] uppercase tracking-[0.33em] text-[#e8d8ad]">PARFUMERIE</p><p className="mt-8 max-w-[280px] text-xs leading-5 text-[#f8f2e6]/50">Scent as identity. Ticho, ktoré zostane v pamäti.</p></div>
          <div><p className="mb-5 text-[10px] uppercase tracking-[0.22em] text-[#e8d8ad]">Objavujte</p><div className="flex flex-col items-start gap-3 text-xs text-[#f8f2e6]/70"><button type="button" onClick={() => goTo('#parfumes')} data-testid="footer-link-parfumes">Parfumy</button><button type="button" onClick={() => goTo('#story')} data-testid="footer-link-story">O nás</button><button type="button" onClick={() => goTo('#contact')} data-testid="footer-link-contact">Kontakt</button></div></div>
          <div><p className="mb-5 text-[10px] uppercase tracking-[0.22em] text-[#e8d8ad]">D’Arvé list</p>{subscribed ? <p className="flex items-center gap-2 text-xs text-[#ecdcae]" data-testid="newsletter-success"><Check size={15} /> Ďakujeme, ste v zozname.</p> : <><p className="mb-4 text-xs leading-5 text-[#f8f2e6]/55">Pozvánky do salónu a nové kompozície. Žiadny hluk.</p><form onSubmit={(event) => { event.preventDefault(); if (email.trim()) setSubscribed(true); }} className="flex border-b border-[#f8f2e6]/35 pb-2"><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Váš e-mail" className="w-full bg-transparent text-xs outline-none placeholder:text-[#f8f2e6]/40" data-testid="input-newsletter-email" /><button type="submit" aria-label="Prihlásiť sa do newslettera" data-testid="button-newsletter-submit"><ArrowRight size={16} /></button></form></>}</div>
        </div>
        <div className="mx-auto mt-16 flex max-w-[1240px] flex-col justify-between gap-5 border-t border-[#f8f2e6]/15 pt-5 text-[9px] uppercase tracking-[0.16em] text-[#f8f2e6]/40 sm:flex-row"><span>© 2024 D’Arvé Parfumerie</span><span className="flex items-center gap-2"><Instagram size={13} /> @darve.parfumerie</span><span>Slovensko / EU</span></div>
      </footer>

      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#32171f]/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Detail vône ${selectedProduct.name}`} data-testid="quick-view-overlay">
          <div className="modal-in relative grid max-h-[92vh] w-full max-w-[850px] overflow-y-auto bg-[#f5f0e6] text-[#32171f] sm:grid-cols-2">
            <button type="button" onClick={() => setSelectedProduct(null)} className="absolute right-4 top-4 z-10 rounded-full bg-[#f5f0e6]/70 p-2" aria-label="Zavrieť detail" data-testid="button-close-quick-view"><X size={18} /></button>
            <div className="aspect-[.82] min-h-[370px] bg-[#e8ded4] sm:min-h-full"><img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-cover" /></div>
            <div className="flex flex-col justify-center p-8 lg:p-12"><p className="text-[10px] uppercase tracking-[0.25em] text-[#8d6c42]">{selectedProduct.edition} / {selectedProduct.category}</p><h2 className="mt-4 font-display text-5xl leading-[.85]">{selectedProduct.name.replace('D’ARVÉ ', '')}</h2><p className="mt-4 font-display text-2xl text-[#8d6c42]">{selectedProduct.family}</p><div className="my-8 border-y border-[#32171f]/15 py-5"><p className="text-[10px] uppercase tracking-[0.2em] text-[#8d6c42]">Olfaktorická pyramída</p><p className="mt-3 text-sm leading-6 text-[#704e53]">{selectedProduct.notes}</p></div><p className="text-sm leading-6 text-[#704e53]">{selectedProduct.description}</p><div className="mt-9 flex items-center justify-between"><span className="font-display text-3xl">{selectedProduct.price}</span><button type="button" onClick={() => addToBag(selectedProduct)} className="flex items-center gap-3 bg-[#32171f] px-5 py-4 text-[10px] uppercase tracking-[0.18em] text-[#f5f0e6] transition hover:bg-[#6f303e]" data-testid={`button-add-to-bag-${selectedProduct.id}`}>Pridať do tašky <Plus size={15} /></button></div><p className="mt-4 text-[9px] uppercase tracking-[0.18em] text-[#8d6c42]">Eau de Parfum · 50 ml</p></div>
          </div>
        </div>
      )}
    </main>
  );
}

function Router() {
  return (
    <ErrorBoundary resetKey={useLocation()[0]}>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={Home} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;