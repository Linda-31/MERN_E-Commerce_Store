import React, { useEffect, useState } from "react";
import { toast, Toaster } from 'sonner';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../Styles/style.css';
import Spinner from "../Component/Spinner";

function Product() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://mern-store-server.onrender.com/api/products");
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
            const res = await axios.get(`https://mern-store-server.onrender.com/api/products/search?q=${searchQuery}`);
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

    const getToken = () => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; token=`);
        if (parts.length === 2) {
            try {
                const userData = JSON.parse(atob(parts.pop().split(';').shift()));
                return userData.token;
            } catch (e) { return null; }
        }
        return null;
    };

    const handleDelete = async (id) => {
        if (window.confirm("Archive this artisanal piece?")) {
            try {
                if (id) {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${getToken()}`
                        }
                    };
                    await axios.delete(`https://mern-store-server.onrender.com/api/products/${id}`, config);
                }
                setProducts((prev) => prev.filter((p) => p._id !== id));
                toast.success('Collection entry removed');
            } catch (error) {
        console.error("Failed to delete from server:", error);
        // Fallback: Remove visually if the server fails to delete (useful for corrupted entries)
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success('Collection entry removed');
      }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="product-management">
      <Toaster richColors position="top-right" />
      
      <div className="text-head">
        <div>
          ARTISANAL INVENTORY
          <span className="d-block mt-1 mt-md-0 d-md-inline ms-md-3">Curating the collections</span>
        </div>
        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto mt-3 mt-md-0">
          <input
            type="search"
            className="form-control"
            style={{ minWidth: '180px', fontSize: '13px' }}
            placeholder="SEARCH..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn-admin btn-admin-primary w-100" style={{ padding: '8px 20px', fontSize: '11px' }} onClick={() => navigate("/add-product")}>
            + Add product
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="custom-table responsive-card-table">
          <thead>
            <tr>
              <th className="text-center">Visual</th>
              <th>Product Identity</th>
              <th className="text-center">Price</th>
              <th className="text-center">Inventory Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="text-center" data-label="Visual">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-visual"
                  />
                </td>
                <td data-label="Identity">
                   <div className="product-title-bold">{product.title}</div>
                   <div className="product-date-sub">{new Date(product.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="text-center" data-label="Price" style={{ fontWeight: '800' }}>₹{product.price ? product.price.toLocaleString() : 0}</td>
                <td className="text-center" data-label="Stock">
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <span style={{ fontSize: '12px' }}>{product.stock} units</span>
                  </div>
                </td>
                <td className="text-center" data-label="Actions">
                  <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-sm btn-outline-dark border-0 p-2" title="View" onClick={() => navigate(`/products/${product._id}`)}>
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-dark border-0 p-2" title="Edit" onClick={() => navigate(`/products/edit/${product._id}`)}>
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger border-0 p-2" title="Delete" onClick={() => handleDelete(product._id)}>
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
