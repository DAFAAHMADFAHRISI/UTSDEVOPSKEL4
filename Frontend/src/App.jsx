import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  RefreshCw,
  AlertCircle,
  BarChart3,
  PieChart as PieIcon,
  Globe,
  Award,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PRODUCT_COLORS = [
  '#3b82f6', // Classic Cars (Blue)
  '#10b981', // Vintage Cars (Emerald)
  '#f59e0b', // Motorcycles (Amber)
  '#8b5cf6', // Planes (Purple)
  '#ec4899', // Trucks and Buses (Pink)
  '#06b6d4', // Ships (Cyan)
  '#f97316', // Trains (Orange)
];

const STATUS_COLORS = {
  Shipped: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' },
  Resolved: { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.3)' },
  'In Process': { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)' },
  'On Hold': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)' },
  Disputed: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.3)' },
  Cancelled: { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)', border: 'rgba(244, 63, 94, 0.3)' },
};

function App() {
  const [summary, setSummary] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [productLines, setProductLines] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [countrySales, setCountrySales] = useState([]);
  const [topSalesReps, setTopSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        summaryRes,
        monthlyRes,
        productsRes,
        productLinesRes,
        orderStatusRes,
        countryRes,
        repsRes,
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/sales-summary`),
        axios.get(`${API_BASE_URL}/monthly-sales`),
        axios.get(`${API_BASE_URL}/top-products?limit=5`),
        axios.get(`${API_BASE_URL}/revenue-by-productline`),
        axios.get(`${API_BASE_URL}/order-status-distribution`),
        axios.get(`${API_BASE_URL}/sales-by-country?limit=8`),
        axios.get(`${API_BASE_URL}/top-sales-reps?limit=5`),
      ]);

      const unwrap = (res) => (Array.isArray(res.data) ? res.data : res.data?.data || []);

      setSummary(summaryRes.data?.data || summaryRes.data);
      setMonthlySales(unwrap(monthlyRes));
      setTopProducts(unwrap(productsRes));
      setProductLines(unwrap(productLinesRes));
      setOrderStatuses(unwrap(orderStatusRes));
      setCountrySales(unwrap(countryRes));
      setTopSalesReps(unwrap(repsRes));

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(
        err.response?.data?.error ||
          err.message ||
          'Gagal terhubung ke API backend. Pastikan container backend aktif.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatNumber = (val) => {
    if (val === undefined || val === null) return '0';
    return new Intl.NumberFormat('en-US').format(val);
  };

  const CustomAreaTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{label}</p>
          <p className="tooltip-value">
            Revenue: {formatCurrency(payload[0]?.value)}
          </p>
          {payload[1] && (
            <p className="tooltip-orders">
              Orders: {formatNumber(payload[1]?.value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{data.productLine}</p>
          <p className="tooltip-value">Omset: {formatCurrency(data.totalRevenue)}</p>
          <p className="tooltip-orders">Porsi: {data.percentage}%</p>
          <p className="tooltip-orders">Unit: {formatNumber(data.totalQuantity)} terjual</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-title-group">
          <h1>
            <BarChart3 size={32} color="#3b82f6" />
            Axon Sales Dashboard
          </h1>
          <p>Visualisasi Data Penjualan & Transaksi Real-time (DevSecOps)</p>
        </div>

        <div className="header-actions">
          <div className="status-badge">
            <span className="status-dot"></span>
            <span>API: Connected ({API_BASE_URL})</span>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="btn-refresh"
            title="Refresh data dari server"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="error-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
          <button onClick={fetchData} className="btn-refresh">
            Coba Lagi
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !summary ? (
        <div className="state-container">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Memuat data analitik dan visualisasi penjualan...
          </p>
        </div>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <section className="summary-grid">
            <div className="card">
              <div className="metric-card">
                <div className="metric-info">
                  <h3>Total Revenue</h3>
                  <div className="metric-value">
                    {formatCurrency(summary?.totalRevenue ?? summary?.total_revenue)}
                  </div>
                  <div className="metric-sub">Total akumulasi penjualan</div>
                </div>
                <div className="metric-icon-box icon-emerald">
                  <DollarSign size={24} />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="metric-card">
                <div className="metric-info">
                  <h3>Total Orders</h3>
                  <div className="metric-value">
                    {formatNumber(summary?.totalOrders ?? summary?.total_orders)}
                  </div>
                  <div className="metric-sub">Total transaksi berhasil</div>
                </div>
                <div className="metric-icon-box icon-blue">
                  <ShoppingBag size={24} />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="metric-card">
                <div className="metric-info">
                  <h3>Total Customers</h3>
                  <div className="metric-value">
                    {formatNumber(summary?.totalCustomers ?? summary?.total_customers)}
                  </div>
                  <div className="metric-sub">Pelanggan terdaftar</div>
                </div>
                <div className="metric-icon-box icon-purple">
                  <Users size={24} />
                </div>
              </div>
            </div>
          </section>

          {/* Section 1: Tren Penjualan & Top 5 Produk */}
          <section className="charts-grid">
            {/* Monthly Sales Trend */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    <TrendingUp size={20} color="#3b82f6" />
                    Tren Penjualan Bulanan (Monthly Sales)
                  </h2>
                  <div className="card-subtitle">
                    Pergerakan omset dan volume pesanan dari waktu ke waktu
                  </div>
                </div>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlySales}
                    margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="monthName"
                      stroke="#6b7280"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomAreaTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="totalSales"
                      name="Total Sales"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#salesGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top 5 Best-Selling Products */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    <Package size={20} color="#10b981" />
                    Top 5 Produk Terlaris
                  </h2>
                  <div className="card-subtitle">
                    Berdasarkan kuantitas unit & total pendapatan
                  </div>
                </div>
              </div>

              <div className="products-list">
                {topProducts.map((product, idx) => (
                  <div key={product.productCode || idx} className="product-item">
                    <div className="product-rank">#{idx + 1}</div>
                    <div className="product-details">
                      <div className="product-name" title={product.productName}>
                        {product.productName}
                      </div>
                      <div className="product-category">
                        {product.productLine} &bull; SKU: {product.productCode}
                      </div>
                    </div>
                    <div className="product-stats">
                      <div className="product-revenue">
                        {formatCurrency(product.totalSales ?? product.total_sales)}
                      </div>
                      <div className="product-qty">
                        {formatNumber(product.totalQuantity ?? product.total_quantity)} terjual
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2: Kategori Produk (Donut) & Status Pemenuhan Pesanan */}
          <section className="grid-2-col">
            {/* Revenue by Product Line Donut Chart */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    <PieIcon size={20} color="#f59e0b" />
                    Distribusi Revenue per Kategori Produk
                  </h2>
                  <div className="card-subtitle">
                    Porsi kontribusi lini produk terhadap total omset
                  </div>
                </div>
              </div>

              <div className="donut-layout">
                <div style={{ width: '220px', height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productLines}
                        dataKey="totalRevenue"
                        nameKey="productLine"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                      >
                        {productLines.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PRODUCT_COLORS[index % PRODUCT_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="donut-legend">
                  {productLines.map((pl, idx) => (
                    <div key={pl.productLine || idx} className="legend-item">
                      <div className="legend-left">
                        <span
                          className="legend-dot"
                          style={{
                            backgroundColor: PRODUCT_COLORS[idx % PRODUCT_COLORS.length],
                          }}
                        ></span>
                        <span className="legend-name" title={pl.productLine}>
                          {pl.productLine}
                        </span>
                      </div>
                      <div className="legend-right">
                        <span className="legend-pct">{pl.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Fulfillment Status */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    <Activity size={20} color="#06b6d4" />
                    Status Pemenuhan Pesanan (Fulfillment)
                  </h2>
                  <div className="card-subtitle">
                    Kesehatan logistik pengiriman & status operasional
                  </div>
                </div>
              </div>

              <div className="status-cards-grid">
                {orderStatuses.map((os) => {
                  const theme = STATUS_COLORS[os.status] || {
                    color: '#9ca3af',
                    bg: 'rgba(156, 163, 175, 0.1)',
                    border: 'rgba(156, 163, 175, 0.2)',
                  };
                  return (
                    <div key={os.status} className="status-card-item">
                      <div
                        className="status-pill"
                        style={{
                          color: theme.color,
                          backgroundColor: theme.bg,
                          border: `1px solid ${theme.border}`,
                        }}
                      >
                        {os.status}
                      </div>
                      <div className="status-count">{formatNumber(os.totalOrders)}</div>
                      <div className="status-bar-bg">
                        <div
                          className="status-bar-fill"
                          style={{
                            width: `${Math.min(100, Math.max(10, os.percentage))}%`,
                            backgroundColor: theme.color,
                          }}
                        ></div>
                      </div>
                      <div className="status-sub">{os.percentage}% dari total pesanan</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section 3: Pasar Global (Sales by Country) & Top Sales Reps */}
          <section className="grid-2-col">
            {/* Sales by Country Horizontal Bar */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    <Globe size={20} color="#3b82f6" />
                    Top 8 Negara Pasar Terbesar (Global Sales)
                  </h2>
                  <div className="card-subtitle">
                    Negara penyumbang omset penjualan tertinggi
                  </div>
                </div>
              </div>

              <div className="chart-wrapper" style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={countrySales}
                    margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      type="number"
                      stroke="#6b7280"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                      type="category"
                      dataKey="country"
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      width={70}
                    />
                    <Tooltip
                      formatter={(val) => [formatCurrency(val), 'Revenue']}
                      contentStyle={{
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '0.5rem',
                        color: '#fff',
                      }}
                    />
                    <Bar
                      dataKey="totalRevenue"
                      name="Revenue ($)"
                      fill="#38bdf8"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Sales Representatives */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    <Award size={20} color="#f59e0b" />
                    Top Sales Representative Leaderboard
                  </h2>
                  <div className="card-subtitle">
                    Staf penjual dengan perolehan omset tertinggi
                  </div>
                </div>
              </div>

              <div className="reps-list">
                {topSalesReps.map((rep, idx) => {
                  let rankClass = 'rank-other';
                  if (idx === 0) rankClass = 'rank-gold';
                  else if (idx === 1) rankClass = 'rank-silver';
                  else if (idx === 2) rankClass = 'rank-bronze';

                  return (
                    <div key={rep.salesRepName || idx} className="rep-item">
                      <div className={`rep-rank ${rankClass}`}>
                        {idx + 1}
                      </div>
                      <div className="rep-info">
                        <div className="rep-name">{rep.salesRepName}</div>
                        <div className="rep-meta">
                          {rep.jobTitle} &bull; {rep.totalClients} Klien &bull; {rep.totalOrders} Order
                        </div>
                      </div>
                      <div className="rep-revenue">
                        <div className="rep-revenue-val">
                          {formatCurrency(rep.totalRevenue)}
                        </div>
                        <div className="rep-revenue-sub">Omset deal</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section 4: Komparasi Omset 5 Produk Terlaris */}
          <section className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  <BarChart3 size={20} color="#8b5cf6" />
                  Komparasi Omset Produk Terlaris
                </h2>
                <div className="card-subtitle">
                  Perbandingan nominal pendapatan 5 produk teratas
                </div>
              </div>
            </div>
            <div className="chart-wrapper" style={{ height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProducts}
                  margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="productName"
                    stroke="#6b7280"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(name) =>
                      name.length > 15 ? `${name.substring(0, 15)}...` : name
                    }
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Total Sales']}
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.95)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '0.5rem',
                      color: '#fff',
                    }}
                  />
                  <Bar
                    dataKey="totalSales"
                    name="Total Sales ($)"
                    fill="#8b5cf6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>
          Axon Sales Data Visualization Dashboard &bull; Workshop DevSecOps &bull;{' '}
          {lastUpdated && `Data terakhir diperbarui: ${lastUpdated}`}
        </p>
      </footer>
    </div>
  );
}

export default App;
