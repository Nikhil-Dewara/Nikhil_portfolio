import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Download,
  Mail,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BadgeCheck,
  Phone,
  GraduationCap,
  Award,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import ThreeBackground from "./components/ThreeBackground";
import CustomCursor from "./components/CustomCursor";
import DynamicIsland from "./components/DynamicIsland";
import GlassDock from "./components/GlassDock";
import "./App.css";

const ROLES = ["Software Engineer", "Python Full-Stack Developer", "AI Builder"];

// Grouped exactly as on the resume — Programming & Frameworks / Cloud &
// Databases / AI Technologies — instead of one flat undifferentiated list
const SKILL_GROUPS = [
  {
    label: "Programming & Frameworks",
    color: "blue",
    items: ["Python", "JavaScript", "Django", "FastAPI", "React.js", "Tailwind CSS", "Micro Frontends", "REST APIs"],
  },
  {
    label: "Cloud & Databases",
    color: "teal",
    items: ["AWS", "Azure", "CI/CD", "Microsoft SQL Server", "MySQL", "SQLite"],
  },
  {
    label: "AI Technologies",
    color: "violet",
    items: ["Agno", "Agentic AI", "RAG", "LangChain", "LLMs", "OpenAI API", "Prompt Engineering"],
  },
];

const EXPERIENCE = [
  {
    role: "Software Engineer",
    company: "AceNet Consulting Pvt Ltd",
    dates: "Aug 2025 — Present",
    tag: "CURRENT",
    logoUrl: "/loader.png",
    bullets: [
      "Developed backend services and REST APIs using Python (FastAPI) to support internal tools and client-facing features, handling business logic and data validation.",
      "Built reusable React.js components for the E2O (Thejo) client project, improving UI/UX modularity and consistency across the application.",
      "Resolved critical client-raised production tickets on the BG application, working directly with the client team to troubleshoot and close issues quickly.",
      "Implemented complex Microsoft SQL Server schema changes to support new business requirements without disrupting production.",
    ],
    tags: ["FastAPI", "React.js", "SQL Server", "Python"],
  },
  {
    role: "Full Stack Developer Intern",
    company: "AceNet Consulting Pvt Ltd",
    dates: "May 2025 — Aug 2025",
    tag: "3 MONTHS",
    logoUrl: "/loader.png",
    bullets: [
      "Architected internal Proofs of Concept (TME, CMMS, AI applications) for business workflow optimization, taking each from design through working demo.",
      "Conducted API testing using Swagger and Postman across multiple services, and optimized SQL queries to improve backend performance.",
    ],
    tags: ["Python", "FastAPI", "SQL", "SQLite"],
  },
];

// Key Projects (Office) — matches resume section 1:1
// Key Projects (Office)
const WORK_PROJECTS = [
  {
    title: "Micro Frontend Host Architecture",
    description: "Host application integrating multiple decoupled micro frontends into a single shell, improving load speed and long-term codebase scalability across teams.",
    tags: ["React.js", "Architecture"],
  },
  {
    title: "Trade Matching Engine (TME)",
    description: "High-concurrency FastAPI backend paired with a React.js UI, matching multi-party financial trades — automatically calculating settlement amounts and flagging mismatches in real time.",
    tags: ["FastAPI", "React.js", "SQL"],
  },
  {
    title: "CMMS Management System",
    description: "Full UI proof of concept for a computerized maintenance management system, covering preventive-maintenance workflows with role-based access control for managers and technicians.",
    tags: ["React.js", "FastAPI", "SQL"],
  },
  {
    title: "AI VKYC & AI Timesheet Suite",
    description: "Video KYC verification system built on AWS Rekognition, paired with an AI-driven timesheet processor using AWS Textract and Amazon Bedrock to extract and validate attendance records automatically.",
    tags: ["OpenAI API", "LLM", "Python"],
  },
  {
    title: "CMMS Agentic AI Telemetry Engine",
    description: "Autonomous Agentic AI assistant that queries internal APIs to synthesize real-time industrial machine telemetry and maintenance backlogs into actionable summaries.",
    tags: ["LangChain", "RAG", "LLM", "FastAPI"],
  },
];

