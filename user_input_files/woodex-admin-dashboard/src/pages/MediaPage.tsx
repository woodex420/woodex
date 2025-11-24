import { Upload, Image, Folder } from 'lucide-react';

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Media Manager</h1>
        <p className="text-slate-400">Manage product images and media files</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center">
          <Upload className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Upload Images</h3>
          <p className="text-slate-400 mb-4">Drag and drop images here or click to browse</p>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            Select Files
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Uploads</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center">
                <Image className="w-8 h-8 text-slate-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
