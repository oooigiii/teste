export interface BlueskyResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface BlueskyMessage {
  uri: string
  cid: string
  author: {
    did: string
    handle: string
    displayName?: string
  }
  record: {
    text: string
    createdAt: string
  }
}

export interface BlueskyUser {
  did: string
  handle: string
  displayName?: string
  description?: string
  avatar?: string
}

export interface BlueskySession {
  did: string
  handle: string
  email?: string
  accessJwt: string
  refreshJwt: string
}
