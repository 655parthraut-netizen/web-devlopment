import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

const Wishlist = () => {
  const { wishlist } = useCart();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="page-shell min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="p-4 rounded-full bg-gray-50 border border-gray-100 text-gray-400 mb-6">
          <Heart className="h-8 w-8" />
        </div>
        <h1 className="page-heading mb-3">Your wishlist is empty</h1>
        <p className="body-muted max-w-sm mb-8">
          Save items you like and come back to them anytime.
        </p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Browse products
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container space-y-10 animate-fade-in">
        <div className="text-left">
          <span className="eyebrow">Saved items</span>
          <h1 className="page-heading">My wishlist ({wishlist.length})</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
