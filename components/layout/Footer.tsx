
// import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-grey-800 to-grey-900 text-white pt-16 pb-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-grey-700/50">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-md p-1 mr-2 text-xl">Y</span>
              <span className="text-xl font-bold">YouGotaMentor</span>
            </div>
            <p className="text-grey-400">
              Connecting students with affordable mentorship to unlock their full potential.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-grey-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-grey-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-grey-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-grey-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-grey-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/mentors" className="text-grey-400 hover:text-white transition-colors">Find Mentors</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-grey-400 hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link href="/pricing" className="text-grey-400 hover:text-white transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="/about" className="text-grey-400 hover:text-white transition-colors">About Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-grey-400 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-grey-400 hover:text-white transition-colors">Success Stories</Link>
              </li>
              <li>
                <Link href="/faq" className="text-grey-400 hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/community" className="text-grey-400 hover:text-white transition-colors">Community</Link>
              </li>
              <li>
                <Link href="/become-mentor" className="text-grey-400 hover:text-white transition-colors">Become a mentor</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center group">
                <Mail className="h-5 w-5 mr-2 text-primary group-hover:text-white transition-colors" />
                <a href="mailto:info@yougotamentor.com" className="text-grey-400 group-hover:text-white transition-colors">
                  info@yougotamentor.com
                </a>
              </li>
              <li className="flex items-center group">
                <Phone className="h-5 w-5 mr-2 text-primary group-hover:text-white transition-colors" />
                <a href="tel:+1234567890" className="text-grey-400 group-hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary mt-1" />
                <span className="text-grey-400">
                  123 Mentor Street, San Francisco, CA 94107
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 text-grey-400 text-sm flex flex-col md:flex-row md:justify-between">
          <p>&copy; {new Date().getFullYear()} YouGotaMentor. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
