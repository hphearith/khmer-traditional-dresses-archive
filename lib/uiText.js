import { ENTRY_LIMITS, EARLIEST_YEAR, getDeleteFailureMessage, getEntryMessage, getSaveFailureMessage } from "./entry.js";
import { MAX_PHOTO_BYTES, PHOTO_CONSENT, getPhotoFailureMessage, getPhotoMessage } from "./photo.js";

// Every piece of interface text is a pair: { en, km } (lib/bilingual.js, ADR 0003).
// Fixed texts live in TEXT, grouped by screen. Texts that carry a number or a
// name are small functions below. The messages that already exist in
// lib/entry.js and lib/photo.js keep their English there, untouched: the
// functions here take the English from them and add the Khmer, so the English
// has one source. Numbers stay Western (0-9) in both languages.
const t = (en, km) => ({ en, km });

export const TEXT = {
  page: {
    backToCommunity: t("Back to the Community", "ត្រឡប់ទៅសហគមន៍វិញ"),
    writeTitle: t("Write an entry", "សរសេរកំណត់ត្រា"),
    writeIntro: t(
      "Tell the story of one dress you ordered or had made, in Khmer, English or both. Your entry is public as soon as you save it.",
      "ចែករំលែករឿងរ៉ាវនៃសម្លៀកបំពាក់មួយឈុតដែលអ្នកបានកុម្ម៉ង់ ឬឱ្យគេដេរ ជាភាសាខ្មែរ ភាសាអង់គ្លេស ឬទាំងពីរ។ កំណត់ត្រារបស់អ្នកនឹងបង្ហាញជាសាធារណៈភ្លាមៗ នៅពេលអ្នករក្សាទុក។",
    ),
    editTitle: t("Edit your entry", "កែប្រែកំណត់ត្រារបស់អ្នក"),
    editIntro: t(
      "Changes go live only when you choose Save changes. The entry keeps its place on the Community tab.",
      "ការផ្លាស់ប្តូរនឹងបង្ហាញជាសាធារណៈ លុះត្រាតែអ្នកជ្រើសរើស «រក្សាទុកការផ្លាស់ប្តូរ»។ កំណត់ត្រានេះរក្សាទីតាំងរបស់វានៅលើផ្ទាំងសហគមន៍។",
    ),
    editLoadFailed: t(
      "This entry could not be loaded. Go back to the Community and try again.",
      "មិនអាចផ្ទុកកំណត់ត្រានេះបានទេ។ សូមត្រឡប់ទៅសហគមន៍វិញ ហើយព្យាយាមម្តងទៀត។",
    ),
    editNotOwner: t("You can only change entries you wrote.", "អ្នកអាចកែប្រែបានតែកំណត់ត្រាដែលអ្នកបានសរសេរប៉ុណ្ណោះ។"),
  },
  form: {
    title: t("Title", "ចំណងជើង"),
    story: t("Story", "រឿងរ៉ាវ"),
    storyHint: t(
      "Who it was made for, how it was ordered, what it means to you.",
      "ធ្វើឡើងសម្រាប់នរណា កុម្ម៉ង់យ៉ាងដូចម្តេច និងមានន័យអ្វីចំពោះអ្នក។",
    ),
    creditedAs: t("Credited as", "បង្ហាញឈ្មោះជា"),
    creditedAsHint: t(
      "The name shown on this entry. Leave it blank to show your @Username.",
      "ឈ្មោះដែលបង្ហាញលើកំណត់ត្រានេះ។ ទុកទទេដើម្បីបង្ហាញឈ្មោះអ្នកប្រើប្រាស់ @ របស់អ្នក។",
    ),
    required: t("required", "ត្រូវបំពេញ"),
    optional: t("optional", "ស្រេចចិត្ត"),
    limitReached: t("Limit reached.", "ដល់កម្រិតកំណត់ហើយ។"),
    saveEntry: t("Save entry", "រក្សាទុកកំណត់ត្រា"),
    saveChanges: t("Save changes", "រក្សាទុកការផ្លាស់ប្តូរ"),
    saving: t("Saving…", "កំពុងរក្សាទុក…"),
    restored: t(
      "Your draft was restored, but the photo and the consent box are not saved in a draft. Choose the photo again and tick the box.",
      "បានស្ដារសេចក្តីព្រាងរបស់អ្នកឡើងវិញ ប៉ុន្តែរូបថត និងប្រអប់ការយល់ព្រមមិនត្រូវបានរក្សាទុកក្នុងសេចក្តីព្រាងទេ។ សូមជ្រើសរើសរូបថតម្តងទៀត ហើយធីកប្រអប់នោះ។",
    ),
    signedOut: t(
      "You are no longer logged in. Copy your text somewhere safe, log in again, then try once more.",
      "អ្នកមិនទាន់ចូលគណនីទៀតទេ។ សូមចម្លងអត្ថបទរបស់អ្នកទុកកន្លែងសុវត្ថិភាព ចូលគណនីម្តងទៀត រួចព្យាយាមម្តងទៀត។",
    ),
  },
  photo: {
    label: t("Photo", "រូបថត"),
    replaceLabel: t("Replace the photo", "ជំនួសរូបថត"),
    chosenAlt: t("The photo you chose", "រូបថតដែលអ្នកបានជ្រើសរើស"),
    currentAlt: t("Current photo for", "រូបថតបច្ចុប្បន្នសម្រាប់"),
    consent: t(
      PHOTO_CONSENT,
      "ខ្ញុំបានថតរូបនេះដោយខ្លួនឯង ឬមានការអនុញ្ញាតឱ្យចែករំលែក ហើយអ្នកដែលអាចសម្គាល់បានក្នុងរូបនេះបានយល់ព្រមឱ្យបង្ហាញជាសាធារណៈក្នុងបណ្ណសារនេះ។",
    ),
    consentWithNewPhoto: t("required with a new photo", "ត្រូវបំពេញពេលមានរូបថតថ្មី"),
  },
  provenance: {
    legend: t("Provenance", "ប្រភពដើម"),
    intro: t(
      "Where the dress came from, if you know. Fill in any or none.",
      "កន្លែងដែលសម្លៀកបំពាក់នេះមកពី ប្រសិនបើអ្នកដឹង។ បំពេញខ្លះ ឬមិនបំពេញក៏បាន។",
    ),
    occasion: t("Occasion", "ឱកាស"),
    year: t("Year", "ឆ្នាំ"),
    notSure: t("Not sure", "មិនច្បាស់"),
    maker: t("Maker or tailor", "អ្នកផលិត ឬជាងដេរ"),
    place: t("Place", "ទីកន្លែង"),
    placeHint: t("Where it was made.", "កន្លែងដែលវាត្រូវបានធ្វើ។"),
    materials: t("Materials", "សម្ភារៈ"),
  },
  card: {
    makerShort: t("Maker", "អ្នកផលិត"),
    readStory: t("Read story", "អានរឿងរ៉ាវ"),
    photoFor: t("Photo for", "រូបថតសម្រាប់"),
    edit: t("Edit", "កែប្រែ"),
    delete: t("Delete", "លុប"),
    confirmGroup: t("Confirm deleting", "បញ្ជាក់ការលុប"),
    confirmQuestion: t(
      "Delete this entry for good? This cannot be undone.",
      "លុបកំណត់ត្រានេះជាអចិន្ត្រៃយ៍មែនទេ? មិនអាចត្រឡប់វិញបានទេ។",
    ),
    deleteForGood: t("Delete for good", "លុបជាអចិន្ត្រៃយ៍"),
    deleting: t("Deleting…", "កំពុងលុប…"),
    cancel: t("Cancel", "បោះបង់"),
    signedOut: t(
      "You are no longer logged in. Log in again, then try once more.",
      "អ្នកមិនទាន់ចូលគណនីទៀតទេ។ សូមចូលគណនីម្តងទៀត រួចព្យាយាមម្តងទៀត។",
    ),
  },
};

