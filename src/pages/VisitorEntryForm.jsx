import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

function VisitorEntryForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    visiting: '',
    purpose: '',
    photo: '',
    numberOfPersons: 1,
  });

  const [phoneError, setPhoneError] = useState('');
  const [entryTime] = useState(new Date());
  const [submittedData, setSubmittedData] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'phone') {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) {
        setPhoneError('Phone number must be exactly 10 digits.');
      } else {
        setPhoneError('');
      }
    }
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setFormData({ ...formData, photo: imageSrc });
      setShowWebcam(false);
    } else {
      console.error('Webcam not initialized');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phoneError) {
      return;
    }

    if (!formData.photo) {
      alert('Please capture a photo before submitting.');
      return;
    }

    const visitorData = { ...formData, entryTime };
    try {
      const response = await fetch('https://your-backend-url.onrender.com/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitorData),
      });
      if (!response.ok) {
        throw new Error('Failed to submit visitor data');
      }
      const savedData = await response.json();
      setSubmittedData(savedData);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        visiting: '',
        purpose: '',
        photo: '',
        numberOfPersons: 1,
      });
    } catch (error) {
      console.error('Error submitting visitor data:', error);
      alert('Failed to submit visitor data. Please try again.');
    }
  };

  const handlePrint = () => {
    if (!submittedData) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Visitor Pass</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .id-card {
              width: 2.25in;
              height: 3.5in;
              border: 1px solid #000;
              border-radius: 10px;
              padding: 10px;
              box-sizing: border-box;
              text-align: center;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .id-card img {
              width: 1.75in;
              height: 1.75in;
              object-fit: cover;
              margin-bottom: 8px;
              border-radius: 5px;
            }
            .id-card p {
              font-size: 9px;
              margin: 2px 0;
              line-height: 1.2;
            }
            .id-card h2 {
              background-color: #007bff;
              color: white;
              padding: 5px;
              margin-top: 0;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="id-card">
            <h2 class="fs-6 mb-2">VISITOR PASS</h2>
            ${submittedData.photo ? `<img src="${submittedData.photo}" alt="Visitor Photo" />` : '<p>No Photo</p>'}
            <p><strong>Name:</strong> ${submittedData.name}</p>
            <p><strong>Phone:</strong> ${submittedData.phone}</p>
            <p><strong>Visiting:</strong> ${submittedData.visiting}</p>
            <p><strong>Purpose:</strong> ${submittedData.purpose}</p>
            <p><strong>Persons:</strong> ${submittedData.numberOfPersons || 'N/A'}</p>
            <p><strong>Entry:</strong> ${new Date(submittedData.entryTime).toLocaleString()}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0 text-center">Visitor Management System</h2>
            </div>
            <div className="card-body">
              {!submittedData ? (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">Personal Information</h5>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="form-control"
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input
                              type="text"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                              required
                            />
                            {phoneError && <div className="invalid-feedback">{phoneError}</div>}
                          </div>
                          <div className="mb-3">
                            <label htmlFor="numberOfPersons" className="form-label">Number of Persons</label>
                            <input
                              type="number"
                              id="numberOfPersons"
                              name="numberOfPersons"
                              value={formData.numberOfPersons}
                              onChange={handleInputChange}
                              className="form-control"
                              min="1"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">Visit Details</h5>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <label htmlFor="visiting" className="form-label">Person to Visit</label>
                            <input
                              type="text"
                              id="visiting"
                              name="visiting"
                              value={formData.visiting}
                              onChange={handleInputChange}
                              className="form-control"
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="purpose" className="form-label">Purpose of Visit</label>
                            <select
                              id="purpose"
                              name="purpose"
                              value={formData.purpose}
                              onChange={handleInputChange}
                              className="form-select"
                              required
                            >
                              <option value="">Select purpose</option>
                              <option value="Meeting">Meeting</option>
                              <option value="Interview">Interview</option>
                              <option value="Delivery">Delivery</option>
                              <option value="Personal Visit">Personal Visit</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Entry Time</label>
                            <input
                              type="text"
                              className="form-control"
                              value={entryTime.toLocaleString()}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-4">
                      <div className="card">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">Visitor Photo</h5>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-primary"
                            onClick={() => setShowWebcam(!showWebcam)}
                          >
                            {showWebcam ? 'Hide Camera' : 'Show Camera'}
                          </button>
                        </div>
                        <div className="card-body text-center">
                          {showWebcam ? (
                            <div className="mb-3">
                              <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="img-fluid rounded"
                                style={{ maxHeight: '300px' }}
                              />
                              <button 
                                type="button" 
                                className="btn btn-success mt-2"
                                onClick={handleCapture}
                              >
                                Capture Photo
                              </button>
                            </div>
                          ) : (
                            <div className="text-center">
                              {formData.photo ? (
                                <div>
                                  <img 
                                    src={formData.photo} 
                                    alt="Visitor" 
                                    className="img-thumbnail" 
                                    style={{ height: '200px' }} 
                                  />
                                  <div className="mt-2">
                                    <span className="badge bg-success">Photo Captured</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="border rounded p-5 bg-light">
                                  <i className="bi bi-camera fs-1"></i>
                                  <p>No photo captured</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                    <button type="reset" className="btn btn-secondary me-md-2">Reset</button>
                    <button type="submit" className="btn btn-primary">Submit Entry</button>
                  </div>
                </form>
              ) : (
                <div className="row">
                  <div className="col-md-7">
                    <div className="alert alert-success" role="alert">
                      <h4 className="alert-heading">Entry Recorded Successfully!</h4>
                      <p>Visitor details have been saved. You can print the visitor pass now.</p>
                    </div>
                    
                    <div className="card">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Visitor Details</h5>
                      </div>
                      <div className="card-body">
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <p><strong>Name:</strong> {submittedData.name}</p>
                            <p><strong>Phone:</strong> {submittedData.phone}</p>
                            <p><strong>Number of Persons:</strong> {submittedData.numberOfPersons}</p>
                          </div>
                          <div className="col-md-6">
                            <p><strong>Visiting:</strong> {submittedData.visiting}</p>
                            <p><strong>Purpose:</strong> {submittedData.purpose}</p>
                            <p><strong>Entry Time:</strong> {new Date(submittedData.entryTime).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                          <button 
                            onClick={() => setSubmittedData(null)} 
                            className="btn btn-primary me-md-2"
                          >
                            New Entry
                          </button>
                          <button 
                            onClick={handlePrint} 
                            className="btn btn-success"
                          >
                            <i className="bi bi-printer me-1"></i> Print Pass
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="card">
                      <div className="card-header bg-primary text-white">
                        <h5 className="mb-0 text-center">Visitor Pass Preview</h5>
                      </div>
                      <div className="card-body d-flex justify-content-center">
                        <div style={{
                          width: '2.25in',
                          border: '1px solid #000',
                          borderRadius: '10px',
                          padding: '10px',
                          textAlign: 'center',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}>
                          <h6 className="bg-primary text-white p-1 rounded">VISITOR PASS</h6>
                          {submittedData.photo && (
                            <img
                              src={submittedData.photo}
                              alt="Visitor"
                              style={{ width: '1.75in', height: '1.75in', objectFit: 'cover', borderRadius: '5px' }}
                              className="mb-2"
                            />
                          )}
                          <div style={{ fontSize: '9px', lineHeight: '1.2' }}>
                            <p className="mb-1"><strong>Name:</strong> {submittedData.name}</p>
                            <p className="mb-1"><strong>Phone:</strong> {submittedData.phone}</p>
                            <p className="mb-1"><strong>Visiting:</strong> {submittedData.visiting}</p>
                            <p className="mb-1"><strong>Purpose:</strong> {submittedData.purpose}</p>
                            <p className="mb-1"><strong>Persons:</strong> {submittedData.numberOfPersons}</p>
                            <p className="mb-1"><strong>Entry:</strong> {new Date(submittedData.entryTime).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisitorEntryForm;