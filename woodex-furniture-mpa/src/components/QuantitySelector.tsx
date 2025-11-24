import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function QuantitySelector({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 9999,
  size = 'md'
}: QuantitySelectorProps) {
  
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || min;
    onQuantityChange(Math.max(min, Math.min(max, value)));
  };

  const sizeClasses = {
    sm: {
      button: 'px-2 py-1',
      input: 'w-12 text-sm',
      icon: 'h-3 w-3'
    },
    md: {
      button: 'px-3 py-2',
      input: 'w-16 text-base',
      icon: 'h-4 w-4'
    },
    lg: {
      button: 'px-4 py-3',
      input: 'w-20 text-lg',
      icon: 'h-5 w-5'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={handleDecrease}
        disabled={quantity <= min}
        className={`${classes.button} hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="Decrease quantity"
      >
        <Minus className={classes.icon} />
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        className={`${classes.input} text-center border-x border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600`}
        min={min}
        max={max}
      />
      <button
        onClick={handleIncrease}
        disabled={quantity >= max}
        className={`${classes.button} hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="Increase quantity"
      >
        <Plus className={classes.icon} />
      </button>
    </div>
  );
}