// Personal Projects
const PERSONAL_PROJECTS = [
  {
    id: "ai-screener",
    title: "AI Voice Interview Screener",
    description:
      "An autonomous voice agent that conducts real screening interviews — listens, reasons about answer quality, decides whether to follow up, and speaks back in real time using speech-to-text and LLM-driven evaluation.",
    tags: ["React.js", "FastAPI", "OpenAI API", "LLM", "RAG"],
    demoUrl: "https://speech-interview-frontend.vercel.app/",
    codeUrl: "#",
    featured: true,
    category: "ai",
  },
  {
    id: "ai-travel",
    title: "AI Travel Agentic Assistant",
    description: "Conversational agentic AI platform using LangChain and LLM reasoning to plan customized, multi-day trip itineraries based on a user's budget, preferences, and destination constraints.",
    tags: ["Python", "LangChain", "OpenAI API", "LLM"],
    codeUrl: "https://github.com/Nikhil-Dewara/AI_Travel-AgenticAI",
    demoUrl: "#",
    category: "ai",
  },
  {
    id: "melody",
    title: "Melody E-Commerce Platform",
    description: "Full-stack e-commerce platform for music and merchandise — complete cart, checkout, and order-flow implementation backed by a relational database schema.",
    tags: ["Django", "SQL", "SQLite", "React.js"],
    codeUrl: "https://github.com/Nikhil-Dewara/Melody/tree/main/melodyproject",
    demoUrl: "#",
    category: "fullstack",
  },
  {
    id: "pizza-app",
    title: "Pizza Ordering Platform",
    description: "Full-stack food ordering application with a Django backend integrated end to end with HTML/CSS, JavaScript, and a SQL database for order and inventory management.",
    tags: ["Django", "Python", "SQL", "SQLite"],
    codeUrl: "https://github.com/Nikhil-Dewara/PizzaProject/tree/main/PizzaProject",
    demoUrl: "https://pizza-ordering-platform-6gd3.onrender.com/",
    category: "fullstack",
  },
];

const EDUCATION = {
  degree: "B.Tech in Computer Science and Engineering",
  school: "Government Engineering College, Ajmer",
  dates: "Aug 2019 — Aug 2023",
  score: "CGPA: 7.5",
};

