const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  color: { type: String, required: true },
  sizes: { type: [String], required: true },
  image: { type: String, required: true },
  brandName: { type: String, required: true },
  thumbnails: { type: [String], default: [] },
  category: { type: String, required: true }, 
  description: { type: String, required: true },
  stock:  { type: Number, required: true },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [
    {
      name: { type: String, default: "Anonymous" },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }
  ]
},{ timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
