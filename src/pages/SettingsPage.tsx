import { Profile } from '../lib/supabase';

interface SettingsPage_Props {
  profile?: Profile | null;
}

const SettingsPage = ({ profile }: SettingsPage_Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">PAGETITLE</h1>
        <p className="text-text-secondary">Module under development</p>
      </div>
      <div className="bg-white p-8 rounded-lg border border-separator">
        <p className="text-text-secondary">This feature will be available soon.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
