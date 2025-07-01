import React from 'react';
import { Heart, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-purple-900 via-purple-700 to-pink-700 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-300 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10">
        {/* Main footer content */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                Clothzy<span className="text-pink-300">Tech</span>
              </div>
              <p className="text-purple-100 text-sm leading-relaxed">
                Revolutionizing fashion with cutting-edge technology. Where style meets innovation.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/premshaky231/" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110">
                  <Instagram size={18} />
                </a>
                <a href="" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110">
                  <Twitter size={18} />
                </a>
                <a href="https://www.facebook.com/share/1AqqhsFTBW/" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110">
                  <Facebook size={18} />
                </a>
                <a href="https://www.linkedin.com/in/prem-shakya?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-pink-200">Quick Links</h3>
              <div className="space-y-2">
                {['Home', 'About Us', 'Products', 'Services', 'Blog'].map((link, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="block text-purple-100 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-pink-200">Support</h3>
              <div className="space-y-2">
                {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'FAQ'].map((link, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="block text-purple-100 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-pink-200">Get in Touch</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-purple-100">
                  <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Mail size={14} />
                  </div>
                  <span className="text-sm">hello@clothzytech.com</span>
                </div>
                <div className="flex items-center space-x-3 text-purple-100">
                  <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Phone size={14} />
                  </div>
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-purple-100">
                  <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <MapPin size={14} />
                  </div>
                  <span className="text-sm">New York, NY 10001</span>
                </div>
              </div>
              
              {/* Newsletter Signup */}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Stay Updated</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-l-lg text-sm placeholder-purple-200 focus:outline-none focus:border-pink-300 transition-colors"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-r-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-sm text-purple-200">
                © {new Date().getFullYear()} ClothzyTech. All rights reserved.
              </div>
              <div className="flex items-center space-x-2 text-sm text-purple-200">
                <span>Made with</span>
                <Heart size={16} className="text-pink-400 animate-pulse" />
                <span>for fashion lovers</span>
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-purple-200 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-purple-200 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-purple-200 hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;