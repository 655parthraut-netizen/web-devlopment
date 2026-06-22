import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/products?category=${encodeURIComponent(category.name)}`);
  };

  return (
    <motion.div
      onClick={handleCategoryClick}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-900 truncate">{category.name}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        </div>
        <div className="p-2 rounded-lg bg-gray-900 text-white opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
