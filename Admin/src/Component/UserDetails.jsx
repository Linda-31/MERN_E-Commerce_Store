import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from './Spinner';

function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://mern-store-server.onrender.com/api/users/${id}`)
      .then(res => setUser(res.data))
      .catch(err => {
        console.error('Failed to fetch user details', err);
        alert('Error loading user details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!user) return <p className="text-center mt-5 text-danger">User not found</p>;

  return (
    <div className="user-details-page">
      <div className="text-head">
        <div>
          CLIENT PROFILE
          <span className="d-block mt-1 mt-md-0 d-md-inline ms-md-3">Concierge Access & Identity</span>
        </div>
        <button 
          className="btn btn-sm btn-outline-dark border-0 mt-2 mt-md-0" 
          onClick={() => window.history.back()}
          style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}
        >
          ← BACK
        </button>
      </div>

      <div className="row g-4">
        {/* Profile Identity Card */}
        <div className="col-lg-4">
          <div className="table-wrap text-center py-5">
            <div className="mb-4 position-relative d-inline-block">
              <img
                src={user.image || user.userPic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt={user.fullName}
                className="rounded-circle shadow-sm"
                style={{ width: "120px", height: "120px", objectFit: "cover", border: '3px solid #f8f9fa' }}
              />
              <span 
                style={{ 
                  position: 'absolute', bottom: '5px', right: '5px', width: '20px', height: '20px', 
                  borderRadius: '50%', background: user.status === 'Active' ? '#2ecc71' : '#e64e4e',
                  border: '3px solid #fff' 
                }}
              ></span>
            </div>
            <h3 style={{ fontWeight: "800", fontSize: "24px", marginBottom: '5px' }}>{user.fullName}</h3>
            <p className="text-mutedSmall mb-4">{user.email}</p>
            
            <div className="d-flex justify-content-center gap-2 mt-2">
               <span style={{ padding: '6px 15px', borderRadius: '50px', fontSize: '10px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: user.status === 'Active' ? '#27ae60' : '#e64e4e', backgroundColor: user.status === 'Active' ? 'rgba(39,174,96,0.1)' : 'rgba(230,78,78,0.1)' }}>
                  {user.status || 'Active'}
               </span>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="col-lg-8">
          <div className="table-wrap h-100">
            <h5 className="table-title">Personal Credentials</h5>
            <div className="row g-4 mt-1">
              <div className="col-md-6">
                <label className="text-mutedSmall d-block mb-1">Full Legal Name</label>
                <div className="fw-bold fs-6">{user.fullName} {user.lastName}</div>
              </div>
              <div className="col-md-6">
                <label className="text-mutedSmall d-block mb-1">Gender / Identity</label>
                <div className="fw-bold fs-6">{user.gender || 'Not Specified'}</div>
              </div>
              <div className="col-md-6">
                <label className="text-mutedSmall d-block mb-1">Concierge Contact</label>
                <div className="fw-bold fs-6">{user.mobile || '—'}</div>
              </div>
              <div className="col-md-6">
                <label className="text-mutedSmall d-block mb-1">Client Since</label>
                <div className="fw-bold fs-6">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : (user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'N/A')}</div>
              </div>
              <div className="col-12 border-top pt-4">
                <label className="text-mutedSmall d-block mb-1">Primary Residence / Delivery</label>
                <div className="fw-bold fs-6">{user.Address || 'No residency registered'}</div>
              </div>
            </div>
            
            <div className="mt-5 pt-3 border-top d-flex gap-3">
               <button className="btn btn-dark px-4 py-2" style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>
                  EDIT PROFILE
               </button>
               <button className="btn btn-outline-danger px-4 py-2" style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>
                  ARCHIVE CLIENT
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
