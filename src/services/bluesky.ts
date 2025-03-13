import { BskyAgent, RichText } from '@atproto/api'

export class BlueskyService {
  private agent: BskyAgent
  private isAuthenticated: boolean = false

  constructor() {
    this.agent = new BskyAgent({
      service: 'https://bsky.social',
      persistSession: true // Enable session persistence
    })
  }

  async login(identifier: string, password: string) {
    try {
      const response = await this.agent.login({
        identifier,
        password
      })
      this.isAuthenticated = true
      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error('Login failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async sendMessage(recipient: string, content: string) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Not authenticated')
      }

      // Create rich text from the content
      const richText = new RichText({ text: content })
      await richText.detect()

      // Create a post (since Bluesky doesn't have direct messaging yet)
      const response = await this.agent.post({
        text: richText.text,
        facets: richText.facets,
        reply: {
          root: { uri: recipient, cid: recipient }
        }
      })

      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message'
      }
    }
  }

  async getMessages(userId: string) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Not authenticated')
      }

      // Get user's posts/messages
      const response = await this.agent.getAuthorFeed({
        actor: userId,
      })

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Failed to retrieve messages:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve messages'
      }
    }
  }

  async getCurrentUser() {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Not authenticated')
      }

      const response = await this.agent.getProfile({
        actor: this.agent.session?.did || '',
      })

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Failed to get current user:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get current user'
      }
    }
  }

  logout() {
    this.agent.session = undefined
    this.isAuthenticated = false
  }
}

export const blueskyService = new BlueskyService()
