export interface Job {
  id: string
  title: string
  description: string
  embedding?: number[]
  created_at: Date
}

export interface Candidate {
  id: string
  name: string
  skills: string
  summary?: string
  embedding?: number[]
  created_at: Date
}

export interface MatchResult {
  candidate: Candidate
  similarity: number
}
