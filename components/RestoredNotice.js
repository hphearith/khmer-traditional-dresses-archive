// Shown next to the photo and the consent box when a Local draft was restored,
// because those two are never kept in it and the Contributor must give them again.
// Red like the form's other messages, so it is seen. Always on the page, so a
// screen reader announces the text when it appears.
export default function RestoredNotice({ restored }) {
  return (
    <p role="status" style={{ color: "red", fontWeight: 700 }}>
      {restored && "Your draft was restored, but the photo and the consent box are not saved in a draft. Choose the photo again and tick the box."}
    </p>
  );
}
