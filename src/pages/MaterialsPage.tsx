import { useMemo, useState } from 'react';
import { Layers, Search, Database, FlaskConical } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useMaterials, type Material } from '../hooks/use-catalog';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'wood', label: 'Wood Finishes' },
  { id: 'laminate', label: 'Solid & Laminate' },
  { id: 'metal', label: 'Metal Colors' },
  { id: 'fabric', label: 'Fabric & Leather' },
] as const;

const PART_LABELS: Record<string, string> = {
  worktop: 'Worktop',
  frame: 'Frame',
  seating: 'Seating',
  panel: 'Panel',
  storage: 'Storage',
};

const brightnessTone: Record<Material['brightness'], string> = {
  light: 'bg-amber-50 text-amber-800 border-amber-200',
  medium: 'bg-orange-50 text-orange-800 border-orange-200',
  dark: 'bg-stone-100 text-stone-800 border-stone-300',
  all: 'bg-muted text-muted-foreground border-border',
};

const MaterialsPage = () => {
  const { rows, source, isLoading, isError, error } = useMaterials();
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((m) => {
      const inCategory = category === 'all' || m.category === category;
      const matches =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.applicable_to?.some((p) => PART_LABELS[p]?.toLowerCase().includes(q));
      return inCategory && matches;
    });
  }, [rows, category, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">Materials</h1>
          <p className="text-text-secondary">
            {isLoading ? 'Loading finishes…' : `${rows.length} finishes available to the configurator`}
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 font-normal">
          {source === 'supabase' ? (
            <>
              <Database className="h-3 w-3" /> Live Supabase
            </>
          ) : (
            <>
              <FlaskConical className="h-3 w-3" /> Seed snapshot
            </>
          )}
        </Badge>
      </div>

      {source === 'seed' && !isLoading && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Showing the imported <code className="font-mono">seed/catalog.json</code> snapshot because
          Supabase is not configured on this build. Run{' '}
          <code className="font-mono">node scripts/import-catalog.mjs --apply</code> and set{' '}
          <code className="font-mono">VITE_SUPABASE_URL</code> /{' '}
          <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> to manage these live.
        </div>
      )}

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load materials: {error?.message}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="flex-wrap">
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c.id} value={c.id}>
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search finishes or parts…"
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="mb-3 h-28 w-full rounded-md" />
                <Skeleton className="mb-2 h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Layers className="h-12 w-12 text-muted-foreground" />
            <p className="font-medium text-text-primary">No finishes match</p>
            <p className="max-w-sm text-sm text-text-secondary">
              Try a different category, or clear the search to see all {rows.length} materials.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setCategory('all');
              }}
            >
              Reset filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m) => (
            <Card key={m.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <div className="flex h-28 items-center justify-center bg-muted">
                {m.image ? (
                  <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-mono text-xs text-muted-foreground">
                    {m.id}
                    <br />
                    texture pending
                  </span>
                )}
              </div>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-text-primary">{m.name}</p>
                    <p className="text-xs capitalize text-text-secondary">{m.category}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`shrink-0 capitalize font-normal ${brightnessTone[m.brightness] ?? ''}`}
                  >
                    {m.brightness}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(m.applicable_to ?? []).map((part) => (
                    <Badge key={part} variant="secondary" className="text-[10px] font-normal">
                      {PART_LABELS[part] ?? part}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialsPage;
