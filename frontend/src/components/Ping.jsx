import { useState, useEffect } from 'react'
import './Ping.css'

function Ping() {
  const [pingStatus, setPingStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePing = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/ping')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setPingStatus(data)
    } catch (err) {
      setError(err.message)
      setPingStatus(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handlePing()
  }, [])

  return (
    <div className="ping-container">
      <div className="ping-card">
        <h2>Backend Connection Test</h2>
        <p className="ping-description">
          Test connection between frontend and backend
        </p>

        <button 
          className="ping-button" 
          onClick={handlePing}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>

        {error && (
          <div className="ping-result error">
            <h3>❌ Connection Error</h3>
            <p>{error}</p>
            <small>Make sure the backend server is running on port 8080</small>
          </div>
        )}

        {pingStatus && (
          <div className="ping-result success">
            <h3>✅ Connection Successful</h3>
            <div className="ping-details">
              <div className="ping-detail-item">
                <span className="label">Status:</span>
                <span className="value">{pingStatus.status}</span>
              </div>
              <div className="ping-detail-item">
                <span className="label">Message:</span>
                <span className="value">{pingStatus.message}</span>
              </div>
              <div className="ping-detail-item">
                <span className="label">Timestamp:</span>
                <span className="value">{pingStatus.timestamp}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Ping
