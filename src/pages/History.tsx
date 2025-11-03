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
    const sessionData = localStorage.getItem("childSession");
    if (!sessionData) {
      navigate("/child-login");
      return;
    }
    const session = JSON.parse(sessionData);
    setCurrentChild(session);
    loadHistory(session.sessionToken);
  }, [navigate]);

  const loadHistory = async (sessionToken: string) => {
    try {
      const { data, error } = await supabase.rpc('get_playback_history', {
        session_token: sessionToken
      });

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

  const savedTheme = currentChild ? localStorage.getItem(`theme_${currentChild.childId}`) : null;
  const themeIndex = savedTheme ? parseInt(savedTheme) : 0;
  const themeColors = [
    { gradient: "linear-gradient(135deg, hsl(260 80% 60%), hsl(180 80% 60%))", primary: "hsl(260 80% 60%)" },
    { gradient: "linear-gradient(135deg, hsl(340 80% 65%), hsl(30 90% 65%))", primary: "hsl(340 80% 65%)" },
    { gradient: "linear-gradient(135deg, hsl(120 70% 55%), hsl(60 90% 60%))", primary: "hsl(120 70% 55%)" },
    { gradient: "linear-gradient(135deg, hsl(200 90% 55%), hsl(220 85% 65%))", primary: "hsl(200 90% 55%)" },
    { gradient: "linear-gradient(135deg, hsl(0 85% 60%), hsl(320 80% 65%))", primary: "hsl(0 85% 60%)" },
    { gradient: "linear-gradient(135deg, hsl(25 95% 60%), hsl(50 95% 60%))", primary: "hsl(25 95% 60%)" },
    { gradient: "linear-gradient(135deg, hsl(170 80% 50%), hsl(140 70% 55%))", primary: "hsl(170 80% 50%)" },
    { gradient: "linear-gradient(135deg, hsl(280 75% 60%), hsl(320 80% 65%))", primary: "hsl(280 75% 60%)" },
    { gradient: "linear-gradient(135deg, hsl(190 90% 55%), hsl(280 80% 60%))", primary: "hsl(190 90% 55%)" },
    { gradient: "linear-gradient(135deg, hsl(0 85% 60%), hsl(60 90% 60%), hsl(180 80% 55%))", primary: "hsl(0 85% 60%)" },
    { gradient: "linear-gradient(135deg, hsl(260 60% 65%), hsl(280 50% 70%))", primary: "hsl(260 60% 65%)" },
    { gradient: "linear-gradient(135deg, hsl(15 90% 65%), hsl(340 85% 65%))", primary: "hsl(15 90% 65%)" },
    { gradient: "linear-gradient(135deg, hsl(160 70% 60%), hsl(180 60% 70%))", primary: "hsl(160 70% 60%)" },
    { gradient: "linear-gradient(135deg, hsl(45 100% 60%), hsl(30 100% 65%))", primary: "hsl(45 100% 60%)" },
    { gradient: "linear-gradient(135deg, hsl(270 70% 55%), hsl(290 65% 60%))", primary: "hsl(270 70% 55%)" },
  ][themeIndex];

  return (
    <div className="min-h-screen p-4" style={{
      background: themeColors.gradient
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

        <Card className="p-8" style={{ 
          background: `${themeColors.primary}15`,
          backdropFilter: "blur(10px)",
          border: `2px solid ${themeColors.primary}30`
        }}>
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
                      // Pass video data to player via localStorage
                      const videoData = {
                        videoId: item.video_id,
                        title: item.video_title,
                        thumbnail: item.video_thumbnail,
                        channelTitle: ''
                      };
                      localStorage.setItem('playVideo', JSON.stringify(videoData));
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
