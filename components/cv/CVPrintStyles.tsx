/**
 * CVPrintStyles — injects the @page and @media print rules needed for correct
 * A4 two-page output.
 *
 * Key invariants (do NOT remove):
 * - `@page { margin: 0 }` removes Chrome's built-in headers/footers.
 * - `.cv-margin-top` / `.cv-margin-bottom` are hidden on screen and become
 *   15 mm tall in print — they live inside the <thead>/<tfoot> of
 *   `.cv-print-table` so they repeat on every printed page.
 * - `.cv-print-table` expands to full width with collapsed borders so the
 *   table participates in normal page-break flow.
 *
 * A `dangerouslySetInnerHTML` style tag is the correct approach here because
 * Next.js App Router has no built-in way to inject scoped `@page` rules —
 * CSS Modules and `styled-jsx` do not support `@page`.
 */
export function CVPrintStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page { size: A4; margin: 0; }
            header, footer, .skip-link, .cv-print-btn, [data-command-palette] {
              display: none !important;
            }
            #main-content { padding: 0 !important; margin: 0 !important; }
            body {
              background: #fff !important;
              color: #000 !important;
              font-size: 10px !important;
              line-height: 1.35 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .cv-wrapper {
              padding: 0 14mm !important;
              max-width: 100% !important;
              margin: 0 !important;
            }
            .cv-margin-top, .cv-margin-bottom {
              display: block;
            }
            .cv-margin-top { height: 15mm; }
            .cv-margin-bottom { height: 15mm; }
            .cv-print-table {
              width: 100%;
              border-collapse: collapse;
            }
            .cv-print-table thead td,
            .cv-print-table tfoot td {
              padding: 0; margin: 0; border: none;
            }
            .cv-print-table thead td { height: 15mm; }
            .cv-print-table tfoot td { height: 15mm; }
            .cv-entry { break-inside: avoid; }
            .cv-body a {
              color: #1a56db !important;
              text-decoration: underline !important;
            }
            .cv-section-heading { color: #C84B31 !important; }
          }
        `,
      }}
    />
  );
}
