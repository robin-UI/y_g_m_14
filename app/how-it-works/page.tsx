'use client';

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Target, Star, TrendingUp, CheckCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo(heroRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      // Problem section animation
      gsap.fromTo(".problem-card", 
        { opacity: 0, scale: 0.8, rotation: -5 },
        { 
          opacity: 1, 
          scale: 1, 
          rotation: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: problemRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Solution reveal animation
      gsap.fromTo(".solution-element", 
        { opacity: 0, x: -100 },
        { 
          opacity: 1, 
          x: 0,
          duration: 1,
          stagger: 0.3,
          scrollTrigger: {
            trigger: solutionRef.current,
            start: "top 70%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Journey path animation
      gsap.fromTo(".journey-step", 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0,
          duration: 0.8,
          stagger: 0.4,
          scrollTrigger: {
            trigger: journeyRef.current,
            start: "top 60%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Connecting line animation
      gsap.fromTo(".connecting-line", 
        { scaleX: 0 },
        { 
          scaleX: 1,
          duration: 2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: journeyRef.current,
            start: "top 50%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // CTA bounce animation
      gsap.fromTo(ctaRef.current, 
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, 
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* <Header /> */}
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-20 pb-16 px-4 text-center bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Your Dreams, <span className="text-primary">Our Mission</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transforming confusion into clarity, struggles into success, and dreams into reality through personalized mentorship.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section ref={problemRef} className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            The Challenge Students Face
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="problem-card bg-card p-8 rounded-2xl shadow-lg border border-destructive/20">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-destructive">Lost & Confused</h3>
              <p className="text-muted-foreground">
                Students struggle with unclear career paths, overwhelming choices, and lack of direction in their academic journey.
              </p>
            </div>
            <div className="problem-card bg-card p-8 rounded-2xl shadow-lg border border-destructive/20">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-destructive">No Guidance</h3>
              <p className="text-muted-foreground">
                Limited access to experienced mentors who can provide personalized advice and real-world insights.
              </p>
            </div>
            <div className="problem-card bg-card p-8 rounded-2xl shadow-lg border border-destructive/20">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-destructive">Wasted Potential</h3>
              <p className="text-muted-foreground">
                Talented individuals missing opportunities due to lack of proper guidance and structured learning paths.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section ref={solutionRef} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              We Bridge The Gap
            </h2>
            <p className="text-xl text-muted-foreground">
              Connecting ambitious learners with industry experts {`who've`} walked the path
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-primary/20 transform -translate-y-1/2 connecting-line origin-left"></div>
            
            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              <div className="solution-element text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Expert Mentors</h3>
                <p className="text-muted-foreground">
                  Connect with industry leaders who have real-world experience and proven track records.
                </p>
              </div>
              
              <div className="solution-element text-center">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Target className="w-10 h-10 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Personalized Guidance</h3>
                <p className="text-muted-foreground">
                  Receive tailored advice that fits your unique goals, skills, and career aspirations.
                </p>
              </div>
              
              <div className="solution-element text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <TrendingUp className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Accelerated Growth</h3>
                <p className="text-muted-foreground">
                  Fast-track your learning and career development with structured mentorship programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section ref={journeyRef} className="py-20 px-4 bg-gradient-to-b from-primary/5 to-secondary/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Your Journey to Success
          </h2>
          
          <div className="space-y-16">
            <div className="journey-step flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 order-2 md:order-1">
                <div className="bg-card p-8 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">1</div>
                    <h3 className="text-2xl font-semibold">Find Your Mentor</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Browse through our curated list of expert mentors, filter by your field of interest, and choose the perfect match for your goals.
                  </p>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="bg-primary/10 p-8 rounded-2xl flex items-center justify-center h-64">
                  <Users className="w-24 h-24 text-primary" />
                </div>
              </div>
            </div>

            <div className="journey-step flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1">
                <div className="bg-card p-8 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold">2</div>
                    <h3 className="text-2xl font-semibold">Schedule & Connect</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Book one-on-one sessions, join group mentoring programs, and start building a meaningful relationship with your mentor.
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-secondary/10 p-8 rounded-2xl flex items-center justify-center h-64">
                  <Target className="w-24 h-24 text-secondary" />
                </div>
              </div>
            </div>

            <div className="journey-step flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 order-2 md:order-1">
                <div className="bg-card p-8 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">3</div>
                    <h3 className="text-2xl font-semibold">Achieve Your Dreams</h3>
                  </div>
                  <p className="text-muted-foreground">
                    With personalized guidance, structured learning paths, and continuous support, transform your aspirations into achievements.
                  </p>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="bg-primary/10 p-8 rounded-2xl flex items-center justify-center h-64">
                  <Star className="w-24 h-24 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            The Results Speak for Themselves
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-secondary mb-2">3x</div>
              <p className="text-muted-foreground">Faster Career Growth</p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
              <p className="text-muted-foreground">Student Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students who have already found their path to success
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
            Find Your Mentor Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default HowItWorks;