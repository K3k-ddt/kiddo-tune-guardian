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
            },
            events: {
              onStateChange: (event: any) => {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  onPlay?.();
                } else if (event.data === window.YT.PlayerState.PAUSED) {
                  onPause?.();
                } else if (event.data === window.YT.PlayerState.ENDED) {
                  onEnded?.();
                }
              },
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
