'use client';

import { useState } from 'react';
import { Search, Filter, Star, MapPin, DollarSign, GraduationCap, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MentorCardProps } from '@/types/mentorType';
import Image from 'next/image';

// Mock mentor data - using the same structure as MentorsShowcase
const mentors = [
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
    hourlyRate: 45,
    experience: "5+ years",
    location: "San Francisco, CA"
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
    hourlyRate: 50,
    experience: "4+ years",
    location: "New York, NY"
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
    hourlyRate: 55,
    experience: "6+ years",
    location: "Seattle, WA"
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
    hourlyRate: 60,
    experience: "7+ years",
    location: "Austin, TX"
  },
  {
    id: 5,
    name: "David Kim",
    role: "Full Stack Developer",
    company: "Netflix",
    description: "Teaching modern web development and cloud architecture.",
    rating: 4.7,
    reviews: 89,
    imageUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    specialties: ["Full Stack", "Node.js", "AWS"],
    hourlyRate: 48,
    experience: "5+ years",
    location: "Los Angeles, CA"
  },
  {
    id: 6,
    name: "Emma Thompson",
    role: "Mobile Developer",
    company: "Uber",
    description: "Specialized in React Native and mobile app development best practices.",
    rating: 4.8,
    reviews: 67,
    imageUrl: "https://randomuser.me/api/portraits/women/33.jpg",
    specialties: ["React Native", "iOS", "Android"],
    hourlyRate: 52,
    experience: "4+ years",
    location: "Chicago, IL"
  }
];

const popularTags = [
  "UX/UI Mentor",
  "Full Stack",
  "Python Mentor",
  "Career Guidance",
  "Data Science",
  "React Developer",
  "Product Management",
  "Mobile Development"
];

const MentorCard = ({ mentor }: MentorCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Image
            width={64}
            height={64}
            src={mentor.imageUrl}
            alt={mentor.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{mentor.name}</h3>
            <p className="text-muted-foreground text-sm">{mentor.role} at {mentor.company}</p>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 text-sm font-medium">{mentor.rating}</span>
              <span className="ml-1 text-sm text-muted-foreground">({mentor.reviews} reviews)</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {mentor.location}
            </div>
          </div>
        </div>
        
        <p className="mt-4 text-muted-foreground text-sm">{mentor.description}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {mentor.specialties.map((specialty: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="font-semibold text-primary">${mentor.hourlyRate}/hr</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {mentor.experience}
            </div>
          </div>
          <Button size="sm">
            Book Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FindMentors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <div className="relative h-80 bg-gradient-to-r from-primary/20 to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
          <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-4xl shadow-lg border">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative flex-1">
                <Input
                  placeholder="Search for mentors, skills, or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-4 pr-12 text-lg border-2 border-border focus:border-primary"
                />
                <Button 
                  size="sm" 
                  className="absolute right-2 top-2 h-8 w-8 p-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground mr-2">Popular:</span>
              {popularTags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Price Range */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-4 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Price Range ($/hour)
                  </h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100}
                    step={5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Experience Level */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-4 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Experience Level
                  </h4>
                  <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 years</SelectItem>
                      <SelectItem value="3-4">3-4 years</SelectItem>
                      <SelectItem value="5+">5+ years</SelectItem>
                      <SelectItem value="7+">7+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Rating */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-4 flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Minimum Rating
                  </h4>
                  <div className="space-y-2">
                    {[5, 4.5, 4, 3.5].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`rating-${rating}`}
                          checked={selectedRating === rating.toString()}
                          onCheckedChange={() => setSelectedRating(rating.toString())}
                        />
                        <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                          {rating} <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" /> & up
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Qualifications */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-4 flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Specializations
                  </h4>
                  <div className="space-y-2">
                    {["Web Development", "Mobile Development", "Data Science", "UX/UI Design", "Product Management", "DevOps"].map((spec) => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox id={spec} />
                        <label htmlFor={spec} className="text-sm">
                          {spec}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Companies */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-4 flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Companies
                  </h4>
                  <div className="space-y-2">
                    {["Google", "Microsoft", "Amazon", "Apple", "Netflix", "Adobe"].map((company) => (
                      <div key={company} className="flex items-center space-x-2">
                        <Checkbox id={company} />
                        <label htmlFor={company} className="text-sm">
                          {company}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Available Mentors</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{mentors.length} mentors found</span>
                <Select defaultValue="rating">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {mentors.map(mentor => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>

            {/* Load More */}
            <div className="mt-10 text-center">
              <Button variant="outline" size="lg">
                Load More Mentors
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMentors;