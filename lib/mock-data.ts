import type { Candidate, Job } from "./types"
import { generateEmbedding, findMatchingCandidates } from "./vector-utils"
import { API_CONFIG, getApiUrl, getSearchUrl } from "./config"

// Sample data
const jobs: Job[] = [
  {
    id: "1",
    title: "Sieve",
    description: "Product involving SDK development; uses Next.js, Python, Redis.",
    created_at: new Date(),
  },
  {
    id: "2",
    title: "Avoca",
    description: "Company focused on AI Agents; stack includes PostgreSQL and cloud services.",
    created_at: new Date(),
  },
  {
    id: "3",
    title: "Koodos",
    description: "Platform for data pipelines; uses Kafka and ClickHouse.",
    created_at: new Date(),
  },
]

const candidates: Candidate[] = [
  {
    id: "1",
    name: "Celena Chang",
    skills: "Formerly at Flatiron Health; expert in React, TypeScript, PostgreSQL; CS grad from UC Berkeley.",
    created_at: new Date(),
  },
  {
    id: "2",
    name: "Alonso Koumba",
    skills: "Ex-Google engineer; expert in Python and PostgreSQL; CS grad from Stanford.",
    created_at: new Date(),
  },
  {
    id: "3",
    name: "Calvin Goah",
    skills: "Engineer at IXL Learning; skilled in Node.js, React, PostgreSQL; CS grad from Columbia.",
    created_at: new Date(),
  },
]

// Pre-compute embeddings for sample data
jobs.forEach((job) => {
  job.embedding = generateEmbedding(job.title + " " + job.description)
})

candidates.forEach((candidate) => {
  candidate.embedding = generateEmbedding(candidate.name + " " + candidate.skills)
})

// Mock API functions
export async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.JOBS), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Fallback to mock data in case of API failure
    return [...jobs];
  }
}

export async function createJob(job: Omit<Job, "id" | "embedding" | "created_at">): Promise<Job> {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.JOBS), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...job,
        // The API will handle id and created_at
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const newJob = await response.json();
    
    // Add embedding locally since the API might not handle it
    if (!newJob.embedding) {
      newJob.embedding = generateEmbedding(job.title + " " + job.description);
    }
    
    return newJob;
  } catch (error) {
    console.error('Error creating job:', error);
    // Fallback to mock implementation in case of API failure
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newJob: Job = {
      id: String(jobs.length + 1),
      ...job,
      embedding: generateEmbedding(job.title + " " + job.description),
      created_at: new Date(),
    };

    jobs.push(newJob);
    return newJob;
  }
}

export async function getCandidates(): Promise<Candidate[]> {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CANDIDATES), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    // Fallback to mock data in case of API failure
    return [...candidates];
  }
}

export async function createCandidate(
  candidate: Omit<Candidate, "id" | "embedding" | "created_at">,
): Promise<Candidate> {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CANDIDATES), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...candidate,
        // The API will handle id and createdAt, but we still need to generate embedding locally
        // embedding: generateEmbedding(candidate.name + " " + candidate.skills),
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const newCandidate = await response.json();
    return newCandidate;
  } catch (error) {
    console.error('Error creating candidate:', error);
    // Fallback to mock implementation in case of API failure
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newCandidate: Candidate = {
      id: String(candidates.length + 1),
      ...candidate,
      embedding: generateEmbedding(candidate.name + " " + candidate.skills),
      created_at: new Date(),
    };

    candidates.push(newCandidate);
    return newCandidate;
  }
}

export async function matchCandidatesToJob(jobId: string): Promise<Candidate[]> {
  try {
    // Get the job details first (but don't throw if not found locally)
    const job = jobs.find((j) => j.id === jobId);
    
    // Call the match API endpoint
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MATCH), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId: jobId,
        // Include title and description if we have them locally
        ...(job && { 
          jobTitle: job.title,
          jobDescription: job.description 
        })
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const matchResults = await response.json();
    return matchResults;
  } catch (error) {
    console.error('Error matching candidates to job:', error);
    
    // Fallback to local implementation
    await new Promise((resolve) => setTimeout(resolve, 500));

    const job = jobs.find((j) => j.id === jobId);
    if (!job) {
      // If we can't find the job locally for fallback, return empty array
      console.error(`Job with ID ${jobId} not found locally for fallback matching`);
      return [];
    }

    // Use the imported findMatchingCandidates function as fallback
    return findMatchingCandidates(job, candidates);
  }
}

export async function searchCandidates(name: string): Promise<Candidate[]> {
  try {
    const url = getSearchUrl(API_CONFIG.ENDPOINTS.SEARCH_CANDIDATES, { name });
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching candidates:', error);
    
    // Fallback to local filtering if API fails
    if (name.trim() === '') {
      return [...candidates];
    }
    
    const lowercaseName = name.toLowerCase();
    return candidates.filter(candidate => 
      candidate.name.toLowerCase().includes(lowercaseName)
    );
  }
}
