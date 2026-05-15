"use client";

import { useEffect, useRef, useState } from "react";

type CertificateState = {
  title: string;
  url: string;
};

export function CertificateModal() {
  const [certificate, setCertificate] = useState<CertificateState | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const button = target?.closest<HTMLElement>("[data-pdf]");
      if (!button) {
        return;
      }

      lastFocused.current = button;
      setCertificate({
        title: button.dataset.title || "Certificate",
        url: button.dataset.pdf || "",
      });
      document.body.classList.add("pdf-modal-open-body");
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    if (certificate) {
      document.addEventListener("keydown", onKeyDown);
    }

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [certificate]);

  function closeModal() {
    setCertificate(null);
    document.body.classList.remove("pdf-modal-open-body");
    lastFocused.current?.focus();
  }

  function openPdf() {
    if (certificate?.url) {
      window.open(certificate.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="pdf-modal" id="certificate-modal" aria-hidden={certificate ? "false" : "true"}>
      <div className="pdf-modal-backdrop" onClick={closeModal} />
      <section className="pdf-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="certificate-modal-title">
        <header className="pdf-modal-header">
          <h3 id="certificate-modal-title">{certificate?.title ?? "Certificate"}</h3>
          <div className="pdf-modal-actions">
            <button className="pdf-modal-open" id="certificate-modal-open" type="button" onClick={openPdf}>
              Open PDF
            </button>
            <button className="pdf-modal-close" type="button" aria-label="Close certificate preview" onClick={closeModal}>
              &times;
            </button>
          </div>
        </header>
        {certificate?.url ? <iframe src={certificate.url} title="Certificate preview" /> : null}
      </section>
    </div>
  );
}
