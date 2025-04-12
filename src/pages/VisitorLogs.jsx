import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function VisitorLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('cards'); // 'cards' or 'table'

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/visitors');
        if (!response.ok) {
          throw new Error('Failed to fetch visitor logs');
        }
        const data = await response.json();
        setLogs(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching visitor logs:', err);
        setError('Failed to load visitor logs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  const handlePrint = (log) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Visitor ID Card</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .id-card {
              width: 2.25in;
              height: 3.5in;
              border: 1px solid #ccc;
              border-radius: 8px;
              padding: 8px;
              box-sizing: border-box;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .id-card-header {
              background-color: #0d6efd;
              color: white;
              padding: 5px;
              margin: -8px -8px 8px -8px;
              border-radius: 8px 8px 0 0;
            }
            .id-card img {
              width: 1.75in;
              height: 1.75in;
              object-fit: cover;
              margin-bottom: 5px;
              border-radius: 4px;
              border: 1px solid #eee;
            }
            .id-card p {
              font-size: 9px;
              margin: 2px 0;
              line-height: 1.2;
              text-align: left;
            }
            .id-card-footer {
              font-size: 7px;
              margin-top: 5px;
              text-align: center;
              color: #666;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .id-card {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="id-card">
            <div class="id-card-header">
              <h2 style="font-size: 12px; margin: 2px 0;">VISITOR ID CARD</h2>
            </div>
            ${log.photo ? `<img src="${log.photo}" alt="Visitor Photo" />` : '<div style="height: 1.75in; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 4px;"><span>No Photo</span></div>'}
            <p><strong>Name:</strong> ${log.name}</p>
            <p><strong>Phone:</strong> ${log.phone}</p>
            <p><strong>Visiting:</strong> ${log.visiting}</p>
            <p><strong>Purpose:</strong> ${log.purpose}</p>
            <p><strong>Persons:</strong> ${log.numberOfPersons || '1'}</p>
            <p><strong>Entry:</strong> ${new Date(log.entryTime).toLocaleString()}</p>
            <p><strong>Exit:</strong> ${log.exitTime ? new Date(log.exitTime).toLocaleString() : 'Not Yet'}</p>
            <div class="id-card-footer">ID: ${log._id}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredLogs = logs.filter(log => 
    log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.visiting.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.phone.includes(searchTerm)
  );

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 fw-bold text-primary">
              <i className="bi bi-journal-text me-2"></i>
              Visitor Logs
            </h1>
            <div className="btn-group" role="group">
              <button 
                type="button" 
                className={`btn ${view === 'cards' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setView('cards')}
              >
                <i className="bi bi-grid-3x3-gap me-1"></i>
                Card View
              </button>
              <button 
                type="button" 
                className={`btn ${view === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setView('table')}
              >
                <i className="bi bi-table me-1"></i>
                Table View
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search visitor logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={() => setSearchTerm('')}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-md-6 text-md-end mt-3 mt-md-0">
                  <span className="badge bg-primary rounded-pill">
                    {filteredLogs.length} Visitor{filteredLogs.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading visitor logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-file-earmark-x text-secondary" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3 text-muted">No visitor logs found.</p>
            </div>
          ) : view === 'cards' ? (
            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
              {filteredLogs.map((log) => (
                <div key={log._id} className="col">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header bg-primary text-white text-center py-2">
                      <h6 className="card-title m-0">VISITOR ID CARD</h6>
                    </div>
                    <div className="card-body p-3 text-center">
                      {log.photo ? (
                        <img
                          src={log.photo}
                          alt={`${log.name}'s photo`}
                          className="img-fluid mb-3 rounded cursor-pointer"
                          style={{ 
                            width: '100%', 
                            maxHeight: '150px', 
                            objectFit: 'cover',
                            cursor: 'pointer' 
                          }}
                          onClick={() => handlePhotoClick(log.photo)}
                        />
                      ) : (
                        <div className="bg-light d-flex align-items-center justify-content-center mb-3 rounded" style={{ height: '150px' }}>
                          <i className="bi bi-person text-secondary" style={{ fontSize: '3rem' }}></i>
                        </div>
                      )}
                      <div className="small text-start">
                        <p className="mb-1"><strong>Name:</strong> {log.name}</p>
                        <p className="mb-1"><strong>Phone:</strong> {log.phone}</p>
                        <p className="mb-1"><strong>Visiting:</strong> {log.visiting}</p>
                        <p className="mb-1"><strong>Purpose:</strong> {log.purpose}</p>
                        <p className="mb-1"><strong>Persons:</strong> {log.numberOfPersons || '1'}</p>
                        <p className="mb-1">
                          <strong>Entry:</strong> <span className="text-muted">{new Date(log.entryTime).toLocaleString()}</span>
                        </p>
                        <p className="mb-1">
                          <strong>Exit:</strong> 
                          {log.exitTime ? (
                            <span className="text-muted">{new Date(log.exitTime).toLocaleString()}</span>
                          ) : (
                            <span className="badge bg-warning text-dark">Still Inside</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="card-footer bg-white border-top-0">
                      <button
                        className="btn btn-outline-primary btn-sm w-100"
                        onClick={() => handlePrint(log)}
                      >
                        <i className="bi bi-printer me-1"></i>
                        Print ID Card
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Photo</th>
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
                    {filteredLogs.map((log) => (
                      <tr key={log._id}>
                        <td>
                          {log.photo ? (
                            <img
                              src={log.photo}
                              alt={`${log.name}'s photo`}
                              className="rounded"
                              style={{ width: '40px', height: '40px', objectFit: 'cover', cursor: 'pointer' }}
                              onClick={() => handlePhotoClick(log.photo)}
                            />
                          ) : (
                            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                              <i className="bi bi-person text-secondary"></i>
                            </div>
                          )}
                        </td>
                        <td className="fw-bold">{log.name}</td>
                        <td>{log.phone}</td>
                        <td>{log.visiting}</td>
                        <td>{log.purpose}</td>
                        <td className="text-center">
                          <span className="badge bg-secondary rounded-pill">
                            {log.numberOfPersons || '1'}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(log.entryTime).toLocaleString()}
                          </small>
                        </td>
                        <td>
                          {log.exitTime ? (
                            <small className="text-muted">
                              {new Date(log.exitTime).toLocaleString()}
                            </small>
                          ) : (
                            <span className="badge bg-warning text-dark">Still Inside</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handlePrint(log)}
                          >
                            <i className="bi bi-printer"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for displaying the full image */}
      {selectedPhoto && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={closeModal}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Visitor Photo</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body text-center p-0">
                <img
                  src={selectedPhoto}
                  alt="Full-size visitor photo"
                  className="img-fluid"
                  style={{ maxHeight: '70vh' }}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
                <a 
                  href={selectedPhoto} 
                  className="btn btn-primary" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  download="visitor-photo.jpg"
                >
                  <i className="bi bi-download me-1"></i>
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VisitorLogs;