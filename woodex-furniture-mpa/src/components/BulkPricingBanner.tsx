import { Percent, TrendingDown } from 'lucide-react';

interface BulkPricingBannerProps {
  totalQuantity: number;
  savings: number;
}

export default function BulkPricingBanner({ totalQuantity, savings }: BulkPricingBannerProps) {
  let discountTier = '';
  let nextTier = { quantity: 0, discount: 0 };
  
  if (totalQuantity >= 51) {
    discountTier = '15% discount applied (51+ items)';
  } else if (totalQuantity >= 21) {
    discountTier = '10% discount applied (21-50 items)';
    nextTier = { quantity: 51, discount: 15 };
  } else if (totalQuantity >= 6) {
    discountTier = '5% discount applied (6-20 items)';
    nextTier = { quantity: 21, discount: 10 };
  } else {
    nextTier = { quantity: 6, discount: 5 };
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="bg-green-600 text-white p-2 rounded-lg">
          <Percent className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-green-900 mb-1">Bulk Discount Active!</h3>
          {totalQuantity >= 6 ? (
            <>
              <p className="text-green-800 text-sm mb-2">{discountTier}</p>
              <div className="bg-white rounded px-3 py-2 inline-flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-900">
                  You're saving PKR {savings.toLocaleString()}
                </span>
              </div>
              {nextTier.quantity > 0 && (
                <p className="text-green-700 text-xs mt-2">
                  Add {nextTier.quantity - totalQuantity} more items to unlock {nextTier.discount}% discount
                </p>
              )}
            </>
          ) : (
            <p className="text-green-800 text-sm">
              Add {6 - totalQuantity} more items to unlock 5% bulk discount
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
