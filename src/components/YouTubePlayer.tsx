import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

interface YouTubePlayerProps {
  videoId: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (current: number, duration: number) => void;
}

export interface YouTubePlayerHandle {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer = forwardRef<YouTubePlayerHandle, YouTubePlayerProps>(
  ({ videoId, onPlay, onPause, onEnded, onTimeUpdate }, ref) => {
    const playerRef = useRef<any>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const playerIdRef = useRef(`youtube-player-${Math.random().toString(36).substr(2, 9)}`);
    const timeUpdateIntervalRef = useRef<number | undefined>();
    const callbacksRef = useRef({ onPlay, onPause, onEnded, onTimeUpdate });

    // Update callbacks ref whenever they change
    useEffect(() => {
      callbacksRef.current = { onPlay, onPause, onEnded, onTimeUpdate };
    }, [onPlay, onPause, onEnded, onTimeUpdate]);

    useImperativeHandle(ref, () => ({
      play: () => {
        if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      },
      pause: () => {
        if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
        }
      },
      seekTo: (seconds: number) => {
        if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
          playerRef.current.seekTo(seconds, true);
        }
      },
      getCurrentTime: () => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          return playerRef.current.getCurrentTime();
        }
        return 0;
      },
      getDuration: () => {
        if (playerRef.current && typeof playerRef.current.getDuration === 'function') {
          return playerRef.current.getDuration();
        }
        return 0;
      },
    }));

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
                  
                  // Start time update interval
                  timeUpdateIntervalRef.current = window.setInterval(() => {
                    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function' &&
                        typeof playerRef.current.getDuration === 'function') {
                      const currentTime = playerRef.current.getCurrentTime();
                      const duration = playerRef.current.getDuration();
                      callbacksRef.current.onTimeUpdate?.(currentTime, duration);
                    }
                  }, 500);
                },
                onStateChange: (event: any) => {
                  console.log('Player state changed:', event.data);
                  if (event.data === window.YT.PlayerState.PLAYING) {
                    callbacksRef.current.onPlay?.();
                  } else if (event.data === window.YT.PlayerState.PAUSED) {
                    callbacksRef.current.onPause?.();
                  } else if (event.data === window.YT.PlayerState.ENDED) {
                    callbacksRef.current.onEnded?.();
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
        
        if (timeUpdateIntervalRef.current) {
          clearInterval(timeUpdateIntervalRef.current);
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
    }, [videoId]);

    return <div ref={wrapperRef} style={{ display: 'none' }} />;
  }
);

YouTubePlayer.displayName = 'YouTubePlayer';

export default YouTubePlayer;
