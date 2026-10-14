-- Contributor entries: attach one photo (issue #16).
--
-- FOR THE STUDENT TO REVIEW AND RUN in the Supabase dashboard (SQL Editor),
-- after supabase/entries.sql, entries-edit.sql and entries-delete.sql. The
-- agent never runs this against the live project. It is safe to run again.
--
-- WARNING, step 1 DELETES every entry that has no photo. Until now no entry
-- could have one, so this removes the text-only test entries from issue #13
-- (and any real entry written before this ticket). Look first:
--   select id, title, owner from public.entries where photo_path is null;
--
-- How it fits together:
--   1. Every entry must have a photo: photo_path is not null, and it must sit
--      in the owner's own folder, so an entry cannot point at someone else's file.
--   2. The photos live in a public bucket named "photos". Anyone, including a
--      guest with no auth cookie, can view a photo from its public URL. Public
--      means "viewable by link"; it does not let anyone list, upload or delete.
--   3. The bucket itself refuses anything but JPEG, PNG and WebP, and anything
--      over 5 MB (5242880 bytes). lib/photo.js applies the same limits in the
--      form. Change both together.
--   4. Each file is stored at <user id>/<uuid>.<extension>. A signed-in account
--      can upload to, see and delete from its own folder only. A direct call to
--      another account's folder is refused.
--   5. A new entry can now write photo_path. An edit still cannot (see
--      supabase/entries-edit.sql): replacing a photo is issue #17.

-- ---------------------------------------------------------------------------
-- 1. The entries table requires a photo.
-- ---------------------------------------------------------------------------
delete from public.entries where photo_path is null;

alter table public.entries alter column photo_path set not null;

-- The path is <owner id>/<file name>: the first folder is the owner's.
alter table public.entries drop constraint if exists entries_photo_path_owner;
alter table public.entries add constraint entries_photo_path_owner
  check (photo_path like owner::text || '/_%');

-- A new entry may now set photo_path. Granting a column again changes nothing.
grant insert (owner, title, story, credited_as, occasion, year, maker, place, materials, photo_path)
  on public.entries to authenticated;

-- ---------------------------------------------------------------------------
-- 2. The storage area: a public bucket with the type and size limits.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- 3. Who may write: the owner, in their own folder only.
-- storage.foldername(name)[1] is the first folder of the path, which is the
-- user id. A public bucket serves its files by URL without any select policy.
-- The select policy below is for the owner only: Storage's remove() needs
-- select as well as delete, so without it a delete would silently remove nothing.
-- It lets nobody list or read another account's folder through the API.
-- ---------------------------------------------------------------------------
drop policy if exists "Owners upload photos to their own folder" on storage.objects;
create policy "Owners upload photos to their own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Owners see photos in their own folder" on storage.objects;
create policy "Owners see photos in their own folder"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Owners delete photos from their own folder" on storage.objects;
create policy "Owners delete photos from their own folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
