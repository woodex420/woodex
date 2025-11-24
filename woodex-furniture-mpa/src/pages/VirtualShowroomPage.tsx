import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Maximize2, Save, Share2, RotateCw, Eye, Grid3x3 } from 'lucide-react';

interface VirtualRoom {
  id: string;
  room_name: string;
  room_type: string;
  thumbnail_url?: string;
  is_public: boolean;
  created_at: string;
}

export default function VirtualShowroomPage() {
  const { user } = useAuth();
  const [savedRooms, setSavedRooms] = useState<VirtualRoom[]>([]);
  const [activeView, setActiveView] = useState<'3d' | 'gallery'>('3d');
  const [selectedRoomType, setSelectedRoomType] = useState('executive_office');

  useEffect(() => {
    if (user) fetchSavedRooms();
  }, [user]);

  const fetchSavedRooms = async () => {
    const { data } = await supabase
      .from('virtual_rooms')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    setSavedRooms(data || []);
  };

  const roomTypes = [
    { value: 'executive_office', label: 'Executive Office', icon: '🏢' },
    { value: 'reception', label: 'Reception Area', icon: '👥' },
    { value: 'conference', label: 'Conference Room', icon: '📊' },
    { value: 'workspace', label: 'Open Workspace', icon: '💼' },
    { value: 'lounge', label: 'Lounge Area', icon: '🛋️' },
  ];

  const handleSaveConfiguration = async () => {
    if (!user) {
      alert('Please login to save configurations');
      return;
    }

    const roomName = prompt('Enter a name for this room configuration:');
    if (!roomName) return;

    try {
      const { error } = await supabase.from('virtual_rooms').insert([{
        user_id: user.id,
        room_name: roomName,
        room_type: selectedRoomType,
        configuration_data: { roomType: selectedRoomType, timestamp: Date.now() },
        is_public: false,
      }]);

      if (error) throw error;
      alert('Room configuration saved!');
      fetchSavedRooms();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save configuration');
    }
  };

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-blue to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Virtual Showroom</h1>
            <p className="text-xl text-blue-100 mb-6">
              Experience our furniture in immersive 3D. Design your perfect office space with real-time visualization.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-white text-brand-blue px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Launch 3D Configurator
              </button>
              <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* View Tabs */}
      <section className="bg-white border-b border-separator sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('3d')}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeView === '3d'
                    ? 'bg-brand-blue text-white'
                    : 'bg-muted-bg text-text-secondary hover:bg-gray-200'
                }`}
              >
                <Maximize2 className="h-4 w-4" />
                3D View
              </button>
              <button
                onClick={() => setActiveView('gallery')}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeView === 'gallery'
                    ? 'bg-brand-blue text-white'
                    : 'bg-muted-bg text-text-secondary hover:bg-gray-200'
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
                Saved Rooms
              </button>
            </div>
            {activeView === '3d' && (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveConfiguration}
                  className="px-4 py-2 border border-separator rounded-lg hover:bg-muted-bg transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button className="px-4 py-2 border border-separator rounded-lg hover:bg-muted-bg transition-colors flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button className="px-4 py-2 border border-separator rounded-lg hover:bg-muted-bg transition-colors flex items-center gap-2">
                  <RotateCw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      {activeView === '3d' ? (
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Room Type Selector */}
            <div className="bg-white rounded-lg border border-separator p-4 mb-6">
              <h3 className="font-semibold mb-3">Select Room Type</h3>
              <div className="flex flex-wrap gap-2">
                {roomTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedRoomType(type.value)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedRoomType === type.value
                        ? 'border-brand-blue bg-blue-50 text-brand-blue'
                        : 'border-separator hover:border-brand-blue'
                    }`}
                  >
                    <span className="mr-2">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Configurator Frame */}
            <div className="bg-white rounded-lg border border-separator overflow-hidden">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{ height: '600px' }}>
                <div className="text-center">
                  <div className="bg-white rounded-full p-6 inline-block mb-4 shadow-lg">
                    <Eye className="h-12 w-12 text-brand-blue" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">3D Configurator</h3>
                  <p className="text-text-secondary mb-4">Interactive 3D room visualization will load here</p>
                  <div className="bg-blue-50 border border-brand-blue rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-brand-blue">
                      <strong>Integration Ready:</strong> This will embed the existing 3D platform from
                      https://of4tl9ueytzf.space.minimax.io
                    </p>
                  </div>
                  <button className="mt-6 bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Launch Full 3D Experience
                  </button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-separator p-4">
                <h4 className="font-semibold mb-2">1. Select & Place</h4>
                <p className="text-sm text-text-secondary">Choose furniture from the catalog and place it in the room</p>
              </div>
              <div className="bg-white rounded-lg border border-separator p-4">
                <h4 className="font-semibold mb-2">2. Customize</h4>
                <p className="text-sm text-text-secondary">Change materials, colors, and finishes in real-time</p>
              </div>
              <div className="bg-white rounded-lg border border-separator p-4">
                <h4 className="font-semibold mb-2">3. Save & Order</h4>
                <p className="text-sm text-text-secondary">Save your design and add all items to cart</p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Your Saved Room Configurations</h2>
            {savedRooms.length === 0 ? (
              <div className="bg-white rounded-lg border border-separator p-12 text-center">
                <Grid3x3 className="h-16 w-16 text-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Saved Rooms</h3>
                <p className="text-text-secondary mb-4">Start designing in 3D view and save your configurations</p>
                <button
                  onClick={() => setActiveView('3d')}
                  className="bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Designing
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {savedRooms.map((room) => (
                  <div key={room.id} className="bg-white rounded-lg border border-separator overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                      {room.thumbnail_url ? (
                        <img src={room.thumbnail_url} alt={room.room_name} className="w-full h-full object-cover" />
                      ) : (
                        <Eye className="h-12 w-12 text-text-secondary" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-1">{room.room_name}</h3>
                      <p className="text-sm text-text-secondary capitalize mb-3">{room.room_type.replace(/_/g, ' ')}</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-brand-blue text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                          Load
                        </button>
                        <button className="px-4 py-2 border border-separator rounded text-sm hover:bg-muted-bg transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="bg-muted-bg py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful 3D Features</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-brand-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Maximize2 className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Real-time 3D</h3>
              <p className="text-sm text-text-secondary">Sub-200ms response time for smooth interaction</p>
            </div>
            <div className="text-center">
              <div className="bg-brand-orange text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCw className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">360° View</h3>
              <p className="text-sm text-text-secondary">Explore from every angle</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Save className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Save & Share</h3>
              <p className="text-sm text-text-secondary">Save configurations and share with team</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Material Preview</h3>
              <p className="text-sm text-text-secondary">See materials and finishes in real-time</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
