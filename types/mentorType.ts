interface Mentor {
  imageUrl: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  reviews: number;
  location: string;
  description: string;
  specialties: string[];
  hourlyRate: number;
  experience: string;
}

export interface MentorCardProps {
  mentor: Mentor;
}