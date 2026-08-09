import React from 'react';
import { Mail, Phone, FileText, ArrowUp } from 'lucide-react';
import { FaGithub, FaLinkedin } from "react-icons/fa";
export default function GlassDock() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="glass-dock-wrapper">
      <div className="glass-dock">
        <a
          href="https://github.com/Nikhil-Dewara"
          target="_blank"
          rel="noreferrer"
          className="dock-item"
          data-tooltip="GitHub Profile"
        >
          <FaGithub />
        </a>

        <a
          href="https://linkedin.com/in/nikhil-dewara-77a3411a7"
          target="_blank"
          rel="noreferrer"
          className="dock-item"
          data-tooltip="LinkedIn"
        >
         <FaLinkedin />
        </a>

        <a
          href="mailto:nikdewara@gmail.com"
          className="dock-item"
          data-tooltip="Send Email"
        >
          <Mail />
        </a>

        <a
          href="tel:+917976603438"
          className="dock-item"
          data-tooltip="Call Phone"
        >
          <Phone />
        </a>

        <div className="dock-separator"></div>

        {/* RESUME BUTTON DIRECT DOWNLOAD/VIEW LINK */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          download="Nikhil_Dewara_Resume.pdf"
          className="dock-item dock-item--accent"
          data-tooltip="Download Resume (PDF)"
        >
          <FileText />
        </a>

        <button
          onClick={scrollToTop}
          className="dock-item dock-item--ghost"
          data-tooltip="Scroll to Top"
        >
          <ArrowUp />
        </button>
      </div>
    </div>
  );
}