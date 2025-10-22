/**
 * Connector Hub Component
 * Allows users to connect third-party services via OAuth
 */
import React, { useState, useEffect } from 'react';
import { initiateOAuthFlow, checkConnection, disconnectService } from '../services/oauth';

const SERVICES = [
  {
    id: 'google',
    name: 'Google Calendar',
    description: 'Create and manage calendar events',
    icon: '📅',
    color: '#4285F4'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send messages to channels',
    icon: '💬',
    color: '#4A154B'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Manage CRM contacts and deals',
    icon: '🔶',
    color: '#FF7A59'
  }
];

const ConnectorHub = () => {
  const [connections, setConnections] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check connection status for all services
    checkAllConnections();
  }, []);

  const checkAllConnections = async () => {
    const statuses = {};
    for (const service of SERVICES) {
      statuses[service.id] = await checkConnection(service.id);
    }
    setConnections(statuses);
  };

  const handleConnect = async (serviceId) => {
    setLoading({ ...loading, [serviceId]: true });
    setError(null);

    try {
      await initiateOAuthFlow(serviceId);
      // OAuth successful, update connection status
      setConnections({ ...connections, [serviceId]: true });
    } catch (err) {
      setError(`Failed to connect to ${serviceId}: ${err.message}`);
    } finally {
      setLoading({ ...loading, [serviceId]: false });
    }
  };

  const handleDisconnect = async (serviceId) => {
    if (!window.confirm(`Are you sure you want to disconnect ${serviceId}?`)) {
      return;
    }

    setLoading({ ...loading, [serviceId]: true });
    setError(null);

    try {
      const success = await disconnectService(serviceId);
      if (success) {
        setConnections({ ...connections, [serviceId]: false });
      } else {
        setError(`Failed to disconnect ${serviceId}`);
      }
    } catch (err) {
      setError(`Error disconnecting ${serviceId}: ${err.message}`);
    } finally {
      setLoading({ ...loading, [serviceId]: false });
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Connect Your Services</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Connect third-party services to use in your workflows
      </p>

      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#c33'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {SERVICES.map((service) => {
          const isConnected = connections[service.id];
          const isLoading = loading[service.id];

          return (
            <div
              key={service.id}
              style={{
                border: `2px solid ${isConnected ? service.color : '#ddd'}`,
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: '#fff',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                {service.icon}
              </div>

              <h3 style={{ margin: '10px 0' }}>{service.name}</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                {service.description}
              </p>

              {isConnected ? (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                    color: service.color,
                    fontWeight: 'bold'
                  }}>
                    ✓ Connected
                  </div>
                  <button
                    onClick={() => handleDisconnect(service.id)}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#fff',
                      color: '#c33',
                      border: '1px solid #c33',
                      borderRadius: '6px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.6 : 1
                    }}
                  >
                    {isLoading ? 'Disconnecting...' : 'Disconnect'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(service.id)}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: service.color,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  {isLoading ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>About Connections</h3>
        <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
          <li>Your credentials are securely stored in AWS Secrets Manager</li>
          <li>You can disconnect services at any time</li>
          <li>Workflows using disconnected services will fail to execute</li>
          <li>You need to reconnect services if tokens expire</li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectorHub;
