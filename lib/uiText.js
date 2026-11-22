import km from "../src/locales/km.json" with { type: "json" };
import { getConfirmationResendMessage } from "./authConfirmation.js";
import { isPair, pick } from "./bilingual.js";
import { ENTRY_LIMITS, EARLIEST_YEAR, getDeleteFailureMessage, getEntryMessage, getSaveFailureMessage } from "./entry.js";
import { formatUiNumber, formatYear, khmerDateParts } from "./formatUi.js";
import { LANGUAGE_COOKIE } from "./language.js";
import { MAX_PHOTO_BYTES, PHOTO_CONSENT, getPhotoFailureMessage, getPhotoMessage } from "./photo.js";
import { RETURN_NOTE_LIMIT } from "./returnNote.js";
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, formatUsername, getUsernameMessage } from "./username.js";
import { USERNAME_CHANGE_WAIT_DAYS, formatAllowedAt, getChangeMessage, getConfirmMessage, waitEndsAt } from "./usernameChange.js";

// Interface text is an { en, km } pair (lib/bilingual.js, ADR 0005).
// Fixed texts live in TEXT, grouped by screen. Texts that carry a number or a
// name are small functions below. The messages that already exist in
// lib/entry.js and lib/photo.js keep their English there, untouched: the
// functions here take the English from them and add the Khmer, so the English
// has one source. Numbers stay Western (0-9) in both languages.
const t = (en, km) => ({ en, km });

function fillKhmer(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!Object.hasOwn(values, key)) throw new Error('Missing Khmer message value: ' + key);
    return values[key];
  });
}

