import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions');
        setTransactions(res.data);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const categoryData = transactions.reduce((acc, t) => {
    const existing = acc.find(item => item.name === t.category);
    if (existing) {
      existing.value += t.amount;
    } else {
      acc.push({ name: t.category, value: t.amount });
    }
    return acc;
  }, []);

  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      if (t.type === 'income') existing.income += t.amount;
      else existing.expenses += t.amount;
    } else {
      acc.push({
        month,
        income: t.type === 'income' ? t.amount : 0,
        expenses: t.type === 'expense' ? t.amount : 0
      });
    }
    return acc;
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>💰 FinTrack</h1>
        <div className="nav-right">
          <span>Hi, {user?.username}!</span>
          <Link to="/transactions" className="btn-secondary">Transactions</Link>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="summary-cards">
          <div className="card balance">
            <h3>Balance</h3>
            <p className={balance >= 0 ? 'positive' : 'negative'}>
              ${balance.toLocaleString()}
            </p>
          </div>
          <div className="card income">
            <h3>Total Income</h3>
            <p className="positive">${totalIncome.toLocaleString()}</p>
          </div>
          <div className="card expenses">
            <h3>Total Expenses</h3>
            <p className="negative">${totalExpenses.toLocaleString()}</p>
          </div>
        </div>

        <div className="charts">
          <div className="chart-card">
            <h3>Spending by Category</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">No transactions yet</p>
            )}
          </div>

          <div className="chart-card">
            <h3>Income vs Expenses</h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Bar dataKey="income" fill="#22c55e" />
                  <Bar dataKey="expenses" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">No transactions yet</p>
            )}
          </div>
        </div>

        <div className="recent-transactions">
          <h3>Recent Transactions</h3>
          {transactions.slice(0, 5).map(t => (
            <div key={t._id} className={`transaction-item ${t.type}`}>
              <div>
                <p className="transaction-title">{t.title}</p>
                <p className="transaction-category">{t.category}</p>
              </div>
              <p className={`transaction-amount ${t.type}`}>
                {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
              </p>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="no-data">No transactions yet. <Link to="/transactions">Add one!</Link></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;