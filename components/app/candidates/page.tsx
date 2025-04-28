"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getCandidates, createCandidate, searchCandidates } from "@/lib/mock-data"
import type { Candidate } from "@/lib/types"

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [skills, setSkills] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    async function loadCandidates() {
      try {
        const data = await getCandidates()
        setCandidates(data)
      } finally {
        setLoading(false)
      }
    }

    loadCandidates()
  }, [])

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else if (searchQuery === "") {
        // Only reload all candidates if search was explicitly cleared
        setLoading(true);
        try {
          const data = await getCandidates();
          setCandidates(data);
        } finally {
          setLoading(false);
        }
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setSearching(true);
    try {
      const results = await searchCandidates(query);
      setCandidates(results);
    } catch (error) {
      console.error("Error searching candidates:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !skills.trim()) {
      alert("Please fill in all fields")
      return
    }

    setSubmitting(true)

    try {
      const newCandidate = await createCandidate({ name, skills })
      setCandidates((prev) => [...prev, newCandidate])
      setName("")
      setSkills("")
      setShowForm(false)
      alert("Candidate created successfully")
    } catch (error) {
      alert("Failed to create candidate")
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("");
    // The useEffect will handle reloading all candidates
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Candidates</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-500 text-white px-4 py-2 rounded">
          {showForm ? "Cancel" : "Add New Candidate"}
        </button>
      </div>

      {/* Search input */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input 
            type="text" 
            className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Search candidates by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery.trim() !== "" && (
            <button 
              type="button" 
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={clearSearch}
            >
              <svg className="w-4 h-4 text-gray-500 hover:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          )}
        </div>
        {searching && (
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          </div>
        )}
      </div>

      {showForm && (
        <div className="mb-8 border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Add New Candidate</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="e.g., John Doe"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block mb-1">Skills</label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full border rounded p-2"
                rows={3}
                placeholder="e.g., React, Node.js, TypeScript"
                disabled={submitting}
              />
            </div>

            <button type="submit" disabled={submitting} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
              {submitting ? "Adding..." : "Add Candidate"}
            </button>
          </form>
        </div>
      )}

      {loading || searching ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p>{loading ? "Loading candidates..." : "Searching candidates..."}</p>
        </div>
      ) : candidates.length === 0 && searchQuery ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="mb-4">No candidates found matching "{searchQuery}"</p>
          <button onClick={clearSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
            Clear Search
          </button>
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="mb-4">No candidates found. Add your first candidate!</p>
          <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add New Candidate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{candidate.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{new Date(candidate.created_at).toLocaleDateString()}</p>
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="text-sm font-medium mb-1">Skills:</h3>
                <p className="text-sm">{candidate.summary}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
