'use client';

import { useState, useEffect } from 'react';
import JobForm from './components/JobForm';
import CandidateForm from './components/CandidateForm';
import MatchForm from './components/MatchForm';
import MatchResults from './components/MatchResults';

interface Job {
  id: number;
  title: string;
}

interface Candidate {
  id: number;
  name: string;
  summary: string;
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [matchedCandidates, setMatchedCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleAddJob = async (data: { title: string; description: string }) => {
    try {
      const response = await fetch('http://localhost:3000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        await fetchJobs();
      }
    } catch (error) {
      console.error('Error adding job:', error);
      throw error;
    }
  };

  const handleAddCandidate = async (data: { name: string; summary: string }) => {
    try {
      const response = await fetch('http://localhost:3000/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add candidate');
      }
    } catch (error) {
      console.error('Error adding candidate:', error);
      throw error;
    }
  };

  const handleFindMatches = async (data: { jobId?: number; jobDescription?: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const candidates = await response.json();
        setMatchedCandidates(candidates);
      }
    } catch (error) {
      console.error('Error finding matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Job-Candidate Matching System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Job</h2>
              <JobForm onSubmit={handleAddJob} />
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Candidate</h2>
              <CandidateForm onSubmit={handleAddCandidate} />
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Matches</h2>
              <MatchForm jobs={jobs} onSubmit={handleFindMatches} />
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <MatchResults candidates={matchedCandidates} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
