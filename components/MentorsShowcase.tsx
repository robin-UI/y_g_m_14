"use client";
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

// Define a type for mentor data
type Mentor = {
  id: number;
  name: string;
  role: string;
  company: string;
  description: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  specialties: string[];
  hourlyRate: number;
};

const mentors: Mentor[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Senior Software Engineer",
    company: "Google",
    description: "Specializing in web development and helping new developers navigate the tech industry.",
    rating: 4.9,
    reviews: 145,
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    specialties: ["React", "JavaScript", "Career Guidance"],
    hourlyRate: 45
  },
  {
    id: 2,
    name: "Sophia Chen",
    role: "UX/UI Designer",
    company: "Adobe",
    description: "Passionate about creating user-centered designs and teaching design thinking.",
    rating: 5.0,
    reviews: 93,
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    specialties: ["UX Design", "Figma", "Portfolio Reviews"],
    hourlyRate: 50
  },
  {
    id: 3,
    name: "Marcus Williams",
    role: "Data Scientist",
    company: "Microsoft",
    description: "Helping students understand data analysis and machine learning concepts.",
    rating: 4.8,
    reviews: 76,
    imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    specialties: ["Python", "Machine Learning", "Data Visualization"],
    hourlyRate: 55
  },
  {
    id: 4,
    name: "Priya Patel",
    role: "Product Manager",
    company: "Amazon",
    description: "Guiding aspiring product managers through the intricacies of product development.",
    rating: 4.9,
    reviews: 112,
    imageUrl: "https://randomuser.me/api/portraits/women/28.jpg",
    specialties: ["Product Strategy", "Roadmapping", "User Research"],
    hourlyRate: 60
  }
];

const MentorCard = ({ mentor }: { mentor: Mentor }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-grey-100">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* <img 
            src={mentor.imageUrl}
            alt={mentor.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          /> */}
          <Image
            src={mentor.imageUrl}
            alt={mentor.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
          <div>
            <h3 className="font-semibold text-lg text-grey-800">{mentor.name}</h3>
            <p className="text-grey-600 text-sm">{mentor.role} at {mentor.company}</p>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 text-sm font-medium">{mentor.rating}</span>
              <span className="ml-1 text-sm text-grey-500">({mentor.reviews} reviews)</span>
            </div>
          </div>
        </div>
        
        <p className="mt-4 text-grey-600 text-sm">{mentor.description}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {mentor.specialties.map((specialty, index) => (
            <span key={index} className="px-2 py-1 bg-grey-100 text-grey-700 text-xs rounded-full">
              {specialty}
            </span>
          ))}
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div>
            <span className="text-primary font-semibold">${mentor.hourlyRate}</span>
            <span className="text-grey-600 text-sm"> / hour</span>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary-dark text-white">
            Book Session
          </Button>
        </div>
      </div>
    </div>
  );
};

const MentorsShowcase = () => {
  const [visibleMentors, setVisibleMentors] = useState(4);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-grey-800">Meet Our Expert Mentors</h2>
            <p className="text-xl text-grey-600 max-w-2xl">
              Connect with industry professionals who are passionate about sharing their knowledge and experience.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary-light/10 mt-6 md:mt-0"
            onClick={() => setVisibleMentors(prevCount => prevCount + 4)}
          >
            View All Mentors <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.slice(0, visibleMentors).map(mentor => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
        
        {visibleMentors < mentors.length && (
          <div className="mt-10 text-center">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary-light/10"
              onClick={() => setVisibleMentors(prevCount => prevCount + 4)}
            >
              Load More Mentors
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MentorsShowcase;
