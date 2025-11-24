import { useState, useEffect } from 'react';
import { X, ShoppingCart, ChevronLeft, ChevronRight, Menu, Palette } from 'lucide-react';
import PanoramaViewer from './components/PanoramaViewer';
import ProductCustomizer from './components/ProductCustomizer';
import QuoteCart from './components/QuoteCart';
import './App.css';

interface Product {
  id: string;
  name: string;
  category: string;
  room: string;
  basePrice: number;
  dimensions: string;
  description: string;
  hotspot: { x: number; y: number };
}

interface Material {
  id: string;
  name: string;
  type: string;
  priceMultiplier: number;
  image?: string;
  color?: string;
}

interface Room {
  id: string;
  name: string;
  panorama: string;
}

interface WallColor {
  id: string;
  name: string;
  hex: string;
  category: string;
}

interface CartItem {
  product: Product;
  material: Material;
  quantity: number;
  price: number;
}

interface EnhancedMaterials {
  wallColors: {
    [key: string]: WallColor[];
  };
  woodTextures: Material[];
  solidColors: Material[];
  laminates: Material[];
  fabrics: Material[];
  metalFinishes: Material[];
}

function App() {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWallCustomizer, setShowWallCustomizer] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [currentWallColor, setCurrentWallColor] = useState<WallColor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [materials, setMaterials] = useState<EnhancedMaterials | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load products data
        const productsRes = await fetch('/data/products.json');
        const productsData = await productsRes.json();
        setProducts(productsData.products);
        setRooms(productsData.rooms);
        setCurrentRoom(productsData.rooms[0]);

        // Load enhanced materials
        const materialsRes = await fetch('/data/materials-enhanced.json');
        const materialsData = await materialsRes.json();
        setMaterials(materialsData);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Set fallback data
        const fallbackProducts = [
          {
            id: "EXD-001",
            name: "Executive Desk Premium",
            category: "Executive Desks",
            room: "executive",
            basePrice: 85000,
            dimensions: "180cm x 90cm x 75cm",
            description: "Premium executive desk with built-in cable management and storage",
            hotspot: { x: 35, y: 50 }
          },
          {
            id: "EXC-001",
            name: "Executive Chair Deluxe",
            category: "Seating",
            room: "executive",
            basePrice: 45000,
            dimensions: "70cm x 70cm x 120cm",
            description: "Ergonomic high-back executive chair with lumbar support",
            hotspot: { x: 45, y: 55 }
          },
          {
            id: "WKS-001",
            name: "Workstation Pod 4",
            category: "Workstations",
            room: "workstation",
            basePrice: 120000,
            dimensions: "240cm x 120cm x 75cm",
            description: "Modern 4-person workstation with privacy screens",
            hotspot: { x: 50, y: 50 }
          },
          {
            id: "CNF-001",
            name: "Conference Table Elite",
            category: "Conference Tables",
            room: "conference",
            basePrice: 150000,
            dimensions: "360cm x 120cm x 75cm",
            description: "12-person conference table with integrated power outlets",
            hotspot: { x: 50, y: 45 }
          },
          {
            id: "RCP-001",
            name: "Reception Desk Modern",
            category: "Reception",
            room: "reception",
            basePrice: 95000,
            dimensions: "200cm x 80cm x 110cm",
            description: "Contemporary reception desk with LED lighting",
            hotspot: { x: 50, y: 55 }
          }
        ];

        const fallbackRooms = [
          { id: 'reception', name: 'Reception Area', panorama: '/images/panoramas/reception.jpg' },
          { id: 'executive', name: 'Executive Office', panorama: '/images/panoramas/executive.jpg' },
          { id: 'workstation', name: 'Workstation Area', panorama: '/images/panoramas/workstation.jpg' },
          { id: 'conference', name: 'Conference Room', panorama: '/images/panoramas/conference.jpg' }
        ];

        setProducts(fallbackProducts);
        setRooms(fallbackRooms);
        setCurrentRoom(fallbackRooms[0]);
        setMaterials({
          wallColors: {
            warmWhites: [{ id: 'WC-001', name: 'Pearl White', hex: '#F5F5F0', category: 'Warm Whites' }],
            earthTones: [{ id: 'ET-001', name: 'Sand', hex: '#C2B280', category: 'Earth Tones' }],
            coolTones: [{ id: 'CT-001', name: 'Dove Gray', hex: '#6D6875', category: 'Cool Tones' }],
            accentColors: [{ id: 'AC-001', name: 'Soft Green', hex: '#8FBC8F', category: 'Accent Colors' }]
          },
          woodTextures: [
            { id: 'WF-001', name: 'Walnut', type: 'wood', priceMultiplier: 1.0, image: '/images/materials/walnut.jpg', color: '#5D4037' },
            { id: 'WF-002', name: 'Oak', type: 'wood', priceMultiplier: 0.9, image: '/images/materials/oak.jpg', color: '#A1887F' },
            { id: 'WF-003', name: 'Mahogany', type: 'wood', priceMultiplier: 1.2, image: '/images/materials/mahogany.jpg', color: '#6D4C41' },
            { id: 'WF-004', name: 'Cherry', type: 'wood', priceMultiplier: 1.1, image: '/images/materials/cherry.jpg', color: '#8D6E63' }
          ],
          solidColors: [
            { id: 'SC-001', name: 'Black', type: 'solid', priceMultiplier: 0.8, color: '#212121' },
            { id: 'SC-002', name: 'White', type: 'solid', priceMultiplier: 0.8, color: '#FFFFFF' },
            { id: 'SC-003', name: 'Gray', type: 'solid', priceMultiplier: 0.75, color: '#757575' }
          ],
          laminates: [
            { id: 'LM-001', name: 'White Gloss', type: 'laminate', priceMultiplier: 0.6, color: '#FFFFFF' },
            { id: 'LM-002', name: 'Black Matte', type: 'laminate', priceMultiplier: 0.6, color: '#212121' }
          ],
          fabrics: [
            { id: 'FB-001', name: 'Black Leather', type: 'fabric', priceMultiplier: 1.4, color: '#212121' },
            { id: 'FB-002', name: 'Brown Leather', type: 'fabric', priceMultiplier: 1.4, color: '#5D4037' }
          ],
          metalFinishes: [
            { id: 'MF-001', name: 'Black Metal', type: 'metal', priceMultiplier: 1.0, color: '#212121' },
            { id: 'MF-002', name: 'Chrome', type: 'metal', priceMultiplier: 1.15, color: '#C0C0C0' }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowCustomizer(true);
  };

  const handleAddToCart = (product: Product, config: any, quantity: number) => {
    const material = config.surface || config.chairSeat;
    const price = calculateConfigPrice(product, config, quantity);
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && item.material.id === material.id
    );

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      newCart[existingIndex].price += price;
      setCart(newCart);
    } else {
      setCart([...cart, { product, material, quantity, price }]);
    }

    setShowCustomizer(false);
  };

  const calculateConfigPrice = (product: Product, config: any, quantity: number) => {
    let multiplier = 1.0;
    
    if (config.chairSeat) {
      // Chair configuration
      multiplier = (config.chairSeat.priceMultiplier + 
                   config.chairBack.priceMultiplier + 
                   config.chairBase.priceMultiplier +
                   (config.chairArms ? config.chairArms.priceMultiplier : 0)) / 4;
    } else if (config.surface && config.frame) {
      // Table configuration
      multiplier = (config.surface.priceMultiplier + config.frame.priceMultiplier) / 2;
    } else if (config.surface) {
      // Other furniture
      multiplier = config.surface.priceMultiplier;
    }

    return Math.round(product.basePrice * multiplier * quantity);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    const item = newCart[index];
    const newQuantity = item.quantity + delta;

    if (newQuantity <= 0) {
      handleRemoveFromCart(index);
      return;
    }

    const unitPrice = item.price / item.quantity;
    item.quantity = newQuantity;
    item.price = unitPrice * newQuantity;
    setCart(newCart);
  };

  const changeRoom = (direction: number) => {
    if (!rooms.length) return;
    const currentIndex = rooms.findIndex(r => r.id === currentRoom?.id);
    const newIndex = (currentIndex + direction + rooms.length) % rooms.length;
    setCurrentRoom(rooms[newIndex]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading WoodEx Virtual Showroom...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your interactive experience</p>
        </div>
      </div>
    );
  }

  if (!currentRoom || !materials) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Failed to load showroom data</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const roomProducts = products.filter(p => p.room === currentRoom.id);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-b border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-yellow-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-yellow-400">WoodEx Virtual Showroom</h1>
              <p className="text-sm text-gray-300">{currentRoom.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowWallCustomizer(!showWallCustomizer)}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              title="Customize Wall Colors"
            >
              <Palette className="w-6 h-6 text-yellow-400" />
            </button>
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Room Navigation Menu */}
      {showMenu && (
        <div className="absolute top-16 left-4 z-40 bg-black/90 backdrop-blur-sm border border-gray-600 rounded-lg p-4 w-64">
          <h3 className="text-yellow-400 font-semibold mb-3">Showroom Rooms</h3>
          <div className="space-y-2">
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => {
                  setCurrentRoom(room);
                  setShowMenu(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  room.id === currentRoom.id
                    ? 'bg-yellow-400 text-gray-900'
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                {room.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Panorama Viewer */}
      <PanoramaViewer
        panorama={currentRoom.panorama}
        products={roomProducts}
        onProductClick={handleProductClick}
        wallColor={currentWallColor}
      />

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-4">
        <button
          onClick={() => changeRoom(-1)}
          className="bg-black/80 backdrop-blur-sm border border-gray-600 p-3 rounded-full hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-yellow-400" />
        </button>

        <div className="bg-black/80 backdrop-blur-sm border border-gray-600 px-6 py-3 rounded-full">
          <p className="text-white font-medium">
            Room {rooms.findIndex(r => r.id === currentRoom.id) + 1} of {rooms.length}
          </p>
        </div>

        <button
          onClick={() => changeRoom(1)}
          className="bg-black/80 backdrop-blur-sm border border-gray-600 p-3 rounded-full hover:bg-gray-800 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-yellow-400" />
        </button>
      </div>

      {/* Help Overlay */}
      {showHelp && (
        <div className="absolute top-24 right-4 z-30 bg-black/90 backdrop-blur-sm border border-gray-600 rounded-lg p-6 w-80">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-yellow-400 font-bold text-lg">Welcome!</h3>
            <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Click on highlighted products to view details</li>
            <li>• Use arrow buttons to navigate between rooms</li>
            <li>• Drag to look around in 360 degrees</li>
            <li>• Customize products with different materials</li>
            <li>• Add items to cart for quote request</li>
            <li>• Change wall colors to visualize your space</li>
          </ul>
        </div>
      )}

      {/* Wall Color Customizer */}
      {showWallCustomizer && (
        <div className="absolute top-20 right-4 z-30 bg-black/90 backdrop-blur-sm border border-gray-600 rounded-lg p-4 w-80 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-yellow-400 font-bold">Wall Colors</h3>
            <button onClick={() => setShowWallCustomizer(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {Object.entries(materials.wallColors).map(([category, colors]: [string, any]) => (
            <div key={category} className="mb-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">{colors[0]?.category}</h4>
              <div className="grid grid-cols-2 gap-2">
                {colors.map((color: WallColor) => (
                  <button
                    key={color.id}
                    onClick={() => setCurrentWallColor(color)}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      currentWallColor?.id === color.id
                        ? 'border-yellow-400 bg-yellow-400/10'
                        : 'border-gray-600 hover:border-yellow-400/50'
                    }`}
                  >
                    <div 
                      className="w-full h-12 rounded mb-1"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="text-xs font-medium text-white">{color.name}</p>
                    <p className="text-xs text-gray-400">{color.id}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={() => setCurrentWallColor(null)}
            className="w-full mt-2 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
          >
            Reset to Default
          </button>
        </div>
      )}

      {/* Product Customizer Modal */}
      {showCustomizer && selectedProduct && (
        <ProductCustomizer
          product={selectedProduct}
          materials={materials}
          onClose={() => setShowCustomizer(false)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Quote Cart */}
      {showCart && (
        <QuoteCart
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
        />
      )}
    </div>
  );
}

export default App;