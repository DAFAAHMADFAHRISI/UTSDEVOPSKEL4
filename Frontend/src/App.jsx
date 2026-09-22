import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  RefreshCw,
  Server,
  AlertCircle,
  BarChart3,
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
  Legend,
} from 'recharts';

// Pola API_BASE_URL sesuai panduan Tahap 4
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [summary, setSummary] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, monthlyRes, productsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/sales-summary`),
        axios.get(`${API_BASE_URL}/monthly-sales`),
        axios.get(`${API_BASE_URL}/top-products?limit=5`),
      ]);

      // Tangani format jika dibungkus data atau langsung
      const summaryData = summaryRes.data?.data || summaryRes.data;
      const monthlyData = Array.isArray(monthlyRes.data)
        ? monthlyRes.data
        : monthlyRes.data?.data || [];
      const productsData = Array.isArray(productsRes.data)
        ? productsRes.data
        : productsRes.data?.data || [];

      setSummary(summaryData);
      setMonthlySales(monthlyData);
      setTopProducts(productsData);
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
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatNumber = (val) => {
    if (val === undefined || val === null) return '0';
    return new Intl.NumberFormat('en-US').format(val);
  };

  const CustomTooltip = ({ active, payload, label }) => {
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
            Memuat data penjualan dari Docker Backend...
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

          {/* Charts Section */}
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
                    Pergerakan revenue dan volume transaksi dari waktu ke waktu
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
                    <Tooltip content={<CustomTooltip />} />
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

            {/* Top Products */}
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
                        {product.productLine} &bull; Code: {product.productCode}
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

          {/* Top Products Revenue Comparison BarChart */}
          <section className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  <BarChart3 size={20} color="#8b5cf6" />
                  Komparasi Omset Produk Terlaris
                </h2>
                <div className="card-subtitle">
                  Perbandingan nominal penjualan 5 produk teratas
                </div>
              </div>
            </div>
            <div className="chart-wrapper" style={{ height: '280px' }}>
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
