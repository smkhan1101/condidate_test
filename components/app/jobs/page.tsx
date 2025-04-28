"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getJobs, createJob } from "@/lib/mock-data"
import type { Job } from "@/lib/types"
import Link from "next/link"

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getJobs()
        setJobs(data)
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      alert("Please fill in all fields")
      return
    }

    setSubmitting(true)

    try {
      const newJob = await createJob({ title, description })
      setJobs((prev) => [...prev, newJob])
      setTitle("")
      setDescription("")
      setShowForm(false)
      alert("Job created successfully")
    } catch (error) {
      alert("Failed to create job")
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-500 text-white px-4 py-2 rounded">
          {showForm ? "Cancel" : "Add New Job"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="e.g., Frontend Developer"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block mb-1">Job Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded p-2"
                rows={5}
                placeholder="Describe the job requirements, technologies, and responsibilities..."
                disabled={submitting}
              />
            </div>

            <button type="submit" disabled={submitting} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
              {submitting ? "Creating..." : "Create Job"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="mb-4">No jobs found. Add your first job posting!</p>
          <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add New Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{new Date(job.created_at).toLocaleDateString()}</p>
              <p className="mb-4">{job.description}</p>
              <div className="flex justify-end">
                <Link href={`/match?jobId=${job.id}`} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Find Candidates
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
