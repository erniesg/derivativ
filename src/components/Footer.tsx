import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl font-bold text-black anta-regular">
                ∂
              </div>
              <span className="text-lg font-semibold text-gray-900">Derivativ</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              AI-powered math tutor for Cambridge IGCSE Mathematics.
              Generate high-quality questions with multi-agent coordination
              and real-time quality control.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/erniesg/derivativ.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:hello@derivativ.ai"
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          {/* <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/practice"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  Practice
                </Link>
              </li>
              <li>
                <Link
                  to="/learn"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  Learn
                </Link>
              </li>
              <li>
                <Link
                  to="/assessment"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  Auto-Assessment
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  About
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Resources */}
          {/* <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-0580/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>Cambridge IGCSE</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <Link
                  to="/teacher"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  Teacher Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  API Reference
                </a>
              </li>
            </ul>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Derivativ AI. Built with multi-agent coordination.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;