import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import Loader from './Loader';
import { PackageOpen } from 'lucide-react';

const ProductGrid = ({ products, loading }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return <Loader />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-none border border-gray-100 bg-gray-50">
        <div className="p-4 rounded-none bg-white border border-gray-200 text-black mb-4">
          <PackageOpen className="h-10 w-10" />
        </div>
        <h3 className="font-display font-extrabold text-lg text-black mb-1 uppercase tracking-wider">
          No Products Found
        </h3>
        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
          We couldn't find any products matching your current search or filter criteria. Try adjusting your settings.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGrid;
