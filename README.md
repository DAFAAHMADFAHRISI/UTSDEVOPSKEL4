# UTS DevOps & DevSecOps Kelompok 4 - Axon Sales Dashboard

Aplikasi Dashboard Analisis Penjualan Real-time berbasis **Multi-Container Docker** yang menerapkan praktik terbaik **DevSecOps (Shift-Left Security)** dan **Automated Continuous Deployment (CI/CD)** ke cloud **Microsoft Azure**.

---

## 👥 Anggota Tim & Pembagian Peran

| Nama | Peran (Role) | Tanggung Jawab Utama |
| :--- | :--- | :--- |
| **Tamisa** | **Product Manager (PM)** | Penyusunan *Product Requirement Document (PRD)*, pengelolaan *Product Backlog*, penentuan *Acceptance Criteria*, dan *User Acceptance Testing (UAT)*. |
| **Danang** | **SecOps / DevSecOps** | Manajemen kontainerisasi (`compose.yml`), implementasi security pipeline (SAST, SCA, Secret Scanning, Container Audit), dan deployment cloud ke Microsoft Azure. |
| **Dafa** | **Developer (Fullstack)** | Pengembangan antarmuka pengguna (React/Vite), arsitektur REST API server (Node.js/Express), integrasi database MySQL, dan penulisan Dockerfile. |

📄 *Dokumentasi lengkap kebutuhan produk dapat dilihat pada [docs/PRD.md](docs/PRD.md).*

---

## 🚀 Live Production Deployment (Microsoft Azure)

Aplikasi telah berhasil di-deploy ke cloud **Microsoft Azure (Region Indonesia Central - Jakarta)**:

* 🌐 **Frontend Dashboard:** `http://<AZURE_VM_PUBLIC_IP>:5173`
* ⚙️ **Backend REST API:** `http://<AZURE_VM_PUBLIC_IP>:5000/api`
* 🗄️ **Database Manager (phpMyAdmin):** `http://<AZURE_VM_PUBLIC_IP>:8080` *(Internal/Restricted Access)*
* 🖥️ **Spesifikasi VM:** `Standard_B2als_v2` (2 vCPUs, 4 GiB RAM, Ubuntu 24.04 LTS)

> 🔒 *Catatan Keamanan (SecOps): Alamat IP Publik aktual disimpan secara aman pada repositori rahasia tim dan laporan pengujian untuk mencegah scanning publik yang tidak sah.*

---

## 🛡️ Arsitektur Pipeline DevSecOps (CI/CD Automation)

Pipeline pengujian otomatis berjalan di **GitHub Actions** setiap kali ada `push` atau `pull request` ke branch `main`:

```
[ Git Push / Commit ]
         │
         ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                 DEVSECOPS SECURITY GATES                    │
 ├──────────────────────────────┬──────────────────────────────┤
 │ 🔑 Secret Scanning           │ 📦 Dependency Audit (SCA)    │
 │    (Gitleaks)                │    (npm audit high level)    │
 ├──────────────────────────────┼──────────────────────────────┤
 │ 🔍 Static Code Analysis SAST │ 🐳 Container Security Scan   │
 │    (Semgrep Security Audit)  │    (Aqua Security Trivy)     │
 └──────────────────────────────┴──────────────────────────────┘
         │ (Semua Lolos / Centang Hijau ✅)
         ▼
 🚀 Automated Continuous Deployment (CD via SSH ke Azure VM)
    └─ git pull origin main
    └─ docker compose up --build -d
```

---

## 🎯 Fitur Dashboard & Acceptance Criteria (Validasi PM)

Halaman utama dashboard menyajikan 7 metrik bisnis penjualan yang terintegrasi langsung dengan database MySQL:

1. **KPI Ringkasan Penjualan (Sales Summary):** 3 Metric Card (Total Revenue, Total Orders, Total Customers).
2. **Tren Penjualan Bulanan (Monthly Sales Trend):** Area Chart bergradien biru yang memetakan omset dan volume pesanan per bulan.
3. **Top 5 Produk Terlaris:** Peringkat volume penjualan unit dan kontribusi omset produk.
4. **Distribusi Revenue per Kategori:** Donut Chart pangsa pasar lini produk (*Classic Cars, Vintage Cars, dll.*).
5. **Distribusi Status Pemenuhan Pesanan:** Progress Bar tematik (*Shipped, In Process, On Hold, Resolved, Disputed, Cancelled*).
6. **Peta Pasar Global (Top 8 Negara Terbesar):** Horizontal Bar Chart kontribusi omset negara dan rasio pelanggan unik.
7. **Leaderboard Performa Sales Representative:** Evaluasi deal staf penjualan dengan lencana peringkat (🥇, 🥈, 🥉).

---

## 📐 Arsitektur Tata Letak Antarmuka (UI Hierarchy)

```
+-----------------------------------------------------------------------+
| [Header] Axon Sales Dashboard                 [Status: API Connected] |
+-----------------------------------------------------------------------+
| [Baris 1] KPI Card 1: Revenue | KPI Card 2: Orders | KPI Card 3: Cust |
+-----------------------------------+-----------------------------------+
| [Baris 2] Tren Bulanan (Area Chart)| Top 5 Produk (Bar/List Card)      |
+-----------------------------------+-----------------------------------+
| [Baris 3] Donut Kategori Produk   | Status Pemenuhan (Progress Bar)   |
+-----------------------------------+-----------------------------------+
| [Baris 4] Top 8 Negara (Horiz Bar)| Leaderboard Sales Rep (Badge)     |
+-----------------------------------+-----------------------------------+
| [Baris 5] Komparasi Omset Bar Chart & Footer                          |
+-----------------------------------------------------------------------+
```

---

## 💻 Panduan Menjalankan di Lingkungan Lokal (Local Setup)

### Prasyarat:
* Git
* Docker & Docker Compose

### Langkah Instalasi:
1. Clone repositori ini:
   ```bash
   git clone https://github.com/DAFAAHMADFAHRISI/UTSDEVOPSKEL4.git
   cd UTSDEVOPSKEL4
   ```

2. Buat file `.env` di root direktori proyek:
   ```env
   DB_HOST=db
   DB_PORT=3306
   DB_NAME=axon_sales
   DB_USER=axon_user
   DB_PASSWORD=axon_password_123
   MYSQL_ROOT_PASSWORD=root_password_123
   PORT=5000
   VITE_API_URL=http://localhost:5000/api
   ```

3. Jalankan aplikasi via Docker Compose:
   ```bash
   docker compose up --build -d
   ```

4. Akses melalui browser:
   * Frontend: `http://localhost:5173`
   * Backend API: `http://localhost:5000`
   * phpMyAdmin: `http://localhost:8080`

---

## 📋 Matriks Tugas & Status Pelaksanaan

- [x] **Penyusunan Requirement, Product Backlog & PRD** — *Tamisa (PM)*
- [x] **Pengembangan Frontend React & Backend Express.js** — *Dafa (Developer)*
- [x] **Integrasi REST API dan Visualisasi Data** — *Dafa (Developer)*
- [x] **Docker Multi-Container Orchestration (`compose.yml`)** — *Danang (SecOps)*
- [x] **Automated DevSecOps Pipeline (Gitleaks, Semgrep, Trivy, SCA)** — *Danang (SecOps)*
- [x] **Automated Continuous Deployment (CD) ke Microsoft Azure** — *Danang (SecOps)*
- [x] **Security Review, Cloud Deployment Audit & Validasi UAT** — *Tim (Tamisa, Danang, Dafa)*
