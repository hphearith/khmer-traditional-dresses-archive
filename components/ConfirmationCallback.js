"use client";

import Link from "next/link";
import { TEXT } from "../lib/uiText.js";
import { useConfirmationCallback } from "../lib/useConfirmationCallback.js";
import Bilingual from "./Bilingual.js";
import ConfirmationNotice from "./ConfirmationNotice.js";
import Shop from "./Shop.js";

export default function ConfirmationCallback() {
  const { message, canResend } = useConfirmationCallback();

  return (
    <Shop>
      <main className="container sheet-page">
        <section className="sheet" aria-labelledby="confirmation-title">
          <h1 id="confirmation-title" className="sheet-title"><Bilingual text={TEXT.auth.emailConfirmation} /></h1>
          <p role="status" className="form-status"><Bilingual text={message} /></p>
          {canResend && <ConfirmationNotice />}
          <p className="sheet-foot"><Link href="/login"><Bilingual text={TEXT.callback.goToLogin} inline /></Link></p>
        </section>
      </main>
    </Shop>
  );
}
