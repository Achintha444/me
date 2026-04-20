/**
 * Loading skeleton — shown while a page segment is loading.
 * Applied skill: nextjs — loading.tsx file convention with Suspense.
 */
export default function LoadingPage() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading page"
      style={{ paddingBlock: "var(--space-20)" }}
    >
      <div className="container-content">
        {/* Skeleton blocks to maintain layout stability */}
        <div
          style={{
            width: "80px",
            height: "12px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--color-ink-faint)",
            marginBottom: "var(--space-3)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            width: "320px",
            maxWidth: "100%",
            height: "48px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-ink-faint)",
            marginBottom: "var(--space-4)",
            animation: "pulse 1.5s ease-in-out infinite 100ms",
          }}
        />
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            height: "16px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--color-ink-faint)",
            marginBottom: "var(--space-2)",
            animation: "pulse 1.5s ease-in-out infinite 200ms",
          }}
        />
        <div
          style={{
            width: "80%",
            maxWidth: "448px",
            height: "16px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--color-ink-faint)",
            animation: "pulse 1.5s ease-in-out infinite 300ms",
          }}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
