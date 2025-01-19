import axios from 'axios'

interface TumblrLikesResponse {
  response: {
    liked_posts: Array<{
      photos?: Array<{
        original_size: {
          url: string
        }
      }>
    }>
  }
}

interface TumblrBlogResponse {
  response: {
    avatar_url: string
  }
}

export const fetchTumblrLikes = async (username: string) => {
  try {
    const response = await axios.get<TumblrLikesResponse>(
      `https://api.tumblr.com/v2/blog/${username}/likes`,
      {
        params: {
          api_key: import.meta.env.VITE_TUMBLR_API_KEY,
          limit: 20,
        }
      }
    )
    
    // Extract image URLs from the response
    const imageUrls = response.data.response.liked_posts
      .filter(post => post.photos && post.photos.length > 0)
      .map(post => post.photos![0].original_size.url)
    
    return imageUrls
  } catch (error) {
    console.error('Error fetching likes:', error)
    throw new Error('Failed to fetch likes')
  }
}

export const fetchUserAvatar = async (username: string) => {
  try {
    const response = await axios.get<TumblrBlogResponse>(
      `https://api.tumblr.com/v2/blog/${username}/avatar/64`
    )
    return response.data.response.avatar_url
  } catch (error) {
    console.error('Error fetching avatar:', error)
    return null
  }
}