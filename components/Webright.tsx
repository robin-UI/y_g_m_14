import { Target, TrendingUp, Users } from 'lucide-react'
import React from 'react'

function Webright() {
  return (
        <section className="py-20 px-4">
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
            {/* <div className="absolute top-1/2 left-0 right-0 h-1 bg-primary/20 transform -translate-y-1/2 connecting-line origin-left"></div> */}
            
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
  )
}

export default Webright