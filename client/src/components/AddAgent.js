import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../utils/api';

const AddAgent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/agents');
      setAgents(response.data.agents);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setMessage('');
  };

  const validateMobile = (mobile) => {
    // Validate mobile number with country code format
    const mobileRegex = /^\+[1-9]\d{1,14}$/;
    return mobileRegex.test(mobile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validate mobile number format
    if (!validateMobile(formData.mobile)) {
      setError('Mobile number must be in international format with country code (e.g., +1234567890)');
      setLoading(false);
      return;
    }

    try {
      await api.post('/agents/add', formData);
      setMessage('Agent added successfully!');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        password: ''
      });
      fetchAgents(); // Refresh the agents list
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding agent');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (agentId) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await api.delete(`/agents/${agentId}`);
        setMessage('Agent deleted successfully!');
        fetchAgents(); // Refresh the agents list
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting agent');
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1>Agent Management</h1>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Add New Agent</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile" className="form-label">
              Mobile Number with Country Code *
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              className="form-input"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="e.g., +1234567890"
              required
              disabled={loading}
            />
            <small className="form-help">
              Enter mobile number with country code (e.g., +1234567890)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding Agent...' : 'Add Agent'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Existing Agents ({agents.length})</h2>
        </div>

        {agents.length === 0 ? (
          <p>No agents found. Add your first agent above.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent._id}>
                    <td>{agent.name}</td>
                    <td>{agent.email}</td>
                    <td>{agent.mobile}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDelete(agent._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAgent;
