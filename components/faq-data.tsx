import { Truck, Heart, Package } from "lucide-react";
import type { ReactNode } from "react";

export const FAQ_DATA: {
  category: string;
  icon: ReactNode;
  questions: { q: string; a: string }[];
}[] = [
  {
    category: "Qurban Antar",
    icon: <Truck size={16} />,
    questions: [
      {
        q: "Harga, Berat, dan data lain Hewan?",
        a: "Detail tersebut dapat Anda lihat langsung di dalam katalog aplikasi saat Anda memilih produk yang diinginkan.",
      },
      {
        q: "Lokasi kandangnya dimana?",
        a: "Kandang utama kami untuk wilayah Bandung berada di daerah Cimenyan.",
      },
      {
        q: "Apakah Ada Ongkir untuk Luar Kota?",
        a: "Free Ongkir (gratis ongkos kirim) berlaku khusus untuk wilayah Bandung Raya dan Jakarta Raya.",
      },
      {
        q: "Apakah hewannya ada Surat Keterangan Sehat?",
        a: "Ada dong. Semua hewan kami dijamin kesehatannya.",
      },
      {
        q: "Bagaimana Sistem Pembayarannya?",
        a: "Anda dapat transfer ke Rekening resmi kami. Boleh DP Minimal 50% untuk mengikat harga, dan pelunasan paling lambat H-7 sebelum pengiriman hewan.",
      },
    ],
  },
  {
    category: "Qurban Berbagi",
    icon: <Heart size={16} />,
    questions: [
      {
        q: "Daerah penyalurannya dimana saja?",
        a: "Tersebar di beberapa wilayah Jawa Barat, Jawa Tengah, Jawa Timur, dan NTT. Secara spesifik berada di: Kab. Bandung, Majalengka, Brebes, Magelang, Bojonegoro, dan Kupang.",
      },
      {
        q: "Spesifikasi hewan seperti apa?",
        a: "Untuk Domba rata-rata berbobot 21 - 25 Kg. Sedangkan untuk Sapi berbobot 200 - 250 Kg.",
      },
      {
        q: "Waktu penyembelihan kapan saja?",
        a: "Penyembelihan dilakukan mulai dari Hari H Idul Adha sampai dengan Hari Tasyrik ke-3.",
      },
      {
        q: "Dokumentasi seperti apa yang dikirimkan ke konsumen?",
        a: "Konsumen akan menerima 4 laporan: 1. Foto Hewan Hidup, 2. Video Penyembelihan, 3. Foto Penyaluran, 4. Sertifikat Qurban.",
      },
      {
        q: "Notifikasi apa saja yang diterima Konsumen?",
        a: "Anda akan menerima update berupa: Notif Pembayaran, Verifikasi Data, Lokasi & Waktu Penyembelihan, Report Proses, hingga Ucapan Terima Kasih.",
      },
      {
        q: "Apa saja Hak Pequrban?",
        a: "Hak Anda meliputi: Mendapatkan notifikasi selama proses qurban, Report dokumentasi, Video penyembelihan, dan Sertifikat Qurban.",
      },
      {
        q: "Kenapa Qurban Berbagi lebih murah dibanding Antar/Kaleng?",
        a: "Karena hewannya dibeli langsung dari desa dan disebar langsung di desa tersebut. Ini adalah bentuk kepedulian kami berkolaborasi dengan warga desa dan menekan biaya logistik.",
      },
      {
        q: "Berapa keluaran daging qurbannya?",
        a: "Domba menghasilkan sekitar 3,5 - 4 Kg daging. Sapi menghasilkan sekitar 45 - 50 Kg daging.",
      },
      {
        q: "Berapa jumlah paket yang dibagikan ke warga?",
        a: "1 Ekor Domba menjadi 10 - 15 paket daging. 1 Ekor Sapi menjadi 70 - 90 paket daging.",
      },
    ],
  },
  {
    category: "Qurban Kaleng",
    icon: <Package size={16} />,
    questions: [
      {
        q: "Berapa Output Kaleng yang dihasilkan?",
        a: "SAPI STANDAR (±200kg): Kornet 350 klg / Rendang 250 klg. SAPI PREMIUM (±330kg): Kornet 550 klg / Rendang 450 klg. DOMBA: Kornet 35 klg / Rendang 25 klg.",
      },
      {
        q: "Berapa lama sampai ke Pequrban/Mitra?",
        a: "Estimasi untuk Domba 1 bulan, dan Sapi 2 bulan. Termasuk rentang proses boning, frozen, hingga masuk kaleng.",
      },
      {
        q: "Pabriknya dimana?",
        a: "Pabrik pengolahan kami berada di wilayah Tangerang.",
      },
      {
        q: "Berapa lama pengerjaan pengalengan?",
        a: "Maksimal 2 Bulan, tergantung pada antrian pemrosesan di pabrik.",
      },
      {
        q: "Berapa Gram isi 1 kaleng?",
        a: "Isi kemasan kaleng untuk sapi maupun domba adalah ±200 gram.",
      },
      {
        q: "Berapa Minimum Order untuk produk kaleng?",
        a: "Minimal pemesanan untuk Sapi adalah 5 Ekor. Untuk Domba adalah 30 Ekor.",
      },
      {
        q: "Apakah boleh pakai label/merk mitra sendiri?",
        a: "Bisa, namun tidak memiliki izin edar komersial (seperti BPOM), sehingga peruntukannya khusus untuk dibagikan secara gratis.",
      },
      {
        q: "Pengiriman kaleng boleh ke berapa titik lokasi?",
        a: "Mohon maaf, pengiriman hanya kami lakukan untuk 1 titik pengiriman saja.",
      },
    ],
  },
];
