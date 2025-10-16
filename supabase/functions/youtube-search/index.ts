import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation helper
const validateInput = (query: string, parentId?: string) => {
  // Validate query length
  if (query.length > 100) {
    throw new Error('Search query too long (max 100 characters)');
  }

  // Validate query contains only safe characters
  const validPattern = /^[a-zA-Z0-9\s\u0100-\u017F\u0400-\u04FF]+$/;
  if (!validPattern.test(query)) {
    throw new Error('Search query contains invalid characters');
  }

  // Validate parentId is UUID if provided
  if (parentId) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(parentId)) {
      throw new Error('Invalid parent ID format');
    }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, parentId } = await req.json();
    
    if (!query || !query.trim()) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input
    try {
      validateInput(query.trim(), parentId);
    } catch (validationError: any) {
      return new Response(
        JSON.stringify({ error: validationError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    // Check if query contains blocked phrases
    if (parentId) {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: blockedPhrases } = await supabase
        .from('blocked_phrases')
        .select('phrase')
        .eq('parent_id', parentId);

      if (blockedPhrases) {
        const queryLower = query.toLowerCase();
        for (const blocked of blockedPhrases) {
          if (queryLower.includes(blocked.phrase.toLowerCase())) {
            return new Response(
              JSON.stringify({ 
                error: 'Blocked phrase detected',
                blocked: true,
                message: 'To wyszukiwanie jest zablokowane przez rodzica.'
              }),
              { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      }

      // Get blocked songs
      const { data: blockedSongs } = await supabase
        .from('blocked_songs')
        .select('video_id')
        .eq('parent_id', parentId);

      const blockedVideoIds = new Set(blockedSongs?.map(s => s.video_id) || []);

      // Search YouTube with safe search and filter for kids content
      const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
      searchUrl.searchParams.append('part', 'snippet');
      searchUrl.searchParams.append('q', query + ' children kids songs');
      searchUrl.searchParams.append('type', 'video');
      searchUrl.searchParams.append('videoCategoryId', '10'); // Music category
      searchUrl.searchParams.append('safeSearch', 'strict');
      searchUrl.searchParams.append('maxResults', '20');
      searchUrl.searchParams.append('key', YOUTUBE_API_KEY);

      const response = await fetch(searchUrl.toString());
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('YouTube API error:', errorData);
        throw new Error('Failed to search YouTube');
      }

      const data = await response.json();

      // Filter out blocked videos and format results
      const results = data.items
        ?.filter((item: any) => !blockedVideoIds.has(item.id.videoId))
        .map((item: any) => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
        })) || [];

      return new Response(
        JSON.stringify({ results }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback if no parent ID (shouldn't happen in normal flow)
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.append('part', 'snippet');
    searchUrl.searchParams.append('q', query + ' children kids songs');
    searchUrl.searchParams.append('type', 'video');
    searchUrl.searchParams.append('videoCategoryId', '10');
    searchUrl.searchParams.append('safeSearch', 'strict');
    searchUrl.searchParams.append('maxResults', '20');
    searchUrl.searchParams.append('key', YOUTUBE_API_KEY);

    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    const results = data.items?.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
    })) || [];

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in youtube-search:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
