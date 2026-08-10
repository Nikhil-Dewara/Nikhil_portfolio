import React, { useState } from 'react';
import { User, Briefcase, Code2, Mail, Music2 } from 'lucide-react';

export default function DynamicIsland({ activeSection }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <nav className="dynamic-island-container">
      <div
        className={`dynamic-island ${isExpanded ? 'expanded' : ''}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="island-compact-content">
          <div className="island-avatar">
            <span>ND</span>
            <span className="online-indicator"></span>
          </div>

          <div className="island-brand">
            <span className="brand-name">Ni<span className="accent">k</span>hil Dewara</span>
            <span className="brand-status">AceNet Consulting · Software Engineer</span>
          </div>
        </div>

        {/* Expanded Navigation Bar */}
        <div className="island-nav-links">
          <a href="#about" className={activeSection === 'about' ? 'active' : ''}>
            <User size={15} /> About
          </a>
          <a href="#experience" className={activeSection === 'experience' ? 'active' : ''}>
            <Briefcase size={15} /> Experience
          </a>
          <a href="#projects" className={activeSection === 'projects' ? 'active' : ''}>
            <Code2 size={15} /> Projects
          </a>
          <a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>
            <Mail size={15} /> Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
