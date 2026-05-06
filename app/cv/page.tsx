import type { Metadata } from "next";
import { getCVData } from "@/lib/content";
import { CV_FONT_SIZES } from "@/lib/cv-config";
import { PrintButton } from "./PrintButton";
import { CVPrintStyles } from "@/components/cv/CVPrintStyles";
import { CVHeader } from "@/components/cv/CVHeader";
import { CVSection } from "@/components/cv/CVSection";
import { CVEmploymentSection } from "@/components/cv/CVEmploymentSection";
import { CVProjectsSection } from "@/components/cv/CVProjectsSection";
import { CVLeadershipSection } from "@/components/cv/CVLeadershipSection";
import { CVVolunteeringSection } from "@/components/cv/CVVolunteeringSection";
import { CVEducationSection } from "@/components/cv/CVEducationSection";
import { CVInterestsSection } from "@/components/cv/CVInterestsSection";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Curriculum vitae of Achintha Isuru — Front-end Developer and UI/UX Designer with 4+ years of experience building responsive web and mobile applications.",
};

/**
 * CVPage — server component. Reads all CV data from `content/cv.json` and
 * composes the section components into a print-optimised two-page A4 resume
 * that also looks polished on screen.
 *
 * Applied skills:
 * - nextjs-app-router-patterns: pure Server Component, no "use client"
 * - vercel-react-best-practices: composition over monolith, typed data
 *
 * Print structure invariants (do NOT alter):
 * - `.cv-print-table` wraps the body in a <table> so <thead>/<tfoot> repeat
 *   the 15 mm margin spacers on every printed page.
 * - `CVPrintStyles` injects `@page { margin: 0 }` to suppress browser chrome.
 * - `.cv-margin-top` / `.cv-margin-bottom` are `display:none` on screen and
 *   `display:block; height:15mm` in print — defined in CVPrintStyles.
 */
export default function CVPage() {
  const cv = getCVData();
  const { body } = CV_FONT_SIZES;

  return (
    <>
      <CVPrintStyles />

      <div
        className="cv-wrapper"
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "var(--space-4) var(--space-4) var(--space-8)",
          fontFamily: "var(--font-body)",
          fontSize: body,
          color: "var(--color-ink)",
          lineHeight: 1.45,
        }}
      >
        {/* ── Print / Save button — hidden in print via .cv-print-btn ───── */}
        <div
          className="cv-print-btn"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "var(--space-2)",
          }}
        >
          <PrintButton />
        </div>

        {/* ── CV body — wrapped in table for per-page print margins ──────
            The <thead> and <tfoot> contain the margin spacers that repeat on
            each printed page. The <tbody> holds all visible content.
            This structure was hard-won — do not simplify it away.          */}
        <table
          className="cv-print-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <td>
                <div className="cv-margin-top" style={{ display: "none" }} />
              </td>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <td>
                <div className="cv-margin-bottom" style={{ display: "none" }} />
              </td>
            </tr>
          </tfoot>
          <tbody>
            <tr>
              <td style={{ padding: 0, border: "none" }}>
                <div className="cv-body">

                  <CVHeader cv={cv} />

                  {/* Personal Summary — no dedicated section component needed,
                      uses CVSection directly since it has no custom entry rows */}
                  <CVSection label="Personal Summary" heading="Personal Summary">
                    <p
                      style={{
                        fontSize: CV_FONT_SIZES.sm,
                        lineHeight: 1.45,
                        margin: 0,
                      }}
                    >
                      {cv.summary}
                    </p>
                  </CVSection>

                  <CVEmploymentSection employment={cv.employment} />
                  <CVProjectsSection projects={cv.projects} />
                  <CVLeadershipSection leadership={cv.leadership} />
                  <CVVolunteeringSection volunteering={cv.volunteering} />
                  <CVEducationSection education={cv.education} />
                  <CVInterestsSection interests={cv.interests} />

                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
