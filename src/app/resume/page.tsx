import Image from "next/image";
import { LocationIcon } from "@/components/layout/NavIcons";
import { CertificateModal } from "@/components/sections/CertificateModal";
import { SocialIcons } from "@/components/sections/SocialIcons";
import {
  certifications,
  education,
  experience,
  profile,
  skillGroups,
  technicalExperience,
} from "@/data/profile";
import { projects } from "@/data/projects";

export const metadata = {
  title: "Resume",
};

/** Icon sources for the skills that have a recognisable logo. */
const skillIcons: Record<string, string> = {
  Swift: "https://cdn.simpleicons.org/swift",
  Python: "https://cdn.simpleicons.org/python",
  SQL: "/sql_logo.webp",
  TypeScript: "https://cdn.simpleicons.org/typescript",
  JavaScript: "https://cdn.simpleicons.org/javascript",
  HTML: "https://cdn.simpleicons.org/html5",
  CSS: "/css_logo.webp",
  "React.js": "https://cdn.simpleicons.org/react",
  "Node.js": "https://cdn.simpleicons.org/nodedotjs",
  Express: "https://cdn.simpleicons.org/express",
  UIKit: "https://cdn.simpleicons.org/apple",
  SwiftUI: "https://cdn.simpleicons.org/swift",
  Xcode: "https://cdn.simpleicons.org/xcode",
  MySQL: "https://cdn.simpleicons.org/mysql",
  GitHub: "https://cdn.simpleicons.org/github",
  Proxmox: "https://cdn.simpleicons.org/proxmox",
  "Ubuntu Server": "https://cdn.simpleicons.org/ubuntu",
  Figma: "https://cdn.simpleicons.org/figma",
  Canva: "https://cdn.simpleicons.org/canva",
  Linux: "https://cdn.simpleicons.org/linux",
  "Cloudflare Tunnel": "https://cdn.simpleicons.org/cloudflare",
};

export default function ResumePage() {
  return (
    <>
      <article className="first-entry home-info">
        <div className="profile">
          <div className="profile_inner">
            <Image src="/miguel.jpg" alt={profile.name} width={200} height={200} priority draggable={false} />
            <h1>{profile.name}</h1>
            <span className="profile-meta">
              <span className="profile-meta-line">
                <LocationIcon size={15} />
                {profile.location}
              </span>
              <span className="profile-meta-line">{profile.educationLine}</span>
            </span>
            <SocialIcons />
            <div className="buttons">
              <a className="button" href="#about" rel="noopener" title="View Profile">
                <span className="button-inner">View Profile</span>
              </a>
              <a className="button" href={profile.resumeUrl} rel="noopener" title="Download Resume">
                <span className="button-inner">Download Resume</span>
              </a>
            </div>
          </div>
        </div>
      </article>

      <div className="post-content">
        <section id="about" className="resume-section">
          <h2 className="resume-section-title">About Me</h2>
          <div className="about-container">
            <p className="about-lede">
              I am a BS Information Technology student at De La Salle University. My work spans native
              iOS development in Swift and UIKit, full-stack web platforms, and self-hosted Linux
              infrastructure &mdash; most recently a 504-hour internship at Seven Seven Global Services,
              where I shipped a native iOS booking app and authored two technical training manuals. I
              build projects end to end, from architecture through production deployment.
            </p>

            <h3>What I work with</h3>
            <div className="skill-groups">
              {skillGroups.map((group) => (
                <div className="skill-group" key={group.label}>
                  <span className="skill-group-label">{group.label}</span>
                  <div className="skills-wrapper">
                    {group.items.map((skill) => (
                      <span className="skill-tag" key={skill}>
                        {skillIcons[skill] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={skillIcons[skill]} className="skill-icon" alt="" width={16} height={16} />
                        ) : null}
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="education-container">
              <div className="education-grid">
                <div className="edu-column">
                  <h3>Education</h3>
                  {education.map((entry) => (
                    <div className="edu-item" key={entry.school}>
                      <span className="edu-school">{entry.school}</span>
                      <span className="edu-meta">
                        {entry.detail} | {entry.period} | {entry.location}
                      </span>
                      {entry.notes ? <p className="edu-desc">{entry.notes}</p> : null}
                    </div>
                  ))}
                </div>

                <div className="edu-column">
                  <h3>Leadership</h3>
                  <div className="edu-item">
                    <span className="edu-school">25th Benilde Model United Nations</span>
                    <span className="edu-meta">
                      Delegate, Canada | January 2024 - February 2024 | Manila, Philippines
                    </span>
                    <p className="edu-desc">
                      Represented Canada in the General Assembly, led working groups and informal
                      caucuses, negotiated with multiple delegations, and helped push a resolution to
                      adoption.
                    </p>
                  </div>
                </div>
              </div>

              <div className="btn-download-wrapper">
                <a href={profile.resumeUrl} className="btn-download" download>
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </section>

        <hr className="resume-rule" />

        <section id="experience" className="resume-section">
          <h2 className="resume-section-title">Experience</h2>
          <div className="timeline">
            {experience.map((role) => (
              <div className="timeline-item" key={role.organization}>
                <span className="timeline-company">{role.organization}</span>
                <h3 className="timeline-title">{role.role}</h3>
                <span className="timeline-date">
                  {role.period} | {role.location}
                </span>
                <p>{role.summary}</p>
                {role.highlights ? (
                  <ul className="timeline-highlights">
                    {role.highlights.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <hr className="resume-rule" />

        <section id="projects" className="resume-section">
          <h2 className="resume-section-title">Projects &amp; Technical Experience</h2>
          <div className="timeline">
            {technicalExperience.map((entry) => (
              <div className="timeline-item" key={entry.organization}>
                <span className="timeline-company">{entry.organization}</span>
                <h3 className="timeline-title">{entry.role}</h3>
                <span className="timeline-date">{entry.period}</span>
                <ul className="timeline-highlights">
                  {entry.highlights.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {projects.length > 0 ? (
            <>
              <h3 className="resume-subsection-title">Featured work</h3>
              <div className="project-grid">
                {projects.map((project) => (
                  <article className="project-card" key={project.slug}>
                    {project.image ? (
                      <Image src={project.image} alt={`${project.title} preview`} width={640} height={360} />
                    ) : null}
                    <div className="project-card-body">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      {project.liveUrl ? (
                        <a
                          className="project-view-button"
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.liveLabel ?? "View Page"}
                        </a>
                      ) : project.liveLabel ? (
                        <button className="project-view-button project-view-button-disabled" type="button" disabled>
                          {project.liveLabel}
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </section>

        <hr className="resume-rule" />

        <section id="certifications" className="resume-section">
          <h2 className="resume-section-title">Certifications</h2>
          <div className="cert-grid">
            {certifications.map((certification) => (
              <article className="cert-card" key={certification.title}>
                <h3>{certification.title}</h3>
                <p>
                  {certification.issuer} &middot; {certification.date}
                </p>
                {certification.pdf ? (
                  <button
                    className="cert-view-button"
                    type="button"
                    data-pdf={certification.pdf}
                    data-title={certification.title}
                  >
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
