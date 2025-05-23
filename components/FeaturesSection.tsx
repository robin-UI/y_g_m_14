
import { Phone, Video, Users, Calendar, Clock, Award } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: JSX.Element, title: string, description: string }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-grey-100 animate-slide-up">
      <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-grey-800">{title}</h3>
      <p className="text-grey-600">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Phone size={24} />,
      title: "Phone Consultations",
      description: "Convenient phone calls with mentors that fit into your busy schedule."
    },
    {
      icon: <Video size={24} />,
      title: "Video Sessions",
      description: "Face-to-face virtual meetings for in-depth discussions and visual demonstrations."
    },
    {
      icon: <Users size={24} />,
      title: "In-Person Meetings",
      description: "One-on-one meetings in person for hands-on guidance and networking."
    },
    {
      icon: <Calendar size={24} />,
      title: "Flexible Scheduling",
      description: "Book sessions that work with both your schedule and your mentor's availability."
    },
    {
      icon: <Clock size={24} />,
      title: "Affordable Rates",
      description: "Pay only for the time you need with transparent, affordable pricing."
    },
    {
      icon: <Award size={24} />,
      title: "Vetted Experts",
      description: "All mentors are verified professionals with proven experience in their fields."
    }
  ];

  return (
    <section className="py-16 bg-grey-100 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-grey-800">How Our Mentorship Works</h2>
          <p className="text-xl text-grey-600 max-w-2xl mx-auto">
            We offer various ways to connect with mentors, ensuring you get the guidance that best suits your learning style.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
