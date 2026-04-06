import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import '../Styles/style.css';

function User() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      const searchUsers = async () => {
        try {
          if (searchQuery.trim() === "") {
            fetchUsers();
          } else {
            const res = await axios.get(`http://localhost:4000/api/users/search?q=${searchQuery}`);
            setUsers(res.data);
          }
        } catch (error) {
          console.error("Search failed:", error);
        }
      };
      searchUsers();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this client from the curation?")) {
      axios.delete(`http://localhost:4000/api/users/${id}`)
        .then(() => {
          setUsers(prev => prev.filter(user => user._id !== id));
          toast.success("Client profile archived");
        })
        .catch(() => toast.error("Process failed"));
    }
  };

  return (
    <div className="user-management">
      <Toaster richColors position="top-right" />
      
      <div className="text-head">
        <div>
          CLIENT CURATION
          <span className="d-block mt-1 mt-md-0 d-md-inline ms-md-3">Artisanal user insights</span>
        </div>
        <div className="d-flex w-100 w-md-auto mt-3 mt-md-0">
           <input
              type="search"
              className="form-control w-100"
              style={{ minWidth: '200px', fontSize: '13px' }}
              placeholder="SEARCH..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      <div className="table-wrap">
        <table className="custom-table responsive-card-table">
          <thead>
            <tr>
              <th>Curation Name</th>
              <th className="text-center">Email Address</th>
              <th className="text-center">Concierge Contact</th>
              <th className="text-center">Location</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-5 text-muted">No clients currently in curation</td></tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  <td data-label="Name" style={{ fontWeight: '700' }}>{user.fullName}</td>
                  <td data-label="Email" className="text-center text-muted">{user.email}</td>
                  <td data-label="Contact" className="text-center">{user.mobile || 'N/A'}</td>
                  <td data-label="City" className="text-center" style={{ fontSize: '12px' }}>{user.Address || user.deliveryAddress?.city || 'N/A'}</td>
                  <td data-label="Actions" className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-sm btn-outline-dark border-0 p-2" title="View" onClick={() => navigate(`/users/${user._id}`)}>
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-dark border-0 p-2" title="Edit" onClick={() => navigate(`/users/edit/${user._id}`)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger border-0 p-2" title="Delete" onClick={() => handleDelete(user._id)}>
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default User;
