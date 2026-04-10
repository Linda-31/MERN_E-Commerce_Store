import { useForm } from 'react-hook-form';
import "../Styles/style.css";
import axios from "axios";
import { toast } from "sonner";


function Filter({ onApply }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { colors: [], sizes: [], minPrice: '', maxPrice: '' }
  });

const onSubmit = async (data) => {
  try {
    const res = await axios.post("/api/products/filter", data);
    onApply(res.data); 
  } catch (err) {
    console.error("Error applying filters:", err);
    toast.error("Failed to apply filters");
  }
};


  const handleClear = async () => {
    reset();
    window.location.reload();
    try {
     const res = await axios.get("/api/products");
      onApply(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to fetch products");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 250, fontFamily: "'Jost', sans-serif" }}>
      <h4 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '20px', color: '#000' }}>Product color</h4>
      <div className="mt-3">
        {['Red', 'Blue', 'Black', 'White', 'Brown', 'Green'].map(color => (
          <div className="form-check" key={color}>
            <input
              type="checkbox"
              className="form-check-input"
              id={`color-${color}`}
              value={color.toLowerCase()}
              {...register("colors")}
            />
            <label className="form-check-label" htmlFor={`color-${color}`}>{color}</label>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h4 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '20px', color: '#000' }}>Product size</h4>
        {['S', 'M', 'L', 'XL'].map(size => (
          <div className="form-check" key={size}>
            <input
              type="checkbox"
              className="form-check-input"
              id={`size-${size}`}
              value={size}
              {...register("sizes")}
            />
            <label className="form-check-label" htmlFor={`size-${size}`}>{size}</label>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h4 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '20px', color: '#000' }}>Product price</h4>
        <div className="d-flex gap-2">
          <input type="number" className="form-control" placeholder="Min" {...register("minPrice")} />
          <input type="number" className="form-control" placeholder="Max" {...register("maxPrice")} />
        </div>
      </div>
      

      <button 
        type="submit" 
        className="btn w-100 mt-5" 
        style={{ backgroundColor:'#000', color: '#fff', border: 'none', borderRadius: '0', padding: '12px', fontWeight: 'bold', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}
      >
        Apply Filters
      </button>
      <button 
        type="button" 
        className="btn w-100 mt-2" 
        onClick={handleClear}
        style={{ background: 'transparent', color: '#888', border: '1px solid #eee', borderRadius: '0', padding: '12px', fontSize: '11px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}
      >
        Clear Selection
      </button>
    </form>
  );
}

export default Filter;
