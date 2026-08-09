import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Download,
  Mail,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BadgeCheck,
  Phone,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import ThreeBackground from "./components/ThreeBackground";
import CustomCursor from "./components/CustomCursor";
import DynamicIsland from "./components/DynamicIsland";
import GlassDock from "./components/GlassDock";
import "./App.css";

const ROLES = ["Full Stack Developer", "Python Engineer", "AI Builder"];

// STRICT TECH STACK ACCORDING TO USER REQUIREMENTS
const STRICT_SKILLS = [
  "Python",
  "Django",
  "React.js",
  "SQL",
  "SQLite",
  "FastAPI",
  "OpenAI API",
  "LLM",
  "LangChain",
  "RAG",
];

const EXPERIENCE = [
  {
    role: "Software Engineer",
    company: "AceNet Consulting",
    dates: "Aug 2025 — Present",
    tag: "CURRENT",
    logoUrl: "/acenet-logo.png",
    logoFallback: "AC",
    bullets: [
      "Designed and built REST APIs in FastAPI powering internal business tools and client-facing features, owning business logic and data validation end to end.",
      "Built reusable, modular React.js components for the E2O (Thejo) client project, improving UI consistency and long-term maintainability.",
      "Took ownership of critical client-raised production issues on the BG application, working directly with client teams to diagnose and resolve.",
      "Implemented complex Microsoft SQL Server schema migrations to support evolving business requirements without disrupting production.",
    ],
    tags: ["FastAPI", "React.js", "SQL", "Python"],
  },
  {
    role: "Full Stack Developer Intern",
    company: "AceNet Consulting",
    dates: "May 2025 — Aug 2025",
    tag: "3 MONTHS",
    logoUrl: "/acenet-logo.png",
    logoFallback: "AC",
    bullets: [
      "Architected internal proofs of concept (Trade Matching Engine, CMMS, AI applications), taking each from design through working demo.",
      "Conducted API testing across multiple services using Swagger and Postman, and optimized SQL queries to improve backend performance.",
    ],
    tags: ["Python", "FastAPI", "SQL", "SQLite"],
  },
];

const PERSONAL_PROJECTS = [
  {
    id: "ai-screener",
    title: "AI Voice Interview Screener",
    description:
      "An autonomous voice agent that conducts real screening interviews — listens, reasons about answer quality, decides whether to follow up, and speaks back in real time.",
    tags: ["React.js", "FastAPI", "OpenAI API", "LLM", "RAG"],
    demoUrl: "https://speech-interview-frontend.vercel.app/",
    codeUrl: "#",
    featured: true,
    category: "ai",
  },
  {
    id: "ai-travel",
    title: "AI Travel Agentic Assistant",
    description:
      "Conversational agentic AI platform using LangChain and LLM reasoning to plan customized trips based on budgets and constraints.",
    tags: ["Python", "LangChain", "OpenAI API", "LLM"],
    codeUrl: "https://github.com/Nikhil-Dewara/AI_Travel-AgenticAI",
    category: "ai",
  },
  {
    id: "melody",
    title: "Melody E-Commerce Platform",
    description:
      "Full-stack e-commerce platform for music/merchandise — complete cart, checkout, order flow, and database models.",
    tags: ["Django", "SQL", "SQLite", "React.js"],
    codeUrl: "https://github.com/Nikhil-Dewara/Melody/tree/main/melodyproject",
    category: "fullstack",
  },
  {
    id: "pizza-app",
    title: "Pizza Ordering Platform",
    description:
      "Full-stack food ordering application — Django backend integrated with HTML/CSS, JS, and SQL database end to end.",
    tags: ["Django", "Python", "SQL", "SQLite"],
    codeUrl:
      "https://github.com/Nikhil-Dewara/PizzaProject/tree/main/PizzaProject",
    category: "fullstack",
  },
];

