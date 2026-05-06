import { CV_FONT_SIZES } from "@/lib/cv-config";
import { CVSection } from "./CVSection";

const { sm } = CV_FONT_SIZES;

/** Props for CVInterestsSection. */
interface CVInterestsSectionProps {
  /** Free-text interests string from CV data. */
  interests: string;
}

/**
 * CVInterestsSection — renders the "Interests" section.
 *
 * This is the last section on the CV, so no bottom margin is applied
 * (`last` prop passed to CVSection).
 */
export function CVInterestsSection({ interests }: CVInterestsSectionProps) {
  return (
    <CVSection label="Interests" heading="Interests" last>
      <p style={{ fontSize: sm, margin: 0, color: "var(--color-ink-muted)" }}>
        {interests}
      </p>
    </CVSection>
  );
}
