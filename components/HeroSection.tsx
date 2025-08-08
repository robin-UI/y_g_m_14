
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-primary/5 via-white to-secondary/10 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm text-primary font-medium text-sm mb-4">
                Find Your Perfect Mentor
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-grey-800 leading-tight">
              Unlock Your Potential with <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Expert</span> Mentorship
            </h1>
            <p className="text-lg text-grey-600 md:pr-10">
              Connect with affordable mentors for personalized guidance through phone calls, video meetings, and face-to-face sessions tailored to your goals and skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 text-white">
                Find Your Mentor <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="pt-6">
              <p className="text-grey-500 text-sm flex items-center">
                <span className="bg-green-500 h-2 w-2 rounded-full inline-block mr-2"></span>
                Over 1,000+ students already connected with mentors
              </p>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <div className="absolute -z-10 w-64 h-64 bg-primary/30 rounded-full blur-3xl top-10 right-10 animate-pulse"></div>
            <div className="absolute -z-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl bottom-10 left-10"></div>
            <div className="w-full h-[400px] md:h-[500px] rounded-xl backdrop-blur-md bg-white/40 border border-white/30 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/30 backdrop-blur-sm"></div>
              {/* <img 
                src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fG1lbnRvcnNoaXB8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60" 
                alt="Mentorship session" 
                className="object-cover h-full w-full rounded-xl mix-blend-overlay"
              /> */}
              <Image
                src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fG1lbnRvcnNoaXB8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
                alt="Mentorship session"
                fill
                className="object-cover h-full w-full rounded-xl mix-blend-overlay"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/70 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/50 hover:bg-white/80 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <Image
                    src="https://randomuser.me/api/portraits/women/23.jpg"
                    alt="Mentor"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-primary"
                  />
                  <div>
                    <p className="font-medium text-grey-800">Sarah Johnson</p>
                    <p className="text-sm text-grey-600">UX Design Mentor • 12+ years experience</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white/80 backdrop-blur-md rounded-lg shadow-xl p-4 max-w-[220px] border border-white/50 hidden md:block transform hover:translate-y-[-5px] transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-grey-800">Live Mentoring</p>
              </div>
              <p className="text-xs text-grey-600">Next session in 15 minutes with David on Web Development</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
