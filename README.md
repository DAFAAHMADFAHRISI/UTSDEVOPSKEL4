# UTS DevOps Kelompok 4 - Axon Sales

## 👥 Anggota Tim & Peran

| Nama | Peran |
| :--- | :--- |
| **Tamisa** | Product Owner |
| **Dafa** | Developer |
| **Danang** | Product Manager |

---

## 🎯 Tujuan Projek

Menerapkan *best practices* dari **DevSecOps** dengan studi kasus **Axon-Sales**.

---

## 🎯 Product Backlog & Acceptance Criteria (Dashboard Page)

Sebagai Product Owner, ruang lingkup pengembangan secara khusus difokuskan pada bagian halaman *dashboard* (satu halaman antarmuka utama) dengan 7 fitur visualisasi metrik bisnis. Berikut adalah kriteria penerimaan berdasarkan *endpoint* API yang telah disepakati dan diaktifkan:

### 1. KPI Ringkasan Penjualan (Sales Summary)
- **Kriteria:** Sistem harus menampilkan 3 *Metric Card* di bagian atas yang mencakup Total Revenue (akumulasi omset seluruh transaksi), Total Orders (jumlah transaksi unik), dan Total Customers (jumlah pelanggan terdaftar).
- **Validasi PO:** ✅ Lulus. 

### 2. Tren Penjualan Bulanan (Monthly Sales)
- **Kriteria:** Sistem harus merangkum pendapatan kotor dan jumlah transaksi pesanan yang diagregasikan per bulan, divisualisasikan dalam *Area Chart* bergradien biru untuk memantau siklus penjualan.
- **Validasi PO:** ✅ Lulus.

### 3. Top 5 Produk Terlaris
- **Kriteria:** Sistem harus mengurutkan 5 produk berdasarkan volume unit terbanyak yang dibeli pelanggan beserta total omsetnya, menggunakan *List Card Ranking* dan *Bar Chart*.
- **Validasi PO:** ✅ Lulus.

### 4. Distribusi Revenue per Kategori Produk
- **Kriteria:** Sistem harus menampilkan persentase pangsa pasar dari setiap lini produk (Classic Cars, Vintage Cars, dll) menggunakan *Donut Chart* interaktif untuk memudahkan analisis kontribusi omset.
- **Validasi PO:** ✅ Lulus.

### 5. Distribusi Status Pemenuhan Pesanan
- **Kriteria:** Sistem wajib merangkum rasio penyelesaian logistik (Shipped, In Process, On Hold, Resolved, Disputed, Cancelled) menggunakan indikator *Progress Bar* dengan kode warna tematik.
- **Validasi PO:** ✅ Lulus.

### 6. Peta Pasar Global (Top 8 Negara Terbesar)
- **Kriteria:** Sistem harus memetakan 8 negara penyumbang omset tertinggi menggunakan *Horizontal Bar Chart*, lengkap dengan rasio jumlah pelanggan unik per negara.
- **Validasi PO:** ✅ Lulus.

### 7. Leaderboard Performa Sales Representative
- **Kriteria:** Sistem harus mengevaluasi kinerja staf penjualan berdasarkan omset *closed deal* dan jumlah klien yang dikelola, ditampilkan dalam format peringkat berperingkat lencana (🥇, 🥈, 🥉).
- **Validasi PO:** ✅ Lulus.

---

## 📐 Arsitektur & Tata Letak Antarmuka

Untuk memastikan kenyamanan pemantauan data (*user experience*), hierarki visual dashboard ditetapkan dengan struktur berikut:
- **Baris 1:** Header & 3 KPI Ringkasan Penjualan.
- **Baris 2:** Area Chart Tren Bulanan (Kiri) & Top 5 Produk (Kanan).
- **Baris 3:** Donut Chart Kategori (Kiri) & Status Pemenuhan Pesanan (Kanan).
- **Baris 4:** Peta Pasar Global (Kiri) & Leaderboard Sales Rep (Kanan).
- **Baris 5:** Komparasi Omset Bar Chart & Footer.

---

## 📋 Daftar Task

- [x] Penulisan Requirement, Product Backlog & Validasi Akhir — *Tamisa*
- [x] Pembuatan Composer — *Danang*
- [x] Pembuatan Frontend (FE) dan Backend (BE) — *Dafa*
- [x] Integrasi Frontend & Backend (FE/BE) — *Dafa*
- [ ] Deployment dengan Azure — *Danang*
- [ ] Review Kode & Lingkungan (FE, BE, dan Docker) — *Tim*