# Contributor entries: photo manual checks (issue #16)

The photo rules live in the database and in Supabase Storage, and the repo holds
no credentials, so they are checked **by hand** after running
`supabase/photos.sql` in the Supabase SQL Editor. Report the results as manually
verified, not automated. The type, size, consent and path rules in `lib/photo.js`
are automated (`node --test tests/`).

Note: once `photos.sql` has run, every insert into `entries` needs a valid
`photo_path`. The insert examples in `supabase/entries-manual-checks.md` that
omit it now fail with a not-null error; that is expected.

You need the two confirmed test accounts A and B from `entries-manual-checks.md`
(`<ID_A>`, `<ID_B>`, `$TOKEN_A`; never commit a token), and any small `photo.jpg`
(under 5 MB), `big.jpg` (over 5 MB) and `note.txt` on disk.

## 1. The table (SQL Editor)

```sql
insert into public.entries (owner, title, story) values ('<ID_A>', 'no photo', 'x');
-- expect: ERROR null value in column "photo_path" violates not-null constraint

insert into public.entries (owner, title, story, photo_path) values ('<ID_A>', 'wrong folder', 'x', '<ID_B>/a.jpg');
-- expect: ERROR violates check constraint "entries_photo_path_owner"

insert into public.entries (owner, title, story, photo_path) values ('<ID_A>', 'own folder', 'x', '<ID_A>/a.jpg');
-- expect: success. Clean up: delete from public.entries where title = 'own folder';
```

## 2. The bucket

Storage → Buckets → `photos`: public, 5 MB limit, allowed types image/jpeg,
image/png, image/webp. Running `photos.sql` twice must not fail.

## 3. Access rules (from a terminal)

```bash
BASE="$NEXT_PUBLIC_SUPABASE_URL/storage/v1/object"
KEY="$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"

# A uploads into A's own folder
curl -X POST "$BASE/photos/<ID_A>/check-1.jpg" -H "apikey: $KEY" -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: image/jpeg" --data-binary @photo.jpg
# expect: 200 with a Key

# A guest can view it, with no cookie and no key
curl -I "$BASE/public/photos/<ID_A>/check-1.jpg"
# expect: 200, content-type image/jpeg

# A cannot upload into B's folder
curl -X POST "$BASE/photos/<ID_B>/forged.jpg" -H "apikey: $KEY" -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: image/jpeg" --data-binary @photo.jpg
# expect: 403 new row violates row-level security policy

# A guest cannot upload
curl -X POST "$BASE/photos/<ID_A>/guest.jpg" -H "apikey: $KEY" -H "Content-Type: image/jpeg" --data-binary @photo.jpg
# expect: 400/403 row-level security (or unauthorized)

# The bucket refuses a wrong type and an oversized file
curl -X POST "$BASE/photos/<ID_A>/note.jpg" -H "apikey: $KEY" -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: text/plain" --data-binary @note.txt
# expect: 415 mime type text/plain is not supported
curl -X POST "$BASE/photos/<ID_A>/big.jpg" -H "apikey: $KEY" -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: image/jpeg" --data-binary @big.jpg
# expect: 413 The object exceeded the maximum allowed size

# B cannot delete A's photo (a refused delete is not an error: it removes nothing)
curl -X DELETE "$BASE/photos/<ID_A>/check-1.jpg" -H "apikey: $KEY" -H "Authorization: Bearer $TOKEN_B"
# expect: the file is still viewable afterwards (repeat the guest curl above)

# A guest cannot delete A's photo
curl -X DELETE "$BASE/photos/<ID_A>/check-1.jpg" -H "apikey: $KEY"
# expect: refused; the file is still viewable

# A can delete A's own photo
curl -X DELETE "$BASE/photos/<ID_A>/check-1.jpg" -H "apikey: $KEY" -H "Authorization: Bearer $TOKEN_A"
# expect: 200; the guest curl now gives 400/404
```

## 4. In the app

1. Open `/contribute` signed in. Photo and the consent box are marked required before you submit.
2. Press Save entry empty: the title, story, photo and consent each show a message in place.
3. Choose `note.txt`, then `big.jpg`: each is refused with a clear message, nothing is uploaded.
4. Choose `photo.jpg`, tick the box, save: you return to the Community tab and the photo shows on the card.
5. Open the home page in a private window (a guest): the photo shows, and no auth cookie is set.
6. Check the file path in Storage → photos: `<your user id>/<uuid>.jpg`, not the original filename.
7. Force a refused save after an upload (for example turn the network offline right after choosing
   the photo, or temporarily rename the `entries` table in a scratch project): the form says the
   entry was not saved, and the new file is gone from Storage when the database refused it.
8. Edit an existing entry: there is no photo or consent field, and saving still works.
