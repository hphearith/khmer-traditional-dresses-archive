-- Contributor entries: every Return carries a Return note (issue #66, part of #43).
--
-- NOT YET RUN. Run it by hand in the Supabase dashboard (SQL Editor), leaving out
-- the commented undo block at the end, then work through
-- entries-return-note-manual-checks.md and record the date there. It adds one
-- column, replaces review_entry, and changes nothing else. It is safe to run
-- again: the second run changes nothing.
--
-- AFTER RUNNING IT, DO NOT PRESS RETURN ON THE LIVE SITE until issue #67 (the
-- screens) is deployed. The deployed code still calls review_entry with two
-- arguments. Publish keeps working, because the note defaults to null; Return is
-- refused, because it has no note.
--
-- How it fits together:
--   1. return_note holds the Reviewer's own words for the Contributor (see
--      "Return note" in CONTEXT.md). It is nullable: entries Returned before this
--      file have none, and that is allowed. No constraint ties a Returned status
--      to a note, because those rows would make this file fail.
--   2. The column gets no insert or update grant. Since entries.sql, insert and
--      update have only ever been granted column by column (entries-edit.sql,
--      entries-status.sql, photos.sql, photos-replace.sql and
--      entries-reviewer-publish.sql each name their columns), so a Contributor
--      can neither write nor erase a Return note. Through the API only
--      review_entry, which runs as its owner (security definer), writes it.
--      service_role, which the site never uses, can still write every column.
--   3. Select IS granted on the whole table (entries.sql), so the new column is
--      readable on every row row-level security shows. Pending and Returned rows
--      are hidden from everyone but their Contributor and Reviewers, but a
--      Published row is shown to anyone. That is why Publish clears the note in
--      the same update: a note left on a Published row would be public.
--   4. The two-argument review_entry(uuid, text) is dropped. Postgres treats a
--      different argument list as a different function, so leaving it would keep
--      a way to Return with no note.
--   5. The new review_entry answers true or false exactly as before: true only
--      when it changed the row. Every refusal is false: not a Reviewer, an
--      unknown decision, an entry that is not Pending, a Return whose note is
--      missing, blank or over 500 characters, or a Publish that sends a note.
--   6. The note is trimmed of spaces, tabs and newlines at its two ends only.
--      Nothing inside it changes, and no Khmer character is ever removed.
--      char_length counts one per character (code point), as the browser's
--      maxLength does, so 500 means the same thing on both sides.
--   7. When the Contributor edits a Returned entry, it becomes Pending and keeps
--      its Return note, so the Reviewer can see what was asked. A later Return
--      replaces it. Deleting the entry removes it with the row.
--
-- To undo: the block at the end of this file puts back the two-argument
-- function and removes the column. It puts the function back as review-gate.sql
-- wrote it, which was never compared with the live one: section 1 of the
-- manual checks saves the live text first, and that text is what to restore. Undoing loses every Return note, and once
-- #67 is deployed it also stops Return working on the site.

begin;

alter table public.entries add column if not exists return_note text;

drop function if exists public.review_entry(uuid, text);

create or replace function public.review_entry(entry_id uuid, decision text, note text default null)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  trimmed_note text := btrim(note, E' \t\n\r');
begin
  if not public.is_reviewer() then
    return false;
  end if;

  if decision = 'returned' then
    if trimmed_note is null or char_length(trimmed_note) not between 1 and 500 then
      return false;
    end if;
    update public.entries set status = 'returned', return_note = trimmed_note
      where id = entry_id and status = 'pending';
    return found;
  end if;

  if decision = 'published' then
    if note is not null then
      return false;
    end if;
    update public.entries set status = 'published', return_note = null
      where id = entry_id and status = 'pending';
    return found;
  end if;

  return false;
end;
$$;

revoke execute on function public.review_entry(uuid, text, text) from public, anon;
grant execute on function public.review_entry(uuid, text, text) to authenticated;

commit;

-- ---------------------------------------------------------------------------
-- Undo, only if this change causes a problem. Remove the comment marks and run
-- these lines on their own. The function is review_entry as review-gate.sql
-- created it.
--
-- begin;
-- drop function if exists public.review_entry(uuid, text, text);
-- create or replace function public.review_entry(entry_id uuid, decision text)
-- returns boolean
-- language plpgsql
-- security definer
-- set search_path = ''
-- as $$
-- begin
--   if not public.is_reviewer() then
--     return false;
--   end if;
--   if decision not in ('published', 'returned') then
--     return false;
--   end if;
--   update public.entries set status = decision
--     where id = entry_id and status = 'pending';
--   return found;
-- end;
-- $$;
-- revoke execute on function public.review_entry(uuid, text) from public, anon;
-- grant execute on function public.review_entry(uuid, text) to authenticated;
-- alter table public.entries drop column if exists return_note;
-- commit;
-- ---------------------------------------------------------------------------