export const TEXT = {
  page: {
    backToCommunity: t("Back to the Community", km.entry_page.back_to_community),
    writeTitle: t("Write an entry", km.entry_page.write_title),
    writeIntro: t(
      "Tell the story of one dress you ordered or had made, in Khmer, English or both. Your entry is reviewed before it is published.",
      `${km.entry_page.story_intro} ${km.entry_page.review_before_publish}`,
    ),
    writeIntroReviewer: t(
      "Tell the story of one dress you ordered or had made, in Khmer, English or both.",
      km.entry_page.story_intro,
    ),
    editTitle: t("Edit your entry", km.entry_page.edit_title),
    editIntro: t(
      "Saving sends the entry back for review. You can still find it in My entries. It becomes public again when published.",
      fillKhmer(km.entry_page.edit_intro, { myEntries: km.community.my_entries }),
    ),
    editLoadFailed: t(
      "This entry could not be loaded. Go back to the Community and try again.",
      km.entry_page.edit_load_failed,
    ),
    editNotOwner: t("You can only change entries you wrote.", km.entry_page.edit_not_owner),
  },
  form: {
    title: t("Title", km.entry_form.title),
    story: t("Story", km.entry_form.story),
    storyHint: t(
      "Who it was made for, how it was ordered, what it means to you.",
      km.entry_form.story_hint,
    ),
    creditedAs: t("Credited as", km.entry_form.credited_as),
    creditedAsHint: t(
      "The name shown on this entry. Leave it blank to show your @Username.",
      km.entry_form.credited_as_hint,
    ),
    required: t("required", km.states_and_feedback.required_field),
    optional: t("optional", km.entry_form.optional),
    limitReached: t("Limit reached.", km.entry_form.limit_reached),
    submitForReview: t("Submit for review", km.entry_form.submit_for_review),
    submitting: t("Submitting…", km.entry_form.submitting),
    publishing: t("Publishing…", km.entry_form.publishing),
    localDraft: t("Drafts on this device keep your text and year.", km.entry_form.local_draft),
    saveChanges: t("Save changes", km.actions_and_modals.save_changes),
    saving: t("Saving…", km.states_and_feedback.saving),
    restored: t(
      "Your draft was restored, but the photo and the consent box are not saved in a draft. Choose the photo again and tick the box.",
      km.entry_form.restored,
    ),
    restoredEdit: t(
      "Your draft was restored. To replace the current photo, choose the new photo again and tick the consent box.",
      km.entry_form.restored_edit,
    ),
    signedOut: t(
      "You are no longer logged in. Copy your text somewhere safe, log in again, then try once more.",
      km.entry_form.signed_out,
    ),
  },
  photo: {
    label: t("Photo", km.photo.label),
    replaceLabel: t("Replace the photo", km.photo.replace_label),
    chosenAlt: t("The photo you chose", km.photo.chosen_alt),
    choose: t("Choose photo", km.photo.choose),
    nothingChosen: t("No file chosen", km.photo.nothing_chosen),
    consent: t(
      PHOTO_CONSENT,
      km.photo.consent,
    ),
    consentWithNewPhoto: t("required with a new photo", km.photo.consent_with_new_photo),
  },
  provenance: {
    legend: t("Provenance", km.provenance.legend),
    intro: t(
      "Where the dress came from, if you know. Fill in any or none.",
      km.provenance.intro,
    ),
    occasion: t("Occasion", km.provenance.occasion),
    year: t("Year", km.provenance.year),
    notSure: t("Not sure", km.provenance.not_sure),
    maker: t("Maker or tailor", km.provenance.maker),
    place: t("Place", km.provenance.place),
    placeHint: t("Where it was made.", km.provenance.place_hint),
    materials: t("Materials", km.catalogue.material),
  },
  card: {
    makerShort: t("Maker", km.entry_card.maker_short),
    edit: t("Edit", km.actions_and_modals.edit),
    delete: t("Delete", km.actions_and_modals.delete),
    confirmGroup: t("Confirm deleting", km.entry_card.confirm_group),
    confirmQuestion: t(
      "Delete this entry for good? This cannot be undone.",
      km.entry_card.confirm_question,
    ),
    deleteForGood: t("Delete for good", km.entry_card.delete_for_good),
    deleting: t("Deleting…", km.entry_card.deleting),
    cancel: t("Cancel", km.actions_and_modals.cancel),
    signedOut: t(
      "You are no longer logged in. Log in again, then try once more.",
      km.entry_card.signed_out,
    ),
  },
  auth: {
    signUp: t("Sign up", km.auth_and_account.sign_up),
    logIn: t("Log in", km.auth_and_account.log_in),
    signUpIntro: t("Create your contributor account.", km.auth_and_account.sign_up_intro),
    logInIntro: t("Welcome back to the archive.", km.auth_and_account.log_in_intro),
    verifyAlert: t(
      "Your email may have been confirmed, but this browser could not complete sign-in. Contributor accounts require essential cookies. Try logging in below, or continue browsing as a guest.",
      km.auth_and_account.verification_failed,
    ),
    cookiesHeading: t("Essential cookies", km.auth_and_account.essential_cookies),
    cookiesText: t(
      "We use essential cookies to keep your account secure and signed in. You can continue without them by browsing as a guest.",
      fillKhmer(km.auth_and_account.cookies_help, { sessionHelp: km.cookies.signInBody }),
    ),
    cookiesLink: t("Learn about cookies", km.auth_and_account.cookies_link),
    continueAsGuest: t("Continue as guest", km.auth_and_account.continue_as_guest),
    haveAccount: t("Already have an account?", km.auth_and_account.have_account),
    needAccount: t("Need an account?", km.auth_and_account.need_account),
    email: t("Email", km.auth_and_account.email),
    password: t("Password", km.auth_and_account.password),
    passwordHint: t("Use at least 6 characters.", km.auth_and_account.password_hint),
    pleaseWait: t("Please wait…", km.auth_and_account.please_wait),
    loggingIn: t("Logging in…", km.auth_and_account.logging_in),
    signingUp: t("Signing up…", km.auth_and_account.signing_up),
    signUpFailed: t("Unable to sign up. Please try again.", km.auth_and_account.sign_up_failed),
    invalidLogin: t("Invalid email or password", km.auth_and_account.invalid_login),
    needsConfirmation: t(
      "This address may need confirmation before sign-in. If so, you can request another email.",
      km.auth_and_account.needs_confirmation,
    ),
    emailConfirmation: t("Email confirmation", km.auth_and_account.email_confirmation),
    emailAddress: t("Email address", km.auth_and_account.email_address),
    sending: t("Sending…", km.auth_and_account.sending),
    resend: t("Resend confirmation email", km.auth_and_account.resend),
  },
  callback: {
    checking: t("Checking your confirmation link…", km.callback.checking),
    providerError: t(
      "This confirmation link could not be completed. It may have expired or already been used.",
      km.callback.provider_error,
    ),
    missingCode: t(
      "This confirmation link is missing or invalid. Open a new email link, or try logging in.",
      km.callback.missing_code,
    ),
    missingVerifier: t(
      "Your email may have been confirmed, but this browser could not complete sign-in. Try logging in; if confirmation is still needed, request a new email.",
      km.callback.missing_verifier,
    ),
    exchangeFailed: t(
      "This confirmation link could not be completed. It may have expired or already been used. Try logging in, or request a new email if needed.",
      km.callback.exchange_failed,
    ),
    networkFailed: t(
      "We could not complete this confirmation right now. Try logging in or open the email link again.",
      km.callback.network_failed,
    ),
    goToLogin: t("Go to login", km.auth_and_account.log_in),
  },
  username: {
    label: t("Username", km.username.label),
    chooseTitle: t("Choose a Username", km.username.choose_title),
    chooseIntro: t(
      "Accounts now have a public Username. Choose yours to continue.",
      km.username.choose_intro,
    ),
    logOutInstead: t("Log out instead", km.auth_and_account.log_out),
    save: t("Save Username", km.username.save),
    backToArchive: t("Back to the archive", km.username.back_to_archive),
    changeTitle: t("Change your Username", km.username.change_title),
    changeIntro: t(
      `Entries that show your Username will show the new one. After a change you must wait ${USERNAME_CHANGE_WAIT_DAYS} days before changing it again.`,
      fillKhmer(km.username.change_intro, { days: formatUiNumber(USERNAME_CHANGE_WAIT_DAYS, "km") }),
    ),
    checkFailed: t(
      "We could not check when you last changed your Username. You can still try; we will tell you if it is too soon.",
      km.username.check_failed,
    ),
    change: t("Change Username", km.username.change),
    confirmYes: t("Yes, change it", km.actions_and_modals.confirm_action),
    goBack: t("Go back", km.actions_and_modals.back),
  },
  home: {
    skip: t("Skip to collection", km.home.skip),
    brand: t("Khmer Living Archive", km.home.brand),
    navLabel: t("Main navigation", km.home.nav_label),
    navCollection: t("Collection", km.home.nav_collection),
    navAbout: t("About the archive", km.home.nav_about),
    logOut: t("Log out", km.auth_and_account.log_out),
    browse: t("Browse the collection", km.home.browse),
    heroNote: t(
      "An archive of garments, materials, and the knowledge behind them.",
      km.home.hero_note,
    ),
    aboutHeading: t("Knowledge from a tailor’s practice.", km.home.about_heading),
    footer: t(
      "Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall 2026.",
      km.home.footer,
    ),
    draftSaved: t("Draft saved", km.home.draft_saved),
  },
  // The toggle's group name, read by screen readers. The two choices are not
  // pairs: each language is always named in its own script (LanguageToggle).
  language: {
    label: t("Language", km.auth_and_account.language),
  },
  tabs: {
    label: t("Archive sections", km.tabs.label),
    official: t("Official collection", km.tabs.official),
    community: t("Community", km.tabs.community),
  },
  catalogue: {
    heading: t("Explore the garments", km.catalogue.heading),
    reset: t("Reset", km.actions_and_modals.reset),
    searchLabel: t("Search the archive", km.catalogue.search_label),
    placeholder: t("sampot, silk…", km.catalogue.placeholder),
    searchHint: t(
      "Search English or Khmer names, materials, and descriptions. Use quotes for an exact phrase.",
      km.catalogue.search_hint,
    ),
    clearSearch: t("Clear search", km.catalogue.clear_search),
    suggestions: t("Search suggestions", km.catalogue.suggestions),
    filterLabel: t("Garment category", km.catalogue.filter_label),
    all: t("All garments", km.catalogue.all),
    lower: t("Lower body", km.catalogue.lower),
    upper: t("Upper body", km.catalogue.upper),
    ensemble: t("Ensembles", km.catalogue.ensemble),
    noneFound: t("No garments found", km.states_and_feedback.no_results),
    resetAll: t("Reset search and filters", km.catalogue.reset_all),
    cardEnsemble: t("Ensemble", km.catalogue.ensemble),
    material: t("Material", km.catalogue.material),
    readEntry: t("Read entry", km.catalogue.read_entry),
  },
  community: {
    heading: t("Dresses and their stories", km.community.heading),
    searchLabel: t("Search the entries", km.community.search_label),
    placeholder: t("title, place…", km.community.placeholder),
    searchHint: t(
      "Search titles, stories, credits, makers, places, and materials in English or Khmer. Use quotes for an exact phrase.",
      km.community.search_hint,
    ),
    viewsLabel: t("Which entries to show", km.community.views_label),
    allEntries: t("All entries", km.community.all_entries),
    myEntries: t("My entries", km.community.my_entries),
    loadFailed: t("Entries could not be loaded", km.community.load_failed),
    loadFailedHelp: t("Please refresh the page to try again.", km.community.load_failed_help),
    noneMine: t("You have not written an entry yet", km.community.none_mine),
    none: t("No entries yet", km.community.none),
    noneFound: t("No entries found", km.states_and_feedback.no_results),
    resetSearch: t("Reset search", km.community.reset_search),
  },
  cookies: {
    title: t("Our use of cookies", km.cookies.title),
    intro: t("We keep our use of cookies limited and purposeful.", km.cookies.intro),
    guestHeading: t("Guest browsing", km.cookies.guestHeading),
    guestBody: t("You can browse the archive without signing in or using account cookies.", km.cookies.guestBody),
    signInHeading: t("Signing in", km.cookies.signInHeading),
    signInBody: t("Essential cookies keep your account secure and remember you as you move between pages.", km.cookies.signInBody),
    languageHeading: t("Your language choice", km.cookies.languageHeading),
    languageChoice: t(`The archive is shown in Khmer unless you choose English with the language buttons at the top of every page. When you press one, a cookie named “${LANGUAGE_COOKIE}” is saved in this browser holding only your choice, “en” or “km”, so the next page opens in the same language.`, fillKhmer(km.cookies.languageChoice, { cookie: LANGUAGE_COOKIE })),
    languageStorage: t("It is set only when you press a language button, whether or not you are signed in, and nothing else is stored with it. It lasts one month, and you can remove it in your browser’s site data, after which the archive is shown in Khmer again.", km.cookies.languageStorage),
    draftHeading: t("Local drafts on this device", km.cookies.draftHeading),
    draftStorage: t("While you write or edit an entry, the text you have typed is saved in your browser’s local storage on this device as a local draft, so you can come back to it after leaving the page, reloading or closing the tab. It is stored under a name that includes your account, so someone else signing in on the same browser does not see it. Only the text fields and the year are kept, never the photo or the consent box.", km.cookies.draftStorage),
    draftRemoval: t("Nothing in a local draft is sent anywhere until you choose to save the entry. Saving removes the draft from this device, and you can also clear it in your browser’s site data. If your browser blocks local storage, the forms still work and simply do not keep local drafts.", km.cookies.draftRemoval),
    draftNotice: t("When you leave a form with a local draft kept, a short note with the time is placed in your browser’s session storage so the next page can say “Draft saved”. The page removes it as soon as it reads it, and the browser removes it when you close the tab.", km.cookies.draftNotice),
    draftGuest: t("Browsing as a guest keeps no local drafts: they exist only once you are signed in and start writing.", km.cookies.draftGuest),
    optionalHeading: t("Analytics and advertising", km.cookies.optionalHeading),
    optionalBody: t("We do not use analytics or advertising cookies.", km.cookies.optionalBody),
  },
  unavailable: {
    title: t("Page not found", km.unavailable.title),
    help: t("Return to the archive to keep browsing.", km.unavailable.help),
  },
  review: {
    submitted: t(
      "Your post has been submitted for review. Check My entries to see when it is published or returned.",
      fillKhmer(km.review.submitted, { myEntries: km.community.my_entries }),
    ),
    // The Review queue page (/review), for Reviewers.
    queue: {
      title: t("Review queue", km.review.queue.title),
      notReviewer: t("This page is for reviewers.", km.review.queue.not_reviewer),
      empty: t("No entries are waiting for review.", km.review.queue.empty),
      publish: t("Publish", km.review.queue.publish),
      return: t("Return", km.review.queue.return),
      // Shown on a card when the database did not make the decision.
      decisionFailed: t(
        "This entry could not be changed. It may already have been reviewed in another tab. Refresh the page to see the queue as it is now.",
        km.review.queue.decision_failed,
      ),
    },
    // The Contributor sees the same Return note label as the Reviewer.
    note: {
      name: t("Return note", km.review.note.name),
      hint: t(
        `Tell the contributor what to change. Up to ${RETURN_NOTE_LIMIT} characters.`,
        fillKhmer(km.review.note.hint, { limit: formatUiNumber(RETURN_NOTE_LIMIT, "km") }),
      ),
      sendBack: t("Send back", km.review.queue.return),
      // Over the earlier note on a Pending card, once a Returned entry is edited.
      returnedBefore: t("Returned before with this note", km.review.note.returned_before),
    },
    // Shown under the pill on a Returned entry in My entries. It starts with the
    // pill's own words, "<word>៖ <what to do>".
    returnedHint: t(
      "Returned: edit and save to send it for review again",
      fillKhmer(km.review.returned_hint, { status: km.review.status.returned }),
    ),
    // The Status pill on an entry in My entries: just the status word, one for
    // each status an entry can have. The Khmer of Published and Returned is the
    // word the Reviewer's live line uses.
    pill: {
      pending: t("Pending", km.review.status.pending),
      published: t("Published", km.review.status.published),
      returned: t("Returned", km.review.status.returned),
    },
  },
};