const number = (value) => value.toLocaleString("en");

// "1,234 of 5,000 characters"
export function characterCountText(count, limit) {
  return t(`${number(count)} of ${number(limit)} characters`, `${number(count)} ក្នុងចំណោម ${number(limit)} តួអក្សរ`);
}

// The credit line on an entry card. The name is the Contributor's own text and is never changed.
export function sharedByText(credit) {
  return t(`Shared by ${credit}`, `ចែករំលែកដោយ ${credit}`);
}

// The hint under the photo field. Editing may keep the current photo.
export function photoHintText(keepCurrent) {
  const mb = MAX_PHOTO_BYTES / 1024 / 1024;
  const limits = t(
    `One JPEG, PNG or WebP photo of the dress, up to ${mb} MB.`,
    `រូបថត JPEG, PNG ឬ WebP មួយសន្លឹកនៃសម្លៀកបំពាក់ ទំហំរហូតដល់ ${mb} MB។`,
  );
  if (!keepCurrent) return limits;
  return t(`Leave this empty to keep the current photo. ${limits.en}`, `ទុកទទេដើម្បីរក្សារូបថតបច្ចុប្បន្ន។ ${limits.km}`);
}

// The name of each entry field inside a message, e.g. "Give your entry a title."
const FIELD_NAMES_KM = {
  title: "ចំណងជើង",
  story: "រឿងរ៉ាវ",
  credited_as: "ឈ្មោះដែលបង្ហាញ",
  occasion: "ឱកាស",
  maker: "អ្នកផលិត",
  place: "ទីកន្លែង",
  materials: "សម្ភារៈ",
};

