-- Fix: restrict SELECT on search_history so each visitor can only read
-- their own rows. The previous policy allowed any anon/authenticated user
-- to read ALL rows from the past 30 days (information leak).
--
-- Strategy: visitor_id is a client-supplied opaque token (not auth.uid()).
-- We surface it as a session cookie / localStorage token on the client and
-- pass it via a Supabase RPC or the PostgREST header `request.header.x-visitor-id`.
-- Until full auth is wired, we use the anon pattern: the INSERT policy already
-- enforces a non-empty visitor_id, so we restrict SELECT to the same token
-- stored in the Postgres session variable `app.current_visitor_id`, which the
-- client sets via `supabase.rpc('set_visitor_id', { vid: visitorId })` before
-- each SELECT.  Service-role bypass remains unrestricted.

-- Drop the broad "all recent rows" policy.
DROP POLICY IF EXISTS "Public can read recent search entries" ON public.search_history;

-- Narrow SELECT: only rows matching the requesting visitor's id.
-- The visitor_id must have been set for this session; if not, no rows return.
CREATE POLICY "Visitors read own search entries"
  ON public.search_history FOR SELECT
  TO anon, authenticated
  USING (
    visitor_id = current_setting('app.current_visitor_id', true)
    AND created_at > now() - interval '30 days'
  );

-- Helper RPC so clients can safely set the session variable (no privilege escalation risk).
CREATE OR REPLACE FUNCTION public.set_visitor_id(vid text)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  IF vid IS NULL OR char_length(vid) NOT BETWEEN 3 AND 64 THEN
    RAISE EXCEPTION 'Invalid visitor_id length';
  END IF;
  PERFORM set_config('app.current_visitor_id', vid, true); -- true = transaction-local
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_visitor_id(text) TO anon, authenticated;

COMMENT ON POLICY "Visitors read own search entries" ON public.search_history IS
  'Each visitor can only SELECT their own rows. Call set_visitor_id(vid) in the same transaction before querying.';
