# ElectroNova — Premium Luxury Electronics Store

ElectroNova is a complete, fully featured e-commerce website designed around a sleek, dark-themed luxury aesthetic. Drawing inspiration from flagship technology brands like Apple and Sony, it showcases high-end audio gear and personal electronics with premium glassmorphism elements, fluid page transitions, and smooth hover micro-animations.

---

## 🌟 Key Features

### 🛒 Complete Shopping Cart & Wishlist System
- Add/remove items and increase/decrease purchase quantities dynamically.
- Interactive user wishlist to save products for later.
- Intelligent synchronization: Guests use local caching (`localStorage`) which merges seamlessly with Supabase database rows when logging in.

### 🔍 Search & Multi-Tier Catalog Filtering
- Real-time catalog searching.
- Filter products instantly by category (Headphones, Laptops, Smartphones, Smart Watches, Gaming) and customized price caps.
- Dynamic sorting by Top Rated popularity, Price (Ascending/Descending), or highest Promotional Discounts.

### 💳 Simulated Checkout Experience
- Shipping address collection.
- Simulated secure SSL payment inputs (no actual charges processed).
- Animated order placement success displays producing transaction order IDs.

### 🔑 Authentication & Order Tracking Profile
- Complete user registration, login, and session tracking.
- Secured user profile displaying registration dates and chronological past order histories.

### 🔌 Seamless Offline Fallback Layer
- If Supabase environment variables are not supplied, the app gracefully degrades to client-side mode, operating authentication, cart syncing, wishlists, and orders through `localStorage` out-of-the-box.

---

## 🛠️ Technology Stack

- **Frontend Core**: React.js (v19) + Vite (v8)
- **Styling**: Tailwind CSS (v4) with custom Outfit & Inter typography
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database & Auth**: Supabase

---

## 🚀 Installation & Local Run

### 1. Clone the repository and install dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Create a `.env` file in the root directory and specify your Supabase keys:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*Note: If you do not create a `.env` file, ElectroNova will run automatically using its high-fidelity mock client-side database layer.*

### 3. Launch Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🗄️ Supabase Database Schema

To initialize the database on your Supabase instance, execute the following SQL scripts in the Supabase **SQL Editor**:

```sql
-- 1. Products Catalog Table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    image TEXT NOT NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    category TEXT NOT NULL,
    description TEXT,
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    specifications JSONB DEFAULT '{}'::jsonb,
    rating NUMERIC DEFAULT 4.5,
    stock INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Shopping Cart Table
CREATE TABLE public.cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Wishlist Saved Items Table
CREATE TABLE public.wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Customer Orders Table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    items JSONB NOT NULL, -- Holds structural array containing item price, quantity, and name
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'Pending' NOT NULL,
    shipping_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on user transactions
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Select policy for public viewing of products catalog
CREATE POLICY "Allow public read access to products" ON public.products
    FOR SELECT USING (true);

-- User isolated policies for Cart
CREATE POLICY "Manage own cart" ON public.cart
    FOR ALL USING (auth.uid() = user_id);

-- User isolated policies for Wishlist
CREATE POLICY "Manage own wishlist" ON public.wishlist
    FOR ALL USING (auth.uid() = user_id);

-- User isolated policies for Orders
CREATE POLICY "Manage own orders" ON public.orders
    FOR ALL USING (auth.uid() = user_id);
```

### Initial Seed Data

Run this insert query to populate the database with the initial flagship products:

