import type { CVVolunteering } from "@/lib/content";
import { CV_FONT_SIZES } from "@/lib/cv-config";
import { CVSection } from "./CVSection";
import { CVBulletList } from "./CVBulletList";

const { sm } = CV_FONT_SIZES;

/** Props for CVVolunteeringSection. */
interface CVVolunteeringSectionProps {
  /** Array of volunteering entries from CV data. */
  volunteering: CVVolunteering[];
}

/**
 * CVVolunteeringSection — renders the "Volunteering Experiences" section.
 *
 * Each entry shows the organization name (optionally hyperlinked) in bold,
 * followed by a bullet list of activities.
 */
export function CVVolunteeringSection({
  volunteering,
}: CVVolunteeringSectionProps) {
  return (
    <CVSection label="Volunteering Experiences" heading="Volunteering Experiences">
      {volunteering.map((vol, i) => (
        <div key={i} className="cv-entry">
          <strong style={{ fontSize: sm, fontWeight: 700 }}>
            {vol.link ? (
              <a
                href={vol.link.url}
                target={
                  vol.link.url.startsWith("http") ? "_blank" : undefined
                }
                rel={
                  vol.link.url.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                {vol.organization}
              </a>
            ) : (
              vol.organization
            )}
          </strong>
          <CVBulletList bullets={vol.bullets} bulletLinks={vol.bulletLinks} />
        </div>
      ))}
    </CVSection>
  );
}
