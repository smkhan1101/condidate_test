export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  type: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  applicationDeadline: string;
} 