import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, Heart, History, LogOut, Play, Pause, SkipBack, SkipForward, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import VoiceSearch from "@/components/VoiceSearch";
import YouTubePlayer from "@/components/YouTubePlayer";

const Player = () => {
  const navigate = useNavigate();
  const [currentChild, setCurrentChild] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [parentId, setParentId] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const childData = localStorage.getItem("currentChild");
    if (!childData) {
      navigate("/child-login");
      return;
    }
    const child = JSON.parse(childData);
    setCurrentChild(child);
    loadParentId(child.parent_id);

    // Check if there's a video to play from history/favorites
    const playVideoData = localStorage.getItem('playVideo');
    if (playVideoData) {
      const videoData = JSON.parse(playVideoData);
      handlePlayVideo(videoData);
      localStorage.removeItem('playVideo');
    }
  }, [navigate]);

  const loadParentId = async (childParentId: string) => {
    setParentId(childParentId);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentChild");
    toast.success("Wylogowano");
    navigate("/");
  };

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) {
      toast.error("Wpisz co chcesz posłuchać!");
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-search', {
        body: { query: searchTerm, parentId }
      });

      if (error) throw error;

      if (data.blocked) {
        toast.error(data.message);
        setSearchResults([]);
        return;
      }

      setSearchResults(data.results || []);
      
      if (data.results?.length === 0) {
        toast.info("Nie znaleziono wyników");
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error("Błąd podczas wyszukiwania");
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlayVideo = async (video: any) => {
    setCurrentVideo(video);
    setIsPlaying(true);

    // Check if video is in favorites
    checkIfFavorite(video.videoId);

    // Save to playback history
    try {
      await supabase.from('playback_history').insert({
        child_id: currentChild.id,
        video_id: video.videoId,
        video_title: video.title,
        video_thumbnail: video.thumbnail,
        search_query: searchQuery
      });
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const checkIfFavorite = async (videoId: string) => {
    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('child_id', currentChild.id)
        .eq('video_id', videoId)
        .maybeSingle();
      
      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!currentVideo) return;

    try {
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('child_id', currentChild.id)
        .eq('video_id', currentVideo.videoId)
        .maybeSingle();

      if (existing) {
        await supabase.from('favorites').delete().eq('id', existing.id);
        setIsFavorite(false);
        toast.success("Usunięto z ulubionych");
      } else {
        await supabase.from('favorites').insert({
          child_id: currentChild.id,
          video_id: currentVideo.videoId,
          video_title: currentVideo.title,
          video_thumbnail: currentVideo.thumbnail
        });
        setIsFavorite(true);
        toast.success("Dodano do ulubionych!");
      }
    } catch (error) {
      toast.error("Błąd podczas zapisywania");
    }
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
          <div className="flex gap-3 mb-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Czego chcesz posłuchać?"
              className="h-14 text-lg rounded-2xl"
              disabled={isSearching}
            />
            <Button onClick={() => handleSearch()} size="lg" className="rounded-2xl px-8" disabled={isSearching}>
              {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            </Button>
            <VoiceSearch onResult={(text) => {
              setSearchQuery(text);
              handleSearch(text);
            }} />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((video) => (
                <button
                  key={video.videoId}
                  onClick={() => handlePlayVideo(video)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-20 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{video.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{video.channelTitle}</p>
                  </div>
                  <Play className="h-6 w-6 text-primary flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Player */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="text-center space-y-6">
            {currentVideo ? (
              <>
                <div className="w-48 h-48 mx-auto rounded-3xl overflow-hidden shadow-lg">
                  <img src={currentVideo.thumbnail} alt={currentVideo.title} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl font-bold">{currentVideo.title}</h2>
                <p className="text-muted-foreground">{currentVideo.channelTitle}</p>
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
              <Button 
                size="lg" 
                variant="ghost" 
                className="rounded-full w-14 h-14"
                disabled={!currentVideo}
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button 
                size="lg" 
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full w-20 h-20"
                style={{ background: "linear-gradient(135deg, hsl(260 80% 60%), hsl(180 80% 60%))" }}
                disabled={!currentVideo}
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              </Button>
              <Button 
                size="lg" 
                variant="ghost" 
                className="rounded-full w-14 h-14"
                disabled={!currentVideo}
              >
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>

            {currentVideo && (
              <Button
                onClick={toggleFavorite}
                variant="outline"
                size="lg"
                className="rounded-2xl"
              >
                <Heart className={`mr-2 h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? "Usuń z" : "Dodaj do"} ulubionych
              </Button>
            )}
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

      {/* YouTube Player (hidden, audio only) */}
      {currentVideo && isPlaying && (
        <YouTubePlayer
          videoId={currentVideo.videoId}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            toast.info("Piosenka zakończona");
          }}
        />
      )}
    </div>
  );
};

export default Player;
