import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Mic, Heart, History, LogOut, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Player = () => {
  const navigate = useNavigate();
  const [currentChild, setCurrentChild] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);

  useEffect(() => {
    const childData = localStorage.getItem("currentChild");
    if (!childData) {
      navigate("/child-login");
      return;
    }
    setCurrentChild(JSON.parse(childData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentChild");
    toast.success("Wylogowano");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Wpisz co chcesz posłuchać!");
      return;
    }

    // TODO: Implement YouTube search with API
    toast.info("Wyszukiwanie: " + searchQuery);
  };

  if (!currentChild) {
    return null;
  }

  return (
    <div className="min-h-screen p-4" style={{
      background: "linear-gradient(135deg, hsl(260 80% 60%), hsl(180 80% 60%))"
    }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
            style={{ background: currentChild.avatar_color }}
          >
            {currentChild.username[0].toUpperCase()}
          </div>
          <span className="text-white font-bold text-xl">{currentChild.username}</span>
        </div>
        <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-white/20">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex gap-3">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Czego chcesz posłuchać?"
              className="h-14 text-lg rounded-2xl"
            />
            <Button onClick={handleSearch} size="lg" className="rounded-2xl px-8">
              <Search className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl px-8">
              <Mic className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Player */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="text-center space-y-6">
            {currentVideo ? (
              <>
                <div className="w-48 h-48 mx-auto rounded-3xl overflow-hidden">
                  <img src={currentVideo.thumbnail} alt={currentVideo.title} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl font-bold">{currentVideo.title}</h2>
              </>
            ) : (
              <>
                <div className="w-48 h-48 mx-auto rounded-3xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(260 100% 75%), hsl(30 100% 80%))" }}
                >
                  <Play className="w-24 h-24 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-muted-foreground">Wybierz piosenkę aby zacząć słuchać</h2>
              </>
            )}

            {/* Controls */}
            <div className="flex justify-center items-center gap-6">
              <Button size="lg" variant="ghost" className="rounded-full w-14 h-14">
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button 
                size="lg" 
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full w-20 h-20"
                style={{ background: "linear-gradient(135deg, hsl(260 80% 60%), hsl(180 80% 60%))" }}
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              </Button>
              <Button size="lg" variant="ghost" className="rounded-full w-14 h-14">
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => navigate("/favorites")}
            size="lg" 
            className="h-24 rounded-2xl text-lg"
            style={{ background: "hsl(0 100% 70%)" }}
          >
            <Heart className="mr-2 h-6 w-6" />
            Ulubione
          </Button>
          <Button 
            onClick={() => navigate("/history")}
            size="lg" 
            className="h-24 rounded-2xl text-lg"
            style={{ background: "hsl(280 100% 70%)" }}
          >
            <History className="mr-2 h-6 w-6" />
            Historia
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Player;
