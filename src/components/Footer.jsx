import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Shield, RotateCcw } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-12 pb-6 text-gray-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div className="space-y-3">
            <span className="font-display text-lg font-semibold tracking-tight text-gray-900">
              Electro<span className="text-gray-400 font-normal">Nova</span>
            </span>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              Premium electronics — mice, keyboards, monitors, and accessories built for everyday performance.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 text-sm mb-4">Quick links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products" className="hover:text-gray-900 transition-colors">All products</Link></li>
              <li><Link to="/products?category=Mice" className="hover:text-gray-900 transition-colors">Mice</Link></li>
              <li><Link to="/products?category=Keyboards" className="hover:text-gray-900 transition-colors">Keyboards</Link></li>
              <li><Link to="/products?category=Monitors" className="hover:text-gray-900 transition-colors">Monitors</Link></li>
              <li><Link to="/about" className="hover:text-gray-900 transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 text-sm mb-4">Why shop with us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-gray-900 shrink-0" />
                <span>Free delivery on all orders</span>
              </li>
              <li className="flex items-center gap-2.5">
                <RotateCcw className="h-4 w-4 text-gray-900 shrink-0" />
                <span>30-day easy returns</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Shield className="h-4 w-4 text-gray-900 shrink-0" />
                <span>2-year warranty included</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-gray-200 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} ElectroNova. All rights reserved.</p>
          <p>
            Designed by <span className="font-semibold text-gray-700">Parth Raut</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
