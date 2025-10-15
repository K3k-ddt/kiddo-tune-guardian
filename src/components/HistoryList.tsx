import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

interface HistoryListProps {
  childId?: string;
  parentId?: string;
}

const HistoryList = ({ childId, parentId }: HistoryListProps) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [childId, parentId]);

  const loadHistory = async () => {
    try {
      let query = supabase
        .from('playback_history')
        .select(`
          *,
          child_accounts!inner(
            username,
            avatar_color,
            parent_id
          )
        `)
        .order('played_at', { ascending: false })
        .limit(50);

      if (childId) {
        query = query.eq('child_id', childId);
      } else if (parentId) {
        query = query.eq('child_accounts.parent_id', parentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Ładowanie...</div>;
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Brak historii odtwarzania
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {history.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="flex items-center gap-4">
            <img 
              src={item.video_thumbnail} 
              alt={item.video_title}
              className="w-24 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate">{item.video_title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: item.child_accounts?.avatar_color }}
                >
                  {item.child_accounts?.username?.[0]?.toUpperCase()}
                </div>
                <span>{item.child_accounts?.username}</span>
                <span>•</span>
                <span>{new Date(item.played_at).toLocaleString('pl-PL')}</span>
              </div>
              {item.search_query && (
                <p className="text-xs text-muted-foreground mt-1">
                  Wyszukiwanie: "{item.search_query}"
                </p>
              )}
            </div>
            <Play className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HistoryList;
