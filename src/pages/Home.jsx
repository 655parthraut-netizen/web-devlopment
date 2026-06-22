import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Features from '../components/Features';
import Loader from '../components/Loader';
import supabase from '../supabase/client';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('rating', { ascending: false });

        if (!error && data) {
          setFeaturedProducts(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const categories = [
    {
      name: 'Mice',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop',
      count: 1,
      description: 'Precision wireless and gaming mice.',
    },
    {
      name: 'Keyboards',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=400&fit=crop',
      count: 1,
      description: 'Mechanical and RGB keyboards.',
    },
    {
      name: 'Monitors',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=400&fit=crop',
      count: 1,
      description: '4K displays for work and play.',
    },
    {
      name: 'Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
      count: 1,
      description: 'Studio-grade audio with ANC.',
    },
  ];

  return (
    <div className="w-full bg-white text-gray-700 animate-fade-in">
      <HeroSection />

      <section className="py-14 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-left mb-8">
          <span className="eyebrow">Categories</span>
          <h2 className="section-heading">Shop by type</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
            >
              <CategoryCard category={cat} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-14 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 text-left gap-4">
          <div>
            <span className="eyebrow">Top rated</span>
            <h2 className="section-heading">Featured products</h2>
          </div>
          <Link
            to="/products"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Features />
    </div>
  );
};

export default Home;