const number = (value) => formatUiNumber(value, "en");
const khmerNumber = (value) => formatUiNumber(value, "km");
const MAX_PHOTO_MB = MAX_PHOTO_BYTES / 1024 / 1024;

export function entrySaveActionText({ editing = false, isReviewer = false, pending = false } = {}) {
  if (editing) return pending ? TEXT.form.saving : TEXT.form.saveChanges;
  if (isReviewer) return pending ? TEXT.form.publishing : TEXT.review.queue.publish;
  return pending ? TEXT.form.submitting : TEXT.form.submitForReview;
}

export function characterCountText(count, limit) {
  return t(
    `${number(count)} of ${number(limit)} characters`,
    fillKhmer(km.entry_form.count, { count: khmerNumber(count), limit: khmerNumber(limit) }),
  );
}

export function sharedByText(credit) {
  return t(`Shared by ${credit}`, fillKhmer(km.entry_card.shared_by, { credit }));
}

export function namedEntryText(label, title) {
  return t(`${label.en}: ${title}`, fillKhmer(km.entry_card.named_label, { label: label.km, title }));
}

export function entryPhotoText(title, current = false) {
  const label = current ? "Current photo for" : "Photo for";
  const template = current ? km.photo.current_for_entry : km.photo.for_entry;
  return t(`${label}: ${title}`, fillKhmer(template, { title }));
}

