import React from 'react';
import { Job } from '../types';

interface JobDetailsProps {
  job: Job;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <span className="mr-4">{job.company}</span>
          <span className="mr-4">{job.type}</span>
          <span>{job.location}</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
        <p className="text-gray-700">{job.description}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
        <ul className="list-disc list-inside text-gray-700">
          {job.requirements.map((requirement: string, index: number) => (
            <li key={index}>{requirement}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Salary Range</h2>
        <p className="text-gray-700">
          {job.salaryRange.currency} {job.salaryRange.min} - {job.salaryRange.max}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Deadline</h2>
        <p className="text-gray-700">{job.applicationDeadline}</p>
      </div>

      <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
        Apply Now
      </button>
    </div>
  );
};

export default JobDetails; 