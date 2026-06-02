import { CertificateModal } from "@/components/sections/CertificateModal";
import { SocialIcons } from "@/components/sections/SocialIcons";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

const skills = [
  { name: "Python", icon: "https://cdn.simpleicons.org/python" },
  { name: "SQL", icon: "/sql_logo.png" },
  { name: "HTML", icon: "https://cdn.simpleicons.org/html5" },
  { name: "CSS", icon: "/css_logo.png" },
  { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript" },
  { name: "React.js", icon: "https://cdn.simpleicons.org/react" },
  { name: "GitHub", icon: "https://cdn.simpleicons.org/github" },
  { name: "Linux", icon: "https://cdn.simpleicons.org/linux" },
  { name: "Proxmox", icon: "https://cdn.simpleicons.org/proxmox" },
  { name: "Cloudflare Tunnel", icon: "https://cdn.simpleicons.org/cloudflare" },
  { name: "WordPress", icon: "https://cdn.simpleicons.org/wordpress" },
  { name: "Figma", icon: "https://cdn.simpleicons.org/figma" },
  { name: "Canva", icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/canva.svg" },
];

const certifications = [
  {
    title: "CCNA: Switching, Routing, and Wireless Essentials",
    issuer: "Cisco Networking Academy | May 2025",
  },
  {
    title: "CCNA: Enterprise Networking, Security, and Automation",
    issuer: "Cisco Networking Academy | September 2025",
    pdf: "/certificates/ccna-enterprise-networking-security-automation.pdf",
  },
  {
    title: "AWS Academy Graduate - Cloud Foundations",
    issuer: "Amazon Web Services Training and Certification | November 2025",
    pdf: "/certificates/aws-academy-cloud-foundations.pdf",
  },
  {
    title: "AWS Cloud Quest: Cloud Practitioner",
    issuer: "Amazon Web Services Training and Certification | November 2025",
    pdf: "/certificates/aws-cloud-quest-cloud-practitioner.pdf",
  },
];

export default function HomePage() {
  return (
    <>
      <article className="first-entry home-info">
        <div className="profile">
          <div className="profile_inner">
            <img draggable="false" src="/miguel.jpg" alt="profile image" title="" height="200" width="200" />
            <h1>{profile.name}</h1>
            <span>
              {"\uD83D\uDCCD"} Mandaluyong City, Philippines | Bachelor of Science in Information Technology
              <br />@ De La Salle University - Manila
            </span>
            <SocialIcons />
            <div className="buttons">
              <a className="button" href="#about" rel="noopener" title="View Profile">
                <span className="button-inner">View Profile</span>
              </a>
              <a className="button" href="/Miguel-Joaquin-Sanson-Resume.docx" rel="noopener" title="Download Resume">
                <span className="button-inner">Download Resume</span>
              </a>
            </div>
          </div>
        </div>
      </article>

      <div className="post-content">
        <section id="about" style={{ paddingTop: 10, marginBottom: 20 }}>
          <h2 style={{ fontSize: "2rem", marginBottom: 20 }}>About Me</h2>
          <div className="about-container">
            <p className="about-lede">
              I am a BS Information Technology student at De La Salle University with hands-on experience in web development, Linux-based hosting, database-backed applications, and practical hardware repair. I build projects from concept to production with a focus on reliable deployment, responsive UI, and maintainable systems.
            </p>

            <h3>What I work with</h3>
            <div className="skills-wrapper">
              {skills.map((skill) => (
                <span className="skill-tag" key={skill.name}>
                  <img src={skill.icon} className="skill-icon" alt={skill.name} />
                  {skill.name}
                </span>
              ))}
            </div>

            <div className="education-container">
              <div className="education-grid">
                <div className="edu-column">
                  <h3>Education</h3>
                  <div className="edu-item">
                    <span className="edu-school">De La Salle University</span>
                    <span className="edu-meta">BS Information Technology | June 2021 - Present | Manila, Philippines</span>
                    <p className="edu-desc">Relevant coursework: Data Structures and Algorithms, Web Development, Programming, and Database Systems.</p>
                  </div>
                  <div className="edu-item">
                    <span className="edu-school">University of St. La Salle</span>
                    <span className="edu-meta">High School Diploma, with High Honors | June 2013 - March 2020 | Bacolod, Philippines</span>
                  </div>
                </div>

                <div className="edu-column">
                  <h3>Leadership</h3>
                  <div className="edu-item">
                    <span className="edu-school">25th Benilde Model United Nations</span>
                    <span className="edu-meta">Delegate, Canada | January 2024 - February 2024 | Manila, Philippines</span>
                    <p className="edu-desc">Represented Canada in the General Assembly, led working groups and informal caucuses, negotiated with multiple delegations, and helped push a resolution to adoption.</p>
                  </div>
                </div>
              </div>

              <div className="btn-download-wrapper">
                <a href="/Miguel-Joaquin-Sanson-Resume.docx" className="btn-download" download>
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </section>

        <hr style={{ border: 0, borderTop: "1px solid var(--tertiary)", margin: "0 0 20px 0" }} />

        <section id="experience" style={{ paddingTop: 10, marginBottom: 20 }}>
          <h2 style={{ fontSize: "2rem", marginBottom: 20 }}>Relevant Experience</h2>
          <div className="timeline">
            <div className="timeline-item">
              <span className="timeline-company">P&amp;G Next Leadership Camp</span>
              <h3 className="timeline-title">SRE Operations Manager Role</h3>
              <span className="timeline-date">March 2026 - April 2026 | Manila, Philippines</span>
              <p>
                Designed the operations and reliability portion of Consumer IQ, a P&amp;G Next MVP web app, by defining monitoring, self-healing, and incident-response workflows for data, AI, API, and dashboard reliability. Built the service-level framework and coordinated issue ownership across Data Engineering and AI Engineering to support trustworthy business insights and faster recovery from failures.
              </p>
            </div>
            <div className="timeline-item">
              <span className="timeline-company">Favor Tech Team</span>
              <h3 className="timeline-title">Volunteer</h3>
              <span className="timeline-date">December 2023 - November 2024 | Manila, Philippines</span>
              <p>
                Assisted in regular website maintenance and updates, ensuring up-to-date content and seamless performance using WordPress, JavaScript, and SQL. Created and tested technical demonstrations for publication.
              </p>
            </div>
          </div>
        </section>

        <hr style={{ border: 0, borderTop: "1px solid var(--tertiary)", margin: "0 0 20px 0" }} />

        <section id="projects" style={{ paddingTop: 10, marginBottom: 20 }}>
          <h2 style={{ fontSize: "2rem", marginBottom: 20 }}>My Projects</h2>
          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.slug}>
                {project.image ? <img src={project.image} alt={`${project.title} preview`} /> : null}
                <div className="project-card-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {project.liveUrl ? (
                    <a className="project-view-button" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      {project.liveLabel ?? "View Page"}
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <hr style={{ border: 0, borderTop: "1px solid var(--tertiary)", margin: "0 0 20px 0" }} />

        <section id="certifications" style={{ paddingTop: 10, marginBottom: 20 }}>
          <h2 style={{ fontSize: "2rem", marginBottom: 20 }}>Certifications</h2>
          <div className="cert-grid">
            {certifications.map((certification) => (
              <article className="cert-card" key={certification.title}>
                <h3>{certification.title}</h3>
                <p>{certification.issuer}</p>
                {certification.pdf ? (
                  <button className="cert-view-button" type="button" data-pdf={certification.pdf} data-title={certification.title}>
                    View Certificate
                  </button>
                ) : (
                  <button className="cert-view-button cert-view-button-disabled" type="button" disabled>
                    View Certificate
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>

      <CertificateModal />
    </>
  );
}
