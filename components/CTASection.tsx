
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute -z-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl top-10 right-10"></div>
      <div className="absolute -z-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl bottom-10 left-10"></div>
      <div className="container mx-auto">
        <div className="backdrop-blur-lg bg-gradient-to-r from-primary/80 to-primary-dark/90 rounded-xl p-8 md:p-12 text-white shadow-xl border border-white/10 transform hover:scale-[1.01] transition-all duration-300">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Accelerate Your Growth?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of students who are advancing their careers through personalized mentorship. 
              Get matched with the perfect mentor today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-grey-100 hover:shadow-lg transition-all duration-300 group">
                Find Your Mentor <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/80">
              No commitments. Cancel your subscription anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
