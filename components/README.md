# Synapse Job-Candidate Matching System

A minimal job-candidate matching system using vector similarity, with a Next.js frontend.

## Features

- Add job postings with titles and descriptions
- Add candidate profiles with names and skills
- Match candidates to jobs using vector similarity
- View the top 3 matching candidates for a job

## Setup

1. Clone the repository
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Implementation Details

The system simulates vector embeddings by generating mock vectors based on text content. Cosine similarity is used to find the best matches between job descriptions and candidate skills.

## Deployment

Deploy this application to Vercel for a live demo.
