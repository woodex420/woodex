import { useState } from 'react';
import { X, ShoppingCart, Palette, Settings } from 'lucide-react';

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

interface EnhancedMaterials {
  wallColors: {
    [key: string]: any[];
  };
  woodTextures: Material[];
  solidColors: Material[];
  laminates: Material[];
  fabrics: Material[];
  metalFinishes: Material[];
}

interface ProductCustomizerProps {
  product: Product;
  materials: EnhancedMaterials;
  onClose: () => void;
  onAddToCart: (product: Product, config: any, quantity: number) => void;
}

const ProductCustomizer = ({ product, materials, onClose, onAddToCart }: ProductCustomizerProps) => {
  const [activeTab, setActiveTab] = useState('surface');
  const [config, setConfig] = useState<any>({});
  const [quantity, setQuantity] = useState(1);

  const tabs = [
    { id: 'surface', label: 'Surface Materials', icon: Palette },
    { id: 'structure', label: 'Frame & Structure', icon: Settings },
    ...(product.category === 'Seating' ? [{ id: 'seating', label: 'Seat & Back', icon: Settings }] : [])
  ];

  const calculatePrice = () => {
    let multiplier = 1.0;
    
    if (config.surface) multiplier *= config.surface.priceMultiplier;
    if (config.frame) multiplier *= config.frame.priceMultiplier;
    if (config.chairSeat) multiplier *= config.chairSeat.priceMultiplier;
    if (config.chairBack) multiplier *= config.chairBack.priceMultiplier;
    if (config.chairBase) multiplier *= config.chairBase.priceMultiplier;
    if (config.chairArms) multiplier *= config.chairArms.priceMultiplier;

    return Math.round(product.basePrice * multiplier * quantity);
  };

  const handleAddToCart = () => {
    onAddToCart(product, config, quantity);
  };

  const MaterialSelector = ({ materials: materialList, currentValue, onSelect }: {
    materials: Material[];
    currentValue: Material | null;
    onSelect: (material: Material) => void;
  }) => (
    <div className="grid grid-cols-2 gap-3">
      {materialList.map((material) => (
        <button
          key={material.id}
          onClick={() => onSelect(material)}
          className={`p-3 rounded-lg border-2 transition-all text-left ${
            currentValue?.id === material.id
              ? 'border-yellow-400 bg-yellow-400/10'
              : 'border-gray-600 hover:border-yellow-400/50'
          }`}
        >
          <div className="flex items-center space-x-3">
            {material.image ? (
              <img 
                src={material.image} 
                alt={material.name}
                className="w-12 h-12 rounded object-cover border border-gray-500"
              />
            ) : (
              <div 
                className="w-12 h-12 rounded border border-gray-500"
                style={{ backgroundColor: material.color }}
              />
            )}
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{material.name}</p>
              <p className="text-gray-400 text-xs capitalize">{material.type}</p>
              <p className="text-yellow-400 text-xs font-semibold">
                {material.priceMultiplier}x base
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-yellow-400">{product.name}</h2>
            <p className="text-gray-400 text-sm mt-1">{product.category} • {product.dimensions}</p>
            <p className="text-gray-300 text-sm mt-2">{product.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-yellow-400 text-yellow-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0">
          {/* Material Options */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'surface' && (
              <div>
                <h3 className="text-white font-semibold mb-4">Choose Surface Material</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-gray-300 font-medium mb-3">Wood Finishes</h4>
                    <MaterialSelector
                      materials={materials.woodTextures}
                      currentValue={config.surface}
                      onSelect={(material) => setConfig({ ...config, surface: material })}
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-gray-300 font-medium mb-3">Solid Colors</h4>
                    <MaterialSelector
                      materials={materials.solidColors}
                      currentValue={config.surface}
                      onSelect={(material) => setConfig({ ...config, surface: material })}
                    />
                  </div>

                  <div>
                    <h4 className="text-gray-300 font-medium mb-3">Laminates</h4>
                    <MaterialSelector
                      materials={materials.laminates}
                      currentValue={config.surface}
                      onSelect={(material) => setConfig({ ...config, surface: material })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'structure' && (
              <div>
                <h3 className="text-white font-semibold mb-4">Frame & Structure</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-gray-300 font-medium mb-3">Metal Finishes</h4>
                    <MaterialSelector
                      materials={materials.metalFinishes}
                      currentValue={config.frame}
                      onSelect={(material) => setConfig({ ...config, frame: material })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seating' && (
              <div>
                <h3 className="text-white font-semibold mb-4">Chair Components</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-gray-300 font-medium mb-3">Seat Material</h4>
                    <MaterialSelector
                      materials={materials.fabrics}
                      currentValue={config.chairSeat}
                      onSelect={(material) => setConfig({ ...config, chairSeat: material })}
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-gray-300 font-medium mb-3">Back Material</h4>
                    <MaterialSelector
                      materials={materials.fabrics}
                      currentValue={config.chairBack}
                      onSelect={(material) => setConfig({ ...config, chairBack: material })}
                    />
                  </div>

                  <div>
                    <h4 className="text-gray-300 font-medium mb-3">Base & Legs</h4>
                    <MaterialSelector
                      materials={materials.metalFinishes}
                      currentValue={config.chairBase}
                      onSelect={(material) => setConfig({ ...config, chairBase: material })}
                    />
                  </div>

                  <div>
                    <h4 className="text-gray-300 font-medium mb-3">Armrests (Optional)</h4>
                    <MaterialSelector
                      materials={materials.metalFinishes}
                      currentValue={config.chairArms}
                      onSelect={(material) => setConfig({ ...config, chairArms: material })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Configuration Summary */}
          <div className="w-80 bg-gray-800 p-6 border-l border-gray-700">
            <h3 className="text-white font-semibold mb-4">Configuration Summary</h3>
            
            <div className="space-y-4 mb-6">
              {config.surface && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Surface:</span>
                  <span className="text-white">{config.surface.name}</span>
                </div>
              )}
              
              {config.frame && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Frame:</span>
                  <span className="text-white">{config.frame.name}</span>
                </div>
              )}

              {config.chairSeat && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Seat:</span>
                  <span className="text-white">{config.chairSeat.name}</span>
                </div>
              )}

              {config.chairBack && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Back:</span>
                  <span className="text-white">{config.chairBack.name}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white font-bold"
                >
                  -
                </button>
                <span className="text-white font-semibold text-lg w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Base Price:</span>
                <span className="text-white">₹{product.basePrice.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400">Total Price:</span>
                <span className="text-yellow-400 font-bold text-xl">₹{calculatePrice().toLocaleString()}</span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={Object.keys(config).length === 0}
                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Quote Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizer;