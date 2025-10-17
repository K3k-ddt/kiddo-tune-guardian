import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Search, Heart, History, LogOut, Play, Pause, SkipBack, SkipForward, Loader2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import VoiceSearch from "@/components/VoiceSearch";
import YouTubePlayer, { YouTubePlayerHandle } from "@/components/YouTubePlayer";

const Player = () => {
  const navigate = useNavigate();
  const playerRef = useRef<YouTubePlayerHandle>(null);
  const [currentChild, setCurrentChild] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [parentId, setParentId] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [timeUsage, setTimeUsage] = useState({ used: 0, limit: 60, remaining: 60 });
  const timeTrackingRef = useRef<number>(0);

  useEffect(() => {
    const sessionData = localStorage.getItem("childSession");
    if (!sessionData) {
      navigate("/child-login");
      return;
    }
    const session = JSON.parse(sessionData);
    setCurrentChild(session);
    loadParentId(session.parentId);
    loadTimeUsage(session.sessionToken);

    // Check if there's a video to play from history/favorites
    const playVideoData = localStorage.getItem('playVideo');
    if (playVideoData) {
      const videoData = JSON.parse(playVideoData);
      handlePlayVideo(videoData);
      localStorage.removeItem('playVideo');
    }

    // Track time usage every minute
    const timeTrackingInterval = setInterval(() => {
      if (isPlaying) {
        timeTrackingRef.current += 1;
        if (timeTrackingRef.current >= 60) {
          updateTimeUsage(session.sessionToken, 1);
          timeTrackingRef.current = 0;
        }
      }
    }, 1000);

    return () => clearInterval(timeTrackingInterval);
  }, [navigate, isPlaying]);

  const loadParentId = async (childParentId: string) => {
    setParentId(childParentId);
  };

  const loadTimeUsage = async (sessionToken: string) => {
    try {
      const { data, error } = await supabase.rpc('get_time_usage', {
        session_token: sessionToken
      });

      if (error) throw error;

      const result = data as any;
      if (result.success) {
        setTimeUsage({
          used: result.time_used_today,
          limit: result.daily_limit,
          remaining: result.remaining_minutes
        });

        if (result.is_locked) {
          toast.error("Przekroczono dzienny limit czasu!");
          navigate("/");
        }
      }
    } catch (error) {
      console.error('Error loading time usage:', error);
    }
  };

  const updateTimeUsage = async (sessionToken: string, minutes: number) => {
    try {
      const { data, error } = await supabase.rpc('update_time_usage', {
        session_token: sessionToken,
        minutes_used: minutes
      });

      if (error) throw error;

      const result = data as any;
      if (result.success) {
        setTimeUsage({
          used: result.time_used_today,
          limit: result.daily_limit,
          remaining: result.remaining_minutes
        });

        if (result.is_locked) {
          toast.error("Przekroczono dzienny limit czasu!");
          setIsPlaying(false);
          playerRef.current?.pause();
          setTimeout(() => navigate("/"), 2000);
        }
      }
    } catch (error) {
      console.error('Error updating time usage:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("childSession");
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

  const handlePlayVideo = async (video: any, addToQueue: boolean = true) => {
    if (addToQueue && searchResults.length > 0) {
      setQueue(searchResults);
      const index = searchResults.findIndex(v => v.videoId === video.videoId);
      setCurrentIndex(index >= 0 ? index : 0);
    }
    
    setCurrentVideo(video);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);

    // Check if video is in favorites
    checkIfFavorite(video.videoId);

    // Save to playback history
    try {
      await supabase.rpc('add_playback_history', {
        session_token: currentChild.sessionToken,
        video_id_input: video.videoId,
        video_title_input: video.title,
        video_thumbnail_input: video.thumbnail,
        search_query_input: searchQuery
      });
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const handleNext = () => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      handlePlayVideo(queue[nextIndex], false);
    }
  };

  const handlePrevious = () => {
    if (queue.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      handlePlayVideo(queue[prevIndex], false);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    playerRef.current?.seekTo(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const checkIfFavorite = async (videoId: string) => {
    try {
      const { data } = await supabase.rpc('get_favorites', {
        session_token: currentChild.sessionToken
      });
      
      setIsFavorite(data?.some((f: any) => f.video_id === videoId) || false);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!currentVideo) return;

    try {
      const { data, error } = await supabase.rpc('toggle_favorite', {
        session_token: currentChild.sessionToken,
        video_id_input: currentVideo.videoId,
        video_title_input: currentVideo.title,
        video_thumbnail_input: currentVideo.thumbnail
      });

      if (error) throw error;

      const result = data as any;
      if (result.action === 'removed') {
        setIsFavorite(false);
        toast.success("Usunięto z ulubionych");
      } else {
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
            style={{ background: currentChild.avatarColor }}
          >
            {currentChild.username[0].toUpperCase()}
          </div>
          <div>
            <div className="text-white font-bold text-xl">{currentChild.username}</div>
            <div className="text-white/80 text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pozostało: {timeUsage.remaining} min
            </div>
          </div>
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

            {/* Progress Bar */}
            {currentVideo && (
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center items-center gap-6">
              <Button 
                size="lg" 
                variant="ghost" 
                className="rounded-full w-14 h-14"
                disabled={!currentVideo || currentIndex === 0}
                onClick={handlePrevious}
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button 
                size="lg" 
                onClick={() => {
                  if (isPlaying) {
                    playerRef.current?.pause();
                    setIsPlaying(false);
                  } else {
                    playerRef.current?.play();
                    setIsPlaying(true);
                  }
                }}
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
                disabled={!currentVideo || currentIndex === queue.length - 1}
                onClick={handleNext}
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
      {currentVideo && (
        <YouTubePlayer
          ref={playerRef}
          videoId={currentVideo.videoId}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            if (currentIndex < queue.length - 1) {
              handleNext();
            } else {
              toast.info("Koniec listy odtwarzania");
            }
          }}
          onTimeUpdate={(current, total) => {
            setCurrentTime(current);
            setDuration(total);
          }}
        />
      )}
    </div>
  );
};

export default Player;
