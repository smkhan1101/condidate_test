import Link from "next/link"

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto text-center py-10">
      <h1 className="text-4xl font-bold mb-6">Job-Candidate Matching System</h1>
      <p className="mb-8 text-gray-600">
        A vector similarity-based system to match the best candidates for your job openings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Add Jobs</h2>
          <p className="mb-4 text-sm text-gray-500">Create new job postings with descriptions</p>
          <Link href="/jobs" className="bg-blue-500 text-white px-4 py-2 rounded block text-center">
            Manage Jobs
          </Link>
        </div>

        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Add Candidates</h2>
          <p className="mb-4 text-sm text-gray-500">Create new candidate profiles with skills</p>
          <Link href="/candidates" className="bg-blue-500 text-white px-4 py-2 rounded block text-center">
            Manage Candidates
          </Link>
        </div>

        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Match Candidates</h2>
          <p className="mb-4 text-sm text-gray-500">Find the best candidates for your jobs</p>
          <Link href="/match" className="bg-blue-500 text-white px-4 py-2 rounded block text-center">
            Start Matching
          </Link>
        </div>
      </div>
    </div>
  )
}
