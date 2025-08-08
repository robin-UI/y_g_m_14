"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  testimonial: string;
  rating: number;
  imageUrl: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Michael Brown",
    role: "Computer Science Student",
    company: "Stanford University",
    testimonial: "Working with my mentor has completely transformed my approach to coding. I've learned practical skills that my university courses didn't cover, and I landed an internship at a top tech company!",
    rating: 5,
    imageUrl: "https://randomuser.me/api/portraits/men/42.jpg"
  },
  {
    id: 2,
    name: "Emma Rodriguez",
    role: "UX Design Intern",
    company: "Design Studio Co.",
    testimonial: "The personalized feedback on my portfolio from my mentor helped me refine my work and stand out in interviews. The one-on-one video calls were incredibly valuable for my growth.",
    rating: 5,
    imageUrl: "https://randomuser.me/api/portraits/women/33.jpg"
  },
  {
    id: 3,
    name: "David Kim",
    role: "Junior Data Analyst",
    company: "Finance Tech Inc.",
    testimonial: "My mentor guided me through complex data projects and helped me understand industry best practices. Their insights were crucial in helping me transition from academia to a professional role.",
    rating: 4,
    imageUrl: "https://randomuser.me/api/portraits/men/56.jpg"
  },
  {
    id: 4,
    name: "Olivia Johnson",
    role: "Marketing Graduate",
    company: "Global Media",
    testimonial: "The in-person meetings with my mentor provided networking opportunities I wouldn't have had otherwise. They gave me practical advice that helped me launch my career in digital marketing.",
    rating: 5,
    imageUrl: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= testimonials.length ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-16 px-4 bg-secondary/5">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-grey-800">Success Stories</h2>
          <p className="text-xl text-grey-600 max-w-2xl mx-auto">
            Hear from students who have accelerated their careers through our mentorship program.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="min-w-full px-4"
                >
                  <div className="bg-white p-8 rounded-xl shadow-md border border-grey-100">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="flex-shrink-0">
                        {/* <img 
                          src={testimonial.imageUrl} 
                          alt={testimonial.name} 
                          className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                        /> */}
                        <Image
                          src={testimonial.imageUrl}
                          alt={testimonial.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                        />
                      </div>
                      <div>
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-grey-300'}`} 
                            />
                          ))}
                        </div>
                        <blockquote className="text-grey-700 italic mb-6 text-lg">
                          &quot;{testimonial.testimonial}&quot;
                        </blockquote>
                        <div>
                          <p className="font-semibold text-grey-800">{testimonial.name}</p>
                          <p className="text-grey-600 text-sm">{testimonial.role}, {testimonial.company}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center items-center mt-8 gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={prevTestimonial}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            {testimonials.map((_, index) => (
              <button 
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-grey-300'}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={nextTestimonial}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