const WORK_PROJECTS = [
  {
    title: "Trade Matching Engine (TME)",
    description:
      "High-concurrency FastAPI backend paired with React.js UI, matching multi-party financial trades, settlement logic, and mismatch validation.",
    tags: ["FastAPI", "React.js", "SQL"],
  },
  {
    title: "CMMS Management System",
    description:
      "Full UI proof of concept for maintenance management covering preventive workflows and role-based access control.",
    tags: ["React.js", "FastAPI", "SQL"],
  },
  {
    title: "Micro Frontend Host Architecture",
    description:
      "Host application integrating multiple decoupled micro frontends, enhancing load speed and modular codebase scalability.",
    tags: ["React.js", "Architecture"],
  },
  {
    title: "AI VKYC & AI Timesheet Suite",
    description:
      "Video KYC verification system alongside AI-driven timesheet processing leveraging cloud AI vision & text extraction.",
    tags: ["OpenAI API", "LLM", "Python"],
  },
  {
    title: "CMMS Agentic AI Telemetry Engine",
    description:
      "Autonomous assistant using agentic orchestration to synthesize real-time industrial machine telemetry data.",
    tags: ["LangChain", "RAG", "LLM", "FastAPI"],
  },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.12 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal--visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// PRISM-EDGE TILT CARD
function TiltCard({ children, className = "", accent = false }) {
  const ref = useRef(null);

  function handleMouseMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mx = (x / rect.width) * 100;
    const my = (y / rect.height) * 100;

    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;

    el.style.setProperty("--mx", `${mx}%`);
    el.style.setProperty("--my", `${my}%`);
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
  }

  return (
    <div
      ref={ref}
      className={`glass-card tilt-card ${accent ? "tilt-card--accent" : ""} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-glare" />
      <div className="card-content-3d">{children}</div>
    </div>
  );
}

function App() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [photoError, setPhotoError] = useState(false);
  const [projectTab, setProjectTab] = useState("all");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  const scrollerRef = useRef(null);

  // Role Ticker Loop
  useEffect(() => {
    const interval = setInterval(
      () => setRoleIndex((i) => (i + 1) % ROLES.length),
      2400,
    );
    return () => clearInterval(interval);
  }, []);

  // Initial Loader Simulation
  useEffect(() => {
    const tick = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 25, 100);
        if (next >= 100) {
          clearInterval(tick);
          setTimeout(() => setLoading(false), 350);
        }
        return next;
      });
    }, 100);
    return () => clearInterval(tick);
  }, []);

  // Active Section Scroll Observer
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const handleScroll = () => {
      const scrollY = window.scrollY;
      sections.forEach((sec) => {
        const top = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id = sec.getAttribute("id");
        if (scrollY >= top && scrollY < top + height) {
          setActiveSection(id);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollExperience(dir) {
    scrollerRef.current?.scrollBy({ left: dir * 390, behavior: "smooth" });
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText("nikdewara@gmail.com");
    setCopiedEmail(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#ff5d73", "#6d5ef5", "#00a99c", "#ffa726"],
    });
    setTimeout(() => setCopiedEmail(false), 2500);
  }

  const filteredPersonalProjects = PERSONAL_PROJECTS.filter((p) => {
    if (projectTab === "all") return true;
    if (projectTab === "ai") return p.category === "ai";
    if (projectTab === "fullstack") return p.category === "fullstack";
    return true;
  });

  return (
    <div className="app-container">
      {/* Levitating 3D Prism-Glass WebGL Canvas */}
      <ThreeBackground />

      {/* Custom Liquid Cursor */}
      <CustomCursor />

      {/* iOS Dynamic Island Top Header */}
      <DynamicIsland activeSection={activeSection} />

      {/* iOS Glass Dock Bottom Bar */}
      <GlassDock />

      {/* Initial Prism Glass Loader */}
      {loading && (
        <div className="loader-screen">
          <div className="loader-card glass-card">
            <div className="apple-logo-badge">
              <span>ND</span>
            </div>
            <h2 className="loader-title">
              Ni<span className="accent">k</span>hil Dewara
            </h2>
            <p className="loader-sub">Full Stack & AI Engineer</p>
            <div className="loader-bar-bg">
              <div
                className="loader-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="loader-pct">{Math.floor(progress)}%</div>
          </div>
        </div>
      )}

      <main className="content-wrapper">
        {/* HERO SECTION */}
        <section id="hero" className="hero-section">
          <div className="hero-grid">
            <div className="hero-text-card">
              <div className="status-pill">
                <span className="status-dot"></span>
                <span>Available for Full-time Roles & AI Development</span>
              </div>

              <h1 className="hero-name">
                Ni<span className="accent">k</span>hil
                <br />
                Dewara
              </h1>

              <div className="role-ticker-box">
                <span className="role-prefix">I am a</span>
                <span className="role-text" key={roleIndex}>
                  {ROLES[roleIndex]}
                </span>
              </div>

              <p className="hero-bio">
                FastAPI, Django, and React by trade — self-hosted multi-model AI
                pipelines, LangChain, and RAG applications by curiosity.
                Building high-concurrency platforms and agentic AI at{" "}
                <strong>AceNet Consulting</strong>.
              </p>

              <div className="hero-buttons">
                {/* DIRECT PDF DOWNLOAD LINK */}
                <a
                  className="btn btn-primary"
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  download="Nikhil_Dewara_Resume.pdf"
                >
                  <Download /> Download Resume
                </a>
                <a
                  className="btn btn-glass"
                  href="https://github.com/Nikhil-Dewara"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGithub /> GitHub
                </a>
                <a className="btn btn-ghost" href="mailto:nikdewara@gmail.com">
                  <Mail /> Contact Me
                </a>
              </div>

              {/* Quick Spec Metrics */}
              <div className="hero-stats-row">
                <div className="stat-widget">
                  <span className="stat-num">FastAPI & Django</span>
                  <span className="stat-label">High-Performance APIs</span>
                </div>
                <div className="stat-widget">
                  <span className="stat-num">React.js & SQL</span>
                  <span className="stat-label">Full Stack Systems</span>
                </div>
                <div className="stat-widget">
                  <span className="stat-num">LangChain & RAG</span>
                  <span className="stat-label">LLM Agent Pipelines</span>
                </div>
              </div>
            </div>

            {/* LEVITATING 3D HERO AVATAR CARD */}
            <div className="hero-avatar-wrapper">
              <TiltCard accent className="hero-avatar-card">
                <div className="avatar-glass-inner">
                  {photoError ? (
                    <div className="photo-fallback">
                      <span className="fallback-initial">N</span>
                      <span className="fallback-tag">Nikhil Dewara</span>
                    </div>
                  ) : (
                    <img
                      src="/per.jpg"
                      alt="Nikhil Dewara"
                      onError={() => setPhotoError(true)}
                      className="profile-photo"
                    />
                  )}
                  <div className="avatar-badge">
                    <BadgeCheck /> Software Engineer
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* ABOUT & SKILLS SECTION */}
        <Reveal>
          <section id="about" className="section">
            <div className="section-header">
              <span className="badge-pill">Overview & Core Stack</span>
              <h2 className="section-title">About & Skills</h2>
            </div>

            <div className="about-grid">
              <TiltCard className="about-main-card">
                <p className="about-text">
                  I'm a <strong>Software Engineer</strong> who enjoys owning
                  problems end-to-end — from architecting a relational database
                  schema in <strong>SQL & SQLite</strong> to shipping a clean
                  responsive UI in <strong>React.js</strong>. At AceNet
                  Consulting, I build high-concurrency trade matching engines
                  and enterprise workflows.
                </p>
                <p className="about-text" style={{ marginTop: "1rem" }}>
                  I specialize in{" "}
                  <strong>Agentic AI, LangChain, and RAG architecture</strong> —
                  combining <strong>FastAPI, Django, and OpenAI APIs</strong> to
                  build intelligent voice screeners and autonomous decision
                  systems.
                </p>
              </TiltCard>

              {/* SKILLS MATRIX */}
              <TiltCard accent className="strict-skills-card">
                <h4 className="skills-title">
                  <Sparkles /> Tech Stack & Frameworks
                </h4>
                <div className="strict-tag-grid">
                  {STRICT_SKILLS.map((skill) => (
                    <span key={skill} className="strict-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </div>
          </section>
        </Reveal>

        {/* EXPERIENCE SECTION WITH COMPANY LOGO PLACEHOLDERS */}
        <Reveal>
          <section id="experience" className="section">
            <div className="section-header-row">
              <div>
                <span className="badge-pill">Career History</span>
                <h2 className="section-title">Professional Experience</h2>
              </div>
              <div className="scroll-controls">
                <button
                  onClick={() => scrollExperience(-1)}
                  aria-label="Scroll left"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={() => scrollExperience(1)}
                  aria-label="Scroll right"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>

            <div className="experience-scroller" ref={scrollerRef}>
              {EXPERIENCE.map((job, i) => (
                <TiltCard key={i} accent className="exp-card">
                  <div className="exp-top">
                    {/* DEDICATED COMPANY LOGO CONTAINER PLACEHOLDER */}
                    <div className="company-logo-container">
                      <img
                        src="/loader.png"
                        alt={`${job.company} logo`}
                        className="company-logo-img"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>

                    <span className="pill-status">{job.tag}</span>
                  </div>

                  <span className="timeline-dates">{job.dates}</span>
                  <h3 className="exp-role">{job.role}</h3>
                  <p className="exp-company">{job.company}</p>

                  <ul className="exp-bullet-list">
                    {job.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>

                  <div className="tag-row" style={{ marginTop: "auto" }}>
                    {job.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              ))}
            </div>
          </section>
        </Reveal>

        {/* PROJECTS SHOWCASE SECTION */}
        <section id="projects" className="section">
          <Reveal>
            <div className="section-header-row">
              <div>
                <span className="badge-pill">Built Systems</span>
                <h2 className="section-title">Projects & Applications</h2>
              </div>

              {/* Category Filter Tabs */}
              <div className="project-tabs">
                <button
                  className={`tab-btn ${projectTab === "all" ? "active" : ""}`}
                  onClick={() => setProjectTab("all")}
                >
                  All Projects
                </button>
                <button
                  className={`tab-btn ${projectTab === "ai" ? "active" : ""}`}
                  onClick={() => setProjectTab("ai")}
                >
                  AI & RAG
                </button>
                <button
                  className={`tab-btn ${projectTab === "fullstack" ? "active" : ""}`}
                  onClick={() => setProjectTab("fullstack")}
                >
                  Full Stack
                </button>
              </div>
            </div>
          </Reveal>

          {/* PERSONAL PROJECTS GRID */}
          <div className="standard-project-grid">
            {filteredPersonalProjects.map((p) => (
              <Reveal key={p.title}>
                <TiltCard className="standard-project-card">
                  <div className="window-chrome">
                    <div className="window-dots">
                      <span className="dot dot-red" />
                      <span className="dot dot-amber" />
                      <span className="dot dot-green" />
                    </div>
                    {p.featured && (
                      <span className="featured-badge-tag">Featured Build</span>
                    )}
                  </div>

                  <h3 className="card-title">{p.title}</h3>
                  <p className="card-desc">{p.description}</p>

                  <div className="tag-row" style={{ marginBottom: "16px" }}>
                    {p.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="card-bottom-actions">
                    {p.codeUrl && p.codeUrl !== "#" ? (
                      <a
                        className="btn btn-ghost btn-sm"
                        href={p.codeUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaGithub size={16} /> Repository
                      </a>
                    ) : (
                      <span className="tag tag--muted">Private Repo</span>
                    )}

                    {p.demoUrl && p.demoUrl !== "#" && (
                      <a className="btn btn-primary btn-sm" href={p.demoUrl}>
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          {/* ENTERPRISE WORK PROJECTS GRID */}
          <Reveal>
            <div className="section-subtitle-box">
              <span className="badge-pill">Enterprise Projects</span>
              <h3 className="section-subtitle">
                AceNet Consulting Deliverables
              </h3>
            </div>
          </Reveal>

          <div className="standard-project-grid">
            {WORK_PROJECTS.map((p) => (
              <Reveal key={p.title}>
                <TiltCard className="standard-project-card work-project-card">
                  <div className="window-chrome">
                    <div
                      className="company-logo-container"
                      style={{ width: "32px", height: "32px" }}
                    >
                      <span
                        className="company-logo-fallback"
                        style={{ fontSize: "0.75rem" }}
                      >
                        AC
                      </span>
                    </div>
                    <span className="tag tag--muted">Client Project</span>
                  </div>

                  <h3 className="card-title">{p.title}</h3>
                  <p className="card-desc">{p.description}</p>

                  <div className="tag-row" style={{ marginTop: "auto" }}>
                    {p.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FOOTER & CONTACT SECTION */}
        <Reveal>
          <footer id="contact" className="footer-section">
            <TiltCard accent className="contact-glass-card">
              <div className="footer-content">
                <span className="badge-pill">Get In Touch</span>
                <h2 className="footer-title">
                  Let's build{" "}
                  <span className="accent">something extraordinary</span>
                </h2>
                <p className="footer-sub">
                  Have an open software role, consulting project, or want to
                  discuss Python, FastAPI & LLM Agent systems? My inbox is open.
                </p>

                <div className="contact-grid">
                  <button
                    className="contact-item-btn"
                    onClick={handleCopyEmail}
                  >
                    <div className="contact-icon">
                      <Mail />
                    </div>
                    <div className="contact-details">
                      <span className="contact-label">Email Address</span>
                      <span className="contact-val">nikdewara@gmail.com</span>
                    </div>
                    <span className="copy-badge">
                      {copiedEmail ? "Copied! ✨" : "Copy Email"}
                    </span>
                  </button>

                  <a className="contact-item-btn" href="tel:+917976603438">
                    <div className="contact-icon">
                      <Phone />
                    </div>
                    <div className="contact-details">
                      <span className="contact-label">Phone Number</span>
                      <span className="contact-val">+91 7976603438</span>
                    </div>
                    <ExternalLink className="nav-arrow" />
                  </a>

                  <a
                    className="contact-item-btn"
                    href="https://linkedin.com/in/nikhil-dewara-77a3411a7"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="contact-icon">
                      <FaLinkedin />
                    </div>
                    <div className="contact-details">
                      <span className="contact-label">LinkedIn Profile</span>
                      <span className="contact-val">/in/nikhil-dewara</span>
                    </div>
                    <ExternalLink className="nav-arrow" />
                  </a>

                  <a
                    className="contact-item-btn"
                    href="https://github.com/Nikhil-Dewara"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="contact-icon">
                      <FaGithub />
                    </div>
                    <div className="contact-details">
                      <span className="contact-label">GitHub Repositories</span>
                      <span className="contact-val">/Nikhil-Dewara</span>
                    </div>
                    <ExternalLink className="nav-arrow" />
                  </a>
                </div>

                <div className="footer-bottom">
                  <p>
                    © {new Date().getFullYear()} Nikhil Dewara. Prism Glass
                    Portfolio System.
                  </p>
                </div>
              </div>
            </TiltCard>
          </footer>
        </Reveal>
      </main>
    </div>
  );
}

export default App;
