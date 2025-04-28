import type { Candidate, Job } from "./types"

// Generate a mock embedding vector based on text content
export function generateEmbedding(text: string): number[] {
  // Create a deterministic but simple embedding based on the text
  const embedding = Array(64).fill(0)

  // Use character codes to influence the embedding
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i)
    embedding[i % embedding.length] += charCode / 100
  }

  // Normalize the embedding
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return embedding.map((val) => val / magnitude)
}

// Calculate cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
  }
  return dotProduct
}

// Find matching candidates for a job
export function findMatchingCandidates(job: Job, candidates: Candidate[], limit = 3): Candidate[] {
  if (!job.embedding) {
    job.embedding = generateEmbedding(job.title + " " + job.description)
  }

  const results = candidates.map((candidate) => {
    if (!candidate.embedding) {
      candidate.embedding = generateEmbedding(candidate.name + " " + candidate.skills)
    }

    const similarity = cosineSimilarity(job.embedding!, candidate.embedding!)

    return {
      candidate,
      similarity,
    }
  })

  // Sort by similarity (highest first) and take the top 'limit' results
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((result) => result.candidate)
}
