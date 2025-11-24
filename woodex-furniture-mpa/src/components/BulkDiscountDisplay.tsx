import { TrendingDown } from 'lucide-react';

interface BulkDiscountDisplayProps {
  currentQuantity?: number;
  compact?: boolean;
}

export default function BulkDiscountDisplay({ currentQuantity = 0, compact = false }: BulkDiscountDisplayProps) {
  const tiers = [
    { minQty: 6, maxQty: 20, discount: 5 },
    { minQty: 21, maxQty: 50, discount: 10 },
    { minQty: 51, maxQty: Infinity, discount: 15 }
  ];

  const getCurrentTier = () => {
    return tiers.find(tier => currentQuantity >= tier.minQty && currentQuantity <= tier.maxQty);
  };

  const getNextTier = () => {
    return tiers.find(tier => currentQuantity < tier.minQty);
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
        <TrendingDown className="h-3 w-3" />
        <span className="font-semibold">
          5% @ 6+ • 10% @ 21+ • 15% @ 51+
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <TrendingDown className="h-4 w-4 text-green-600" />
        <h4 className="text-sm font-semibold text-gray-800">Bulk Discount Tiers</h4>
      </div>
      
      <div className="space-y-1">
        {tiers.map((tier, index) => {
          const isCurrentTier = currentTier?.minQty === tier.minQty;
          const isPastTier = currentQuantity > tier.maxQty;
          
          return (
            <div
              key={index}
              className={`flex justify-between items-center text-sm ${
                isCurrentTier
                  ? 'font-bold text-green-700 bg-green-100 px-2 py-1 rounded'
                  : isPastTier
                  ? 'text-gray-400'
                  : 'text-gray-700'
              }`}
            >
              <span>
                {tier.minQty}-{tier.maxQty === Infinity ? '∞' : tier.maxQty} units:
              </span>
              <span className={isCurrentTier ? 'text-green-700' : 'text-green-600'}>
                {tier.discount}% OFF
              </span>
            </div>
          );
        })}
      </div>

      {currentQuantity > 0 && (
        <div className="mt-2 pt-2 border-t border-green-200">
          {currentTier ? (
            <p className="text-xs text-green-700 font-semibold">
              {currentTier.discount}% discount active! You're saving big.
            </p>
          ) : nextTier ? (
            <p className="text-xs text-gray-600">
              Add {nextTier.minQty - currentQuantity} more to get {nextTier.discount}% OFF
            </p>
          ) : (
            <p className="text-xs text-gray-600">
              Add 6 or more items to unlock bulk discounts
            </p>
          )}
        </div>
      )}
    </div>
  );
}
