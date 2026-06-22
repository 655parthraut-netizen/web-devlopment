import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [added, setAdded] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
    >
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
        {product.discount > 0 ? (
          <span className="rounded-md bg-gray-900 px-2 py-0.5 text-[11px] font-medium text-white">
            −{product.discount}%
          </span>
        ) : (
          <div />
        )}
        
        <button
          onClick={handleWishlistClick}
          className="p-2 rounded-lg border border-gray-100 bg-white text-gray-400 hover:text-red-500 hover:border-gray-200 transition-colors"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      <div className="relative w-full aspect-square flex items-center justify-center p-6 bg-gray-50 border-b border-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            className="p-2.5 rounded-lg bg-white text-gray-900 border border-gray-200 shadow-sm hover:bg-gray-900 hover:text-white transition-colors"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-5 text-left flex-grow flex flex-col justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{product.brand}</span>
            <div className="flex items-center gap-1 text-gray-900">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="font-medium">{product.rating}</span>
            </div>
          </div>

          <h3 className="font-medium text-sm text-gray-900 line-clamp-2 leading-snug break-words min-h-[2.5rem]">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex flex-col gap-0.5">
            {product.discount > 0 && (
              <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
            <span className="text-base font-semibold text-gray-900">${discountedPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-lg border transition-colors ${
              product.stock <= 0
                ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-900 hover:text-white hover:border-gray-900'
            }`}
            title="Add to cart"
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
