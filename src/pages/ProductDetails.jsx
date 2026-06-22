import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import ReviewCard from '../components/ReviewCard';
import ProductCard from '../components/ProductCard';
import supabase from '../supabase/client';
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  // Page States
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Review states (interactive addition)
  const [reviews, setReviews] = useState([
    { author: 'Jordan K.', rating: 5, date: '2026-06-10T12:00:00Z', comment: 'Incredibly detailed acoustic response. Lows are punching and deep, mids are natural. Hands down the best purchase I have made this year.' },
    { author: 'Elena R.', rating: 4, date: '2026-06-08T09:30:00Z', comment: 'Extremely comfortable ear pads and beautiful minimal trim. Noise cancelling works well on my flights. Battery life seems solid.' }
  ]);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        // Reset qty
        setQuantity(1);

        // Fetch target product
        const { data: currentProduct, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id);

        if (!error && currentProduct && currentProduct.length > 0) {
          const prod = currentProduct[0];
          setProduct(prod);
          setActiveImage(prod.image);

          // Fetch related products (same category, excluding current)
          const { data: related } = await supabase
            .from('products')
            .select('*')
            .eq('category', prod.category);
          
          if (related) {
            setRelatedProducts(related.filter((r) => r.id !== prod.id).slice(0, 3));
          }
        } else {
          // If product not found
          navigate('/not-found');
        }
      } catch (err) {
        console.error('Error fetching PDP product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, navigate]);

  if (loading) {
    return <Loader fullPage />;
  }

  if (!product) {
    return null;
  }

  const isWishlisted = isInWishlist(product.id);
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistClick = () => {
    toggleWishlist(product);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newAuthor.trim() && newComment.trim()) {
      const reviewObj = {
        author: newAuthor,
        rating: Number(newRating),
        date: new Date().toISOString(),
        comment: newComment
      };
      setReviews([reviewObj, ...reviews]);
      setNewAuthor('');
      setNewComment('');
      setNewRating(5);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    }
  };

  return (
    <div className="w-full bg-white text-gray-700 min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 animate-fade-in">
      
      {/* Back to Products */}
      <div className="text-left">
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </button>
      </div>

      {/* Main PDP Split Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Image Gallery */}
        <div className="space-y-6">
          {/* Main Showcase Box - Gray Backdrop */}
          <div className="aspect-square w-full rounded-none border border-gray-100 bg-gray-50 flex items-center justify-center p-8 overflow-hidden relative group">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              src={activeImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-102 transition-transform duration-500"
            />
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-24 h-24 flex-shrink-0 rounded-none border p-2 flex items-center justify-center transition-all duration-300 ${
                    activeImage === imgUrl ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300 bg-white'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details info block */}
        <div className="text-left space-y-8">
          
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              {product.brand}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
              product.stock > 10
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                : product.stock > 0
                ? 'bg-amber-50 border-amber-100 text-amber-700'
                : 'bg-red-50 border-red-100 text-red-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
              }`} />
              <span>
                {product.stock > 10
                  ? 'In Stock'
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : 'Out of Stock'}
              </span>
            </span>
          </div>

          {/* Title & Rating */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight leading-snug break-words">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center text-gray-900 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900">{product.rating}</span>
              <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 inline-flex items-baseline gap-3 flex-wrap break-words">
            <span className="text-2xl sm:text-3xl font-semibold text-gray-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-base text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs font-medium text-red-600">
                  Save {product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Description summary */}
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xl">
            {product.description}
          </p>

          {/* Quantity selector & Add Actions */}
          <div className="space-y-4 pt-6 border-t border-gray-100 max-w-md">
            
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-none bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors text-gray-500 hover:text-black font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors text-gray-500 hover:text-black font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
                className={`flex-grow inline-flex items-center justify-center gap-2 rounded-none px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                  product.stock <= 0
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-extrabold'
                    : 'bg-black border-black text-white hover:bg-gray-800'
                }`}
              >
                {added ? (
                  <>Added to Bag</>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add To Cart
                  </>
                )}
              </button>

              <button
                disabled={product.stock <= 0}
                onClick={handleBuyNow}
                className="flex-grow inline-flex items-center justify-center gap-2 rounded-none border border-black bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all duration-300"
              >
                <ShoppingBag className="h-4 w-4" />
                Buy Now
              </button>

              <button
                onClick={handleWishlistClick}
                className={`p-4 rounded-none border border-gray-200 hover:border-black transition-all duration-300 ${
                  isWishlisted ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-400'
                }`}
              >
                <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

          </div>

          {/* Quick trust metrics */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100 max-w-md text-[11px] font-bold uppercase tracking-widest text-gray-500">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-black" />
              <span>Complimentary Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-black" />
              <span>2-Year Full Warranty</span>
            </div>
          </div>

        </div>

      </div>

      {/* Product Details Specs & Bullet Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-16 border-t border-gray-100 text-left">
        
        {/* Core Bullet Features */}
        <div className="space-y-4 lg:col-span-1">
        <h3 className="font-medium text-sm text-gray-900 border-b border-gray-100 pb-3 mb-4">
            Key features
          </h3>
          <ul className="space-y-3">
            {product.features && product.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-500 leading-relaxed font-normal">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black flex-shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Specifications Grid Table */}
        <div className="space-y-4 lg:col-span-2">
          <h3 className="font-medium text-sm text-gray-900 border-b border-gray-100 pb-3 mb-4">
            Specifications
          </h3>
          <div className="rounded-none border border-gray-100 overflow-hidden bg-white">
            <table className="w-full text-sm text-left border-collapse">
              <tbody>
                {product.specifications && Object.entries(product.specifications).map(([key, value], idx) => (
                  <tr
                    key={key}
                    className={idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-transparent'}
                  >
                    <td className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-black w-1/3 border-b border-gray-100/50">
                      {key}
                    </td>
                    <td className="px-6 py-4 text-gray-600 border-b border-gray-100/50 text-sm font-normal">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Customer Reviews Section */}
      <section className="pt-16 border-t border-gray-100 text-left">
        <h3 className="section-heading mb-8">
          Customer reviews
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.map((rev, idx) => (
              <ReviewCard key={idx} review={rev} />
            ))}
          </div>

          {/* Add Review Form */}
          <div className="lg:col-span-1 p-6 rounded-none border border-gray-100 bg-gray-50 space-y-6">
            <h4 className="font-display font-extrabold text-sm uppercase text-black tracking-wider">
              Write a Review
            </h4>

            {reviewSuccess && (
              <p className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-150 p-3 rounded-none">
                Thank you! Your verified purchase review has been posted.
              </p>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Sterling"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-black rounded-none py-3 px-4 text-sm focus:border-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Overall Rating</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-black rounded-none py-3 px-4 text-sm focus:border-black cursor-pointer"
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Good)</option>
                  <option value="3">3 Stars (Average)</option>
                  <option value="2">2 Stars (Poor)</option>
                  <option value="1">1 Star (Terrible)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-display">Comments</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Share details of your experience with this product..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-black rounded-none py-3 px-4 text-sm focus:border-black resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-none bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors duration-300 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Review
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-16 border-t border-gray-100 text-left">
          <h3 className="section-heading mb-8">
            You may also like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetails;
