// Sample data shown on the dashboard for users who haven't connected Spotify.
// During Spotify's Development Mode an app can only authorize a handful of
// allow-listed users, so most new accounts can't pull real listening data.
// These fixtures let them explore the dashboard with clearly-labeled demo data.
// Real Spotify track/artist IDs are used so the embeds actually render music.

const minutesAgo = (m) => new Date(Date.now() - m * 60 * 1000).toISOString();

export const DEMO_RECENT_TRACKS = [
  { track: { id: "0VjIjW4GlU5eMxbDg6jJ7q", name: "Blinding Lights", artists: ["The Weeknd"], album: "After Hours", played_at: minutesAgo(8) } },
  { track: { id: "463CkQjx2Zk1yXoBuierM9", name: "Levitating", artists: ["Dua Lipa"], album: "Future Nostalgia", played_at: minutesAgo(35) } },
  { track: { id: "4LRPiXqCikLlN15c3yImP7", name: "As It Was", artists: ["Harry Styles"], album: "Harry's House", played_at: minutesAgo(92) } },
  { track: { id: "2Fxmhks0bxGSBdJ92vM42m", name: "bad guy", artists: ["Billie Eilish"], album: "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", played_at: minutesAgo(180) } },
  { track: { id: "6Uj1ctrBOjOas8xZXGqKk4", name: "Heat Waves", artists: ["Glass Animals"], album: "Dreamland", played_at: minutesAgo(310) } },
];

export const DEMO_TOP_GENRES = [
  { genre: "pop", count: 8 },
  { genre: "synth-pop", count: 5 },
  { genre: "indie pop", count: 4 },
  { genre: "dance pop", count: 3 },
  { genre: "alternative", count: 2 },
];

export const DEMO_ARTISTS_BY_GENRE = {
  pop: [
    { id: "1Xyo4u8uXC1ZmMpatF05PJ", name: "The Weeknd", popularity: 96, images: [] },
    { id: "6M2wZ9GZgrQXHCFfjv46we", name: "Dua Lipa", popularity: 92, images: [] },
    { id: "06HL4z0CvFAxyc27GXpf02", name: "Taylor Swift", popularity: 99, images: [] },
  ],
  "synth-pop": [
    { id: "1Xyo4u8uXC1ZmMpatF05PJ", name: "The Weeknd", popularity: 96, images: [] },
    { id: "53XhwfbYqKCa1cC15pYq2q", name: "Imagine Dragons", popularity: 88, images: [] },
  ],
  "indie pop": [
    { id: "4yvcSjfu4PC0CYQyLy4wSq", name: "Glass Animals", popularity: 82, images: [] },
    { id: "6qqNVTkY8uBg9cP3Jd7DAH", name: "Billie Eilish", popularity: 90, images: [] },
  ],
  "dance pop": [
    { id: "6M2wZ9GZgrQXHCFfjv46we", name: "Dua Lipa", popularity: 92, images: [] },
  ],
  alternative: [
    { id: "6KImCVD70vtIoJWnq6nGn3", name: "Harry Styles", popularity: 91, images: [] },
  ],
};

export const DEMO_RECOMMENDATIONS = [
  { id: "6Uj1ctrBOjOas8xZXGqKk4", uri: "spotify:track:6Uj1ctrBOjOas8xZXGqKk4", name: "Heat Waves", artist: "Glass Animals", genre: "indie pop" },
  { id: "5HCyWlXZPP0y6Gqq8TgA20", uri: "spotify:track:5HCyWlXZPP0y6Gqq8TgA20", name: "STAY", artist: "The Kid LAROI, Justin Bieber", genre: "pop" },
  { id: "6f3Slt0GbA2bPZlz0aIFXN", uri: "spotify:track:6f3Slt0GbA2bPZlz0aIFXN", name: "The Less I Know The Better", artist: "Tame Impala", genre: "psychedelic pop" },
  { id: "0e7ipj03S05BNilyu5bRzt", uri: "spotify:track:0e7ipj03S05BNilyu5bRzt", name: "rockstar", artist: "Post Malone", genre: "hip hop" },
];

