import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Heart, Play, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Favorites = () => {
  const navigate = useNavigate();
  const [currentChild, setCurrentChild] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const childData = localStorage.getItem("currentChild");
    if (!childData) {
      navigate("/child-login");
      return;
    }
    const child = JSON.parse(childData);
    setCurrentChild(child);
    loadFavorites(child.id);
  }, [navigate]);

  const loadFavorites = async (childId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('child_id', childId)
        .order('added_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      toast.error("Błąd podczas ładowania ulubionych");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      await supabase.from('favorites').delete().eq('id', favoriteId);
      setFavorites(favorites.filter(f => f.id !== favoriteId));
      toast.success("Usunięto z ulubionych");
    } catch (error) {
      toast.error("Błąd podczas usuwania");
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
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold">Twoje ulubione</h1>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">
                Nie masz jeszcze żadnych ulubionych piosenek
              </p>
              <Button 
                onClick={() => navigate("/player")}
                className="mt-6"
              >
                Znajdź swoją ulubioną piosenkę
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <img 
                    src={favorite.video_thumbnail} 
                    alt={favorite.video_title}
                    className="w-24 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{favorite.video_title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Dodano: {new Date(favorite.added_at).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        // Play this video
                        navigate("/player");
                      }}
                      size="sm"
                      className="rounded-xl"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => removeFavorite(favorite.id)}
                      size="sm"
                      variant="destructive"
                      className="rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Favorites;
