import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Transactions = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    title: '', amount: '', type: 'expense', category: 'other', date: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction._id}`, form);
      } else {
        await api.post('/transactions', form);
      }
      setForm({ title: '', amount: '', type: 'expense', category: 'other', date: '' });
      setShowForm(false);
      setEditingTransaction(null);
      fetchTransactions();
    } catch (err) {
      setError('Failed to save transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setForm({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date.split('T')[0]
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      setError('Failed to delete transaction');
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>💰 FinTrack</h1>
        <div className="nav-right">
          <span>Hi, {user?.username}!</span>
          <Link to="/dashboard" className="btn-secondary">Dashboard</Link>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="transactions-header">
          <h2>Transactions</h2>
          <button className="btn-primary" onClick={() => {
            setShowForm(!showForm);
            setEditingTransaction(null);
            setForm({ title: '', amount: '', type: 'expense', category: 'other', date: '' });
          }}>
            {showForm ? 'Cancel' : '+ Add Transaction'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="form-card">
            <h3>{editingTransaction ? 'Edit Transaction' : 'New Transaction'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Grocery shopping"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="salary">Salary</option>
                    <option value="utilities">Utilities</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
              </button>
            </form>
          </div>
        )}

        <div className="filter-bar">
          <button className={filter === 'all' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'income' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('income')}>Income</button>
          <button className={filter === 'expense' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('expense')}>Expenses</button>
        </div>

        <div className="transactions-list">
          {filteredTransactions.map(t => (
            <div key={t._id} className={`transaction-item ${t.type}`}>
              <div>
                <p className="transaction-title">{t.title}</p>
                <p className="transaction-category">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
              </div>
              <div className="transaction-actions">
                <p className={`transaction-amount ${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                </p>
                <button className="btn-edit" onClick={() => handleEdit(t)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(t._id)}>Delete</button>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && (
            <p className="no-data">No transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
