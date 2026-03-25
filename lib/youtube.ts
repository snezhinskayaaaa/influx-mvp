const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

interface YouTubeChannelStats {
  subscriberCount: number
  viewCount: number
  videoCount: number
  title: string
  thumbnail: string
}

/**
 * Extract YouTube channel ID or handle from a URL
 * Supports: youtube.com/channel/ID, youtube.com/@handle, youtube.com/c/name, youtube.com/user/name
 */
function extractYouTubeIdentifier(input: string): { type: 'id' | 'handle' | 'username'; value: string } | null {
  if (!input) return null

  const cleaned = input.trim()

  // Direct channel ID
  const channelIdMatch = cleaned.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]+)/)
  if (channelIdMatch) return { type: 'id', value: channelIdMatch[1] }

  // @handle format
  const handleMatch = cleaned.match(/youtube\.com\/@([a-zA-Z0-9._-]+)/)
  if (handleMatch) return { type: 'handle', value: handleMatch[1] }

  // /c/ custom URL
  const customMatch = cleaned.match(/youtube\.com\/c\/([a-zA-Z0-9._-]+)/)
  if (customMatch) return { type: 'handle', value: customMatch[1] }

  // /user/ legacy URL
  const userMatch = cleaned.match(/youtube\.com\/user\/([a-zA-Z0-9._-]+)/)
  if (userMatch) return { type: 'username', value: userMatch[1] }

  // Just a handle without URL (e.g. "@MrBeast" or "MrBeast")
  const bareHandle = cleaned.replace(/^@/, '')
  if (bareHandle && !bareHandle.includes('/') && !bareHandle.includes('.')) {
    return { type: 'handle', value: bareHandle }
  }

  return null
}

export async function getYouTubeStats(youtubeUrl: string): Promise<YouTubeChannelStats | null> {
  if (!YOUTUBE_API_KEY) {
    console.error('YOUTUBE_API_KEY not configured')
    return null
  }

  const identifier = extractYouTubeIdentifier(youtubeUrl)
  if (!identifier) return null

  try {
    let channelId = identifier.value

    // If we have a handle or username, we need to resolve it to a channel ID first
    if (identifier.type === 'handle') {
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(identifier.value)}&maxResults=1&key=${YOUTUBE_API_KEY}`
      )
      const searchData = await searchRes.json()
      if (searchData.items?.[0]?.snippet?.channelId) {
        channelId = searchData.items[0].snippet.channelId
      } else {
        return null
      }
    } else if (identifier.type === 'username') {
      const userRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${encodeURIComponent(identifier.value)}&key=${YOUTUBE_API_KEY}`
      )
      const userData = await userRes.json()
      if (userData.items?.[0]?.id) {
        channelId = userData.items[0].id
      } else {
        return null
      }
    }

    // Fetch channel statistics
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`
    )
    const data = await res.json()

    if (!data.items?.[0]) return null

    const channel = data.items[0]
    return {
      subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
      viewCount: parseInt(channel.statistics.viewCount) || 0,
      videoCount: parseInt(channel.statistics.videoCount) || 0,
      title: channel.snippet.title || '',
      thumbnail: channel.snippet.thumbnails?.default?.url || '',
    }
  } catch (error) {
    console.error('YouTube API error:', error)
    return null
  }
}
