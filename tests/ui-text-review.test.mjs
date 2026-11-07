import assert from "node:assert/strict";
import test from "node:test";
import { isPair } from "../lib/bilingual.js";
import { TEXT, decisionDoneText, submittedText } from "../lib/uiText.js";

test("a new entry's confirmation keeps the curator's English word for word", () => {
  assert.equal(
    TEXT.review.submitted.en,
    "Your post has been submitted for review. Check My entries to see when it is published or returned.",
  );
});

test("a new entry's confirmation promises no notification, because the app sends none", () => {
  assert.doesNotMatch(TEXT.review.submitted.en, /notif/i);
  assert.doesNotMatch(TEXT.review.submitted.km, /ការជូនដំណឹង/);
});

test("the entry form no longer promises an entry or an edit goes public at once", () => {
  assert.doesNotMatch(TEXT.page.writeIntro.en, /public as soon as/);
  assert.doesNotMatch(TEXT.page.editIntro.en, /go live only when/);
});

test("every Review queue text is a pair with both languages", () => {
  const texts = Object.entries(TEXT.review.queue);
  assert.notEqual(texts.length, 0);
  for (const [name, text] of texts) assert.equal(isPair(text), true, name);
});

test("the Review queue texts use the words the spec chose", () => {
  assert.equal(TEXT.review.queue.title.en, "Review queue");
  assert.equal(TEXT.review.queue.notReviewer.en, "This page is for reviewers.");
  assert.equal(TEXT.review.queue.empty.en, "No entries are waiting for review.");
});

// Phnom Penh is UTC+7 all year (no daylight saving), so each expected date below
// is worked out by hand: add seven hours to the UTC time.
test("the submitted date is an English and Khmer pair, with Western digits", () => {
  const text = submittedText("2026-10-25T10:00:00Z");
  assert.equal(isPair(text), true);
  assert.equal(text.en, "Submitted 25 October 2026");
  assert.equal(text.km, "បានដាក់ស្នើនៅថ្ងៃទី 25 ខែតុលា ឆ្នាំ 2026");
});

test("the submitted date reads the timestamp the way Supabase sends it", () => {
  assert.deepEqual(submittedText("2026-10-25T10:00:00.123456+00:00"), submittedText("2026-10-25T10:00:00Z"));
});

test("a submission just before midnight UTC is already the next day in Phnom Penh", () => {
  // 23:30 UTC on 31 October is 06:30 on 1 November in Phnom Penh: the day and the month both move on.
  const text = submittedText("2026-10-31T23:30:00Z");
  assert.equal(text.en, "Submitted 1 November 2026");
  assert.equal(text.km, "បានដាក់ស្នើនៅថ្ងៃទី 1 ខែវិច្ឆិកា ឆ្នាំ 2026");
});

test("the submitted date changes day exactly at midnight in Phnom Penh", () => {
  assert.equal(submittedText("2026-10-31T16:59:59Z").en, "Submitted 31 October 2026"); // 23:59:59 in Phnom Penh
  assert.equal(submittedText("2026-10-31T17:00:00Z").en, "Submitted 1 November 2026"); // 00:00:00 in Phnom Penh
});

test("the live line after a decision names the decision and the entry, in both languages", () => {
  assert.deepEqual(decisionDoneText("published", "Waiting politely"), {
    en: "Published: Waiting politely",
    km: "បានផ្សាយ៖ Waiting politely",
  });
  assert.deepEqual(decisionDoneText("returned", "Waiting politely"), {
    en: "Returned: Waiting politely",
    km: "បានបញ្ជូនត្រឡប់មកវិញ៖ Waiting politely",
  });
});

test("the live line keeps the title exactly as written: Khmer, spaces, a zero-width space, markup", () => {
  for (const title of ["សំពត់ហូល", "  ឈុត\u200bអាពាហ៍ពិពាហ៍  ", "<script>alert(1)</script> & \"quotes\"", "Sampot Hol សំពត់ហូល"]) {
    for (const decision of ["published", "returned"]) {
      const text = decisionDoneText(decision, title);
      assert.equal(isPair(text), true, title);
      assert.equal(text.en.endsWith(`: ${title}`), true, `en: ${JSON.stringify(title)}`);
      assert.equal(text.km.endsWith(`៖ ${title}`), true, `km: ${JSON.stringify(title)}`);
    }
  }
});

test("the decision buttons and the failure message use the words the spec chose, each in both languages", () => {
  assert.equal(TEXT.review.queue.publish.en, "Publish");
  assert.equal(TEXT.review.queue.publish.km, "ផ្សាយ");
  assert.equal(TEXT.review.queue.return.en, "Return");
  assert.equal(TEXT.review.queue.return.km, "បញ្ជូនត្រឡប់");
  assert.equal(
    TEXT.review.queue.decisionFailed.en,
    "This entry could not be changed. It may already have been reviewed in another tab. Refresh the page to see the queue as it is now.",
  );
  for (const name of ["publish", "return", "decisionFailed"]) assert.equal(isPair(TEXT.review.queue[name]), true, name);
});

test("a Reviewer's write intro keeps the first sentence and says nothing about review, with no new Khmer", () => {
  const { writeIntro, writeIntroReviewer } = TEXT.page;
  assert.equal(writeIntroReviewer.en, "Tell the story of one dress you ordered or had made, in Khmer, English or both.");
  assert.equal(writeIntro.en.startsWith(writeIntroReviewer.en), true);
  // Cut from the Contributor's Khmer at its sentence break, so a Khmer reader has nothing new to check.
  assert.equal(writeIntroReviewer.km.endsWith("។"), true);
  assert.equal(writeIntro.km.startsWith(writeIntroReviewer.km), true);
  assert.doesNotMatch(writeIntroReviewer.en, /review/i);
  assert.doesNotMatch(writeIntroReviewer.km, /ពិនិត្យ/);
  // A Contributor's text stays as it was.
  assert.match(writeIntro.en, /Your entry is reviewed before it is published\.$/);
  assert.match(writeIntro.km, /ពិនិត្យ/);
});

test("every status has a short pill pair in both languages, and nothing else does", () => {
  const statuses = ["pending", "published", "returned"];
  assert.deepEqual(Object.keys(TEXT.review.pill).sort(), statuses);
  for (const status of statuses) assert.equal(isPair(TEXT.review.pill[status]), true, status);
});

test("the pills use the words the ticket chose", () => {
  assert.deepEqual(TEXT.review.pill.pending, { en: "Pending", km: "កំពុងរង់ចាំការពិនិត្យ" });
  assert.deepEqual(TEXT.review.pill.published, { en: "Published", km: "បានផ្សាយ" });
  assert.deepEqual(TEXT.review.pill.returned, { en: "Returned", km: "បានបញ្ជូនត្រឡប់មកវិញ" });
});

test("the Published and Returned pills use the same Khmer word as the Reviewer's live line", () => {
  const word = (text) => text.km.split("៖")[0];
  assert.equal(TEXT.review.pill.published.km, word(decisionDoneText("published", "x")));
  assert.equal(TEXT.review.pill.returned.km, word(decisionDoneText("returned", "x")));
});

test("the Returned hint begins with the Returned pill's words, in both languages", () => {
  assert.equal(isPair(TEXT.review.returnedHint), true);
  assert.equal(TEXT.review.returnedHint.en.startsWith(`${TEXT.review.pill.returned.en}:`), true);
  // The hint is "<word>៖ <what to do>"; the word before the colon is the pill's.
  assert.equal(TEXT.review.returnedHint.km.startsWith(`${TEXT.review.pill.returned.km}៖`), true);
});