export function photoHintText(keepCurrent) {
  const limits = t(
    `One JPEG, PNG or WebP photo of the dress, up to ${MAX_PHOTO_MB} MB.`,
    fillKhmer(km.photo.hint, { size: khmerNumber(MAX_PHOTO_MB) }),
  );
  if (!keepCurrent) return limits;
  return t(
    `Leave this empty to keep the current photo. ${limits.en}`,
    fillKhmer(km.photo.keep_current, { hint: limits.km }),
  );
}

const FIELD_NAMES_KM = {
  title: TEXT.form.title.km,
  story: TEXT.form.story.km,
  credited_as: TEXT.form.creditedAs.km,
  occasion: TEXT.provenance.occasion.km,
  maker: fillKhmer(km.entry_form.maker_name, { maker: TEXT.provenance.maker.km }),
  place: TEXT.provenance.place.km,
  materials: TEXT.provenance.materials.km,
};

export function entryMessageText(field, reason, options) {
  const en = getEntryMessage(field, reason, options);
  if (field === "year") {
    const currentYear = options?.currentYear ?? new Date().getFullYear();
    return t(en, fillKhmer(km.entry_form.year_error, { first: formatYear(EARLIEST_YEAR), last: formatYear(currentYear) }));
  }
  const name = FIELD_NAMES_KM[field];
  if (reason === "required") return t(en, fillKhmer(km.entry_form.required_error, { field: name }));
  return t(en, fillKhmer(km.entry_form.length_error, { field: name, limit: khmerNumber(ENTRY_LIMITS[field]) }));
}

