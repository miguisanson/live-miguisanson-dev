import Link from "next/link";
import { aiResearchModuleList, aiResearchWorkflow } from "@/data/aiResearch";

export function AIResearchLanding() {
  return (
    <article className="ai-wide-shell ai-research-landing">
      <section className="ai-research-hero" aria-labelledby="ai-research-title">
        <div className="ai-hero-copy">
          <div className="ai-eyebrow">Seven Seven implementation study</div>
          <h1 id="ai-research-title">AI Research</h1>
          <p>
            Mock-first support tools for QA, recruitment, and HR workflows. Each module generates structured draft
            output, keeps real data out of the demo, and routes decisions through a human review gate.
          </p>
          <div className="ai-hero-actions">
            <Link className="ai-primary-link" href="/ai-research/qa-assistant">
              Open QA module
            </Link>
            <a className="ai-secondary-link" href="#ai-modules">
              View modules
            </a>
          </div>
        </div>

        <div className="ai-control-surface" aria-label="AI research operating model">
          <div className="ai-console-header">
            <span>Mock mode</span>
            <strong>Human review required</strong>
          </div>
          <div className="ai-console-grid">
            {aiResearchModuleList.map((module) => (
              <div className={`ai-console-tile ${module.accentClass}`} key={module.id}>
                <span>{module.moduleType}</span>
                <strong>{module.title.replace("AI ", "")}</strong>
                <small>{module.metrics[2]}</small>
              </div>
            ))}
          </div>
          <div className="ai-console-footer">
            <span>API key</span>
            <strong>Not required</strong>
          </div>
        </div>
      </section>

      <section className="ai-workflow-panel" aria-labelledby="ai-workflow-title">
        <div className="ai-panel-heading">
          <span className="ai-eyebrow">Workflow</span>
          <h2 id="ai-workflow-title">Drafts move through a review queue before anything is approved.</h2>
        </div>
        <div className="ai-workflow-rail">
          {aiResearchWorkflow.map((step, index) => (
            <article className="ai-workflow-node" key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-module-board" id="ai-modules" aria-labelledby="ai-modules-title">
        <div className="ai-panel-heading">
          <span className="ai-eyebrow">Modules</span>
          <h2 id="ai-modules-title">Three focused research modules</h2>
        </div>
        <div className="ai-module-card-grid">
          {aiResearchModuleList.map((module) => (
            <article className={`ai-module-card ${module.accentClass}`} key={module.id}>
              <div className="ai-module-card-top">
                <span>{module.moduleType}</span>
                <strong>Draft</strong>
              </div>
              <h3>{module.title}</h3>
              <p>{module.summary}</p>
              <div className="ai-metric-row" aria-label={`${module.title} metrics`}>
                {module.metrics.map((metric) => (
                  <span key={metric}>{metric}</span>
                ))}
              </div>
              <ul>
                {module.outputPreview.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link className="ai-card-link" href={module.route}>
                Open module
              </Link>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}
