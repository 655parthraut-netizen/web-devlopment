import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasValidCredentials =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_url' &&
  supabaseAnonKey !== 'your_supabase_anon_key';

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@electronova.com';
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@123';

const PRODUCT_DATA_VERSION = 'v2-electronics';

const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    name: 'Pulse Pro Wireless Mouse',
    brand: 'ElectroNova',
    price: 79.99,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7f39b7?w=600&h=600&fit=crop',
    ],
    category: 'Mice',
    description:
      'Ergonomic wireless mouse with precision 26K DPI sensor, silent clicks, and 70-hour battery life. Perfect for work and gaming.',
    features: [
      '26,000 DPI Optical Sensor',
      '70-Hour Rechargeable Battery',
      'Silent Click Technology',
      'Bluetooth & 2.4GHz Dual Mode',
      '6 Programmable Buttons',
    ],
    specifications: {
      DPI: '26,000',
      Connectivity: 'Bluetooth 5.0 / 2.4GHz',
      Battery: '70 hours',
      Weight: '89g',
      'Charging Port': 'USB-C',
    },
    rating: 4.8,
    stock: 42,
    created_at: '2026-06-11T00:00:00Z',
  },
  {
    id: 'p2',
    name: 'Apex Mechanical RGB Keyboard',
    brand: 'ElectroNova',
    price: 149.99,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=600&fit=crop',
    ],
    category: 'Keyboards',
    description:
      'Hot-swappable mechanical keyboard with per-key RGB lighting, PBT keycaps, and tactile switches for a premium typing experience.',
    features: [
      'Hot-Swappable Switches',
      'Per-Key RGB Backlight',
      'PBT Double-Shot Keycaps',
      'Aluminum Top Frame',
      'USB-C Detachable Cable',
    ],
    specifications: {
      Layout: 'TKL (87 keys)',
      Switches: 'Tactile Brown',
      'Polling Rate': '1000Hz',
      Material: 'Aluminum + ABS',
      Backlight: 'RGB per key',
    },
    rating: 4.9,
    stock: 28,
    created_at: '2026-06-11T00:00:00Z',
  },
  {
    id: 'p3',
    name: 'Vision 27" 4K Monitor',
    brand: 'ElectroNova',
    price: 399.99,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop'],
    category: 'Monitors',
    description:
      'Ultra-sharp 4K IPS display with 144Hz refresh rate, HDR400, and slim bezels. Ideal for creators and competitive gamers.',
    features: [
      '4K UHD 3840×2160 Resolution',
      '144Hz Refresh Rate',
      'IPS Panel with HDR400',
      '99% sRGB Color Accuracy',
      'Height-Adjustable Stand',
    ],
    specifications: {
      Size: '27 inches',
      Resolution: '3840 × 2160',
      'Refresh Rate': '144Hz',
      Panel: 'IPS',
      Ports: 'HDMI 2.1, DisplayPort 1.4, USB-C',
    },
    rating: 4.7,
    stock: 15,
    created_at: '2026-06-11T00:00:00Z',
  },
  {
    id: 'p4',
    name: 'Studio ANC Headphones',
    brand: 'ElectroNova',
    price: 249.99,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
    ],
    category: 'Headphones',
    description:
      'Over-ear headphones with adaptive noise cancellation, 40mm drivers, and 35-hour battery for all-day comfort and clarity.',
    features: [
      'Adaptive Active Noise Cancellation',
      '40mm Hi-Res Drivers',
      '35-Hour Battery Life',
      'Memory Foam Ear Cushions',
      'Multipoint Bluetooth 5.3',
    ],
    specifications: {
      'Driver Size': '40mm',
      'Frequency Range': '20Hz – 40kHz',
      'Battery Life': '35 hours',
      Weight: '260g',
      'Charging Port': 'USB-C',
    },
    rating: 4.8,
    stock: 36,
    created_at: '2026-06-11T00:00:00Z',
  },
  {
    id: 'p5',
    name: 'StreamCam 4K Webcam',
    brand: 'ElectroNova',
    price: 129.99,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1587826080692-f439e9779791?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1587826080692-f439e9779791?w=600&h=600&fit=crop'],
    category: 'Webcams',
    description:
      '4K webcam with auto-focus, built-in ring light, and dual noise-canceling mics. Look professional on every video call.',
    features: [
      '4K 30fps / 1080p 60fps',
      'Auto-Focus with Face Tracking',
      'Built-in Ring Light',
      'Dual Noise-Canceling Microphones',
      'Privacy Shutter Cover',
    ],
    specifications: {
      Resolution: '4K @ 30fps',
      'Field of View': '90°',
      Focus: 'Auto-focus',
      Mount: 'Clip + Tripod Thread',
      Connection: 'USB 3.0',
    },
    rating: 4.6,
    stock: 50,
    created_at: '2026-06-11T00:00:00Z',
  },
  {
    id: 'p6',
    name: 'ConnectHub USB-C Dock',
    brand: 'ElectroNova',
    price: 59.99,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1625948515291-69613ac7651f?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1625948515291-69613ac7651f?w=600&h=600&fit=crop'],
    category: 'Accessories',
    description:
      'Compact 7-in-1 USB-C hub with 4K HDMI, SD card reader, and 100W pass-through charging for laptops and tablets.',
    features: [
      '4K HDMI Output',
      '100W Power Delivery',
      'SD & microSD Card Reader',
      '3× USB 3.0 Ports',
      'Aluminum Unibody Design',
    ],
    specifications: {
      Ports: 'HDMI, USB-C PD, 3× USB-A, SD/microSD',
      'Power Delivery': '100W',
      'HDMI Output': '4K @ 60Hz',
      Material: 'Aluminum',
      Cable: '15cm braided USB-C',
    },
    rating: 4.5,
    stock: 64,
    created_at: '2026-06-11T00:00:00Z',
  },
];