const ACHIEVEMENTS = ["Quarterly Performance Award — AceNet Consulting Pvt Ltd."];
const LANGUAGES = ["English (Native/Bilingual)", "Hindi (Native/Bilingual)"];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? "reveal--visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

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

  useEffect(() => {
    const interval = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  const duration = 1500; // 3 seconds

  const startTime = Date.now();

  const timer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const percentage = Math.min((elapsed / duration) * 100, 100);

    setProgress(percentage);

    if (percentage >= 100) {
      clearInterval(timer);
      setTimeout(() => setLoading(false), 200);
    }
  }, 50);

  return () => clearInterval(timer);
}, []);

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
      colors: ["#3a5cff", "#7c3aed", "#00c2a8", "#ff9f0a"],
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
      <ThreeBackground />
      <CustomCursor />
      <DynamicIsland activeSection={activeSection} />
      <GlassDock />

      {loading && (
        <div className="loader-screen">
          <div className="loader-card glass-card">
            <div className="apple-logo-badge">
              <img src="/NikhilLogo.png" alt="Nikhil Logo" />
            </div>
            <h2 className="loader-title">
              Ni<span className="accent">k</span>hil Dewara
            </h2>
            <p className="loader-sub">$ initializing_portfolio --env=production</p>
            <div className="loader-bar-bg">
              <div className="loader-bar-fill" style={{ width: `${progress}%` }} />
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
                Software Engineer with 1+ year of experience building backend services in
                <strong> Python (FastAPI, Django)</strong> and full-stack web apps in <strong>React.js</strong>,
                across FinTech and maintenance-management domains — REST APIs, micro frontends, JWT auth,
                AWS, and AI-powered applications at <strong>AceNet Consulting</strong>.
              </p>

              <div className="hero-buttons">
                <a
                  className="btn btn-primary"
                  href="/Nikhil_Dewara_Resume_.pdf"
                  target="_blank"
                  rel="noreferrer"
                  download="Nikhil_Dewara_Resume_.pdf"
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

              <div className="hero-stats-row">
                <div className="stat-widget">
                  <span className="stat-num">FastAPI & Django</span>
                  <span className="stat-label">High-Performance APIs</span>
                </div>
                <div className="stat-widget">
                  <span className="stat-num">React.js & AWS</span>
                  <span className="stat-label">Full Stack Systems</span>
                </div>
                <div className="stat-widget">
                  <span className="stat-num">LangChain & Agno</span>
                  <span className="stat-label">Agentic AI Pipelines</span>
                </div>
              </div>
            </div>

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

        {/* ABOUT & SKILLS SECTION — rendered as real code-editor panes */}
        <Reveal>
          <section id="about" className="section">
            <div className="section-header">
              <span className="badge-pill">Overview & Core Stack</span>
              <h2 className="section-title">About & Skills</h2>
            </div>

            <div className="about-grid">
              <TiltCard className="about-main-card code-window">
                <div className="code-tabbar">
                  <div className="code-tab">
                    <span className="code-tab-dot"></span> profile.md
                  </div>
                </div>
                <div className="code-body">
                  <div className="code-line">
                    <span className="code-linenum">1</span>
                    <span className="code-content code-comment">// whoami</span>
                  </div>
                  <div className="code-line">
                    <span className="code-linenum">2</span>
                    <span className="code-content code-prose">
                      Software Engineer with <strong>1+ year of experience</strong> building backend services
                      in <strong>Python (FastAPI, Django)</strong> and full-stack web applications with
                      <strong> React.js</strong>, across FinTech and maintenance-management domains.
                      Experienced with REST APIs, micro frontends, JWT-based authentication, AI-powered
                      applications, and AWS.
                    </span>
                  </div>
                  <div className="code-line">
                    <span className="code-linenum">3</span>
                    <span className="code-content code-comment">// shipped</span>
                  </div>
                  <div className="code-line">
                    <span className="code-linenum">4</span>
                    <span className="code-content code-prose">
                      Delivered client-facing projects including a <strong>trade matching engine</strong>,
                      a <strong>CMMS platform</strong>, and multiple <strong>AI/Agentic AI</strong> proofs of concept
                      at AceNet Consulting.
                    </span>
                  </div>
                </div>
              </TiltCard>

              <TiltCard accent className="strict-skills-card code-window">
                <div className="code-tabbar">
                  <div className="code-tab">
                    <span className="code-tab-dot"></span> skills.json
                  </div>
                </div>
                <div className="code-body">
                  <div className="code-line">
                    <span className="code-linenum">1</span>
                    <span className="code-content">
                      <span className="code-punct">{"{"}</span>
                    </span>
                  </div>
                  {SKILL_GROUPS.map((group, gi) => (
                    <div key={group.label}>
                      <div className="code-line">
                        <span className="code-linenum">{gi * 2 + 2}</span>
                        <span className="code-content">
                          <span className="code-key">{group.label.toLowerCase().replace(/ & | /g, "_")}</span>
                          <span className="code-punct">: [</span>
                        </span>
                      </div>
                      <div className="code-line">
                        <span className="code-linenum"></span>
                        <span className="code-content code-array">
                          {group.items.map((skill) => (
                            <span key={skill} className="code-string">
                              {skill}
                            </span>
                          ))}
                        </span>
                      </div>
                      <div className="code-line">
                        <span className="code-linenum">{gi * 2 + 3}</span>
                        <span className="code-content">
                          <span className="code-punct">],</span>
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="code-line">
                    <span className="code-linenum">{SKILL_GROUPS.length * 2 + 2}</span>
                    <span className="code-content">
                      <span className="code-punct">{"}"}</span>
                    </span>
                  </div>
                </div>
              </TiltCard>
            </div>
          </section>
        </Reveal>

        {/* EXPERIENCE SECTION */}
        <Reveal>
          <section id="experience" className="section">
            <div className="section-header-row">
              <div>
                <span className="badge-pill">Career History</span>
                <h2 className="section-title">Professional Experience</h2>
              </div>
              <div className="scroll-controls">
                <button onClick={() => scrollExperience(-1)} aria-label="Scroll left">
                  <ChevronLeft />
                </button>
                <button onClick={() => scrollExperience(1)} aria-label="Scroll right">
                  <ChevronRight />
                </button>
              </div>
            </div>

            <div className="experience-scroller" ref={scrollerRef}>
              {EXPERIENCE.map((job, i) => (
                <TiltCard key={i} accent className="exp-card">
                  <div className="exp-top">
                    <div className="company-logo-container">
                      <img
                        src={job.logoUrl}
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
                    {p.featured && <span className="featured-badge-tag">Featured Build</span>}
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
                      <a className="btn btn-ghost btn-sm" href={p.codeUrl} target="_blank" rel="noreferrer">
                        <FaGithub size={16} /> Repository
                      </a>
                    ) : (
                      <span className="tag tag--muted">Private Repo</span>
                    )}

                    {p.demoUrl && p.demoUrl !== "#" && (
                      <a className="btn btn-primary btn-sm" href={p.demoUrl} target="_blank" rel="noreferrer">
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="section-subtitle-box">
              <span className="badge-pill">Enterprise Projects</span>
              <h3 className="section-subtitle">AceNet Consulting Deliverables</h3>
            </div>
          </Reveal>

          <div className="standard-project-grid">
            {WORK_PROJECTS.map((p) => (
              <Reveal key={p.title}>
                <TiltCard className="standard-project-card work-project-card">
                  <div className="window-chrome">
                    <div className="company-logo-container" style={{ width: "32px", height: "32px" }}>
                      <img
                        src="/loader.png"
                        alt="AceNet logo"
                        className="company-logo-img"
                        style={{ width: "32px", height: "32px", objectFit: "contain" }}
                      />
                    </div>
                    <span className="tag tag--dark">MFE — Company POC</span>
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

        {/* EDUCATION & ACHIEVEMENTS SECTION */}
        <Reveal>
          <section id="credentials" className="section">
            <div className="section-header">
              <span className="badge-pill">Background</span>
              <h2 className="section-title">Education & Achievements</h2>
            </div>

            <div className="credentials-grid">
              <TiltCard className="credential-card">
                <div className="credential-icon-row">
                  <div className="credential-icon">
                    <GraduationCap />
                  </div>
                  <h4>Education</h4>
                </div>
                <div className="edu-degree">{EDUCATION.degree}</div>
                <div className="edu-school">{EDUCATION.school}</div>
                <div className="edu-meta">
                  {EDUCATION.dates} · {EDUCATION.score}
                </div>
              </TiltCard>

              <TiltCard accent className="credential-card">
                <div className="credential-icon-row">
                  <div className="credential-icon">
                    <Award />
                  </div>
                  <h4>Achievements & Languages</h4>
                </div>
                <ul className="achievement-list">
                  {ACHIEVEMENTS.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                <div className="lang-row">
                  {LANGUAGES.map((l) => (
                    <span className="lang-chip" key={l}>
                      {l}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </div>
          </section>
        </Reveal>

        {/* FOOTER & CONTACT SECTION */}
        <Reveal>
          <footer id="contact" className="footer-section">
            <TiltCard accent className="contact-glass-card">
              <div className="footer-content">
                <span className="badge-pill">Get In Touch</span>
                <h2 className="footer-title">
                  Let's build <span className="accent">something extraordinary</span>
                </h2>
                <p className="footer-sub">
                  Have an open software role, consulting project, or want to discuss Python, FastAPI & LLM Agent
                  systems? My inbox is open.
                </p>

                <div className="contact-grid">
                  <button className="contact-item-btn" onClick={handleCopyEmail}>
                    <div className="contact-icon">
                      <Mail />
                    </div>
                    <div className="contact-details">
                      <span className="contact-label">Email Address</span>
                      <span className="contact-val">nikdewara@gmail.com</span>
                    </div>
                    <span className="copy-badge">{copiedEmail ? "Copied! ✨" : "Copy Email"}</span>
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
                  <p>© {new Date().getFullYear()} Nikhil Dewara. Built with React & Three.js.</p>
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
