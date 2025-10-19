import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalItems: 0,
    recentUploads: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);


  // Refresh stats when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch agents count
      const agentsResponse = await api.get('/agents');
      const agentsCount = agentsResponse.data.agents.length;

      // Fetch distribution data to get total items
      const distributionResponse = await api.get('/list/agents');
      const totalItems = distributionResponse.data.totalItems || 0;

      const newStats = {
        totalAgents: agentsCount,
        totalItems: totalItems,
        recentUploads: totalItems > 0 ? 2 : 0
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default values on error
      setStats({
        totalAgents: 0,
        totalItems: 0,
        recentUploads: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }


  return (
    <div className="dashboard">
      <div className="container">
        <div className="page-header">
          <h1>Dashboard</h1>
          <button className="btn btn-secondary" onClick={fetchStats}>
            🔄 Refresh Stats
          </button>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.totalAgents}</div>
            <div className="stat-label">Total Agents</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number" key={`total-items-${stats.totalItems}`}>{stats.totalItems}</div>
            <div className="stat-label">Total List Items</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{stats.recentUploads}</div>
            <div className="stat-label">Recent Uploads</div>
          </div>
        </div>


        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          
          <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
            <Link to="/add-agent" className="btn btn-primary">
              Add New Agent
            </Link>
            
            <Link to="/upload-list" className="btn btn-success">
              Upload CSV List
            </Link>
            
            <Link to="/view-distribution" className="btn btn-secondary">
              View Distribution
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">System Overview</h2>
          </div>
          
          <p>
            Welcome to the Agent List Distributor system. This application allows you to:
          </p>
          
          <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
            <li>Manage agents and their information</li>
            <li>Upload CSV files containing contact lists</li>
            <li>Automatically distribute lists among agents</li>
            <li>View and track distribution assignments</li>
          </ul>
          
          <div style={{ marginTop: '2rem' }}>
            <h3>Getting Started:</h3>
            <ol style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
              <li>Add agents to the system using the "Add Agent" feature</li>
              <li>Upload a CSV file with contact information</li>
              <li>View how the lists are distributed among agents</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
