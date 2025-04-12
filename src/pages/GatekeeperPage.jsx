import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast } from 'bootstrap'; // Explicitly import Toast from Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JavaScript

function GatekeeperPage() {
  const [searchFields, setSearchFields] = useState({
    name: '',
    phone: '',
    visiting: '',
    purpose: '',
  });
  const [visitors, setVisitors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFields({ ...searchFields, [name]: value });
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(searchFields).toString();
      const response = await fetch(`http://localhost:5000/api/visitors?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch visitors');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setVisitors(data);
        setError(null);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Error fetching visitors:', err);
      setError('Failed to load visitors. Please try again later.');
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExitTime = async (id) => {
    try {
      const exitTime = new Date();
      const response = await fetch(`http://localhost:5000/api/visitors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exitTime }),
      });
      if (!response.ok) {
        throw new Error('Failed to update exit time');
      }
      await response.json();

      // Show success message with Bootstrap toast
      const toastLiveExample = document.getElementById('liveToast');
      const toast = new Toast(toastLiveExample); // Use the imported Toast
      toast.show();

      handleSearch(); // Refresh the visitor list after updating
    } catch (err) {
      console.error('Error updating exit time:', err);
      setError('Failed to update exit time. Please try again later.');
    }
  };

  const clearSearchFields = () => {
    setSearchFields({
      name: '',
      phone: '',
      visiting: '',
      purpose: '',
    });
  };

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="h2 mb-4 fw-bold text-primary">
            <i className="bi bi-shield-lock me-2"></i>
            Gatekeeper Dashboard
          </h1>
          
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}
          
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="card-title mb-0">
                <i className="bi bi-search me-2"></i>
                Search Visitors
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="nameInput"
                      name="name"
                      placeholder="Name"
                      value={searchFields.name}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="nameInput">Visitor Name</label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="phoneInput"
                      name="phone"
                      placeholder="Phone"
                      value={searchFields.phone}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="phoneInput">Phone Number</label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="visitingInput"
                      name="visiting"
                      placeholder="Visiting"
                      value={searchFields.visiting}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="visitingInput">Visiting Person</label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="purposeInput"
                      name="purpose"
                      placeholder="Purpose"
                      value={searchFields.purpose}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="purposeInput">Visit Purpose</label>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button 
                  className="btn btn-outline-secondary me-2" 
                  onClick={clearSearchFields}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Clear
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search me-1"></i>
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                <i className="bi bi-people-fill me-2"></i>
                Visitor Records
              </h5>
              <span className="badge bg-primary rounded-pill">
                {visitors.length} Records
              </span>
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
                        <th>Actions</th>
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
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleUpdateExitTime(visitor._id)}
                              disabled={visitor.exitTime}
                            >
                              <i className="bi bi-box-arrow-right me-1"></i>
                              {visitor.exitTime ? 'Checked Out' : 'Check Out'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-search text-secondary" style={{ fontSize: '2rem' }}></i>
                  <p className="text-muted mt-2">No visitors found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast notification for success */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div id="liveToast" className="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header bg-success text-white">
            <i className="bi bi-check-circle me-2"></i>
            <strong className="me-auto">Success</strong>
            <small>Just now</small>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            Exit time updated successfully!
          </div>
        </div>
      </div>
    </div>
  );
}

export default GatekeeperPage;