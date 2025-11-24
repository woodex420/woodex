import { useState } from 'react';
import { Download, Upload, FileJson, FileSpreadsheet } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportExportModal({ isOpen, onClose, onSuccess }: ImportExportModalProps) {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'export' | 'import'>('export');

  if (!isOpen) return null;

  async function handleExportJSON() {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('product-crud', {
        body: { operation: 'get_all' }
      });

      if (error) throw error;

      const jsonData = JSON.stringify({ products: data.data }, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `woodex-products-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Products exported successfully!');
    } catch (error: any) {
      alert('Failed to export: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleExportCSV() {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('product-crud', {
        body: { operation: 'get_all' }
      });

      if (error) throw error;

      const products = data.data;
      
      // CSV headers
      const headers = ['ID', 'Name', 'Slug', 'SKU', 'Price', 'Category', 'Stock', 'Status'];
      const csvRows = [headers.join(',')];

      // Add data rows
      products.forEach((product: any) => {
        const row = [
          product.id,
          `"${product.name}"`,
          product.slug,
          product.sku,
          product.price,
          product.categories?.name || '',
          product.stock_quantity,
          product.is_active ? 'Active' : 'Inactive'
        ];
        csvRows.push(row.join(','));
      });

      const csvData = csvRows.join('\n');
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `woodex-products-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Products exported to CSV successfully!');
    } catch (error: any) {
      alert('Failed to export: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error('Invalid JSON format. Expected { products: [...] }');
      }

      let successCount = 0;
      let errorCount = 0;

      for (const product of data.products) {
        try {
          const { error } = await supabase.functions.invoke('product-crud', {
            body: {
              operation: 'create',
              productData: {
                name: product.name,
                slug: product.slug,
                description: product.description,
                category_id: product.category_id,
                sku: product.sku,
                price: product.price,
                stock_quantity: product.stock_quantity || 100,
                is_active: product.is_active !== undefined ? product.is_active : true,
                features: product.features || [],
                image: product.image || '',
                seo_title: product.seo_title || '',
                focus_keyword: product.focus_keyword || '',
                secondary_keyword: product.secondary_keyword || ''
              }
            }
          });

          if (error) {
            errorCount++;
            console.error(`Failed to import ${product.name}:`, error);
          } else {
            successCount++;
          }
        } catch (err) {
          errorCount++;
          console.error(`Error importing ${product.name}:`, err);
        }
      }

      alert(`Import complete!\nSuccessful: ${successCount}\nFailed: ${errorCount}`);
      onSuccess();
    } catch (error: any) {
      alert('Failed to import: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">Import / Export Products</h2>
          
          <div className="flex gap-2">
            <button
              onClick={() => setTab('export')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                tab === 'export'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Export
            </button>
            <button
              onClick={() => setTab('import')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                tab === 'import'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Import
            </button>
          </div>
        </div>

        <div className="p-6">
          {tab === 'export' ? (
            <div className="space-y-4">
              <p className="text-slate-400 mb-4">
                Export all your products to JSON or CSV format for backup or external use.
              </p>

              <button
                onClick={handleExportJSON}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-lg text-white transition-colors"
              >
                <FileJson className="w-6 h-6 text-blue-400" />
                <div className="text-left flex-1">
                  <div className="font-medium">Export as JSON</div>
                  <div className="text-sm text-slate-400">Full product data with all fields</div>
                </div>
                <Download className="w-5 h-5 text-slate-400" />
              </button>

              <button
                onClick={handleExportCSV}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-lg text-white transition-colors"
              >
                <FileSpreadsheet className="w-6 h-6 text-green-400" />
                <div className="text-left flex-1">
                  <div className="font-medium">Export as CSV</div>
                  <div className="text-sm text-slate-400">Basic product data for spreadsheets</div>
                </div>
                <Download className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-400 mb-4">
                Import products from a JSON file. The file should follow this format:
              </p>

              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <pre className="text-sm text-slate-300 overflow-x-auto">
{`{
  "products": [
    {
      "name": "Product Name",
      "slug": "product-slug",
      "sku": "SKU-001",
      "price": 50000,
      "category_id": "uuid",
      "description": "Description",
      "stock_quantity": 100,
      "is_active": true
    }
  ]
}`}
                </pre>
              </div>

              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium inline-block">
                    Select JSON File
                  </span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
                <p className="text-slate-400 text-sm mt-2">
                  Click to select a JSON file to import
                </p>
              </div>

              {loading && (
                <div className="text-center py-4">
                  <div className="text-white">Importing products...</div>
                  <div className="text-slate-400 text-sm">This may take a few moments</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