// Same choice as getEntryMessage in lib/entry.js: year first, then required, else too long.
export function entryMessageText(field, reason, options) {
  const en = getEntryMessage(field, reason, options);
  if (field === "year") {
    const currentYear = options?.currentYear ?? new Date().getFullYear();
    return t(en, `ជ្រើសរើសឆ្នាំពី ${EARLIEST_YEAR} ដល់ ${currentYear} ឬទុកចោលទទេ។`);
  }
  if (reason === "required") return t(en, `សូមបញ្ចូល${FIELD_NAMES_KM[field]}ក្នុងកំណត់ត្រារបស់អ្នក។`);
  return t(en, `សូមកុំឱ្យ${FIELD_NAMES_KM[field]}លើស ${number(ENTRY_LIMITS[field])} តួអក្សរ។`);
}

const SAVE_FAILURES_KM = {
  "42501": "គណនីនេះមិនអាចរក្សាទុកកំណត់ត្រាបានទេនៅពេលនេះ។ សូមចាកចេញ ចូលម្តងទៀត ហើយប្រាកដថាអ្នកបានជ្រើសរើសឈ្មោះអ្នកប្រើប្រាស់។",
  "23514": "មានអ្វីមួយក្នុងកំណត់ត្រារបស់អ្នកមិនត្រូវបានទទួលយក។ សូមពិនិត្យគ្រប់ប្រអប់ ហើយព្យាយាមម្តងទៀត។",
  offline: "អ្នកហាក់ដូចជាគ្មានអ៊ីនធឺណិត។ អត្ថបទរបស់អ្នកនៅតែមាន៖ សូមភ្ជាប់ឡើងវិញ ហើយរក្សាទុកម្តងទៀត។",
  timeout: "វាចំណាយពេលយូរពេក។ អត្ថបទរបស់អ្នកនៅតែមាន៖ សូមពិនិត្យការតភ្ជាប់ ហើយរក្សាទុកម្តងទៀត។",
  "not-saved": "ការផ្លាស់ប្តូរនោះមិនត្រូវបានរក្សាទុកទេ។ អត្ថបទរបស់អ្នកនៅតែមាន៖ សូមចម្លងវាទុកកន្លែងសុវត្ថិភាព ផ្ទុកទំព័រឡើងវិញដើម្បីមើលថាកំណត់ត្រានៅតែជារបស់អ្នក ហើយរក្សាទុកម្តងទៀត។",
};
const SAVE_FAILED_KM = "យើងមិនអាចរក្សាទុកកំណត់ត្រារបស់អ្នកបានទេ។ សូមពិនិត្យការតភ្ជាប់ ហើយព្យាយាមម្តងទៀត។";

export function saveFailureText(error) {
  const km = Object.hasOwn(SAVE_FAILURES_KM, error?.code) ? SAVE_FAILURES_KM[error.code] : SAVE_FAILED_KM;
  return t(getSaveFailureMessage(error), km);
}

