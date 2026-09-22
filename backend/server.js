const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool, testConnection } = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root & Health check
app.get('/', (req, res) => {
  res.json({
    name: 'Axon Sales Dashboard - Backend API',
    status: 'online',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/sales-summary',
      '/api/top-products',
      '/api/monthly-sales',
    ],
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 AS status');
    res.json({
      status: 'healthy',
      database: result[0]?.status === 1 ? 'connected' : 'unknown',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Endpoint 1: Sales Summary (Total Revenue, Total Orders, Total Customers)
app.get('/api/sales-summary', async (req, res) => {
  try {
    // 1. Total Revenue from orderdetails
    const [revenueRows] = await pool.query(`
      SELECT ROUND(COALESCE(SUM(quantityOrdered * priceEach), 0), 2) AS totalRevenue 
      FROM orderdetails
    `);

    // 2. Total Orders from orders
    const [ordersRows] = await pool.query(`
      SELECT COUNT(DISTINCT orderNumber) AS totalOrders 
      FROM orders
    `);

    // 3. Total Customers from customers
    const [customersRows] = await pool.query(`
      SELECT COUNT(DISTINCT customerNumber) AS totalCustomers 
      FROM customers
    `);

    const totalRevenue = Number(revenueRows[0]?.totalRevenue || 0);
    const totalOrders = Number(ordersRows[0]?.totalOrders || 0);
    const totalCustomers = Number(customersRows[0]?.totalCustomers || 0);

    const response = {
      totalRevenue,
      totalOrders,
      totalCustomers,
      total_revenue: totalRevenue,
      total_orders: totalOrders,
      total_customers: totalCustomers,
    };

    // Also attach data property to support frontend accessing res.data.data
    response.data = {
      totalRevenue,
      totalOrders,
      totalCustomers,
      total_revenue: totalRevenue,
      total_orders: totalOrders,
      total_customers: totalCustomers,
    };

    res.json(response);
  } catch (error) {
    console.error('[Error] /api/sales-summary:', error.message);
    res.status(500).json({ error: 'Failed to retrieve sales summary', details: error.message });
  }
});

// Endpoint 2: Top Products (Best-selling products)
app.get('/api/top-products', async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 5);

    const [rows] = await pool.query(
      `
      SELECT 
        p.productCode,
        p.productName,
        p.productLine,
        CAST(SUM(od.quantityOrdered) AS UNSIGNED) AS totalQuantity,
        CAST(SUM(od.quantityOrdered) AS UNSIGNED) AS total_quantity,
        CAST(SUM(od.quantityOrdered) AS UNSIGNED) AS quantity,
        ROUND(SUM(od.quantityOrdered * od.priceEach), 2) AS totalSales,
        ROUND(SUM(od.quantityOrdered * od.priceEach), 2) AS total_sales,
        ROUND(SUM(od.quantityOrdered * od.priceEach), 2) AS revenue
      FROM products p
      JOIN orderdetails od ON p.productCode = od.productCode
      GROUP BY p.productCode, p.productName, p.productLine
      ORDER BY totalQuantity DESC
      LIMIT ?
      `,
      [limit]
    );

    const formattedRows = rows.map((row) => ({
      productCode: row.productCode,
      productName: row.productName,
      productLine: row.productLine,
      totalQuantity: Number(row.totalQuantity),
      total_quantity: Number(row.total_quantity),
      quantity: Number(row.quantity),
      totalSales: Number(row.totalSales),
      total_sales: Number(row.total_sales),
      revenue: Number(row.revenue),
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error('[Error] /api/top-products:', error.message);
    res.status(500).json({ error: 'Failed to retrieve top products', details: error.message });
  }
});

// Endpoint 3: Monthly Sales (Monthly sales trend)
app.get('/api/monthly-sales', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        DATE_FORMAT(o.orderDate, '%Y-%m') AS month,
        DATE_FORMAT(o.orderDate, '%b %Y') AS monthName,
        DATE_FORMAT(o.orderDate, '%b %Y') AS month_name,
        ROUND(COALESCE(SUM(od.quantityOrdered * od.priceEach), 0), 2) AS totalSales,
        ROUND(COALESCE(SUM(od.quantityOrdered * od.priceEach), 0), 2) AS total_sales,
        ROUND(COALESCE(SUM(od.quantityOrdered * od.priceEach), 0), 2) AS revenue,
        COUNT(DISTINCT o.orderNumber) AS totalOrders,
        COUNT(DISTINCT o.orderNumber) AS total_orders
      FROM orders o
      JOIN orderdetails od ON o.orderNumber = od.orderNumber
      GROUP BY DATE_FORMAT(o.orderDate, '%Y-%m'), DATE_FORMAT(o.orderDate, '%b %Y')
      ORDER BY month ASC
    `);

    const formattedRows = rows.map((row) => ({
      month: row.month,
      monthName: row.monthName,
      month_name: row.month_name,
      totalSales: Number(row.totalSales),
      total_sales: Number(row.total_sales),
      revenue: Number(row.revenue),
      totalOrders: Number(row.totalOrders),
      total_orders: Number(row.total_orders),
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error('[Error] /api/monthly-sales:', error.message);
    res.status(500).json({ error: 'Failed to retrieve monthly sales', details: error.message });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`[Server] Express Backend running on http://0.0.0.0:${PORT}`);
  await testConnection();
});