export const DEMO_TOP_ARTISTS = [
  { id: "1Xyo4u8uXC1ZmMpatF05PJ", name: "The Weeknd", genres: ["pop", "synth-pop", "r&b"], popularity: 96, followers: { total: 95000000 }, images: [], external_urls: { spotify: "https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ" }, uri: "spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ" },
  { id: "6M2wZ9GZgrQXHCFfjv46we", name: "Dua Lipa", genres: ["pop", "dance pop"], popularity: 92, followers: { total: 42000000 }, images: [], external_urls: { spotify: "https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we" }, uri: "spotify:artist:6M2wZ9GZgrQXHCFfjv46we" },
  { id: "6KImCVD70vtIoJWnq6nGn3", name: "Harry Styles", genres: ["pop", "alternative"], popularity: 91, followers: { total: 38000000 }, images: [], external_urls: { spotify: "https://open.spotify.com/artist/6KImCVD70vtIoJWnq6nGn3" }, uri: "spotify:artist:6KImCVD70vtIoJWnq6nGn3" },
  { id: "6qqNVTkY8uBg9cP3Jd7DAH", name: "Billie Eilish", genres: ["indie pop", "electropop"], popularity: 90, followers: { total: 75000000 }, images: [], external_urls: { spotify: "https://open.spotify.com/artist/6qqNVTkY8uBg9cP3Jd7DAH" }, uri: "spotify:artist:6qqNVTkY8uBg9cP3Jd7DAH" },
  { id: "4yvcSjfu4PC0CYQyLy4wSq", name: "Glass Animals", genres: ["indie pop", "alternative"], popularity: 82, followers: { total: 6000000 }, images: [], external_urls: { spotify: "https://open.spotify.com/artist/4yvcSjfu4PC0CYQyLy4wSq" }, uri: "spotify:artist:4yvcSjfu4PC0CYQyLy4wSq" },
];

export const DEMO_PLAYLISTS = [
  { id: "37i9dQZF1DXcBWIGoYBM5M", name: "Today's Top Hits", description: "The hottest tracks right now.", uri: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M", tracks: { total: 50 }, owner: { display_name: "Spotify" }, external_urls: { spotify: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M" } },
  { id: "37i9dQZF1DX0XUsuxWHRQd", name: "RapCaviar", description: "New music from hip-hop's biggest names.", uri: "spotify:playlist:37i9dQZF1DX0XUsuxWHRQd", tracks: { total: 50 }, owner: { display_name: "Spotify" }, external_urls: { spotify: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd" } },
  { id: "37i9dQZF1DX4sWSpwq3LiO", name: "Peaceful Piano", description: "Relax and indulge with beautiful piano pieces.", uri: "spotify:playlist:37i9dQZF1DX4sWSpwq3LiO", tracks: { total: 50 }, owner: { display_name: "Spotify" }, external_urls: { spotify: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO" } },
];

export const DEMO_TOP_TRACKS = [
  { id: "0VjIjW4GlU5eMxbDg6jJ7q", name: "Blinding Lights", uri: "spotify:track:0VjIjW4GlU5eMxbDg6jJ7q", artists: [{ name: "The Weeknd" }], album: { name: "After Hours" }, external_urls: { spotify: "https://open.spotify.com/track/0VjIjW4GlU5eMxbDg6jJ7q" } },
  { id: "463CkQjx2Zk1yXoBuierM9", name: "Levitating", uri: "spotify:track:463CkQjx2Zk1yXoBuierM9", artists: [{ name: "Dua Lipa" }], album: { name: "Future Nostalgia" }, external_urls: { spotify: "https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9" } },
  { id: "4LRPiXqCikLlN15c3yImP7", name: "As It Was", uri: "spotify:track:4LRPiXqCikLlN15c3yImP7", artists: [{ name: "Harry Styles" }], album: { name: "Harry's House" }, external_urls: { spotify: "https://open.spotify.com/track/4LRPiXqCikLlN15c3yImP7" } },
  { id: "2Fxmhks0bxGSBdJ92vM42m", name: "bad guy", uri: "spotify:track:2Fxmhks0bxGSBdJ92vM42m", artists: [{ name: "Billie Eilish" }], album: { name: "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?" }, external_urls: { spotify: "https://open.spotify.com/track/2Fxmhks0bxGSBdJ92vM42m" } },
];
