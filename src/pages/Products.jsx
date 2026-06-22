import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import Loader from '../components/Loader';
import supabase from '../supabase/client';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  // Component Filter/Search states
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(500);
  const [sortBy, setSortBy] = useState('rating'); // rating, price-asc, price-desc, discount
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Sync state if category changes in URL parameter (e.g. from nav clicks)
  useEffect(() => {
    const urlCat = searchParams.get('category') || 'All';
    setSelectedCategory(urlCat);
  }, [searchParams]);

  // Load all products initially
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching catalog products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter & Sort logic applied locally for ultra-fast instantaneous responses
  useEffect(() => {
    let result = [...products];

    // 1. Text Search Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 3. Price Filter (checking discounted price rather than retail price)
    result = result.filter((p) => {
      const finalPrice = p.price * (1 - (p.discount || 0) / 100);
      return finalPrice <= priceRange;
    });

    // 4. Sorting
    result.sort((a, b) => {
      const finalPriceA = a.price * (1 - (a.discount || 0) / 100);
      const finalPriceB = b.price * (1 - (b.discount || 0) / 100);

      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return finalPriceA - finalPriceB;
      if (sortBy === 'price-desc') return finalPriceB - finalPriceA;
      if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
      return 0;
    });

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    if (categoryName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryName);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceRange(500);
    setSortBy('rating');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const categories = ['All', 'Mice', 'Keyboards', 'Monitors', 'Headphones', 'Webcams', 'Accessories'];

  return (
    <div className="w-full bg-white min-h-screen text-gray-700 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      
      <div className="text-left mb-10">
        <span className="eyebrow">Catalog</span>
        <h1 className="page-heading">All products</h1>
      </div>

      {/* Catalog Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 pb-6 border-b border-gray-100">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md flex items-center">
          <Search className="absolute left-4 h-4.5 w-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search mouse, keyboard, monitor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg py-3 pl-11 pr-10 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 p-1 text-gray-400 hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort & Action controls */}
        <div className="flex w-full md:w-auto items-center justify-between sm:justify-end gap-4">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFiltersMobile(true)}
            className="flex md:hidden items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 hover:border-gray-300"
          >
            <SlidersHorizontal className="h-4.5 w-4.5 text-black" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="relative flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5">
            <ArrowUpDown className="h-4 w-4 text-gray-500 mr-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-900 focus:outline-none cursor-pointer pr-2 border-none"
            >
              <option value="rating">Top rated</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="discount">Best deals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Filters Column Layout */}
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Left Sidebar Filter Column (Desktop Only) */}
        <aside className="hidden md:block w-64 flex-shrink-0 text-left space-y-8">
          
          {/* Category Filter */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-900">
              Categories
            </h3>
            <div className="flex flex-col space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? 'text-gray-900 bg-gray-100 font-medium'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-gray-900">
                Price cap
              </h3>
              <span className="text-sm font-medium text-gray-900">${priceRange}</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-100 rounded-none appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[10px] font-bold text-gray-400">
              <span>$50</span>
              <span>$500</span>
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleClearFilters}
            className="w-full py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear filters
          </button>
        </aside>

        {/* Right Products Cards Grid */}
        <main className="flex-grow">
          {loading ? (
            <Loader />
          ) : (
            <>
              {/* Filter feedback tags */}
              {(selectedCategory !== 'All' || searchQuery !== '' || priceRange < 500) && (
                <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span>Active filters:</span>
                  {selectedCategory !== 'All' && (
                    <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1 rounded-none text-black text-[10px]">
                      Category: {selectedCategory}
                      <X className="h-3 w-3 text-black cursor-pointer hover:text-red-500" onClick={() => handleCategorySelect('All')} />
                    </span>
                  )}
                  {searchQuery !== '' && (
                    <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1 rounded-none text-black text-[10px]">
                      Search: "{searchQuery}"
                      <X className="h-3 w-3 text-black cursor-pointer hover:text-red-500" onClick={() => setSearchQuery('')} />
                    </span>
                  )}
                  {priceRange < 500 && (
                    <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1 rounded-none text-black text-[10px]">
                      Under: ${priceRange}
                      <X className="h-3 w-3 text-black cursor-pointer hover:text-red-500" onClick={() => setPriceRange(500)} />
                    </span>
                  )}
                  <button
                    onClick={handleClearFilters}
                    className="text-black hover:underline font-extrabold ml-2 text-[10px]"
                  >
                    Reset
                  </button>
                </div>
              )}

              <ProductGrid products={filteredProducts} loading={loading} />
            </>
          )}
        </main>
      </div>

      {/* Collapsible Mobile Drawer Filters Menu */}
      <AnimatePresence>
        {showFiltersMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersMobile(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white border-r border-gray-100 p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-8 text-left">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h3 className="font-display font-extrabold text-black text-lg uppercase tracking-wider">Filters</h3>
                  <button onClick={() => setShowFiltersMobile(false)} className="p-1 text-gray-400 hover:text-black">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                  <h4 className="font-display font-extrabold text-black tracking-wider uppercase text-xs">
                    Categories
                  </h4>
                  <div className="flex flex-col space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          handleCategorySelect(cat);
                          setShowFiltersMobile(false);
                        }}
                        className={`text-left text-xs uppercase tracking-wider font-bold py-2.5 px-3 rounded-none transition-colors ${
                          selectedCategory === cat
                            ? 'text-black bg-gray-50 border-l-2 border-black'
                            : 'text-gray-500 hover:text-black hover:bg-gray-50/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price cap */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-extrabold text-black tracking-wider uppercase text-xs">
                      Price Cap
                    </h4>
                    <span className="text-xs font-extrabold text-black">${priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="50"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-none appearance-none cursor-pointer accent-black"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                <button
                  onClick={() => {
                    handleClearFilters();
                    setShowFiltersMobile(false);
                  }}
                  className="w-full py-3.5 rounded-none border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="w-full py-3.5 rounded-none bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Products;