```sql
INSERT INTO public.products (name, brand, price, discount, image, images, category, description, features, specifications, rating, stock)
VALUES 
('Horizon ANC Headphones', 'ElectroNova', 349.99, 15, '/images/hero_headphones.png', ARRAY['/images/hero_headphones.png', '/images/product_headphones.png'], 'Headphones', 'Flagship over-ear active noise-cancelling headphones featuring acoustic soundstage, premium obsidian black leather, brushed gold metal casing, and up to 40 hours of high-fidelity playback.', ARRAY['Adaptive Active Noise Cancellation', 'Custom 40mm Beryllium Drivers', '40-Hour Battery Life with Fast Charge', 'Brushed Gold Aluminum Architecture', 'Bluetooth 5.3 with LDAC Support'], '{"Frequency Range": "4Hz - 40kHz", "Impedance": "32 Ohm", "Driver Size": "40mm", "Weight": "290g", "Charging Port": "USB Type-C"}'::jsonb, 4.9, 24),

('Signature Pro Wireless', 'ElectroNova', 249.99, 10, '/images/product_headphones.png', ARRAY['/images/product_headphones.png', '/images/hero_headphones.png'], 'Headphones', 'Acoustically tuned for sound purists, the Signature Pro wireless headphones deliver absolute clarity with customizable EQ, plush comfort, and ultra low-latency connection.', ARRAY['Studio Grade Audio Quality', 'Ultra-Soft Memory Foam Ear Cups', 'Multi-Device Smart Connection', 'Hi-Res Audio Certified', 'Dual MEMS Beamforming Mics'], '{"Frequency Range": "10Hz - 35kHz", "Impedance": "28 Ohm", "Driver Size": "38mm", "Weight": "270g", "Charging Port": "USB Type-C"}'::jsonb, 4.7, 18),

('Apex Phone 15 Pro', 'ElectroNova', 1099.99, 5, '/images/product_smartphone.png', ARRAY['/images/product_smartphone.png'], 'Smartphones', 'Revolutionary sleek design featuring a ceramic-titanium build, edge-to-edge golden fluid AMOLED screen, and an advanced quad-lens camera array with neural capabilities.', ARRAY['6.8-inch Fluid AMOLED Display', 'Obsidian Ceramic Back with Titanium Edges', 'Quad-Lens 200MP Neural Camera System', 'Octa-Core 3.5GHz Ultra Processor', '65W Super-charge Battery'], '{"Processor": "NovaChip A18 Octa-Core", "RAM": "12GB LPDDR5", "Storage": "256GB / 512GB UFS 4.0", "Display": "6.8 inch 120Hz Dynamic AMOLED", "Battery": "5000 mAh"}'::jsonb, 4.8, 12),

('BladeBook 16 Carbon', 'ElectroNova', 1999.99, 12, '/images/product_laptop.png', ARRAY['/images/product_laptop.png'], 'Laptops', 'Ultra-premium, slim carbon laptop built for creators and gamers. Backed by elite graphics, custom liquid-metal cooling mechanics, and a gold backlit keyboard layout.', ARRAY['16-inch Mini-LED 165Hz Screen', 'Carbon-Fiber Reinforcement Core Frame', 'RGB Gold Backlit Custom Typing Layout', 'Liquid-Metal Thermal Regulation System', 'Studio Grade Spatial Speaker Array'], '{"Processor": "Intel Core i9 14th Gen", "Graphics": "NVIDIA RTX 4080 Laptop GPU", "RAM": "32GB DDR5", "Storage": "1TB NVMe PCIe Gen 4 SSD", "Display": "16-inch 165Hz 2.5K Mini-LED"}'::jsonb, 4.9, 8),

('Chrono X Active Smartwatch', 'ElectroNova', 399.99, 20, '/images/product_smartwatch.png', ARRAY['/images/product_smartwatch.png'], 'Smart Watches', 'Elegant luxury design that stands up to the elements. Features a deep brushed titanium casing, customizable wellness displays, and water-resistance up to 100 meters.', ARRAY['Rugged Solid Titanium Case', 'Always-On High Brightness AMOLED', 'All-Day Blood-Oxygen & Heart Tracking', 'Offline GPS Mapping & Compass Navigation', 'Up to 7 Days Battery Life'], '{"Case Material": "Titanium Alloy Grade 5", "Water Resistance": "10 ATM (100m)", "Display": "1.92-inch AMOLED Always-On", "Sensors": "Compass, Altimeter, Heart-rate, SpO2"}'::jsonb, 4.6, 30),

('Nebula Precision Controller', 'ElectroNova', 129.99, 15, '/images/product_gaming.png', ARRAY['/images/product_gaming.png'], 'Gaming', 'Professional grade wireless console controller with customizable stick tensions, glossy golden triggers, and customizable electric cyan LED visual strips.', ARRAY['Custom Hall-Effect Analog Sticks', 'Adjustable Mechanical Trigger Pulls', 'Vibrant Cyan LED Accent Mapping', 'Swappable Modular Components', 'Low Latency Wireless Adapter Included'], '{"Connectivity": "2.4GHz Wireless / Bluetooth / Wired", "Battery Life": "20 Hours Rechargeable", "Compatible Systems": "PC, PlayStation, Xbox, Android", "Weight": "245g"}'::jsonb, 4.5, 45);
```

---

## 🎨 Design Theme & Styling Details

The website incorporates deep dark obsidian values (e.g. background `#070708` and gray `#1b1b1f`) accented with premium luxury gold highlights (`#d4af37`). 

### Core Custom Colors Used:
- **Obsidian 950**: `#070708` (Obsidian Base)
- **Obsidian 900**: `#0f0f12` (Card and layout divisions)
- **Gold 500**: `#d4af37` (Aesthetic accents and CTA buttons)
- **Glassmorphism**: Backdrop blur overlays of 12px with 5% transparency bounds.
