import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, History as HistoryIcon, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const History = () => {
  const navigate = useNavigate();
  const [currentChild, setCurrentChild] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const childData = localStorage.getItem("currentChild");
    if (!childData) {
      navigate("/child-login");
      return;
    }
    const child = JSON.parse(childData);
    setCurrentChild(child);
    loadHistory(child.id);
  }, [navigate]);

  const loadHistory = async (childId: string) => {
    try {
      const { data, error } = await supabase
        .from('playback_history')
        .select('*')
        .eq('child_id', childId)
        .order('played_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      toast.error("Błąd podczas ładowania historii");
    } finally {
      setLoading(false);
    }
  };

  if (!currentChild || loading) {
    return null;
  }

  return (
    <div className="min-h-screen p-4" style={{
      background: "linear-gradient(135deg, hsl(260 80% 60%), hsl(180 80% 60%))"
    }}>
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate("/player")}
          variant="ghost"
          className="mb-6 text-white hover:bg-white/20"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Powrót do odtwarzacza
        </Button>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <HistoryIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Historia odtwarzania</h1>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <HistoryIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">
                Nie odtwarzałeś jeszcze żadnych piosenek
              </p>
              <Button 
                onClick={() => navigate("/player")}
                className="mt-6"
              >
                Zacznij słuchać muzyki
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <img 
                    src={item.video_thumbnail} 
                    alt={item.video_title}
                    className="w-24 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{item.video_title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.played_at).toLocaleString('pl-PL')}
                    </p>
                    {item.search_query && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Wyszukiwanie: "{item.search_query}"
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      // Play this video again
                      navigate("/player");
                    }}
                    size="sm"
                    className="rounded-xl"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default History;
