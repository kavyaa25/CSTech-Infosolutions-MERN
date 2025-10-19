import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../utils/api';

const AgentListView = () => {
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [viewingItems, setViewingItems] = useState({}); // Track which agents are showing items

  useEffect(() => {
    fetchDistribution();
  }, []);

  const fetchDistribution = async () => {
    try {
      setLoading(true);
      const response = await api.get('/list/agents');
      setDistribution(response.data.distribution);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching distribution data');
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => {
    return distribution.reduce((total, agentData) => total + agentData.items.length, 0);
  };

  const clearMessages = () => {
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 3000);
  };

  const toggleViewItems = (agentId) => {
    setViewingItems(prev => ({
      ...prev,
      [agentId]: !prev[agentId]
    }));
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/list/items/${taskId}`);
        setMessage('Task deleted successfully!');
        clearMessages();
        fetchDistribution(); // Refresh the distribution
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting task');
        clearMessages();
      }
    }
  };

  const handleDeleteAgent = async (agentId) => {
    if (window.confirm('Are you sure you want to delete this agent and all their tasks?')) {
      try {
        await api.delete(`/agents/${agentId}`);
        setMessage('Agent deleted successfully!');
        clearMessages();
        fetchDistribution(); // Refresh the distribution
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting agent');
        clearMessages();
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading distribution data...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Agent List Distribution</h1>
        <button className="btn btn-secondary" onClick={fetchDistribution}>
          Refresh
        </button>
      </div>

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

      {distribution.length === 0 ? (
        <div className="card">
          <div className="text-center" style={{ padding: '3rem' }}>
            <h2>No Distribution Data</h2>
            <p>No lists have been uploaded and distributed yet.</p>
            <p>Go to the "Upload List" section to upload a CSV file and distribute it among agents.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Distribution Summary</h2>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{distribution.length}</div>
                <div className="stat-label">Total Agents</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-number">{getTotalItems()}</div>
                <div className="stat-label">Total Items</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-number">
                  {distribution.length > 0 ? Math.round(getTotalItems() / distribution.length) : 0}
                </div>
                <div className="stat-label">Average per Agent</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Agent Assignments</h2>
            </div>

            <div className="distribution-grid">
              {distribution.map((agentData, index) => (
              <div key={index} className="agent-card">
                <div className="agent-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="agent-name">{agentData.agent.name}</div>
                      <div className="agent-email">{agentData.agent.email}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        {agentData.agent.mobile}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => toggleViewItems(agentData.agent.id)}
                        title={viewingItems[agentData.agent.id] ? "Hide Items" : "View Items"}
                      >
                        {viewingItems[agentData.agent.id] ? "👁️‍🗨️" : "👁️"}
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDeleteAgent(agentData.agent.id)}
                        title="Delete Agent"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                  <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f4fd', borderRadius: '5px' }}>
                    <strong>Assigned Items: {agentData.items.length}</strong>
                  </div>

                  {viewingItems[agentData.agent.id] && (
                    <>
                      {agentData.items.length > 0 ? (
                        <div className="item-list">
                          {agentData.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="item" style={{ position: 'relative' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                  <div className="item-name">{item.firstName}</div>
                                  <div className="item-phone">{item.phone}</div>
                                  {item.notes && (
                                    <div className="item-notes">{item.notes}</div>
                                  )}
                                </div>
                                <button
                                  className="btn btn-danger btn-small"
                                  onClick={() => handleDeleteTask(item.id)}
                                  title="Delete Task"
                                  style={{ marginLeft: '10px', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ 
                          padding: '2rem', 
                          textAlign: 'center', 
                          color: '#666', 
                          fontStyle: 'italic',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '5px'
                        }}>
                          No items assigned to this agent
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Detailed View</h2>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th>Contact Name</th>
                    <th>Phone</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {distribution.map((agentData) =>
                    agentData.items.map((item, itemIndex) => (
                      <tr key={`${agentData.agent.id}-${itemIndex}`}>
                        <td>
                          <div>
                            <strong>{agentData.agent.name}</strong>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            {agentData.agent.email}
                          </div>
                        </td>
                        <td>{item.firstName}</td>
                        <td>{item.phone}</td>
                        <td>{item.notes || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AgentListView;