export function saveFailureText(error) {
  const messages = km.entry_form.save_errors;
  const message = Object.hasOwn(messages, error?.code) ? messages[error.code] : messages.fallback;
  return t(getSaveFailureMessage(error), message);
}

export function deleteFailureText(error) {
  const messages = km.entry_card.delete_errors;
  const code = error?.code;
  const message = code === "42501" || code === "not-saved"
    ? km.entry_card.delete_not_saved
    : Object.hasOwn(messages, code) ? messages[code] : messages.fallback;
  return t(getDeleteFailureMessage(error), message);
}

export function photoMessageText(field, reason) {
  return t(
    getPhotoMessage(field, reason),
    fillKhmer(km.photo.errors[`${field}:${reason}`], { size: khmerNumber(MAX_PHOTO_MB) }),
  );
}

const UPLOAD_FAILURES_KM = {
  ...km.photo.upload_errors,
  "413": km.photo.errors["photo:size"],
  "415": km.photo.errors["photo:type"],
};

export function photoFailureText(error) {
  const key = Object.hasOwn(UPLOAD_FAILURES_KM, error?.code) ? error.code : String(error?.statusCode ?? error?.status);
  const template = Object.hasOwn(UPLOAD_FAILURES_KM, key) ? UPLOAD_FAILURES_KM[key] : km.photo.upload_errors.fallback;
  return t(getPhotoFailureMessage(error), fillKhmer(template, { size: khmerNumber(MAX_PHOTO_MB) }));
}

