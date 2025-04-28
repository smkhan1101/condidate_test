'use client';

import { useState } from 'react';

interface Job {
  id: number;
  title: string;
}

interface MatchFormProps {
  jobs: Job[];
  onSubmit: (data: { jobId?: number; jobDescription?: string }) => void;
}

export default function MatchForm({ jobs, onSubmit }: MatchFormProps) {
  const [selectedJobId, setSelectedJobId] = useState<number | ''>('');
  const [jobDescription, setJobDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        jobId: selectedJobId ? Number(selectedJobId) : undefined,
        jobDescription: selectedJobId ? undefined : jobDescription,
      });
    } catch (error) {
      console.error('Error finding matches:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="job" className="block text-sm font-medium text-gray-700">
          Select Job or Enter Description
        </label>
        <select
          id="job"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value ? Number(e.target.value) : '')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">-- Select a job --</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>
      
      {!selectedJobId && (
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            id="description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required={!selectedJobId}
          />
        </div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting || (!selectedJobId && !jobDescription)}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Finding Matches...' : 'Find Matches'}
      </button>
    </form>
  );
} 