let supabaseClient;
let isMockClient = false;

if (hasValidCredentials) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  isMockClient = true;

  const storedVersion = localStorage.getItem('electronova_data_version');
  if (storedVersion !== PRODUCT_DATA_VERSION) {
    localStorage.setItem('electronova_products', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('electronova_data_version', PRODUCT_DATA_VERSION);
  } else if (!localStorage.getItem('electronova_products')) {
    localStorage.setItem('electronova_products', JSON.stringify(INITIAL_PRODUCTS));
  }

  if (!localStorage.getItem('electronova_users')) {
    localStorage.setItem('electronova_users', JSON.stringify([]));
  }
  if (!localStorage.getItem('electronova_cart')) {
    localStorage.setItem('electronova_cart', JSON.stringify([]));
  }
  if (!localStorage.getItem('electronova_wishlist')) {
    localStorage.setItem('electronova_wishlist', JSON.stringify([]));
  }
  if (!localStorage.getItem('electronova_orders')) {
    localStorage.setItem('electronova_orders', JSON.stringify([]));
  }

  const getTable = (name) => JSON.parse(localStorage.getItem(`electronova_${name}`) || '[]');
  const setTable = (name, data) => localStorage.setItem(`electronova_${name}`, JSON.stringify(data));

  let authListeners = [];

  const triggerAuthChange = (event, session) => {
    authListeners.forEach((listener) => listener(event, session));
  };

  supabaseClient = {
    isMock: true,
    from: (tableName) => {
      return {
        select: () => {
          let data = getTable(tableName);

          const chain = {
            eq: (column, value) => {
              data = data.filter((item) => item[column] === value);
              return chain;
            },
            order: (column, { ascending = true } = {}) => {
              data = [...data].sort((a, b) => {
                if (a[column] < b[column]) return ascending ? -1 : 1;
                if (a[column] > b[column]) return ascending ? 1 : -1;
                return 0;
              });
              return chain;
            },
            then: (resolve) => {
              if (tableName === 'cart' || tableName === 'wishlist') {
                const products = getTable('products');
                const expanded = data.map((item) => {
                  const product = products.find((p) => p.id === item.product_id);
                  return { ...item, products: product };
                });
                return resolve({ data: expanded, error: null });
              }
              return resolve({ data, error: null });
            },
          };

          return chain;
        },
        insert: (insertData) => {
          const table = getTable(tableName);
          const rows = Array.isArray(insertData) ? insertData : [insertData];
          const newRows = rows.map((row) => ({
            id: row.id || `p${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            created_at: new Date().toISOString(),
            ...row,
          }));
          setTable(tableName, [...table, ...newRows]);

          return {
            then: (resolve) => resolve({ data: newRows, error: null }),
          };
        },
        update: (updateData) => {
          let table = getTable(tableName);
          let matchCol, matchVal;

          const chain = {
            eq: (col, val) => {
              matchCol = col;
              matchVal = val;
              return chain;
            },
            then: (resolve) => {
              const updatedRows = [];
              table = table.map((row) => {
                if (row[matchCol] === matchVal) {
                  const updatedRow = { ...row, ...updateData };
                  updatedRows.push(updatedRow);
                  return updatedRow;
                }
                return row;
              });
              setTable(tableName, table);
              return resolve({ data: updatedRows, error: null });
            },
          };
          return chain;
        },
        delete: () => {
          let table = getTable(tableName);
          let matchCol, matchVal;

          const chain = {
            eq: (col, val) => {
              matchCol = col;
              matchVal = val;
              return chain;
            },
            then: (resolve) => {
              const remaining = table.filter((row) => row[matchCol] !== matchVal);
              setTable(tableName, remaining);
              return resolve({ data: null, error: null });
            },
          };
          return chain;
        },
      };
    },
    auth: {
      signUp: async ({ email, password, options }) => {
        const users = getTable('users');
        if (users.some((u) => u.email === email)) {
          return { data: { user: null }, error: { message: 'User already exists' } };
        }
        const newUser = {
          id: `usr-${Math.random().toString(36).substring(2, 9)}`,
          email,
          user_metadata: options?.data || {},
          created_at: new Date().toISOString(),
        };
        users.push({ ...newUser, password });
        setTable('users', users);

        const session = { access_token: `token-${newUser.id}`, user: newUser };
        localStorage.setItem('electronova_current_user', JSON.stringify(newUser));
        triggerAuthChange('SIGNED_IN', session);

        return { data: { user: newUser, session }, error: null };
      },
      signInWithPassword: async ({ email, password }) => {
        const users = getTable('users');
        const user = users.find((u) => u.email === email && u.password === password);
        if (!user) {
          return { data: { user: null, session: null }, error: { message: 'Invalid login credentials' } };
        }

        const { password: _, ...userSafe } = user;
        const session = { access_token: `token-${userSafe.id}`, user: userSafe };
        localStorage.setItem('electronova_current_user', JSON.stringify(userSafe));
        triggerAuthChange('SIGNED_IN', session);

        return { data: { user: userSafe, session }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('electronova_current_user');
        triggerAuthChange('SIGNED_OUT', null);
        return { error: null };
      },
      getUser: async () => {
        const user = JSON.parse(localStorage.getItem('electronova_current_user'));
        return { data: { user }, error: null };
      },
      onAuthStateChange: (callback) => {
        authListeners.push(callback);
        const currentUser = JSON.parse(localStorage.getItem('electronova_current_user'));
        if (currentUser) {
          callback('SIGNED_IN', { access_token: `token-${currentUser.id}`, user: currentUser });
        } else {
          callback('SIGNED_OUT', null);
        }

        return {
          data: {
            subscription: {
              unsubscribe: () => {
                authListeners = authListeners.filter((l) => l !== callback);
              },
            },
          },
        };
      },
    },
  };
}

export const supabase = supabaseClient;
export const isMock = isMockClient;
export default supabase;