// "Your Username is @mary_k."
export function yourUsernameText(username) {
  const printed = formatUsername(username);
  return t(`Your Username is ${printed}.`, fillKhmer(km.username.your_username, { username: printed }));
}

export function usernameHintText() {
  return t(
    `${USERNAME_MIN_LENGTH} to ${USERNAME_MAX_LENGTH} English letters, digits or underscore. Capitals are saved as lowercase. It is shown publicly with an @ in front; never type the @.`,
    fillKhmer(km.username.hint, { min: khmerNumber(USERNAME_MIN_LENGTH), max: khmerNumber(USERNAME_MAX_LENGTH) }),
  );
}

export function usernameMessageText(reason) {
  const messages = km.username.errors;
  const template = Object.hasOwn(messages, reason) ? messages[reason] : messages["invalid-characters"];
  return t(getUsernameMessage(reason), fillKhmer(template, {
    min: khmerNumber(USERNAME_MIN_LENGTH), max: khmerNumber(USERNAME_MAX_LENGTH),
  }));
}

// The deadline is an exact instant in UTC in both Interface languages.
export function allowedAtText(date) {
  const parts = khmerDateParts(date, "UTC", { includeTime: true });
  return t(formatAllowedAt(date), fillKhmer(km.username.allowed_at, parts));
}

export function changeMessageText(result) {
  const en = getChangeMessage(result);
  if (result.reason === "too-soon") {
    return t(en, fillKhmer(km.username.too_soon, { date: allowedAtText(result.allowedAt).km }));
  }
  if (result.reason === "unchanged") return t(en, km.username.unchanged);
  return usernameMessageText(result.reason);
}

export function confirmText(username, now = new Date()) {
  const english = getConfirmMessage(username, now);
  const date = fillKhmer(km.dates.calendar_date, khmerDateParts(waitEndsAt(now), "UTC"));
  return {
    question: t(english.question, fillKhmer(km.username.confirm_question, { username: formatUsername(username) })),
    warning: t(english.warning, fillKhmer(km.username.confirm_warning, { days: khmerNumber(USERNAME_CHANGE_WAIT_DAYS), date })),
  };
}

export function credentialIssueText({ valueMissing, typeMismatch, tooShort }) {
  if (valueMissing) return t("This field is required.", km.states_and_feedback.required_field);
  if (typeMismatch) return t("Enter a valid email address.", km.states_and_feedback.invalid_email + "។");
  if (tooShort) return TEXT.auth.passwordHint;
  return null;
}

const RESEND_KM = {
  sent: km.auth_and_account.resend_sent,
  rateLimited: km.auth_and_account.resend_limited,
  failed: km.auth_and_account.resend_failed,
};

// Same choice as getConfirmationResendMessage in lib/authConfirmation.js.
export function resendMessageText(error) {
  if (!error) return t(getConfirmationResendMessage(error), RESEND_KM.sent);
  const limited = error.code === "over_email_send_rate_limit" || error.status === 429;
  return t(getConfirmationResendMessage(error), limited ? RESEND_KM.rateLimited : RESEND_KM.failed);
}

// The Resend button while it counts down.
export function retryInText(seconds) {
  return t(`Try again in ${seconds}s`, fillKhmer(km.auth_and_account.retry_in, { seconds: khmerNumber(seconds) }));
}

