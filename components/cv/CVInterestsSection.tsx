import type { CVInterestLink } from "@/lib/content";
import { CV_FONT_SIZES } from "@/lib/cv-config";
import { CVSection } from "./CVSection";
import { renderBulletWithLinks } from "./CVBulletList";

const { sm } = CV_FONT_SIZES;

interface CVInterestsSectionProps {
  interests: string;
  interestLinks?: CVInterestLink[];
}

export function CVInterestsSection({ interests, interestLinks }: CVInterestsSectionProps) {
  return (
    <CVSection label="Interests" heading="Interests" last>
      <p style={{ fontSize: sm, margin: 0, color: "var(--color-ink-muted)" }}>
        {interestLinks && interestLinks.length > 0
          ? renderBulletWithLinks(interests, interestLinks)
          : interests}
      </p>
    </CVSection>
  );
}
