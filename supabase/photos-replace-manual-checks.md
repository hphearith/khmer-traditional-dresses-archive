# Contributor entries: replace and clean up photos, manual checks (issue #17)

The access rules live in the database and in Supabase Storage, and the repo
holds no credentials, so they are checked **by hand** after running
`supabase/photos-replace.sql` in the Supabase SQL Editor. Nothing below has been
run yet: report results as manually verified, not automated. The photo-change
rules in `lib/photo.js` (`validatePhotoChange`) are automated
(`node --test tests/`). The storage removal check (`removePhoto` in
`lib/photoStorage.js`) is verified only by the steps here.

Use the two confirmed test accounts A and B and the variables from
`entries-manual-checks.md` and `photos-manual-checks.md` (`<ID_A>`, `<ID_B>`,
`$TOKEN_A`, `$TOKEN_B`, `$BASE`, `$KEY`; never commit a token), plus two small
photos `one.jpg` and `two.jpg`, `big.jpg` (over 5 MB) and `note.txt`. Create an
entry as A with `one.jpg` first (the app, `/contribute`).

## 1. The grant (SQL Editor)

Running `photos-replace.sql` twice must not fail. The owner's own replacement is
checked in the app (section 3). With A's entry id `<ENTRY_A>`, everything else
must be refused:

```bash
# B tries to repoint A's entry: expect [] (no row matched), A's entry unchanged
curl -X PATCH "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries?id=eq.<ENTRY_A>" -H "apikey: $KEY" \
  -H "Authorization: Bearer $TOKEN_B" -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"photo_path":"<ID_B>/x.jpg"}'

# A tries to point their own entry at B's folder: expect violates check constraint "entries_photo_path_owner"
curl -X PATCH "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries?id=eq.<ENTRY_A>" -H "apikey: $KEY" \
  -H "Authorization: Bearer $TOKEN_A" -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"photo_path":"<ID_B>/x.jpg"}'

# A tries to clear the photo: expect null value ... violates not-null constraint
curl -X PATCH "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries?id=eq.<ENTRY_A>" -H "apikey: $KEY" \
  -H "Authorization: Bearer $TOKEN_A" -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"photo_path":null}'

# A guest tries: expect refused (permission denied or [])
curl -X PATCH "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries?id=eq.<ENTRY_A>" -H "apikey: $KEY" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" -d '{"photo_path":"<ID_A>/x.jpg"}'
```

Photo files: the storage rules are the ones already checked in
`photos-manual-checks.md` section 3 (B and a guest cannot delete A's file; A
can). Repeat the "B cannot delete A's photo" call once more here, now that
`removePhoto` relies on it.

## 2. A refused storage delete is caught (the key check)

A refused delete is not an error: storage answers 200 with `[]`. With the app's
browser console open (or the dev server's terminal), make a removal that
storage refuses, for example by temporarily dropping the policy
"Owners delete photos from their own folder" in a scratch project, then delete
an entry as A.

- expect: the entry is deleted, `console.error` shows
  `Removing the photo <path> removed no file`, the file is still in Storage, and
  no message claims the photo was removed.
- Put the policy back (re-run `photos.sql`).

## 3. In the app (as A, entry with `one.jpg`)

1. Open **Edit** on the entry: the current photo is shown, the file input says
   leaving it empty keeps the photo, and the consent box says it is required with
   a new photo.
2. Change only the title and Save changes: you return to the Community tab, the
   title changed and the photo is the same. In Storage the folder still holds
   exactly the one file.
3. Edit again, choose `two.jpg` and leave the box unticked, Save: the consent
   message shows in place and nothing is uploaded.
4. Choose `note.txt`, then `big.jpg`: each is refused with a clear message.
5. Choose `two.jpg`, tick the box, Save: the card now shows `two.jpg`, and
   Storage → photos → `<ID_A>` holds only the new file (the old one is gone).
6. The edit form has no way to clear the photo without choosing a new one.
7. As B, open `/contribute/<ENTRY_A>/edit`: "You can only change entries you
   wrote", no form.
8. Replace failing after the upload (turn the network offline right after
   choosing the file, or point `entries` at a scratch project with the table
   renamed): the form says the entry was not saved, the old photo is still on the
   entry, and the new file is not left in Storage when the database refused it.
9. Delete the entry as A: it leaves the Community tab and My entries, and its file
   is gone from Storage → photos → `<ID_A>`.
10. Follow `agent_docs/removing_account_photos.md` for a throwaway account that
    has one photo, and confirm the folder is gone afterwards and the final SQL
    check returns no rows.

## Verified so far

These were checked by hand by the student, not by an automated test.

| Date | Section | What was checked | Result |
| --- | --- | --- | --- |
| 2026-10-16 | 3, steps 1-10 | Edit shows the current photo; saving without a new photo keeps it; a new photo needs the consent box; a wrong type or an oversized file is refused; a new photo replaces the old one and the old file is gone from Storage; the photo cannot be cleared without replacing it; another account gets "You can only change entries you wrote"; a refused save leaves the old photo and no stray new file; deleting an entry removes its file; the account-photo procedure in `agent_docs/removing_account_photos.md` works | Pass |
| not yet | 1 | Direct calls: another account, a guest, a foreign folder or a null `photo_path` are refused | Not run |
| not yet | 2 | A refused storage delete is logged with `console.error` and the file stays | Not run |

Until sections 1 and 2 are run, the acceptance criteria "Only the owner can replace or delete photos, even by a direct call" and "Storage deletions check what came back" are covered by the code and its comments only, not by a manual check.
