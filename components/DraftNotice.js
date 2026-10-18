const MESSAGES = {
  saved: "Draft saved on this device.",
  restored: "Draft restored from this device. The photo and the consent box are not kept in a draft: choose them again.",
};

// Always on the page, so a screen reader announces the text when it appears.
// Empty when there is no draft, and when the browser blocks storage.
export default function DraftNotice({ status }) {
  return (
    <p role="status" style={{ fontSize: 14, color: "var(--muted)", minHeight: "1.5em" }}>
      {MESSAGES[status]}
    </p>
  );
}
