import { useEffect, useRef } from "react";

interface YouTubePlayerProps {
  videoId: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer = ({ videoId, onPlay, onPause, onEnded }: YouTubePlayerProps) => {
  const playerRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerIdRef = useRef(`youtube-player-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    let playerInterval: number | undefined;

    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (wrapperRef.current && window.YT && window.YT.Player) {
        // Create a new div for the player inside the wrapper
        const playerDiv = document.createElement('div');
        playerDiv.id = playerIdRef.current;
        wrapperRef.current.appendChild(playerDiv);

        try {
          playerRef.current = new window.YT.Player(playerIdRef.current, {
            height: '0',
            width: '0',
            videoId: videoId,
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              playsinline: 1,
              rel: 0,
            },
            events: {
              onReady: (event: any) => {
                console.log('YouTube player ready, playing video');
                event.target.playVideo();
                
                // Monitor player state to keep it playing
                playerInterval = window.setInterval(() => {
                  if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
                    const state = playerRef.current.getPlayerState();
                    // If paused or buffering, try to play again
                    if (state === window.YT.PlayerState.PAUSED || state === window.YT.PlayerState.BUFFERING) {
                      console.log('Player paused/buffering, resuming playback');
                      playerRef.current.playVideo();
                    }
                  }
                }, 2000);
              },
              onStateChange: (event: any) => {
                console.log('Player state changed:', event.data);
                if (event.data === window.YT.PlayerState.PLAYING) {
                  onPlay?.();
                } else if (event.data === window.YT.PlayerState.PAUSED) {
                  onPause?.();
                  // Try to resume playing if accidentally paused
                  setTimeout(() => {
                    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
                      playerRef.current.playVideo();
                    }
                  }, 100);
                } else if (event.data === window.YT.PlayerState.ENDED) {
                  onEnded?.();
                }
              },
              onError: (event: any) => {
                console.error('YouTube player error:', event.data);
              }
            },
          });
        } catch (error) {
          console.error('Error initializing YouTube player:', error);
        }
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerInterval) {
        clearInterval(playerInterval);
      }
      
      try {
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }
        playerRef.current = null;
        
        // Clean up the wrapper content
        if (wrapperRef.current) {
          wrapperRef.current.innerHTML = '';
        }
      } catch (error) {
        console.error('Error cleaning up YouTube player:', error);
      }
    };
  }, [videoId, onPlay, onPause, onEnded]);

  return <div ref={wrapperRef} style={{ display: 'none' }} />;
};

export default YouTubePlayer;
