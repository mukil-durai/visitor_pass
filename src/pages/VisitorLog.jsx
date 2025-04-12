import React, { useEffect, useState } from 'react';

function VisitorLog() {
  const [visitors, setVisitors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://visitor-pass-1.onrender.com/api/visitors'); // Ensure the backend URL is correct
        if (!response.ok) {
          throw new Error('Failed to fetch visitor logs');
        }
        const data = await response.json();
        setVisitors(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching visitor logs:', err);
        setError('Failed to load visitor logs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  return (
    <div className="container py-4">
      <h1 className="h2 mb-4 fw-bold text-primary">
        <i className="bi bi-journal-text me-2"></i>
        Visitor Logs
      </h1>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-header bg-light">
            <h5 className="card-title mb-0">
              <i className="bi bi-people-fill me-2"></i>
              Visitor Records
            </h5>
          </div>
          <div className="card-body p-0">
            {Array.isArray(visitors) && visitors.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Visiting</th>
                      <th>Purpose</th>
                      <th>Persons</th>
                      <th>Entry Time</th>
                      <th>Exit Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.map((visitor) => (
                      <tr key={visitor._id}>
                        <td className="fw-bold">{visitor.name}</td>
                        <td>{visitor.phone}</td>
                        <td>{visitor.visiting}</td>
                        <td>{visitor.purpose}</td>
                        <td className="text-center">
                          <span className="badge bg-secondary rounded-pill">
                            {visitor.numberOfPersons || '1'}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(visitor.entryTime).toLocaleString()}
                          </small>
                        </td>
                        <td>
                          {visitor.exitTime ? (
                            <small className="text-muted">
                              {new Date(visitor.exitTime).toLocaleString()}
                            </small>
                          ) : (
                            <span className="badge bg-warning text-dark">Still Inside</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-search text-secondary" style={{ fontSize: '2rem' }}></i>
                <p className="text-muted mt-2">No visitor logs found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VisitorLog;
