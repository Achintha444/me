"use client";

export function PrintButton() {
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = " ";
    window.print();
    document.title = originalTitle;
  };

  return (
    <button
      className="cv-print-btn btn-outline"
      onClick={handlePrint}
      aria-label="Print or save this CV as a PDF"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        letterSpacing: "0.06em",
        padding: "0.4em 1.1em",
        border: "1px solid var(--color-accent)",
        borderRadius: "var(--radius-sm)",
        background: "transparent",
        color: "var(--color-accent)",
        cursor: "pointer",
      }}
    >
      Print / Save as PDF
    </button>
  );
}
