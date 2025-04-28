'use client';

interface Candidate {
  id: number;
  name: string;
  summary: string;
}

interface MatchResultsProps {
  candidates: Candidate[];
  isLoading: boolean;
}

export default function MatchResults({ candidates, isLoading }: MatchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No matching candidates found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Top Matching Candidates</h3>
      <div className="grid gap-4">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white shadow rounded-lg p-4"
          >
            <h4 className="text-lg font-medium text-gray-900">{candidate.name}</h4>
            <p className="mt-2 text-gray-600">{candidate.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 