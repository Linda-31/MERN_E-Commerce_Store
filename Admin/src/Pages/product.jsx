import React, { useEffect, useState } from "react";
import { toast, Toaster } from 'sonner';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../Styles/style.css';

function Product() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/products");
      setProducts(response.data.reverse());
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      const searchProducts = async () => {
        try {
          if (searchQuery.trim() === "") {
            fetchProducts();
          } else {
            const res = await axios.get(`http://localhost:4000/api/products/search?q=${searchQuery}`);
            setProducts(res.data.reverse());
          }
        } catch (error) {
          console.error("Search failed:", error);
        }
      };
      searchProducts();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleDelete = async (id) => {
    if (window.confirm("Archive this artisanal piece?")) {
      try {
        await axios.delete(`http://localhost:4000/api/products/${id}`);
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success('Collection entry removed');
      } catch (error) {
        toast.error('Process failed');
      }
    }
  };

  if (loading) return <div className="p-5 text-center">CURATING COLLECTION...</div>;

  return (
    <div className="product-management">
      <Toaster richColors position="top-right" />
      
      <div className="text-head">
        ARTISANAL INVENTORY
        <div className="d-flex gap-3">
          <input
            type="search"
            className="form-control"
            style={{ width: '300px', fontSize: '13px' }}
            placeholder="SEARCH INVENTORY..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn-admin btn-admin-primary" style={{ padding: '10px 25px' }} onClick={() => navigate("/add-product")}>
            + curated piece
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Visual</th>
              <th>Product Identity</th>
              <th>Price</th>
              <th>Inventory Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: "50px", height: "65px", objectFit: "cover", borderRadius: "2px" }}
                  />
                </td>
                <td>
                   <div style={{ fontWeight: '700' }}>{product.title}</div>
                   <div style={{ fontSize: '11px', color: '#888' }}>{new Date(product.createdAt).toLocaleDateString()}</div>
                </td>
                <td style={{ fontWeight: '800' }}>₹{product.price.toLocaleString()}</td>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <span style={{ fontSize: '12px', minWidth: '40px' }}>{product.stock}</span>
                    <div className="progress flex-grow-1" style={{ height: '3px', maxWidth: '100px' }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.min((product.stock / 500) * 100, 100)}%`,
                          backgroundColor: product.stock > 100 ? '#000' : '#e64e4e'
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-dark border-0" onClick={() => navigate(`/products/${product._id}`)}>
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-dark border-0" onClick={() => navigate(`/products/edit/${product._id}`)}>
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleDelete(product._id)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

}

export default Product;
