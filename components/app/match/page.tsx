"use client"

import { useState, useEffect } from "react"
import { getJobs, matchCandidatesToJob } from "@/lib/mock-data"
import type { Candidate, Job } from "@/lib/types"
import { useSearchParams } from "next/navigation"
import { getApiUrl, API_CONFIG } from "@/lib/config"

export default function MatchPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string>("")
  const [jobDescription, setJobDescription] = useState<string>("")
  const [matchResults, setMatchResults] = useState<Candidate[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [resultsReceived, setResultsReceived] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getJobs()
        setJobs(data)

        // Check if jobId is in URL params
        const jobId = searchParams.get("jobId")
        if (jobId) {
          setSelectedJobId(jobId)
          setJobDescription("") // Clear description when job is selected from URL
        }
      } finally {
        setLoadingJobs(false)
      }
    }

    loadJobs()
  }, [searchParams])

  // Auto-match when job is selected from URL
  useEffect(() => {
    if (selectedJobId && !loadingJobs) {
      handleFindMatches()
    }
  }, [selectedJobId, loadingJobs])

  // Handle job selection - clear description when a job is selected
  const handleJobSelection = (jobId: string) => {
    setSelectedJobId(jobId)
    setJobDescription("")
  }

  // Handle description input - clear job selection when description is entered
  const handleDescriptionInput = (text: string) => {
    setJobDescription(text)
    if (text.trim() !== "") {
      setSelectedJobId("")
    }
  }

  const handleFindMatches = async () => {
    if (!selectedJobId && !jobDescription.trim()) {
      alert("Please either select a job or enter a job description")
      return
    }

    setLoadingMatches(true)
    setMatchResults([])
    setResultsReceived(false)

    try {
      let matches: Candidate[] = []
      
      if (selectedJobId) {
        // If a job is selected, use the matchCandidatesToJob function
        matches = await matchCandidatesToJob(selectedJobId)
      } else {
        // If description is entered, call the API directly with the description
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MATCH), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobDescription: jobDescription
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        matches = await response.json();
      }
      
      setMatchResults(matches.slice(0, 3)) // Ensure we only show top 3 matches
      setResultsReceived(true)
    } catch (error) {
      alert("Failed to find matching candidates")
      console.error(error)
    } finally {
      setLoadingMatches(false)
    }
  }

  // Get the selected job details
  const selectedJob = jobs.find(job => job.id === selectedJobId)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Match Candidates to Jobs</h1>

      <div className="border rounded-lg p-6 shadow-sm mb-8 bg-white">
        <h2 className="text-xl font-semibold mb-4">Find Matching Candidates</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Select Job</label>
            {loadingJobs ? (
              <div className="py-2 px-3 bg-gray-100 rounded">Loading jobs...</div>
            ) : (
              <select
                value={selectedJobId}
                onChange={(e) => handleJobSelection(e.target.value)}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                disabled={loadingMatches}
              >
                <option value="">Select a job</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-white opacity-50 flex items-center justify-center z-10" 
                 style={{ display: loadingMatches ? 'flex' : 'none' }}>
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            </div>
            <label className="block mb-1 font-medium">OR Enter Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => handleDescriptionInput(e.target.value)}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
              rows={4}
              placeholder="Enter job description to find matching candidates..."
              disabled={loadingMatches}
            />
          </div>

          <button
            onClick={handleFindMatches}
            disabled={loadingJobs || loadingMatches || (!selectedJobId && !jobDescription.trim())}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md w-full font-medium transition-colors duration-200 flex items-center justify-center"
          >
            {loadingMatches ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Finding Matches...
              </>
            ) : (
              "Find Matching Candidates"
            )}
          </button>
        </div>
      </div>

      {selectedJob && !loadingMatches && matchResults.length > 0 && resultsReceived && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800">Selected Job</h3>
          <h2 className="text-lg font-semibold">{selectedJob.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{selectedJob.description}</p>
        </div>
      )}

      {jobDescription && !selectedJobId && !loadingMatches && matchResults.length > 0 && resultsReceived && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800">Custom Job Description</h3>
          <p className="text-sm text-gray-600 mt-1">{jobDescription}</p>
        </div>
      )}

      {loadingMatches ? (
        <div className="text-center py-12 border rounded-lg bg-white">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg">Finding the best candidates for this job...</p>
        </div>
      ) : matchResults.length > 0 && resultsReceived ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Top {matchResults.length} Matching Candidates</h2>
          <div className="space-y-4">
            {matchResults.map((candidate, index) => (
              <div key={candidate.id} className="border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                    }`}>
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold">{candidate.name}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                    index === 1 ? 'bg-gray-100 text-gray-800' : 
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {index === 0 ? 'Best Match' : index === 1 ? 'Second Match' : 'Third Match'}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md mb-3">
                  <p className="text-sm text-gray-700">{candidate.summary}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Added on {new Date(candidate.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (selectedJobId || jobDescription.trim()) && !loadingMatches && resultsReceived ? (
        <div className="text-center py-8 border rounded-lg bg-white">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-lg">No matching candidates found for this job.</p>
          <p className="text-gray-500">Try selecting a different job or modifying your description.</p>
        </div>
      ) : null}
    </div>
  )
}
