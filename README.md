# Earthquake Monitoring WebGIS

Aplikasi WebGIS untuk memantau persebaran gempa bumi terkini di wilayah Indonesia dan sekitarnya, sekaligus memungkinkan pengguna menandai dan mengelola area pantauan (rawan bencana) secara mandiri melalui peta interaktif.

🔗 **Live demo:** https://nextjs-earthquake-webgis.vercel.app

## Latar Belakang

Informasi gempa dari sumber publik sering kali disajikan dalam bentuk tabel atau teks yang kurang intuitif untuk dipahami secara spasial. Aplikasi ini dibuat untuk menampilkan data gempa dalam bentuk peta interaktif, sekaligus memberi ruang bagi pengguna untuk mendokumentasikan area-area yang perlu dipantau (misalnya zona rawan banjir atau longsor) dalam bentuk titik maupun polygon, yang tersimpan secara permanen dan dapat diakses kembali.

## Teknologi yang Digunakan

- **Next.js** (App Router) — framework React untuk membangun aplikasi web
- **TypeScript** — memastikan keamanan tipe data di seluruh aplikasi
- **Leaflet** & **react-leaflet** — pustaka peta interaktif
- **leaflet-draw** — alat gambar titik dan polygon di atas peta
- **Supabase** — database (PostgreSQL) untuk menyimpan data area pantauan
- **Tailwind CSS** — styling
- **Vercel** — platform deployment

## Sumber API Publik

Data gempa diambil secara real-time dari **USGS Earthquake Hazards Program**:

https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson


## Fitur Aplikasi

- Peta interaktif dengan basemap OpenStreetMap, berpusat di wilayah Indonesia
- Visualisasi data gempa terkini (24 jam terakhir) sebagai titik pada peta, dengan ukuran dan warna yang menyesuaikan nilai magnitudo
- Popup informasi gempa: lokasi, magnitudo, kedalaman, dan waktu kejadian
- Indikator status pengambilan data (memuat / berhasil / gagal)
- Alat gambar titik dan polygon langsung di atas peta
- Form pengisian nama, kategori, dan deskripsi setelah menggambar area
- Penyimpanan area pantauan ke database Supabase (format geometri GeoJSON)
- Area pantauan tersimpan otomatis dimuat kembali saat halaman dibuka/di-refresh
- Sidebar daftar seluruh area pantauan dengan tombol untuk mengarahkan peta ke area terkait
- Ekspor area pantauan individual ke file `.geojson`
- Panel info ringkas: jumlah gempa ditampilkan, jumlah area pantauan, dan waktu pembaruan data terakhir
- Tampilan responsif untuk desktop dan mobile

## Cara Menjalankan Project

1. Clone repository ini

git clone https://github.com/ptriayuauliaa-tech/nextjs-earthquake-webgis.git
cd nextjs-earthquake-webgis

2. Install dependencies

npm install

3. Buat file `.env.local` dan isi sesuai konfigurasi Supabase (lihat bagian Environment Variable di bawah)
4. Jalankan development server

npm run dev

5. Buka `http://localhost:3000` di browser

## Konfigurasi Environment Variable

NEXT_PUBLIC_SUPABASE_URL=<url_project_supabase_anda>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable_key_supabase_anda>


Nilai-nilai ini dapat diperoleh dari dashboard Supabase pada menu **Settings → API Keys**.

## Struktur Project (Singkat)

src/
├── app/ # Routing utama (Next.js App Router)
├── components/
│ ├── layout/ # Header, Sidebar, SummaryBar
│ └── map/ # Komponen peta, kontrol gambar, form area
├── hooks/ # Custom hooks (fetch gempa, fetch area pantauan)
├── lib/
│ ├── api/ # Fungsi pengambilan data dari USGS
│ ├── supabase/ # Koneksi ke Supabase
│ └── utils/ # Fungsi bantu (format tanggal, warna magnitudo, export)
└── types/ # Definisi tipe data TypeScript


## Struktur Data Polygon

Area pantauan disimpan dalam tabel `monitoring_areas` di Supabase:

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` | ID unik, dibuat otomatis |
| `name` | `text` | Nama area pantauan |
| `description` | `text` | Deskripsi (opsional) |
| `category` | `text` | Kategori/jenis area |
| `geometry` | `jsonb` | Bentuk geometri dalam format GeoJSON (Point atau Polygon) |
| `created_at` | `timestamptz` | Waktu pembuatan, otomatis terisi |

## Kendala dan Solusi Selama Pengembangan

- **Isu Server-Side Rendering pada Leaflet** — diatasi dengan `"use client"` dan `next/dynamic` (`ssr: false`).
- **Urutan koordinat GeoJSON vs Leaflet** — GeoJSON `[longitude, latitude]`, Leaflet `[latitude, longitude]`, dibalik secara eksplisit saat render.
- **Konflik `leaflet-draw` dengan React Strict Mode** — diatasi dengan menonaktifkan `reactStrictMode` di `next.config.ts`.
- **Ikon marker default Leaflet tidak termuat (404)** — diatasi dengan mengarahkan ikon ke CDN.
- **Kesalahan konfigurasi environment variable Supabase** — URL sempat menyertakan path tambahan, diperbaiki dengan hanya menggunakan domain dasar.

## Kontributor

Putri Ayu Aulia