const DELETE_NOT_SAVED_KM = "ការផ្លាស់ប្តូរនោះមិនត្រូវបានរក្សាទុកទេ។ កំណត់ត្រាមិនទាន់ត្រូវបានលុបទេ៖ សូមផ្ទុកទំព័រឡើងវិញដើម្បីមើលថាវានៅតែជារបស់អ្នក ហើយព្យាយាមម្តងទៀត។";
const DELETE_FAILURES_KM = {
  offline: "អ្នកហាក់ដូចជាគ្មានអ៊ីនធឺណិត។ កំណត់ត្រាមិនទាន់ត្រូវបានលុបទេ៖ សូមភ្ជាប់ឡើងវិញ ហើយព្យាយាមម្តងទៀត។",
  timeout: "វាចំណាយពេលយូរពេក។ សូមពិនិត្យផ្ទាំងសហគមន៍មុនលុបម្តងទៀត៖ កំណត់ត្រាប្រហែលជាត្រូវបានលុបរួចហើយ។",
};
const DELETE_FAILED_KM = "យើងមិនអាចលុបកំណត់ត្រារបស់អ្នកបានទេ។ សូមពិនិត្យការតភ្ជាប់ ហើយព្យាយាមម្តងទៀត។";

export function deleteFailureText(error) {
  // Row-level security (42501) and a delete that matched no row (not-saved) read the same.
  const km = error?.code === "42501" || error?.code === "not-saved"
    ? DELETE_NOT_SAVED_KM
    : (Object.hasOwn(DELETE_FAILURES_KM, error?.code) ? DELETE_FAILURES_KM[error.code] : DELETE_FAILED_KM);
  return t(getDeleteFailureMessage(error), km);
}

const PHOTO_MESSAGES_KM = {
  "photo:required": "សូមជ្រើសរើសរូបថតសម្រាប់កំណត់ត្រារបស់អ្នក។",
  "photo:type": "ឯកសារនោះមិនមែនជារូបថតដែលយើងអាចប្រើបានទេ។ សូមជ្រើសរើសរូបភាព JPEG, PNG ឬ WebP។",
  "photo:size": `រូបថតនោះធំជាង ${MAX_PHOTO_BYTES / 1024 / 1024} MB។ សូមជ្រើសរើសរូបថតតូចជាងនេះ។`,
  "consent:required": "សូមធីកប្រអប់ដើម្បីបញ្ជាក់ថាអ្នកមានសិទ្ធិចែករំលែករូបថតនេះ។",
};

export function photoMessageText(field, reason) {
  return t(getPhotoMessage(field, reason), PHOTO_MESSAGES_KM[`${field}:${reason}`]);
}

const UPLOAD_FAILURES_KM = {
  "403": "គណនីនេះមិនអាចផ្ទុកឡើងរូបថតបានទេនៅពេលនេះ។ សូមចាកចេញ ចូលម្តងទៀត រួចព្យាយាមម្តងទៀត។",
  "413": PHOTO_MESSAGES_KM["photo:size"],
  "415": PHOTO_MESSAGES_KM["photo:type"],
  offline: "អ្នកហាក់ដូចជាគ្មានអ៊ីនធឺណិត។ កំណត់ត្រារបស់អ្នកនៅតែមាន៖ សូមភ្ជាប់ឡើងវិញ ហើយរក្សាទុកម្តងទៀត។",
  timeout: "រូបថតចំណាយពេលយូរពេកក្នុងការផ្ទុកឡើង។ កំណត់ត្រារបស់អ្នកនៅតែមាន៖ សូមពិនិត្យការតភ្ជាប់ ហើយរក្សាទុកម្តងទៀត។",
};
const UPLOAD_FAILED_KM = "យើងមិនអាចផ្ទុកឡើងរូបថតរបស់អ្នកបានទេ។ សូមពិនិត្យការតភ្ជាប់ ហើយព្យាយាមម្តងទៀត។";

// Picks the same key as getPhotoFailureMessage in lib/photo.js: the form's own
// code first, else the storage status.
export function photoFailureText(error) {
  const key = error?.code in UPLOAD_FAILURES_KM ? error.code : String(error?.statusCode ?? error?.status);
  return t(getPhotoFailureMessage(error), UPLOAD_FAILURES_KM[key] ?? UPLOAD_FAILED_KM);
}
