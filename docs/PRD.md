# Product Requirement Document (PRD)
## Project: Axon Sales Dashboard (DevSecOps Implementation)

---

## 📋 Informasi Dokumen

| Parameter | Detail |
| :--- | :--- |
| **Nama Proyek** | Axon Sales Dashboard |
| **Versi Dokumen** | 1.0.0 |
| **Tanggal** | 2 Oktober 2026 |
| **Status** | Approved / In Progress |
| **Studi Kasus** | Penerapan Best Practices DevSecOps pada Axon-Sales |

---

## 👥 Tim & Pembagian Peran

| Nama | Peran (Role) | Tanggung Jawab Utama |
| :--- | :--- | :--- |
| **Tamisa** | **Product Manager (PM)** | Penyusunan *Requirement*, *Product Backlog*, penentuan *Acceptance Criteria*, serta validasi akhir kualitas dan fungsionalitas produk. |
| **Danang** | **SecOps / DevSecOps** | Pembuatan *Docker Compose*, hardening keamanan kontainer, pengujian keamanan (SAST/DAST), manajemen infrastruktur deployment di Azure, dan integrasi keamanan pipeline. |
| **Dafa** | **Developer (Fullstack)** | Pengembangan antarmuka pengguna (Frontend), logika server & API (Backend), integrasi FE-BE, dan penulisan Dockerfile aplikasi. |

---

## 🎯 1. Latar Belakang & Tujuan Proyek

### 1.1 Latar Belakang
Sistem Axon Sales memerlukan antarmuka dashboard terpusat untuk memantau performa penjualan, metrik operasional, serta kinerja tim sales secara *real-time*. Di sisi lain, proses pengembangannya harus mengintegrasikan prinsip-prinsip **DevSecOps** untuk memastikan aplikasi tidak hanya fungsional dan responsif, tetapi juga aman serta dapat di-deploy secara handal.

### 1.2 Tujuan
1. Membangun **1 Halaman Dashboard Utama** yang interaktif dengan 7 visualisasi metrik bisnis utama.
2. Mengintegrasikan Frontend (Vite/React) dan Backend (Node.js/Express) secara seamless berbasis *REST API*.
3. Menerapkan *containerization* (Docker & Docker Compose) dan deployment cloud (Azure) dengan standar keamanan **SecOps**.

---

## 🎯 2. Ruang Lingkup Produk & Fitur Utama (Product Backlog)

Ruang lingkup pengembangan difokuskan pada **Halaman Dashboard Utama** dengan 7 fitur metrik bisnis sebagai berikut:

### 2.1 KPI Ringkasan Penjualan (*Sales Summary Cards*)
- **Deskripsi:** Menampilkan 3 *Metric Card* di bagian atas antarmuka untuk indikator kinerja utama.
- **Komponen Metric:**
  1. **Total Revenue:** Akumulasi total omset dari seluruh transaksi.
  2. **Total Orders:** Jumlah akumulasi transaksi unik.
  3. **Total Customers:** Jumlah pelanggan terdaftar aktif.
- **Kriteria Penerimaan (Acceptance Criteria):**
  - Data wajib diambil dari endpoint API ringkasan penjualan.
  - Format mata uang menggunakan format finansial yang mudah dibaca (misal: USD / Format Ribuan).
- **Status Validasi PM:** ✅ *Lulus (Passed)*

### 2.2 Tren Penjualan Bulanan (*Monthly Sales Trend*)
- **Deskripsi:** Visualisasi grafik tren untuk memantau siklus dan fluktuasi penjualan periodik.
- **Komponen:** *Area Chart* interaktif dengan gradien warna biru.
- **Kriteria Penerimaan:**
  - Mengagregasikan pendapatan kotor dan total jumlah pesanan per bulan.
  - Menyediakan *tooltip* interaktif saat kursor diarahkan ke poin grafik.
- **Status Validasi PM:** ✅ *Lulus (Passed)*

### 2.3 Top 5 Produk Terlaris (*Top 5 Best-Selling Products*)
- **Deskripsi:** Pemeringkatan produk terbaik berdasarkan kuantitas penjualan dan total revenue.
- **Komponen:** *List Card Ranking* dikombinasikan dengan *Bar Chart*.
- **Kriteria Penerimaan:**
  - Menampilkan 5 produk dengan volume unit penjualan terbanyak.
  - Menampilkan total omset yang dihasilkan oleh masing-masing produk tersebut.
- **Status Validasi PM:** ✅ *Lulus (Passed)*

### 2.4 Distribusi Revenue per Kategori Produk (*Revenue by Category*)
- **Deskripsi:** Analisis kontribusi omset berdasarkan lini/kategori produk.
- **Komponen:** *Donut Chart* interaktif.
- **Kriteria Penerimaan:**
  - Menampilkan persentase pangsa pasar tiap kategori (misal: Classic Cars, Vintage Cars, Motorcycles, dll).
  - Setiap potongan chart memiliki warna pembeda yang kontras beserta legenda data.
