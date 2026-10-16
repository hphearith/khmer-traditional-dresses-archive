# Removing an account's photos by hand

Deleting an account in Supabase removes its entries (`entries.owner` is
`on delete cascade`) and its Username, but **not** its photo files. Nothing in
the database can delete files from Storage, so this is a manual step. Do it
**before** deleting the account, because the account's id is how you find its
folder.

## Where the photos are

- Storage area (bucket): **`photos`**, a public bucket.
- Layout: `photos/<user id>/<uuid>.<extension>`, for example
  `photos/5f0c1c64-1b7a-4d6e-9d52-3f1d7f6f0a11/0b9c7a52-8d34-4b8e-a0b7-6c1f2d9e4a33.jpg`.
- `<user id>` is the account's id from Authentication. It is the first folder of
  every path, and it is the only place that account can write to.
- A file's name is a random uuid, never the original filename, so you cannot
  recognise a photo by its name. The folder is the owner.

## Steps

1. In the Supabase dashboard open **Authentication → Users**, find the account
   by email and copy its **User UID**. Do not delete the account yet.
2. Open **Storage → Buckets → `photos`** and open the folder named exactly that
   User UID. If there is no such folder, the account never uploaded a photo:
   skip to step 6.
3. Tick the checkbox at the top of the file list to select every file, then
   choose **Delete** and confirm. Do this in the dashboard, not with SQL:
   deleting rows from `storage.objects` leaves the stored files behind.
4. Go back to **Storage → Buckets → `photos`**. The folder should be gone. If it
   is still listed, open it and repeat step 3 until it is empty.
5. In **SQL Editor**, confirm nothing is left. Replace `<USER_ID>` and run:

   ```sql
   select name from storage.objects
   where bucket_id = 'photos' and (storage.foldername(name))[1] = '<USER_ID>';
   -- expect: no rows
   ```

6. Now delete the account in **Authentication → Users**. Its entries go with it.

## If the account was already deleted

Its folder is still in the bucket, named with an id that no longer matches any
user. Find the orphaned folders by comparing the folder names in **Storage →
Buckets → `photos`** with the User UIDs in **Authentication → Users**, or run:

```sql
select distinct (storage.foldername(name))[1] as folder
from storage.objects
where bucket_id = 'photos'
  and (storage.foldername(name))[1] not in (select id::text from auth.users);
```

Delete each folder the query lists with step 3, in the dashboard.

## Stray files from the app

The app removes a photo when its entry is deleted or the photo is replaced, and
logs `console.error` ("Removing the photo … failed", "… removed no file" or
"… did not finish") when that did not work. The Contributor is not told. A stray
file can also appear with no log at all: if a delete or a save times out, the
app cannot know whether it went through, so it does not touch the file. Find
strays in the logs or with the folder comparison above, and remove one the same
way (step 3, one file).
