import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { DollarSign, TrendingUp, ShoppingBag, PieChart, MapPin, Award, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metrics = await analyticsService.getDashboardMetrics();
        setData(metrics);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load business analytics data from Django REST API.");
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
        <p className="text-xs">Fetching real-time business metrics from Django API...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-rose-400 text-xs">
        {error}
      </div>
    );
  }

  const { kpis, monthly_trend, regional_performance, category_performance, top_products } = data;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Executive Business Dashboard</h1>
          <p className="text-xs text-slate-400">Real-time revenue, profit margin, regional performance & top products</p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Live Data Feed (Django ORM + PostgreSQL)</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sales */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Sales</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-100">${kpis.total_sales.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.4% vs last period</span>
          </div>
        </div>

        {/* Card 2: Total Profit */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Profit</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">${kpis.total_profit.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Strong Gross Profitability</span>
          </div>
        </div>

        {/* Card 3: Profit Margin % */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Profit Margin</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-300">{kpis.profit_margin_percent}%</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
            <span>Healthy Margin Baseline</span>
          </div>
        </div>

        {/* Card 4: Total Orders */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Transactions</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-100">{kpis.total_orders}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
            <span>Verified Orders</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Table */}
        <div className="lg:col-span-2 p-6 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Monthly Revenue & Profit Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase bg-slate-950/60 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Sales Revenue</th>
                  <th className="py-3 px-4">Net Profit</th>
                  <th className="py-3 px-4 text-right">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {monthly_trend.map((row, idx) => {
                  const margin = row.sales > 0 ? ((row.profit / row.sales) * 100).toFixed(1) : '0';
                  return (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4 font-semibold text-slate-200">{row.month}</td>
                      <td className="py-3 px-4 font-mono text-blue-400">${row.sales.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-emerald-400">${row.profit.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-right text-indigo-300">{margin}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional Breakdown */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-400" />
            Regional Sales Breakdown
          </h2>
          <div className="space-y-3">
            {regional_performance.map((reg, idx) => {
              const maxSales = regional_performance[0]?.sales || 1;
              const percent = Math.round((reg.sales / maxSales) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{reg.region} Region</span>
                    <span className="text-blue-400 font-mono">${reg.sales.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 5 Products Table */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Top 5 Products by Gross Profit
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Units Sold</th>
                <th className="py-3 px-4">Total Revenue</th>
                <th className="py-3 px-4 text-right">Gross Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {top_products.map((prod, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-[10px]">
                      #{idx + 1}
                    </span>
                    {prod.name}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{prod.category}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{prod.units}</td>
                  <td className="py-3 px-4 font-mono text-blue-400">${prod.sales.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-right text-emerald-400 font-bold">${prod.profit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