- **Status Validasi PM:** ✅ *Lulus (Passed)*

### 2.5 Distribusi Status Pemenuhan Pesanan (*Order Fulfillment Status*)
- **Deskripsi:** Ringkasan status logistik dan pemrosesan pesanan.
- **Komponen:** *Progress Bar* dengan indikator kode warna tematik.
- **Kriteria Penerimaan:**
  - Mengagregasikan rasio status: *Shipped*, *In Process*, *On Hold*, *Resolved*, *Disputed*, *Cancelled*.
  - Menampilkan persentase atau jumlah pesanan sesuai statusnya.
- **Status Validasi PM:** ✅ *Lulus (Passed)*

### 2.6 Peta Pasar Global (*Global Market Distribution - Top 8 Countries*)
- **Deskripsi:** Pemetaan 8 negara penyumbang omset penjualan terbesar.
- **Komponen:** *Horizontal Bar Chart*.
- **Kriteria Penerimaan:**
  - Urutan 8 negara teratas berdasarkan kontribusi omset.
  - Dilengkapi rasio jumlah pelanggan unik pada masing-masing negara.
- **Status Validasi PM:** ✅ *Lulus (Passed)*

### 2.7 Leaderboard Performa Sales Representative (*Sales Rep Performance*)
- **Deskripsi:** Evaluasi dan pemeringkatan kinerja staf penjualan.
- **Komponen:** Tabel/Card Peringkat dengan Lencana Peringkat (🥇, 🥈, 🥉).
- **Kriteria Penerimaan:**
  - Peringkat didasarkan pada total omset *closed deal* dan jumlah klien yang dikelola.
  - Visualisasi lencana jelas untuk 3 posisi teratas.
- **Status Validasi PM:** ✅ *Lulus (Passed)*

---

## 📐 3. Arsitektur Antarmuka & Tata Letak (UI Layout Hierarchy)

Untuk memastikan pengalaman pengguna (*User Experience*) yang optimal, tata letak visual disusun dalam grid berurutan:

```
+-----------------------------------------------------------------------+
| [Header] Axon Sales Dashboard                                         |
+-----------------------------------------------------------------------+
| [Baris 1] KPI Card 1: Revenue | KPI Card 2: Orders | KPI Card 3: Cust |
+-----------------------------------+-----------------------------------+
| [Baris 2] Tren Bulanan (Area Chart)| Top 5 Produk (Bar/List Card)      |
+-----------------------------------+-----------------------------------+
| [Baris 3] Donut Kategori Produk   | Status Pemenuhan (Progress Bar)   |
+-----------------------------------+-----------------------------------+
| [Baris 4] Top 8 Negara (Horiz Bar)| Leaderboard Sales Rep (Badge)     |
+-----------------------------------+-----------------------------------+
| [Baris 5] Komparasi Bar Chart & Footer                                |
+-----------------------------------------------------------------------+
```

---

## 🛡️ 4. Kebutuhan Non-Fungsional & DevSecOps (Non-Functional Requirements)

1. **Keamanan (Security & SecOps):**
   - Container Image Scanning untuk mendeteksi kerentanan pada dependency (Node.js/Database).
   - Penggunaan *Non-root User* di dalam Dockerfile untuk mencegah eksekusi berhak akses tinggi.
   - Manajemen rahasia (Secret Management) untuk kredensial database & environment variables (tidak meng-hardcode kredensial di repository).
2. **Performa & Responsivitas:**
   - Waktu muat awal (*Initial Load Time*) dashboard < 2 detik.
   - Antarmuka responsif terhadap layar Desktop dan Tablet.
3. **Skalabilitas & Kontainerisasi:**
   - Aplikasi dibungkus menggunakan Docker dengan arsitektur multi-container (Frontend, Backend, Database MySQL) yang diorkestrasi via `compose.yml`.

---

## 📋 5. Matriks Tugas & Pipeline Pelaksanaan

- [x] **Requirement, Product Backlog & Validasi Akhir** — *Tamisa (PM)*
- [x] **Pengembangan Aplikasi Frontend & Backend** — *Dafa (Developer)*
- [x] **Integrasi REST API (FE & BE)** — *Dafa (Developer)*
- [x] **Penyusunan Docker Orchestration (`compose.yml`) & Hardening** — *Danang (SecOps)*
- [ ] **Deployment Cloud & Security Audit di Azure** — *Danang (SecOps)*
- [ ] **Review Kode & Lingkungan Produksi (FE, BE, Container)** — *Tim (Tamisa, Danang, Dafa)*

---

## 📈 6. Kriteria Keberhasilan (Definition of Done)

1. Seluruh 7 fitur metrik bisnis pada dashboard terintegrasi dengan database dan lolos validasi PM.
2. Lingkungan Docker berjalan lancar tanpa error melalui perintah `docker compose up`.
3. Layanan berhasil di-deploy ke Microsoft Azure dengan status *Secure & Healthy*.