// The archive's own name, description and source, each with its Khmer from
// collection.config.js. A missing Khmer text is refused, so the home page
// never shows an English-only identity by accident.
export function identityText(collection) {
  const identity = {
    name: t(collection.name, collection.nameKm),
    description: t(collection.description, collection.descriptionKm),
    source: t(collection.source, collection.sourceKm),
  };
  for (const [field, text] of Object.entries(identity)) {
    if (!isPair(text)) throw new Error(`collection.config.js needs a Khmer text for ${field} (${field}Km).`);
  }
  return identity;
}

export function archiveMetadataText(collection, language, recordTitle) {
  const identity = identityText(collection);
  const name = pick(identity.name, language);
  const title = recordTitle ? `${recordTitle} — ${name}` : `${name} — ${pick(TEXT.home.brand, language)}`;
  return { title, description: pick(identity.description, language) };
}

// "Source recorded by <curator>". The curator's name is shown as it is configured.
export function bylineText(curator) {
  return t(`Source recorded by ${curator}`, fillKhmer(km.home.byline, { curator }));
}

// The day, month and year an entry was submitted, always on Phnom Penh's clock
// (UTC+7, no daylight saving) so the date is the same on the server, in every
// browser and in every time zone. Digits stay Western in both languages. The
// Khmer month names come from the platform's own Khmer locale data.
const PHNOM_PENH_DATE = { timeZone: "Asia/Phnom_Penh", numberingSystem: "latn", day: "numeric", month: "long", year: "numeric" };

// "Submitted 25 October 2026", for the Review queue card. createdAt is the
// entry's created_at, as Supabase sends it. Format it on the server and pass
// the text down, so the server and the browser can never disagree.
// The formatters are made here, not when the module loads: browser code
// imports this module too, and a runtime that rejected the time zone would
// otherwise break every page that imports it, not only the Review queue.
export function submittedText(createdAt) {
  const englishDate = new Intl.DateTimeFormat("en-GB", PHNOM_PENH_DATE);
  const date = new Date(createdAt);
  const khmer = khmerDateParts(date, PHNOM_PENH_DATE.timeZone);
  return t(
    `Submitted ${englishDate.format(date)}`,
    fillKhmer(km.dates.submitted, khmer),
  );
}

// The live line after a Reviewer's decision: "Published: <title>" or
// "Returned: <title>". The title is the Contributor's own text, shown exactly as written.
export function decisionDoneText(decision, title) {
  if (decision !== "published" && decision !== "returned") throw new Error(`Unknown review decision: ${decision}`);
  const status = TEXT.review.pill[decision];
  return t(`${status.en}: ${title}`, fillKhmer(km.review.announcement, { status: status.km, title }));
}

// The hero photo's caption, from its Official record. Maker and place are shown as stored.
export function heroCaptionText(garment) {
  return t(
    `${garment.nameEn}, made by ${garment.maker} in ${garment.place}.`,
    fillKhmer(km.home.hero_caption, { name: garment.nameKh, maker: garment.maker, place: garment.place }),
  );
}

// "showing 3 of 8 entries", under both the Official and the Community search.
export function countText(shown, total) {
  return t(
    `showing ${number(shown)} of ${number(total)} entries`,
    fillKhmer(km.home.count, { shown: khmerNumber(shown), total: khmerNumber(total) }),
  );
}

const GARMENT_KINDS = {
  all: ["garments", km.catalogue.garment],
  lower: ["lower body garments", km.catalogue.lower_garment],
  upper: ["upper body garments", km.catalogue.upper_garment],
  ensemble: ["ensembles", km.catalogue.ensemble],
};

// The Official collection's empty state. The search is shown as typed (spaces at the ends trimmed).
export function emptyGarmentsText(category, query) {
  const [en, categoryName] = GARMENT_KINDS[category];
  const shown = query.trim();
  return t(
    `No ${en} match “${shown}”. Try a different name or material.`,
    fillKhmer(km.catalogue.empty, { category: categoryName, query: shown }),
  );
}

// The Community tab's empty state, shown when a search finds nothing.
export function emptyEntriesText(query) {
  const shown = query.trim();
  return t(
    `No entries match “${shown}”. Try a different word, or search in English or Khmer.`,
    fillKhmer(km.community.empty, { query: shown }),
  );
}

export function readGarmentText(title) {
  return t(`Read entry: ${title}`, fillKhmer(km.catalogue.read_named_entry, { title }));
}
