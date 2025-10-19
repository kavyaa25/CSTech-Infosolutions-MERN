import React, { useState, useRef } from 'react';
import axios from 'axios';
import api from '../utils/api';

const UploadList = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [distribution, setDistribution] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop().toLowerCase();
      const allowedTypes = ['csv', 'xlsx', 'xls'];
      
      if (allowedTypes.includes(fileExt)) {
        setFile(selectedFile);
        setError('');
        setMessage('');
      } else {
        setError('Please select a CSV, XLSX, or XLS file');
        setFile(null);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const fileExt = droppedFile.name.split('.').pop().toLowerCase();
      const allowedTypes = ['csv', 'xlsx', 'xls'];
      
      if (allowedTypes.includes(fileExt)) {
        setFile(droppedFile);
        setError('');
        setMessage('');
      } else {
        setError('Please select a CSV, XLSX, or XLS file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/list/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(`File uploaded successfully! ${response.data.totalItems} items distributed.`);
      setDistribution(response.data.distribution);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setDistribution(null);
    setError('');
    setMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1>Upload and Distribute List</h1>

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
          <h2 className="card-title">Upload CSV File</h2>
        </div>

        <div className="file-upload"
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}
             onClick={() => fileInputRef.current?.click()}>
          <div className="upload-icon">📁</div>
          <p>Click to select file or drag and drop</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Supported formats: CSV, XLSX, XLS (Max 5MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="file-input"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
          />
        </div>

        {file && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p><strong>Selected file:</strong> {file.name}</p>
            <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload and Distribute'}
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={uploading}
          >
            Clear
          </button>
        </div>
      </div>

      {distribution && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Distribution Results</h2>
          </div>

          <div className="distribution-grid">
            {distribution.map((agentData, index) => (
              <div key={index} className="agent-card">
                <div className="agent-header">
                  <div className="agent-name">{agentData.agent.name}</div>
                  <div className="agent-email">{agentData.agent.email}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {agentData.agent.mobile}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>Assigned Items: {agentData.items.length}</strong>
                </div>

                {agentData.items.length > 0 ? (
                  <div className="item-list">
                    {agentData.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="item">
                        <div className="item-name">{item.firstName}</div>
                        <div className="item-phone">{item.phone}</div>
                        {item.notes && (
                          <div className="item-notes">{item.notes}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No items assigned</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">CSV Format Requirements</h2>
        </div>

        <p>Your CSV file must contain the following columns:</p>
        <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
          <li><strong>FirstName</strong> - Text field for the person's first name</li>
          <li><strong>Phone</strong> - Numeric field for phone number (numbers only)</li>
          <li><strong>Notes</strong> - Text field for additional notes (optional)</li>
        </ul>

        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h4>Example CSV format:</h4>
          <pre style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
{`FirstName,Phone,Notes
John Doe,1234567890,Important client
Jane Smith,0987654321,Follow up needed
Mike Johnson,1122334455,`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default UploadList;
