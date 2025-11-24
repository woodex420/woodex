import { useEffect, useRef, useState } from 'react';
import { MapPin, RotateCcw } from 'lucide-react';

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

interface WallColor {
  id: string;
  name: string;
  hex: string;
  category: string;
}

interface PanoramaViewerProps {
  panorama: string;
  products: Product[];
  onProductClick: (product: Product) => void;
  wallColor?: WallColor | null;
}

const PanoramaViewer = ({ panorama, products, onProductClick, wallColor }: PanoramaViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setRotation({ x: 0, y: 0 });
    setImageLoaded(false);
    setImageError(false);
  }, [panorama]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePosition.x;
    const deltaY = e.clientY - lastMousePosition.y;

    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));

    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setLastMousePosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - lastMousePosition.x;
    const deltaY = touch.clientY - lastMousePosition.y;

    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));

    setLastMousePosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const resetRotation = () => {
    setRotation({ x: 0, y: 0 });
  };

  const hotspotStyles = {
    position: 'absolute' as const,
    left: `${Math.max(5, Math.min(95, products[0]?.hotspot.x || 50))}%`,
    top: `${Math.max(10, Math.min(90, products[0]?.hotspot.y || 50))}%`,
    transform: 'translate(-50%, -50%)',
    zIndex: 20,
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Background Room Display */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${panorama})`,
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          filter: wallColor ? `hue-rotate(${getHueRotation(wallColor.hex)}deg) brightness(1.1)` : 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Room Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: wallColor 
              ? `radial-gradient(circle at 50% 50%, ${wallColor.hex}40, ${wallColor.hex}20, transparent)`
              : 'none'
          }}
        />
      </div>

      {/* Room Description Overlay */}
      <div className="absolute top-20 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 max-w-sm">
        <h3 className="text-yellow-400 font-bold text-lg mb-2">Room View</h3>
        <p className="text-white text-sm">
          Drag to look around and click on highlighted items to explore products.
        </p>
        <div className="mt-3 flex items-center space-x-2 text-xs text-gray-300">
          <RotateCcw className="w-3 h-3" />
          <span>Drag to rotate • Touch & drag on mobile</span>
        </div>
      </div>

      {/* Product Hotspots */}
      {products.map((product, index) => (
        <div
          key={product.id}
          style={{
            position: 'absolute',
            left: `${Math.max(5, Math.min(95, product.hotspot.x))}%`,
            top: `${Math.max(10, Math.min(90, product.hotspot.y))}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 25,
          }}
          className="group cursor-pointer"
          onClick={() => onProductClick(product)}
        >
          {/* Pulsing Hotspot */}
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-gray-900 shadow-lg group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-gray-900" />
            </div>
          </div>

          {/* Product Info Tooltip */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm border border-gray-600 rounded-lg p-3 min-w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <h4 className="text-yellow-400 font-semibold text-sm">{product.name}</h4>
            <p className="text-gray-300 text-xs mt-1">{product.category}</p>
            <p className="text-white text-sm font-bold mt-2">₹{product.basePrice.toLocaleString()}</p>
            <p className="text-gray-400 text-xs mt-1">{product.dimensions}</p>
          </div>
        </div>
      ))}

      {/* Image Loading Indicator */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-white">Loading Room...</p>
          </div>
        </div>
      )}

      {/* Image Error Fallback */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
          <div className="text-center">
            <div className="text-6xl mb-4">🏢</div>
            <p className="text-gray-400 mb-4">Room image not available</p>
            <button
              onClick={() => setImageError(false)}
              className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Image Element for Loading */}
      <img
        src={panorama}
        alt="Room panorama"
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        onClick={() => {}}
        draggable={false}
      />

      {/* Reset Rotation Button */}
      <button
        onClick={resetRotation}
        className="absolute bottom-20 right-4 p-3 bg-black/80 backdrop-blur-sm border border-gray-600 rounded-full hover:bg-gray-800 transition-colors z-30"
        title="Reset View"
      >
        <RotateCcw className="w-5 h-5 text-yellow-400" />
      </button>

      {/* Wall Color Indicator */}
      {wallColor && (
        <div className="absolute top-32 right-4 bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-3 z-30">
          <div className="flex items-center space-x-2">
            <div 
              className="w-6 h-6 rounded border border-gray-400"
              style={{ backgroundColor: wallColor.hex }}
            />
            <div>
              <p className="text-white text-sm font-medium">{wallColor.name}</p>
              <p className="text-gray-400 text-xs">{wallColor.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate hue rotation for wall colors
function getHueRotation(hexColor: string): number {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Simple hue calculation based on dominant color
  if (r > g && r > b) return 0; // Red dominant
  if (g > r && g > b) return 120; // Green dominant
  if (b > r && b > g) return 240; // Blue dominant
  
  // Mix of colors
  const avg = (r + g + b) / 3;
  if (avg > 128) return -20; // Light colors
  if (avg > 64) return 0; // Medium colors
  return 20; // Dark colors
}

export default PanoramaViewer;