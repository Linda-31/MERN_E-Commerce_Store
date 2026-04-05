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
        CLIENT CURATION
        <div className="d-flex gap-3">
           <input
              type="search"
              className="form-control"
              style={{ width: '300px', fontSize: '13px' }}
              placeholder="SEARCH CLIENTS..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      <div className="table-wrap">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Curation Name</th>
              <th>Email Address</th>
              <th>Concierge Contact</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-5 text-muted">No clients currently in curation</td></tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  <td style={{ fontWeight: '700' }}>{user.fullName}</td>
                  <td className="text-muted">{user.email}</td>
                  <td>{user.mobile || 'N/A'}</td>
                  <td style={{ fontSize: '12px' }}>{user.Address || user.deliveryAddress?.city || 'N/A'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-dark border-0" onClick={() => navigate(`/users/${user._id}`)}>
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-dark border-0" onClick={() => navigate(`/users/edit/${user._id}`)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleDelete(user._id)}>
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
