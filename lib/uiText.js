import { getConfirmationResendMessage } from "./authConfirmation.js";
import { isPair } from "./bilingual.js";
import { ENTRY_LIMITS, EARLIEST_YEAR, getDeleteFailureMessage, getEntryMessage, getSaveFailureMessage } from "./entry.js";
import { MAX_PHOTO_BYTES, PHOTO_CONSENT, getPhotoFailureMessage, getPhotoMessage } from "./photo.js";
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, formatUsername, getUsernameMessage } from "./username.js";
import { USERNAME_CHANGE_WAIT_DAYS, formatAllowedAt, getChangeMessage, getConfirmMessage, waitEndsAt } from "./usernameChange.js";

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
  auth: {
    signUp: t("Sign up", "ចុះឈ្មោះ"),
    logIn: t("Log in", "ចូលគណនី"),
    signUpIntro: t("Create your contributor account.", "បង្កើតគណនីអ្នករួមចំណែករបស់អ្នក។"),
    logInIntro: t("Welcome back to the archive.", "សូមស្វាគមន៍ការត្រឡប់មកវិញក្នុងបណ្ណសារ។"),
    verifyAlert: t(
      "Your email may have been confirmed, but this browser could not complete sign-in. Contributor accounts require essential cookies. Try logging in below, or continue browsing as a guest.",
      "អ៊ីមែលរបស់អ្នកប្រហែលជាត្រូវបានបញ្ជាក់រួចហើយ ប៉ុន្តែកម្មវិធីរុករកនេះមិនអាចបញ្ចប់ការចូលគណនីបានទេ។ គណនីអ្នករួមចំណែកត្រូវការខូគីចាំបាច់។ សូមព្យាយាមចូលគណនីខាងក្រោម ឬបន្តរុករកជាភ្ញៀវ។",
    ),
    cookiesHeading: t("Essential cookies", "ខូគីចាំបាច់"),
    cookiesText: t(
      "We use essential cookies to keep your account secure and signed in. You can continue without them by browsing as a guest.",
      "យើងប្រើខូគីចាំបាច់ដើម្បីរក្សាគណនីរបស់អ្នកឱ្យមានសុវត្ថិភាព និងនៅតែចូលគណនី។ អ្នកអាចបន្តដោយគ្មានវាបាន ដោយរុករកជាភ្ញៀវ។",
    ),
    cookiesLink: t("Learn about cookies", "ស្វែងយល់អំពីខូគី"),
    continueAsGuest: t("Continue as guest", "បន្តជាភ្ញៀវ"),
    haveAccount: t("Already have an account?", "មានគណនីរួចហើយឬ?"),
    needAccount: t("Need an account?", "ត្រូវការគណនីឬ?"),
    email: t("Email", "អ៊ីមែល"),
    password: t("Password", "ពាក្យសម្ងាត់"),
    passwordHint: t("Use at least 6 characters.", "ប្រើយ៉ាងហោចណាស់ 6 តួអក្សរ។"),
    pleaseWait: t("Please wait…", "សូមរង់ចាំ…"),
    signUpFailed: t("Unable to sign up. Please try again.", "មិនអាចចុះឈ្មោះបានទេ។ សូមព្យាយាមម្តងទៀត។"),
    invalidLogin: t("Invalid email or password", "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ"),
    needsConfirmation: t(
      "This address may need confirmation before sign-in. If so, you can request another email.",
      "អាសយដ្ឋាននេះប្រហែលជាត្រូវការការបញ្ជាក់មុនចូលគណនី។ បើដូច្នេះ អ្នកអាចស្នើសុំអ៊ីមែលមួយទៀតបាន។",
    ),
    emailConfirmation: t("Email confirmation", "ការបញ្ជាក់អ៊ីមែល"),
    emailAddress: t("Email address", "អាសយដ្ឋានអ៊ីមែល"),
    sending: t("Sending…", "កំពុងផ្ញើ…"),
    resend: t("Resend confirmation email", "ផ្ញើអ៊ីមែលបញ្ជាក់ម្តងទៀត"),
  },
  callback: {
    checking: t("Checking your confirmation link…", "កំពុងពិនិត្យតំណបញ្ជាក់របស់អ្នក…"),
    providerError: t(
      "This confirmation link could not be completed. It may have expired or already been used.",
      "មិនអាចបញ្ចប់តំណបញ្ជាក់នេះបានទេ។ វាប្រហែលជាផុតកំណត់ ឬត្រូវបានប្រើរួចហើយ។",
    ),
    missingCode: t(
      "This confirmation link is missing or invalid. Open a new email link, or try logging in.",
      "តំណបញ្ជាក់នេះបាត់ ឬមិនត្រឹមត្រូវ។ សូមបើកតំណថ្មីពីអ៊ីមែល ឬព្យាយាមចូលគណនី។",
    ),
    missingVerifier: t(
      "Your email may have been confirmed, but this browser could not complete sign-in. Try logging in; if confirmation is still needed, request a new email.",
      "អ៊ីមែលរបស់អ្នកប្រហែលជាត្រូវបានបញ្ជាក់រួចហើយ ប៉ុន្តែកម្មវិធីរុករកនេះមិនអាចបញ្ចប់ការចូលគណនីបានទេ។ សូមព្យាយាមចូលគណនី ប្រសិនបើនៅតែត្រូវការការបញ្ជាក់ សូមស្នើសុំអ៊ីមែលថ្មី។",
    ),
    exchangeFailed: t(
      "This confirmation link could not be completed. It may have expired or already been used. Try logging in, or request a new email if needed.",
      "មិនអាចបញ្ចប់តំណបញ្ជាក់នេះបានទេ។ វាប្រហែលជាផុតកំណត់ ឬត្រូវបានប្រើរួចហើយ។ សូមព្យាយាមចូលគណនី ឬស្នើសុំអ៊ីមែលថ្មី បើចាំបាច់។",
    ),
    networkFailed: t(
      "We could not complete this confirmation right now. Try logging in or open the email link again.",
      "យើងមិនអាចបញ្ចប់ការបញ្ជាក់នេះបានទេនៅពេលនេះ។ សូមព្យាយាមចូលគណនី ឬបើកតំណពីអ៊ីមែលម្តងទៀត។",
    ),
    goToLogin: t("Go to login", "ទៅកាន់ទំព័រចូលគណនី"),
  },
  username: {
    label: t("Username", "ឈ្មោះអ្នកប្រើប្រាស់"),
    chooseTitle: t("Choose a Username", "ជ្រើសរើសឈ្មោះអ្នកប្រើប្រាស់"),
    chooseIntro: t(
      "Accounts now have a public Username. Choose yours to continue.",
      "ឥឡូវនេះគណនីមានឈ្មោះអ្នកប្រើប្រាស់ជាសាធារណៈ។ សូមជ្រើសរើសឈ្មោះរបស់អ្នកដើម្បីបន្ត។",
    ),
    logOutInstead: t("Log out instead", "ចាកចេញជំនួសវិញ"),
    save: t("Save Username", "រក្សាទុកឈ្មោះអ្នកប្រើប្រាស់"),
    backToArchive: t("Back to the archive", "ត្រឡប់ទៅបណ្ណសារវិញ"),
    changeTitle: t("Change your Username", "ប្តូរឈ្មោះអ្នកប្រើប្រាស់របស់អ្នក"),
    changeIntro: t(
      `Entries that show your Username will show the new one. After a change you must wait ${USERNAME_CHANGE_WAIT_DAYS} days before changing it again.`,
      `កំណត់ត្រាដែលបង្ហាញឈ្មោះអ្នកប្រើប្រាស់របស់អ្នកនឹងបង្ហាញឈ្មោះថ្មី។ បន្ទាប់ពីប្តូរ អ្នកត្រូវរង់ចាំ ${USERNAME_CHANGE_WAIT_DAYS} ថ្ងៃ មុនពេលប្តូរម្តងទៀត។`,
    ),
    checkFailed: t(
      "We could not check when you last changed your Username. You can still try; we will tell you if it is too soon.",
      "យើងមិនអាចពិនិត្យថាអ្នកបានប្តូរឈ្មោះអ្នកប្រើប្រាស់ចុងក្រោយនៅពេលណាបានទេ។ អ្នកនៅតែអាចសាកល្បងបាន យើងនឹងប្រាប់អ្នកប្រសិនបើវាលឿនពេក។",
    ),
    change: t("Change Username", "ប្តូរឈ្មោះអ្នកប្រើប្រាស់"),
    confirmYes: t("Yes, change it", "បាទ/ចាស ប្តូរវា"),
    goBack: t("Go back", "ត្រឡប់ក្រោយ"),
  },
  home: {
    skip: t("Skip to collection", "រំលងទៅកាន់ការប្រមូល"),
    brand: t("Khmer Living Archive", "បណ្ណសារខ្មែរមានជីវិត"),
    navLabel: t("Main navigation", "ម៉ឺនុយមេ"),
    navCollection: t("Collection", "ការប្រមូល"),
    navAbout: t("About the archive", "អំពីបណ្ណសារ"),
    logOut: t("Log out", "ចាកចេញ"),
    heroLabel: t("A personal collection · Dress & craft", "ការប្រមូលផ្ទាល់ខ្លួន · សម្លៀកបំពាក់ និងសិប្បកម្ម"),
    browse: t("Browse the collection", "រកមើលការប្រមូល"),
    heroNote: t(
      "An archive of garments, materials, and the knowledge behind them.",
      "បណ្ណសារនៃសម្លៀកបំពាក់ សម្ភារៈ និងចំណេះដឹងនៅពីក្រោយវា។",
    ),
    aboutLabel: t("02 / Behind the archive", "02 / នៅពីក្រោយបណ្ណសារ"),
    aboutHeading: t("Knowledge from a tailor’s practice.", "ចំណេះដឹងពីការងាររបស់ជាងកាត់ដេរ។"),
    footer: t(
      "Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall 2026. This archive is under construction all semester. Come back in December.",
      "បង្កើតក្នុងមុខវិជ្ជា ICT 340 — Vibe Coding នៅសាកលវិទ្យាល័យអាមេរិកាំងភ្នំពេញ ឆមាសរដូវស្លឹកឈើជ្រុះ 2026។ បណ្ណសារនេះកំពុងស្ថិតក្នុងការកសាងពេញមួយឆមាស។ សូមត្រឡប់មកវិញក្នុងខែធ្នូ។",
    ),
    draftSaved: t("Draft saved", "បានរក្សាទុកសេចក្តីព្រាង"),
  },
  tabs: {
    label: t("Archive sections", "ផ្នែកនៃបណ្ណសារ"),
    official: t("Official collection", "ការប្រមូលជាផ្លូវការ"),
    community: t("Community", "សហគមន៍"),
  },
  catalogue: {
    label: t("01 / The catalogue", "01 / កាតាឡុក"),
    heading: t("Explore the garments", "ស្វែងរកសម្លៀកបំពាក់"),
    reset: t("Reset", "កំណត់ឡើងវិញ"),
    searchLabel: t("Search the archive", "ស្វែងរកក្នុងបណ្ណសារ"),
    placeholder: t("sampot, silk…", "សំពត់ សូត្រ…"),
    searchHint: t(
      "Search English or Khmer names, materials, and descriptions. Use quotes for an exact phrase.",
      "ស្វែងរកតាមឈ្មោះ សម្ភារៈ និងការពិពណ៌នា ជាភាសាអង់គ្លេស ឬខ្មែរ។ ប្រើសញ្ញាសម្រង់សម្រាប់ឃ្លាជាក់លាក់។",
    ),
    clearSearch: t("Clear search", "សម្អាតការស្វែងរក"),
    suggestions: t("Search suggestions", "ការណែនាំការស្វែងរក"),
    filterLabel: t("Garment category", "ប្រភេទសម្លៀកបំពាក់"),
    all: t("All garments", "សម្លៀកបំពាក់ទាំងអស់"),
    lower: t("Lower body", "ផ្នែកខាងក្រោម"),
    upper: t("Upper body", "ផ្នែកខាងលើ"),
    ensemble: t("Ensembles", "ឈុត"),
    noneFound: t("No garments found", "រកមិនឃើញសម្លៀកបំពាក់ទេ"),
    resetAll: t("Reset search and filters", "កំណត់ការស្វែងរក និងតម្រងឡើងវិញ"),
    cardEnsemble: t("Ensemble", "ឈុត"),
    material: t("Material", "សម្ភារៈ"),
    readEntry: t("Read entry", "អានកំណត់ត្រា"),
  },
  community: {
    heading: t("Dresses and their stories", "សម្លៀកបំពាក់ និងរឿងរ៉ាវរបស់វា"),
    searchLabel: t("Search the entries", "ស្វែងរកកំណត់ត្រា"),
    placeholder: t("title, place…", "ចំណងជើង ទីកន្លែង…"),
    searchHint: t(
      "Search titles, stories, credits, makers, places, and materials in English or Khmer. Use quotes for an exact phrase.",
      "ស្វែងរកចំណងជើង រឿងរ៉ាវ ឈ្មោះអ្នកចែករំលែក អ្នកផលិត ទីកន្លែង និងសម្ភារៈ ជាភាសាអង់គ្លេស ឬខ្មែរ។ ប្រើសញ្ញាសម្រង់សម្រាប់ឃ្លាជាក់លាក់។",
    ),
    viewsLabel: t("Which entries to show", "កំណត់ត្រាណាដែលត្រូវបង្ហាញ"),
    allEntries: t("All entries", "កំណត់ត្រាទាំងអស់"),
    myEntries: t("My entries", "កំណត់ត្រារបស់ខ្ញុំ"),
    loadFailed: t("Entries could not be loaded", "មិនអាចផ្ទុកកំណត់ត្រាបានទេ"),
    loadFailedHelp: t("Please refresh the page to try again.", "សូមផ្ទុកទំព័រឡើងវិញដើម្បីព្យាយាមម្តងទៀត។"),
    noneMine: t("You have not written an entry yet", "អ្នកមិនទាន់បានសរសេរកំណត់ត្រាទេ"),
    none: t("No entries yet", "មិនទាន់មានកំណត់ត្រាទេ"),
    noneFound: t("No entries found", "រកមិនឃើញកំណត់ត្រាទេ"),
    resetSearch: t("Reset search", "កំណត់ការស្វែងរកឡើងវិញ"),
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

// "Your Username is @mary_k."
export function yourUsernameText(username) {
  return t(`Your Username is ${formatUsername(username)}.`, `ឈ្មោះអ្នកប្រើប្រាស់របស់អ្នកគឺ ${formatUsername(username)}។`);
}

// The rule under the Username field. The Username itself stays English letters (CONTEXT.md).
export function usernameHintText() {
  return t(
    `${USERNAME_MIN_LENGTH} to ${USERNAME_MAX_LENGTH} English letters, digits or underscore. Capitals are saved as lowercase. It is shown publicly with an @ in front; never type the @.`,
    `អក្សរអង់គ្លេស លេខ ឬសញ្ញាគូសបន្ទាត់ក្រោម ចំនួន ${USERNAME_MIN_LENGTH} ដល់ ${USERNAME_MAX_LENGTH} តួ។ អក្សរធំនឹងត្រូវរក្សាទុកជាអក្សរតូច។ វាបង្ហាញជាសាធារណៈដោយមាន @ នៅខាងមុខ កុំវាយ @ ។`,
  );
}

const USERNAME_MESSAGES_KM = {
  required: "សូមជ្រើសរើសឈ្មោះអ្នកប្រើប្រាស់។",
  "invalid-characters": "ប្រើតែអក្សរអង់គ្លេស លេខ និងសញ្ញាគូសបន្ទាត់ក្រោមប៉ុណ្ណោះ។ កុំវាយ @ ។",
  "too-short": `ប្រើយ៉ាងហោចណាស់ ${USERNAME_MIN_LENGTH} តួអក្សរ។`,
  "too-long": `ប្រើយ៉ាងច្រើនបំផុត ${USERNAME_MAX_LENGTH} តួអក្សរ។`,
  taken: "ឈ្មោះអ្នកប្រើប្រាស់នោះត្រូវបានគេយករួចហើយ។ សូមជ្រើសរើសឈ្មោះផ្សេង។",
  unknown: "យើងមិនអាចរក្សាទុកឈ្មោះអ្នកប្រើប្រាស់របស់អ្នកបានទេ។ សូមព្យាយាមម្តងទៀត។",
};

// An unknown reason reads like invalid characters, as getUsernameMessage does.
export function usernameMessageText(reason) {
  const km = Object.hasOwn(USERNAME_MESSAGES_KM, reason) ? USERNAME_MESSAGES_KM[reason] : USERNAME_MESSAGES_KM["invalid-characters"];
  return t(getUsernameMessage(reason), km);
}

const MONTHS_KM = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
const pad = (value) => String(value).padStart(2, "0");

// "17 November 2026 at 20:05 UTC", written by hand in UTC like formatAllowedAt.
export function allowedAtText(date) {
  const km = `${date.getUTCDate()} ${MONTHS_KM[date.getUTCMonth()]} ${date.getUTCFullYear()} ម៉ោង ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`;
  return t(formatAllowedAt(date), km);
}

// What to tell a Contributor whose Username change was refused.
export function changeMessageText(result) {
  const en = getChangeMessage(result);
  if (result.reason === "too-soon") {
    return t(en, `អ្នកបានប្តូរឈ្មោះអ្នកប្រើប្រាស់ថ្មីៗនេះ។ អ្នកអាចប្តូរម្តងទៀតចាប់ពី ${allowedAtText(result.allowedAt).km}។`);
  }
  if (result.reason === "unchanged") return t(en, "នោះជាឈ្មោះអ្នកប្រើប្រាស់របស់អ្នករួចហើយ។ សូមវាយឈ្មោះផ្សេង។");
  return usernameMessageText(result.reason);
}

// The question asked before a change is sent, and the warning about the wait.
export function confirmText(username, now = new Date()) {
  const english = getConfirmMessage(username, now);
  const endsAt = waitEndsAt(now);
  const date = `${endsAt.getUTCDate()} ${MONTHS_KM[endsAt.getUTCMonth()]} ${endsAt.getUTCFullYear()}`;
  return {
    question: t(english.question, `តើអ្នកប្រាកដថាចង់ប្តូរឈ្មោះអ្នកប្រើប្រាស់ទៅជា ${formatUsername(username)} មែនទេ?`),
    warning: t(english.warning, `អ្នកមិនអាចប្តូរម្តងទៀតបានក្នុងរយៈពេល ${USERNAME_CHANGE_WAIT_DAYS} ថ្ងៃ រហូតដល់ប្រហែល ${date}។`),
  };
}

const RESEND_KM = {
  sent: "ប្រសិនបើអាសយដ្ឋាននេះត្រូវការការបញ្ជាក់ អ៊ីមែលមួយនឹងមកដល់ក្នុងពេលឆាប់ៗនេះ។",
  rateLimited: "មានការស្នើសុំច្រើនពេក។ សូមរង់ចាំមុនស្នើសុំអ៊ីមែលមួយទៀត។",
  failed: "យើងមិនអាចផ្ញើសារបានទេនៅពេលនេះ។ សូមពិនិត្យអាសយដ្ឋាន ឬព្យាយាមម្តងទៀតពេលក្រោយ។",
};

// Same choice as getConfirmationResendMessage in lib/authConfirmation.js.
export function resendMessageText(error) {
  if (!error) return t(getConfirmationResendMessage(error), RESEND_KM.sent);
  const limited = error.code === "over_email_send_rate_limit" || error.status === 429;
  return t(getConfirmationResendMessage(error), limited ? RESEND_KM.rateLimited : RESEND_KM.failed);
}

// The Resend button while it counts down.
export function retryInText(seconds) {
  return t(`Try again in ${seconds}s`, `ព្យាយាមម្តងទៀតក្នុង ${seconds} វិនាទី`);
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

// "Source recorded by <curator>". The curator's name is shown as it is configured.
export function bylineText(curator) {
  return t(`Source recorded by ${curator}`, `ប្រភពត្រូវបានកត់ត្រាដោយ ${curator}`);
}

// The hero photo's caption, from its Official record. Maker and place are shown as stored.
export function heroCaptionText(garment) {
  return t(
    `${garment.nameEn}, made by ${garment.maker} in ${garment.place}.`,
    `${garment.nameKh} ផលិតដោយ ${garment.maker} នៅ ${garment.place}។`,
  );
}

// "showing 3 of 8 entries", under both the Official and the Community search.
export function countText(shown, total) {
  return t(`showing ${shown} of ${total} entries`, `កំពុងបង្ហាញ ${shown} ក្នុងចំណោម ${total} កំណត់ត្រា`);
}

const GARMENT_KINDS = {
  all: ["garments", "សម្លៀកបំពាក់"],
  lower: ["lower body garments", "សម្លៀកបំពាក់ផ្នែកខាងក្រោម"],
  upper: ["upper body garments", "សម្លៀកបំពាក់ផ្នែកខាងលើ"],
  ensemble: ["ensembles", "ឈុត"],
};

// The Official collection's empty state. The search is shown as typed (spaces at the ends trimmed).
export function emptyGarmentsText(category, query) {
  const [en, km] = GARMENT_KINDS[category];
  const shown = query.trim();
  return t(
    `No ${en} match “${shown}”. Try a different name or material.`,
    `គ្មាន${km}ត្រូវនឹង “${shown}” ទេ។ សូមសាកល្បងឈ្មោះ ឬសម្ភារៈផ្សេង។`,
  );
}

// The Community tab's empty state, shown when a search finds nothing.
export function emptyEntriesText(query) {
  const shown = query.trim();
  return t(
    `No entries match “${shown}”. Try a different word, or search in English or Khmer.`,
    `គ្មានកំណត់ត្រាត្រូវនឹង “${shown}” ទេ។ សូមសាកល្បងពាក្យផ្សេង ឬស្វែងរកជាភាសាអង់គ្លេស ឬខ្មែរ។`,
  );
}
