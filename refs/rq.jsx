import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  ChevronRight, 
  Search, 
  Heart, 
  Package, 
  Truck, 
  ArrowLeft,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Phone,
  Home,
  FileText,
  ShieldCheck,
  PlayCircle,
  Info,
  Download,
  CheckCircle,
  Camera,
  User,
  Map,
  CreditCard,
  Upload,
  QrCode,
  Wallet,
  ChevronDown,
  ChevronUp,
  Building,
  HelpCircle
} from 'lucide-react';

// --- MOCK DATA ---
const BRANCHES = [
  { id: 1, name: 'Bandung Raya' },
  { id: 2, name: 'Jakarta Raya' },
  { id: 3, name: 'Bogor' },
  { id: 4, name: 'Solo' },
  { id: 5, name: 'Semarang' },
];

const PRODUCTS = {
  ANTAR: [
    { id: 101, type: 'DOMBA', typeName: 'Domba Tipe B', weight: '23-25 Kg', price: 2100000, img: 'https://images.pexels.com/photos/288621/pexels-photo-288621.jpeg?auto=compress&cs=tinysrgb&w=600', desc: 'Domba jantan sehat, cukup umur, dan dirawat secara profesional. Harga sudah termasuk biaya pemeliharaan hingga hari raya.' },
    { id: 102, type: 'SAPI_UTUH', typeName: 'Sapi Limousin', weight: '250-300 Kg', price: 24000000, img: 'https://images.pexels.com/photos/4553258/pexels-photo-4553258.jpeg?auto=compress&cs=tinysrgb&w=600', desc: 'Sapi kualitas super dengan daging padat. Cocok untuk qurban keluarga besar. Gratis ongkos kirim ke wilayah tertentu.' },
    { id: 103, type: 'SAPI_1_7', typeName: 'Sapi 1/7 (Kolektif)', weight: 'Kolektif', price: 3500000, img: 'https://images.pexels.com/photos/840111/pexels-photo-840111.jpeg?auto=compress&cs=tinysrgb&w=600', desc: 'Solusi qurban sapi dengan cara patungan 7 orang. Kami yang akan mencarikan kelompok patungan Anda.' },
  ],
  BERBAGI: [
    { id: 201, type: 'SAPI_1_7', typeName: 'Qurban Berbagi Sapi di Desa Oebufu', location: 'Kupang, NTT', target: 80, current: 40, price: 1700000, img: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=600', desc: 'Penyaluran qurban untuk saudara kita di pelosok Kupang yang jarang menikmati daging qurban.' },
    { id: 202, type: 'DOMBA', typeName: 'Qurban Berbagi Domba', location: 'Brebes, Jateng', target: 50, current: 35, price: 1750000, img: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=600', desc: 'Penyaluran untuk santri dan dhuafa di pelosok Brebes.' },
  ],
  KALENG: [
    { id: 301, type: 'SAPI_UTUH', typeName: 'Qurban Kaleng Rendang Sapi', weight: '250 Kaleng', price: 18000000, img: 'https://images.pexels.com/photos/6544383/pexels-photo-6544383.jpeg?auto=compress&cs=tinysrgb&w=600', desc: 'Praktis dan tahan lama. Qurban Anda diolah menjadi rendang kaleng steril yang mudah didistribusikan.' },
    { id: 302, type: 'DOMBA', typeName: 'Qurban Kaleng Kornet Domba', weight: '35 Kaleng', price: 2500000, img: 'https://images.pexels.com/photos/5923979/pexels-photo-5923979.jpeg?auto=compress&cs=tinysrgb&w=600', desc: 'Olahan kornet domba berkualitas yang disalurkan sebagai cadangan pangan darurat.' },
  ]
};

const PAYMENT_CATEGORIES = [
  {
    id: 'qris',
    title: 'QRIS',
    subtitle: '*Dicek Otomatis',
    examples: 'QRIS',
    options: [
      { id: 'qris_all', name: 'QRIS (Gopay, OVO, Dana, LinkAja, dll)', type: 'qris' }
    ]
  },
  {
    id: 'va',
    title: 'Bank Transfer Otomatis',
    subtitle: '*Dicek Otomatis',
    examples: 'VA Mandiri, VA BCA, VA BSI, VA Permata...',
    options: [
      { id: 'va_mandiri', name: 'VA Mandiri', type: 'va', bank: 'Mandiri' },
      { id: 'va_bca', name: 'VA BCA', type: 'va', bank: 'BCA' },
      { id: 'va_bsi', name: 'VA BSI', type: 'va', bank: 'BSI' },
      { id: 'va_bri', name: 'VA BRI', type: 'va', bank: 'BRI' }
    ]
  },
  {
    id: 'ewallet',
    title: 'eWallet',
    subtitle: '*Dicek Otomatis',
    examples: 'Gopay, ShopeePay, OVO, DANA...',
    options: [
      { id: 'ewallet_gopay', name: 'GoPay', type: 'ewallet' },
      { id: 'ewallet_ovo', name: 'OVO', type: 'ewallet' },
      { id: 'ewallet_dana', name: 'DANA', type: 'ewallet' }
    ]
  },
  {
    id: 'transfer',
    title: 'Transfer Bank Manual',
    subtitle: 'Verifikasi manual dengan upload bukti',
    examples: 'Mandiri, BCA',
    options: [
      { id: 'tf_mandiri', name: 'Transfer Bank Mandiri', type: 'transfer', bank: 'Mandiri', account: '131 000 7965 835' },
      { id: 'tf_bca', name: 'Transfer Bank BCA', type: 'transfer', bank: 'BCA', account: '008 123 4567 890' }
    ]
  }
];

const FAQ_DATA = [
  {
    category: 'Qurban Antar',
    icon: <Truck size={16} />,
    questions: [
      { q: 'Harga, Berat, dan data lain Hewan?', a: 'Detail tersebut dapat Anda lihat langsung di dalam katalog aplikasi saat Anda memilih produk yang diinginkan.' },
      { q: 'Lokasi kandangnya dimana?', a: 'Kandang utama kami untuk wilayah Bandung berada di daerah Cimenyan.' },
      { q: 'Apakah Ada Ongkir untuk Luar Kota?', a: 'Free Ongkir (gratis ongkos kirim) berlaku khusus untuk wilayah Bandung Raya dan Jakarta Raya.' },
      { q: 'Apakah hewannya ada Surat Keterangan Sehat?', a: 'Ada dong. Semua hewan kami dijamin kesehatannya.' },
      { q: 'Bagaimana Sistem Pembayarannya?', a: 'Anda dapat transfer ke Rekening resmi kami. Boleh DP Minimal 50% untuk mengikat harga, dan pelunasan paling lambat H-7 sebelum pengiriman hewan.' }
    ]
  },
  {
    category: 'Qurban Berbagi',
    icon: <Heart size={16} />,
    questions: [
      { q: 'Daerah penyalurannya dimana saja?', a: 'Tersebar di beberapa wilayah Jawa Barat, Jawa Tengah, Jawa Timur, dan NTT. Secara spesifik berada di: Kab. Bandung, Majalengka, Brebes, Magelang, Bojonegoro, dan Kupang.' },
      { q: 'Spesifikasi hewan seperti apa?', a: 'Untuk Domba rata-rata berbobot 21 - 25 Kg. Sedangkan untuk Sapi berbobot 200 - 250 Kg.' },
      { q: 'Waktu penyembelihan kapan saja?', a: 'Penyembelihan dilakukan mulai dari Hari H Idul Adha sampai dengan Hari Tasyrik ke-3.' },
      { q: 'Dokumentasi seperti apa yang dikirimkan ke konsumen?', a: 'Konsumen akan menerima 4 laporan: 1. Foto Hewan Hidup, 2. Video Penyembelihan, 3. Foto Penyaluran, 4. Sertifikat Qurban.' },
      { q: 'Notifikasi apa saja yang diterima Konsumen?', a: 'Anda akan menerima update berupa: Notif Pembayaran, Verifikasi Data, Lokasi & Waktu Penyembelihan, Report Proses, hingga Ucapan Terima Kasih.' },
      { q: 'Apa saja Hak Pequrban?', a: 'Hak Anda meliputi: Mendapatkan notifikasi selama proses qurban, Report dokumentasi, Video penyembelihan, dan Sertifikat Qurban.' },
      { q: 'Kenapa Qurban Berbagi lebih murah dibanding Antar/Kaleng?', a: 'Karena hewannya dibeli langsung dari desa dan disebar langsung di desa tersebut. Ini adalah bentuk kepedulian kami berkolaborasi dengan warga desa dan menekan biaya logistik.' },
      { q: 'Berapa keluaran daging qurbannya?', a: 'Domba menghasilkan sekitar 3,5 - 4 Kg daging. Sapi menghasilkan sekitar 45 - 50 Kg daging.' },
      { q: 'Berapa jumlah paket yang dibagikan ke warga?', a: '1 Ekor Domba menjadi 10 - 15 paket daging. 1 Ekor Sapi menjadi 70 - 90 paket daging.' }
    ]
  },
  {
    category: 'Qurban Kaleng',
    icon: <Package size={16} />,
    questions: [
      { q: 'Berapa Output Kaleng yang dihasilkan?', a: 'SAPI STANDAR (±200kg): Kornet 350 klg / Rendang 250 klg. SAPI PREMIUM (±330kg): Kornet 550 klg / Rendang 450 klg. DOMBA: Kornet 35 klg / Rendang 25 klg.' },
      { q: 'Berapa lama sampai ke Pequrban/Mitra?', a: 'Estimasi untuk Domba 1 bulan, dan Sapi 2 bulan. Termasuk rentang proses boning, frozen, hingga masuk kaleng.' },
      { q: 'Pabriknya dimana?', a: 'Pabrik pengolahan kami berada di wilayah Tangerang.' },
      { q: 'Berapa lama pengerjaan pengalengan?', a: 'Maksimal 2 Bulan, tergantung pada antrian pemrosesan di pabrik.' },
      { q: 'Berapa Gram isi 1 kaleng?', a: 'Isi kemasan kaleng untuk sapi maupun domba adalah ±200 gram.' },
      { q: 'Berapa Minimum Order untuk produk kaleng?', a: 'Minimal pemesanan untuk Sapi adalah 5 Ekor. Untuk Domba adalah 30 Ekor.' },
      { q: 'Apakah boleh pakai label/merk mitra sendiri?', a: 'Bisa, namun tidak memiliki izin edar komersial (seperti BPOM), sehingga peruntukannya khusus untuk dibagikan secara gratis.' },
      { q: 'Pengiriman kaleng boleh ke berapa titik lokasi?', a: 'Mohon maaf, pengiriman hanya kami lakukan untuk 1 titik pengiriman saja.' }
    ]
  }
];

export default function RumahQurbanApp() {
  const [view, setView] = useState('home'); 
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [activeTab, setActiveTab] = useState('ANTAR');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [participants, setParticipants] = useState([{ name: '', fatherName: '' }]);
  const [customerData, setCustomerData] = useState({ name: '', phone: '', address: '', lat: '', lng: '' });
  const [isSlaughterRequested, setIsSlaughterRequested] = useState(false);

  // States for Checkout & Payments
  const [showMap, setShowMap] = useState(false);
  const [mapSearchInput, setMapSearchInput] = useState('');
  const [isMapSearched, setIsMapSearched] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [expandedPaymentCategory, setExpandedPaymentCategory] = useState(null);
  const [vaAccordion, setVaAccordion] = useState('atm');

  // States for Tracker, Dokumentasi, and FAQ
  const [trackerInput, setTrackerInput] = useState('');
  const [isTrackerSearched, setIsTrackerSearched] = useState(false);
  const [dokumenInput, setDokumenInput] = useState('');
  const [isDokumenSearched, setIsDokumenSearched] = useState(false);
  const [faqActiveTab, setFaqActiveTab] = useState('Qurban Berbagi');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Memoize Map Iframe to prevent re-rendering and typing lag
  const osmMapIframe = useMemo(() => (
    <iframe 
      title="OSM Map"
      width="100%" 
      height="180" 
      frameBorder="0" 
      scrolling="no" 
      marginHeight="0" 
      marginWidth="0" 
      src="https://www.openstreetmap.org/export/embed.html?bbox=106.0,-8.0,109.0,-6.0&layer=mapnik" 
    ></iframe>
  ), []);

  const formatIDR = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const getMaxParticipants = (type) => {
    if (type === 'SAPI_UTUH') return 7;
    return 1;
  };

  const handleAddParticipant = () => {
    if (participants.length < getMaxParticipants(selectedProduct?.type)) {
      setParticipants([...participants, { name: '', fatherName: '' }]);
    }
  };

  const handleRemoveParticipant = (index) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
  };

  const handleParticipantChange = (index, field, value) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

  const calculateTotal = () => {
    return (selectedProduct?.price || 0) + 
           (activeTab === 'ANTAR' ? 50000 : 0) + 
           (isSlaughterRequested ? 100000 : 0);
  };

  // -- Views --

  const HomeView = () => (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-20">
      <header className="bg-white px-5 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <Heart className="text-red-700 fill-red-700" size={24} />
          <span className="font-bold text-xl text-slate-800 tracking-tight">rumah<span className="text-red-700">qurban</span></span>
        </div>
        <button className="bg-green-50 text-green-700 py-1.5 rounded-md flex items-center gap-1 text-xs font-bold px-3 border border-green-200">
          <Phone size={14} /> CS
        </button>
      </header>

      <div className="relative bg-slate-900 text-white p-6 pb-12 pt-10">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
           <img src="https://images.pexels.com/photos/840111/pexels-photo-840111.jpeg?auto=compress&cs=tinysrgb&w=800" className="w-full h-full object-cover" alt="Qurban Farm" />
        </div>
        <div className="relative z-10">
          <span className="bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">Qurban 2026</span>
          <h1 className="text-3xl font-bold mt-4 leading-tight">Kembalikan Manfaat,<br/>Qurban ke Desa</h1>
          <p className="mt-2 text-slate-300 text-sm line-clamp-2">Lembaga penyedia layanan qurban terpercaya dengan berbagai pilihan hewan dan jangkauan luas.</p>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-5 border border-slate-200">
          <div className="text-center mb-4">
            <h2 className="font-extrabold text-slate-800 text-lg">Mulai Pesan Qurban Anda</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium bg-slate-50 py-1 px-2 rounded inline-block">Pilih kategori di bawah untuk melihat katalog</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => { setActiveTab('ANTAR'); setView('branch_selection'); }} className="flex flex-col items-center p-2 rounded-xl active:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 group">
              <div className="bg-blue-50 text-blue-900 p-3.5 rounded-full mb-2 group-active:scale-95 transition-transform">
                <Truck size={24} />
              </div>
              <span className="text-xs font-bold text-slate-700 text-center leading-tight">Qurban<br/>Antar</span>
            </button>
            <button onClick={() => { setActiveTab('BERBAGI'); setView('catalog'); }} className="flex flex-col items-center p-2 rounded-xl active:bg-red-50 transition-colors border border-transparent hover:border-red-100 group">
              <div className="bg-red-50 text-red-700 p-3.5 rounded-full mb-2 group-active:scale-95 transition-transform">
                <Heart size={24} />
              </div>
              <span className="text-xs font-bold text-slate-700 text-center leading-tight">Qurban<br/>Berbagi</span>
            </button>
            <button onClick={() => { setActiveTab('KALENG'); setView('catalog'); }} className="flex flex-col items-center p-2 rounded-xl active:bg-amber-50 transition-colors border border-transparent hover:border-amber-100 group">
              <div className="bg-amber-50 text-amber-700 p-3.5 rounded-full mb-2 group-active:scale-95 transition-transform">
                <Package size={24} />
              </div>
              <span className="text-xs font-bold text-slate-700 text-center leading-tight">Qurban<br/>Kaleng</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 px-5">
        <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">Telah Dipercaya Oleh</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#1e3a5f]">35.898+</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Pequrban</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#1e3a5f]">275.810+</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Penerima Manfaat</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white py-6 px-5 border-y border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-5 text-center">Kebermanfaatan Rumah Qurban</h2>
        <div className="grid grid-cols-2 gap-y-6">
          <div className="flex flex-col items-center text-center">
            <ShieldCheck size={28} className="text-[#1e3a5f] mb-2" />
            <span className="text-xs font-semibold text-slate-600">Sesuai Syariat</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <FileText size={28} className="text-[#1e3a5f] mb-2" />
            <span className="text-xs font-semibold text-slate-600">Sertifikat Resmi</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <PlayCircle size={28} className="text-[#1e3a5f] mb-2" />
            <span className="text-xs font-semibold text-slate-600">Video Dokumentasi</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <MapPin size={28} className="text-[#1e3a5f] mb-2" />
            <span className="text-xs font-semibold text-slate-600">Tepat Sasaran</span>
          </div>
        </div>
      </div>
    </div>
  );

  const BranchSelectionView = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => setView('home')} className="text-slate-600 p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-slate-800 text-lg">Mau Qurban Dimana?</h1>
      </header>
      
      <div className="p-4 space-y-3 overflow-y-auto pb-20">
        <p className="text-sm text-slate-500 mb-2 px-1">Pilih cabang terdekat untuk melihat stok dan harga Qurban Antar di wilayah Anda.</p>
        {BRANCHES.map(branch => (
          <button 
            key={branch.id}
            onClick={() => { setSelectedBranch(branch); setView('catalog'); }}
            className="w-full bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between active:scale-95 transition-transform"
          >
            <span className="font-semibold text-slate-800">{branch.name}</span>
            <ChevronRight className="text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );

  const CatalogView = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-[#1e3a5f] text-white px-4 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('home')} className="p-1">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-tight">
              {activeTab === 'ANTAR' ? 'Qurban Antar' : activeTab === 'BERBAGI' ? 'Qurban Berbagi' : 'Qurban Kaleng'}
            </h1>
            {activeTab === 'ANTAR' && selectedBranch && (
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin size={10}/> {selectedBranch.name}
              </p>
            )}
          </div>
        </div>
        <Search size={20} className="text-slate-200" />
      </header>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
        {PRODUCTS[activeTab].map(item => (
          <div 
            key={item.id} 
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden active:bg-slate-50"
            onClick={() => { setSelectedProduct(item); setView('product_detail'); }}
          >
            <img src={item.img} alt={item.typeName} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-slate-800 mb-1">{item.typeName}</h3>
              
              {activeTab === 'BERBAGI' ? (
                <div className="mb-3">
                  <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                    <MapPin size={14}/> {item.location}
                  </p>
                  <div className="w-full bg-slate-100 rounded-sm h-2 mb-1">
                    <div className="bg-red-600 h-2 rounded-sm" style={{ width: `${(item.current / item.target) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 font-semibold">
                    <span>Terkumpul: {item.current}</span>
                    <span>Sisa: {item.target - item.current}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 mb-3">{item.weight}</p>
              )}

              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-red-700 text-lg">{formatIDR(item.price)}</span>
                <span className="text-xs text-[#1e3a5f] font-bold border border-[#1e3a5f] px-3 py-1.5 rounded-sm">Detail</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProductDetailView = () => (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <header className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between">
        <button onClick={() => setView('catalog')} className="bg-black/40 backdrop-blur-md text-white p-2 rounded-md">
          <ArrowLeft size={20} />
        </button>
      </header>
      
      <div className="flex-1 overflow-y-auto pb-28">
        <img src={selectedProduct?.img} alt="Product" className="w-full h-72 object-cover" />
        
        <div className="bg-white p-5 rounded-t-xl -mt-4 relative z-10 shadow-sm border-t border-slate-200">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold text-slate-800">{selectedProduct?.typeName}</h1>
          </div>
          <p className="text-2xl font-bold text-red-700 mb-4">{formatIDR(selectedProduct?.price || 0)}</p>
          
          {activeTab === 'BERBAGI' && (
             <div className="bg-slate-50 border border-slate-200 p-4 rounded-md mb-4">
               <p className="text-sm text-slate-600 flex items-center gap-1 mb-3 font-semibold">
                 <MapPin size={16}/> Lokasi: {selectedProduct?.location}
               </p>
               <div className="w-full bg-slate-200 rounded-sm h-2.5 mb-2">
                 <div className="bg-red-600 h-2.5 rounded-sm" style={{ width: `${((selectedProduct?.current || 0) / (selectedProduct?.target || 1)) * 100}%` }}></div>
               </div>
               <div className="flex justify-between text-sm text-slate-500 font-semibold">
                 <span>Terkumpul: {selectedProduct?.current} / {selectedProduct?.target}</span>
               </div>
             </div>
          )}

          <div className="border-t border-slate-100 pt-4 mb-4">
            <h3 className="font-bold text-slate-800 mb-2">Deskripsi</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {selectedProduct?.desc}
            </p>
            {activeTab !== 'BERBAGI' && (
              <p className="text-slate-600 text-sm mt-2">
                <span className="font-semibold text-slate-800">Spesifikasi/Berat:</span> {selectedProduct?.weight}
              </p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3 border border-blue-100">
            <Info className="text-blue-700 shrink-0 mt-0.5" size={20} />
            <p className="text-xs text-blue-800">Harga sudah termasuk biaya perawatan. Sertifikat dan video penyembelihan akan dikirim otomatis ke WhatsApp Anda.</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 px-5 shadow-sm flex gap-3">
        <button 
          onClick={() => {
            setParticipants([{ name: '', fatherName: '' }]);
            setIsSlaughterRequested(false);
            setPaymentMethod(null); 
            setView('checkout');
          }}
          className="w-full bg-red-700 text-white py-3 rounded-md font-bold active:bg-red-800 transition-colors text-lg"
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );

  const PaymentSelectionView = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
        <button onClick={() => setView('checkout')} className="text-slate-600 p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-slate-800 text-lg">Metode Pembayaran</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 bg-slate-100">
        {PAYMENT_CATEGORIES.map(category => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <button 
              onClick={() => setExpandedPaymentCategory(expandedPaymentCategory === category.id ? null : category.id)}
              className="w-full p-4 flex justify-between items-center text-left focus:outline-none"
            >
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{category.title}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{category.subtitle}</p>
                <p className="text-[10px] text-red-600 mt-1 font-semibold">{category.examples}</p>
              </div>
              <ChevronRight 
                size={20} 
                className={`text-slate-400 transition-transform ${expandedPaymentCategory === category.id ? 'rotate-90' : ''}`} 
              />
            </button>
            
            {expandedPaymentCategory === category.id && (
              <div className="border-t border-slate-100 bg-slate-50">
                {category.options.map(option => (
                  <button 
                    key={option.id}
                    onClick={() => { 
                      setPaymentMethod(option); 
                      setView('checkout'); 
                    }}
                    className="w-full p-4 border-b border-slate-200 last:border-b-0 flex items-center justify-between text-left active:bg-slate-100 transition-colors"
                  >
                    <span className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                      {option.type === 'va' && <Building size={16} className="text-slate-400"/>}
                      {option.type === 'transfer' && <CreditCard size={16} className="text-slate-400"/>}
                      {option.type === 'ewallet' && <Wallet size={16} className="text-slate-400"/>}
                      {option.type === 'qris' && <QrCode size={16} className="text-slate-400"/>}
                      {option.name}
                    </span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const CheckoutView = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => setView('product_detail')} className="text-slate-600 p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-slate-800 text-lg">Checkout Pesanan</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        
        <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <h2 className="font-bold text-[#1e3a5f] border-b pb-2 mb-3 flex items-center gap-2">
            <User size={18}/> Data Pemesan
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Nama Lengkap</label>
              <input 
                type="text" 
                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:border-[#1e3a5f] outline-none bg-slate-50" 
                placeholder="Masukkan nama" 
                defaultValue={customerData.name} 
                onBlur={(e) => setCustomerData({...customerData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">No. WhatsApp Aktif</label>
              <input 
                type="tel" 
                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:border-[#1e3a5f] outline-none bg-slate-50" 
                placeholder="08123xxx" 
                defaultValue={customerData.phone} 
                onBlur={(e) => setCustomerData({...customerData, phone: e.target.value})}
              />
            </div>
            {activeTab === 'ANTAR' && (
              <div className="relative">
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Alamat Pengiriman</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-md p-2 text-sm focus:border-[#1e3a5f] outline-none h-20 bg-slate-50" 
                  placeholder="Alamat lengkap tujuan kirim" 
                  defaultValue={customerData.address} 
                  onBlur={(e) => setCustomerData({...customerData, address: e.target.value})}
                />
                
                <button onClick={() => setShowMap(!showMap)} className="text-[#1e3a5f] font-semibold text-xs flex items-center mt-2 cursor-pointer hover:underline">
                  <Map size={14} className="mr-1" /> {showMap ? 'Tutup Peta' : 'Pilih Titik di Peta untuk Presisi (Opsional)'}
                </button>
                {showMap && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex gap-2 mb-3">
                      <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                          id="mapSearchInput"
                          type="text" 
                          placeholder="Cari jalan atau area..." 
                          className="w-full border border-slate-300 rounded-md py-2 pl-8 pr-2 text-xs focus:border-[#1e3a5f] outline-none bg-white"
                          defaultValue={mapSearchInput}
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const val = document.getElementById('mapSearchInput')?.value || '';
                          setMapSearchInput(val);
                          setIsMapSearched(true);
                        }}
                        className="bg-[#1e3a5f] text-white px-3 py-2 rounded-md text-xs font-bold active:bg-blue-900 transition-colors"
                      >
                        Cari
                      </button>
                    </div>
                    
                    <div className="rounded-md overflow-hidden border border-slate-300 shadow-inner relative bg-slate-200">
                      {osmMapIframe}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-4">
                        <MapPin size={32} className={`text-red-600 drop-shadow-md transition-transform ${isMapSearched ? 'animate-bounce' : ''}`} />
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center text-[10px] text-slate-500 bg-white p-2 rounded border border-slate-200">
                      <span>Lat: <b className="text-slate-700">{isMapSearched ? '-6.89123' : (customerData.lat || '-')}</b></span>
                      <span>Long: <b className="text-slate-700">{isMapSearched ? '107.60351' : (customerData.lng || '-')}</b></span>
                    </div>

                    <button 
                      className="w-full mt-3 bg-green-600 text-white py-2.5 text-xs font-bold rounded-md active:bg-green-700 transition-colors flex items-center justify-center gap-2" 
                      onClick={() => {
                        if(isMapSearched) {
                          setCustomerData({...customerData, lat: '-6.89123', lng: '107.60351'});
                        }
                        setShowMap(false);
                      }}
                    >
                      <CheckCircle2 size={16} /> Simpan Titik Lokasi
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="border-b pb-2 mb-3">
            <h2 className="font-bold text-[#1e3a5f] flex items-center gap-2">
              <Heart size={18}/> Data Peserta Qurban
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Atas nama qurban (Maksimal: {getMaxParticipants(selectedProduct?.type)})
            </p>
          </div>

          {participants.map((p, index) => (
            <div key={index} className="mb-4 last:mb-0 relative bg-blue-50/50 p-3 rounded-md border border-blue-100">
              {participants.length > 1 && (
                <button onClick={() => handleRemoveParticipant(index)} className="absolute top-3 right-3 text-slate-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              )}
              <h3 className="text-[10px] font-bold text-blue-800 mb-2 uppercase tracking-wider">Peserta Ke-{index + 1}</h3>
              <div className="space-y-2">
                <input 
                  type="text" 
                  className="w-full border-b border-slate-300 bg-transparent py-1 text-sm outline-none focus:border-[#1e3a5f]" 
                  placeholder="Nama yang berqurban" 
                  defaultValue={p.name} 
                  onBlur={(e) => handleParticipantChange(index, 'name', e.target.value)}
                />
                <input 
                  type="text" 
                  className="w-full border-b border-slate-300 bg-transparent py-1 text-sm outline-none focus:border-[#1e3a5f]" 
                  placeholder="Bin / Binti (Nama Ayah)" 
                  defaultValue={p.fatherName} 
                  onBlur={(e) => handleParticipantChange(index, 'fatherName', e.target.value)}
                />
              </div>
            </div>
          ))}

          {participants.length < getMaxParticipants(selectedProduct?.type) && (
            <button onClick={handleAddParticipant} className="w-full mt-3 py-2 border border-dashed border-[#1e3a5f] text-[#1e3a5f] font-semibold rounded-md flex items-center justify-center gap-2 active:bg-blue-50 text-sm">
              <PlusCircle size={16} /> Tambah Nama Lainnya
            </button>
          )}
        </section>

        {activeTab === 'ANTAR' && (
          <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
             <h2 className="font-bold text-[#1e3a5f] border-b pb-2 mb-3">Opsi Pengiriman & Jasa</h2>
             <label className="flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-slate-50">
                <input 
                  type="checkbox" 
                  className="mt-1 w-4 h-4 text-red-600 rounded-sm border-gray-300 focus:ring-red-500"
                  checked={isSlaughterRequested}
                  onChange={(e) => setIsSlaughterRequested(e.target.checked)}
                />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Bantu Sembelih & Potong</p>
                  <p className="text-xs text-slate-500 mt-0.5">+ Rp 100.000 / Ekor</p>
                </div>
             </label>
             <div className="mt-3 p-3 bg-slate-50 rounded-md border border-slate-100">
               <p className="text-xs text-slate-600"><span className="font-semibold">Ongkos Kirim:</span> Rp 50.000 (Area {selectedBranch?.name})</p>
             </div>
          </section>
        )}

        <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
           <h2 className="font-bold text-[#1e3a5f] border-b pb-2 mb-3 flex items-center gap-2">
             <CreditCard size={18}/> Pilih Metode Pembayaran
           </h2>
           <button 
             onClick={() => setView('payment_selection')}
             className="w-full border border-slate-300 rounded-md p-3.5 flex justify-between items-center bg-slate-50 active:bg-slate-100 transition-colors"
           >
             {paymentMethod ? (
               <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                 <CheckCircle size={16} className="text-green-600"/>
                 {paymentMethod.name}
               </span>
             ) : (
               <span className="text-slate-500 text-sm font-semibold">Pilih Pembayaran...</span>
             )}
             <ChevronRight size={18} className="text-slate-400" />
           </button>
        </section>

      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-semibold text-slate-600">Total Tagihan</p>
          <p className="text-xl font-bold text-red-700">
            {formatIDR(calculateTotal())}
          </p>
        </div>
        <button 
          onClick={() => {
            if(paymentMethod) setView('payment_instruction');
          }}
          disabled={!paymentMethod}
          className={`w-full py-3 rounded-md font-bold transition-colors text-center shadow-md ${paymentMethod ? 'bg-[#1e3a5f] text-white active:bg-blue-900' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        >
          {paymentMethod ? 'Bayar' : 'Pilih Pembayaran'}
        </button>
      </div>
    </div>
  );

  const PaymentInstructionView = () => {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
          <button onClick={() => setView('checkout')} className="text-slate-600 p-1">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-slate-800 text-lg">Instruksi Pembayaran</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 text-center">
            <p className="text-xs font-semibold text-slate-500 mb-1">Selesaikan Pembayaran</p>
            <p className="text-2xl font-bold text-red-700 mb-3">{formatIDR(calculateTotal())}</p>
            <div className="inline-block border border-orange-200 bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full mb-2">
              Batas Waktu: 23:59:59
            </div>
            <p className="text-xs text-slate-500 mt-2">No. Pesanan: <b>INV-2506032850</b></p>
          </div>

          <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
             
             <div className="flex items-center justify-between border-b pb-3 mb-4">
                <span className="text-sm font-bold text-slate-800">{paymentMethod?.name}</span>
                {paymentMethod?.type === 'va' && <Building size={20} className="text-slate-400"/>}
                {paymentMethod?.type === 'transfer' && <CreditCard size={20} className="text-slate-400"/>}
                {paymentMethod?.type === 'ewallet' && <Wallet size={20} className="text-slate-400"/>}
                {paymentMethod?.type === 'qris' && <QrCode size={20} className="text-slate-400"/>}
             </div>

             {paymentMethod?.type === 'transfer' && (
               <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                 <p className="text-xs text-slate-600 mb-1">Silakan transfer ke rekening:</p>
                 <div className="flex items-center gap-2 mb-1 mt-2">
                   <div className="px-2 py-1 bg-blue-800 rounded flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white uppercase">{paymentMethod.bank}</span>
                   </div>
                   <p className="font-bold text-slate-800 text-lg tracking-wider">{paymentMethod.account}</p>
                 </div>
                 <p className="text-xs text-slate-500 mb-4">a.n Rumah Qurban Indonesia</p>
                 
                 <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#1e3a5f]/40 rounded-md p-4 cursor-pointer hover:bg-blue-50 transition-colors bg-white">
                   <Upload size={20} className="text-[#1e3a5f] mb-2"/>
                   <span className="text-sm text-slate-700 font-semibold">Upload Bukti Transfer</span>
                   <span className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG, atau PDF</span>
                   <input type="file" className="hidden" accept="image/*,.pdf" />
                 </label>
               </div>
             )}

             {paymentMethod?.type === 'va' && (
               <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Nomor Virtual Account {paymentMethod.bank}:</p>
                  <div className="flex items-center justify-between mb-4 mt-1">
                     <p className="font-bold text-slate-800 tracking-widest text-xl">8808 1234 5678 9012</p>
                  </div>
                  
                  <p className="text-xs font-bold text-slate-700 mb-2">Panduan Pembayaran</p>
                  <div className="space-y-2">
                     <div className="border border-slate-200 rounded-md bg-white overflow-hidden shadow-sm">
                        <button onClick={() => setVaAccordion(vaAccordion === 'atm' ? '' : 'atm')} className="w-full text-left p-3 text-sm font-semibold flex justify-between items-center text-slate-700">
                          Via ATM {paymentMethod.bank} {vaAccordion === 'atm' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {vaAccordion === 'atm' && (
                          <div className="p-3 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50">
                            1. Masukkan kartu ATM dan PIN Anda.<br/>
                            2. Pilih menu <b>Bayar/Beli</b> atau <b>Transfer</b>.<br/>
                            3. Pilih <b>Virtual Account</b>.<br/>
                            4. Masukkan Nomor VA Anda: <b>8808 1234 5678 9012</b>.<br/>
                            5. Konfirmasi pembayaran.
                          </div>
                        )}
                     </div>
                     <div className="border border-slate-200 rounded-md bg-white overflow-hidden shadow-sm">
                        <button onClick={() => setVaAccordion(vaAccordion === 'mbanking' ? '' : 'mbanking')} className="w-full text-left p-3 text-sm font-semibold flex justify-between items-center text-slate-700">
                          Via Mobile Banking {vaAccordion === 'mbanking' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {vaAccordion === 'mbanking' && (
                          <div className="p-3 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50">
                            1. Buka aplikasi M-Banking Anda.<br/>
                            2. Pilih menu <b>Pembayaran</b> / <b>Virtual Account</b>.<br/>
                            3. Masukkan Nomor VA Anda dan tekan Lanjut.<br/>
                            4. Cek nominal tagihan.<br/>
                            5. Masukkan PIN transaksi Anda.
                          </div>
                        )}
                     </div>
                  </div>
               </div>
             )}

             {paymentMethod?.type === 'ewallet' && (
               <div className="bg-slate-50 p-4 rounded-md border border-slate-200 text-center">
                   <Wallet size={32} className="text-slate-400 mx-auto mb-3" />
                   <p className="text-sm text-slate-700 font-semibold mb-3">Selesaikan di Aplikasi {paymentMethod.name}</p>
                   <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-full shadow-sm active:scale-95 text-sm font-bold text-slate-800">
                     Buka Aplikasi {paymentMethod.name}
                   </button>
                   <p className="text-[10px] text-slate-500 mt-4">Pastikan saldo Anda cukup untuk melakukan pembayaran.</p>
               </div>
             )}

             {paymentMethod?.type === 'qris' && (
               <div className="flex flex-col items-center bg-slate-50 p-4 rounded-md border border-slate-200">
                   <p className="text-sm font-bold text-slate-800 mb-2">Scan QRIS Berikut</p>
                   <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 mb-3">
                     <QrCode size={120} className="text-slate-800"/>
                   </div>
                   <p className="text-xs text-slate-600 text-center px-4">Gunakan aplikasi M-Banking atau E-Wallet pendukung QRIS untuk menscan kode ini.</p>
                   <button className="mt-3 text-[#1e3a5f] text-xs font-bold border border-[#1e3a5f] px-3 py-1.5 rounded-full hover:bg-blue-50">Unduh QR Code</button>
               </div>
             )}
          </section>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          <button 
            onClick={() => setView('success')}
            className="w-full py-3 rounded-md font-bold transition-colors text-center shadow-md bg-green-600 text-white active:bg-green-700"
          >
            Saya Sudah Bayar
          </button>
        </div>
      </div>
    );
  };

  const SuccessView = () => (
    <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6 text-center">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 w-full">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
        </div>
        <h1 className="text-lg font-bold text-slate-800 mb-2">Pesanan Berhasil Diproses!</h1>
        <p className="text-slate-500 text-sm mb-6">
          Terima kasih {customerData.name || 'Kak'}. Kami akan memverifikasi pembayaran Anda segera.
        </p>
        
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-md mb-6 text-left">
          <p className="text-xs font-semibold text-slate-500 mb-1">Total Transaksi</p>
          <p className="font-bold text-red-700 text-xl mb-3">
            {formatIDR(calculateTotal())}
          </p>
          <div className="h-px bg-slate-200 w-full mb-3"></div>
          <p className="text-xs font-semibold text-slate-500 mb-1">No. Invoice Pesanan</p>
          <p className="font-bold text-slate-800 text-lg tracking-wider">INV-2506032850</p>
        </div>

        <button 
          onClick={() => {
            setTrackerInput('INV-2506032850');
            setIsTrackerSearched(true);
            setView('tracker');
          }}
          className="w-full bg-[#1e3a5f] text-white py-3 rounded-md font-bold shadow-sm mb-3"
        >
          Lacak Pesanan Saya
        </button>
        <button 
          onClick={() => {
            setView('home');
            setSelectedProduct(null);
            setCustomerData({ name: '', phone: '', address: '', lat: '', lng: '' });
            setPaymentMethod(null);
          }}
          className="w-full text-slate-500 py-3 rounded-md font-bold text-sm"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );

  const TrackerView = () => {
    if (!isTrackerSearched) {
      return (
        <div className="flex flex-col h-full bg-slate-50">
          <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
            <h1 className="font-bold text-slate-800 text-lg">Lacak Pesanan</h1>
          </header>
          <div className="flex-1 p-6 flex flex-col items-center justify-center pb-24">
            <div className="bg-blue-50 p-4 rounded-full mb-5">
              <Truck size={48} className="text-[#1e3a5f]" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">Lacak Pengiriman & Qurban</h2>
            <p className="text-center text-sm text-slate-500 mb-6 px-4">Masukkan nomor invoice yang Anda terima melalui WhatsApp untuk memantau status pesanan.</p>
            
            <div className="w-full">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Nomor Invoice</label>
              <input 
                type="text" 
                placeholder="Contoh: INV-2506032850" 
                className="w-full border border-slate-300 rounded-md p-3.5 mb-4 outline-none focus:border-[#1e3a5f] bg-white font-semibold text-slate-800"
                defaultValue={trackerInput}
                onBlur={(e) => setTrackerInput(e.target.value)}
              />
              <button 
                onClick={() => { if(trackerInput.trim() !== '') setIsTrackerSearched(true) }}
                className="w-full bg-[#1e3a5f] text-white py-3.5 rounded-md font-bold active:bg-blue-900 transition-colors shadow-sm"
              >
                Cari Pesanan
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-slate-50">
        <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
          <button onClick={() => setIsTrackerSearched(false)} className="text-slate-600 p-1">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-slate-800 text-lg">Detail Lacak</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4">
             <p className="text-xs text-slate-500 font-semibold mb-1">No. Invoice</p>
             <p className="font-bold text-slate-800 text-lg">{trackerInput || 'INV-2506032850'}</p>
             <p className="text-sm text-slate-600 mt-2">Atas Nama: <span className="font-semibold">{customerData.name || 'Hadid Amirul Arifin'}</span></p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-800 mb-5 text-sm border-b pb-2">Status Penyaluran</h2>
            
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100 flex items-center justify-center">
                  <CheckCircle size={10} className="text-white"/>
                </span>
                <h3 className="font-bold text-sm text-slate-800">Pesanan Dibuat</h3>
                <p className="text-xs text-slate-500 mt-1">26 Mei 2026, 10:00 WIB</p>
              </div>
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100 flex items-center justify-center">
                  <CheckCircle size={10} className="text-white"/>
                </span>
                <h3 className="font-bold text-sm text-slate-800">Pembayaran Diterima</h3>
                <p className="text-xs text-slate-500 mt-1">26 Mei 2026, 11:15 WIB</p>
              </div>
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-100 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                </span>
                <h3 className="font-bold text-sm text-blue-800">Alokasi Hewan (Kandang)</h3>
                <p className="text-xs text-slate-500 mt-1 mb-2">Hewan qurban Anda telah disiapkan dengan Nomor Eartag/Tag:</p>
                <span className="inline-block bg-slate-100 border border-slate-300 px-3 py-1 rounded-sm text-sm font-bold tracking-widest text-slate-700">
                  TAG-2268
                </span>
              </div>
              <div className="relative pl-6 opacity-50">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 ring-4 ring-slate-50"></span>
                <h3 className="font-bold text-sm text-slate-600">Proses Penyembelihan</h3>
                <p className="text-xs text-slate-500 mt-1">Menunggu jadwal potong</p>
              </div>
              <div className="relative pl-6 opacity-50">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 ring-4 ring-slate-50"></span>
                <h3 className="font-bold text-sm text-slate-600">Dikirim / Disalurkan</h3>
                <p className="text-xs text-slate-500 mt-1">Estimasi H+1 Idul Adha</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const DokumentasiView = () => {
    if (!isDokumenSearched) {
      return (
        <div className="flex flex-col h-full bg-slate-50">
          <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
            <h1 className="font-bold text-slate-800 text-lg">Dokumen & Sertifikat</h1>
          </header>
          <div className="flex-1 p-6 flex flex-col items-center justify-center pb-24">
            <div className="bg-amber-50 p-4 rounded-full mb-5">
              <FileText size={48} className="text-amber-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">Sertifikat & Dokumentasi</h2>
            <p className="text-center text-sm text-slate-500 mb-6 px-4">Masukkan nomor invoice untuk mengunduh e-sertifikat qurban dan melihat galeri dokumentasi.</p>
            
            <div className="w-full">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Nomor Invoice</label>
              <input 
                type="text" 
                placeholder="Contoh: INV-2506032850" 
                className="w-full border border-slate-300 rounded-md p-3.5 mb-4 outline-none focus:border-[#1e3a5f] bg-white font-semibold text-slate-800"
                defaultValue={dokumenInput}
                onBlur={(e) => setDokumenInput(e.target.value)}
              />
              <button 
                onClick={() => { if(dokumenInput.trim() !== '') setIsDokumenSearched(true) }}
                className="w-full bg-[#1e3a5f] text-white py-3.5 rounded-md font-bold active:bg-blue-900 transition-colors shadow-sm"
              >
                Cari Dokumen
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-slate-50">
        <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
          <button onClick={() => setIsDokumenSearched(false)} className="text-slate-600 p-1">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-slate-800 text-lg">Dokumentasi Anda</h1>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
               <div className="bg-amber-100 text-amber-700 p-2 rounded-md">
                 <ShieldCheck size={20} />
               </div>
               <div>
                 <h2 className="font-bold text-slate-800 text-sm">Sertifikat Qurban</h2>
                 <p className="text-xs text-slate-500">Telah diterbitkan</p>
               </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-center">
              <h3 className="text-sm font-bold text-slate-700">Atas Nama</h3>
              <p className="text-lg font-bold text-[#1e3a5f] mt-1">{customerData.name || 'Hadid Amirul Arifin'}</p>
              <p className="text-xs text-slate-500 mb-4">Bin Redi Waluyo</p>
              <button className="flex items-center justify-center gap-2 w-full bg-white border border-slate-300 text-slate-700 py-2 rounded-md text-sm font-semibold hover:bg-slate-50 active:bg-slate-100">
                <Download size={16} /> Unduh Sertifikat (PDF)
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
               <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
                 <Camera size={20} />
               </div>
               <div>
                 <h2 className="font-bold text-slate-800 text-sm">Dokumentasi Lapangan</h2>
                 <p className="text-xs text-slate-500">Eartag: TAG-2268</p>
               </div>
            </div>
            
            <p className="text-xs text-slate-600 mb-2 font-semibold">Galeri Foto</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <img src="https://images.pexels.com/photos/288621/pexels-photo-288621.jpeg?auto=compress&cs=tinysrgb&w=400" className="w-full h-24 object-cover rounded-md border border-slate-200 shadow-sm" alt="Sebelum 1"/>
              <img src="https://images.pexels.com/photos/4553258/pexels-photo-4553258.jpeg?auto=compress&cs=tinysrgb&w=400" className="w-full h-24 object-cover rounded-md border border-slate-200 shadow-sm" alt="Sebelum 2"/>
              <img src="https://images.pexels.com/photos/6544383/pexels-photo-6544383.jpeg?auto=compress&cs=tinysrgb&w=400" className="w-full h-24 object-cover rounded-md border border-slate-200 shadow-sm" alt="Daging 1"/>
              <img src="https://images.pexels.com/photos/5923979/pexels-photo-5923979.jpeg?auto=compress&cs=tinysrgb&w=400" className="w-full h-24 object-cover rounded-md border border-slate-200 shadow-sm" alt="Daging 2"/>
            </div>

            <p className="text-xs text-slate-600 mb-2 font-semibold mt-2">Daftar Video Penyembelihan</p>
            <div className="space-y-3">
              <div className="relative w-full h-32 bg-slate-900 rounded-md flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">
                 <img src="https://images.pexels.com/photos/840111/pexels-photo-840111.jpeg?auto=compress&cs=tinysrgb&w=400" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Video Sembelih"/>
                 <PlayCircle size={40} className="text-white relative z-10 opacity-90" />
                 <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/60 px-2 py-1 rounded">📹 Proses Penyembelihan</span>
              </div>
              <div className="relative w-full h-32 bg-slate-900 rounded-md flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">
                 <img src="https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=400" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Video Cacah"/>
                 <PlayCircle size={40} className="text-white relative z-10 opacity-90" />
                 <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/60 px-2 py-1 rounded">📹 Pencacahan & Timbang</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const FAQView = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10 border-b border-slate-200">
        <h1 className="font-bold text-slate-800 text-lg">Tanya Jawab (FAQ)</h1>
      </header>

      <div className="flex px-4 py-3 gap-2 bg-white overflow-x-auto no-scrollbar border-b border-slate-200 sticky top-[60px] z-10">
        {FAQ_DATA.map(category => (
          <button
            key={category.category}
            onClick={() => { setFaqActiveTab(category.category); setExpandedFaq(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors ${
              faqActiveTab === category.category 
                ? 'bg-[#1e3a5f] text-white shadow-sm' 
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {category.icon}
            {category.category}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 overflow-y-auto pb-24">
         {FAQ_DATA.find(c => c.category === faqActiveTab)?.questions.map((faq, idx) => (
           <div key={idx} className="mb-3 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <button 
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full text-left p-4 text-sm font-bold text-slate-700 flex justify-between items-center bg-white active:bg-slate-50"
              >
                <span className="pr-4 leading-snug">{faq.q}</span>
                {expandedFaq === idx ? <ChevronUp size={18} className="text-slate-400 shrink-0"/> : <ChevronDown size={18} className="text-slate-400 shrink-0"/>}
              </button>
              {expandedFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
           </div>
         ))}
      </div>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap');
        .font-source-sans { font-family: 'Source Sans Pro', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      
      <div className="font-source-sans bg-slate-100 min-h-screen w-full flex flex-col">
        <div className="w-full max-w-md mx-auto h-screen bg-slate-50 relative flex flex-col shadow-xl sm:border-x sm:border-slate-200">
          
          <div className="flex-1 relative overflow-hidden bg-slate-50">
            {view === 'home' && HomeView()}
            {view === 'branch_selection' && BranchSelectionView()}
            {view === 'catalog' && CatalogView()}
            {view === 'product_detail' && ProductDetailView()}
            {view === 'checkout' && CheckoutView()}
            {view === 'payment_selection' && PaymentSelectionView()}
            {view === 'payment_instruction' && PaymentInstructionView()}
            {view === 'success' && SuccessView()}
            {view === 'tracker' && TrackerView()}
            {view === 'dokumentasi' && DokumentasiView()}
            {view === 'faq' && FAQView()}
          </div>

          {['home', 'catalog', 'tracker', 'dokumentasi', 'faq'].includes(view) && (
            <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 pb-5 pt-3 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
              <button onClick={() => setView('home')} className={`flex flex-col items-center ${view === 'home' ? 'text-red-700' : 'text-slate-400 hover:text-slate-600'}`}>
                <Home size={22} className="mb-1" />
                <span className="text-[10px] font-bold">Beranda</span>
              </button>
              <button onClick={() => setView('faq')} className={`flex flex-col items-center ${view === 'faq' ? 'text-red-700' : 'text-slate-400 hover:text-slate-600'}`}>
                <HelpCircle size={22} className="mb-1" />
                <span className="text-[10px] font-bold">FAQ</span>
              </button>
              <button onClick={() => setView('tracker')} className={`flex flex-col items-center ${view === 'tracker' ? 'text-red-700' : 'text-slate-400 hover:text-slate-600'}`}>
                <Truck size={22} className="mb-1" />
                <span className="text-[10px] font-bold">Lacak</span>
              </button>
              <button onClick={() => setView('dokumentasi')} className={`flex flex-col items-center ${view === 'dokumentasi' ? 'text-red-700' : 'text-slate-400 hover:text-slate-600'}`}>
                <FileText size={22} className="mb-1" />
                <span className="text-[10px] font-bold">Dokumen</span>
              </button>
            </nav>
          )}

        </div>
      </div>
    </>
  );
}