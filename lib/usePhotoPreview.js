"use client";

import { useEffect, useState } from "react";
import { PHOTO_EXTENSIONS } from "./photo.js";

// Shows the photo chosen in a file input before anything is uploaded. The
// preview is a temporary address into the browser's memory: nothing is sent, and
// it is released when the choice changes or the form goes away. A file that is
// empty or not an accepted type has no preview (the form refuses it on save).
export function usePhotoPreview() {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleChange(event) {
    const file = event.target.files?.[0];
    const showable = file && file.size > 0 && Object.hasOwn(PHOTO_EXTENSIONS, file.type);
    setPreview(showable ? URL.createObjectURL(file) : null);
  }

  return { preview, handleChange };
}
