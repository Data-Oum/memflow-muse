CREATE TABLE public.search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  source text NOT NULL CHECK (source IN ('mem0_demo','voice_chat','project_filter')),
  query text NOT NULL CHECK (char_length(query) BETWEEN 1 AND 500),
  result_count integer,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX search_history_visitor_recent_idx ON public.search_history (visitor_id, created_at DESC);
CREATE INDEX search_history_source_recent_idx ON public.search_history (source, created_at DESC);

GRANT SELECT, INSERT ON public.search_history TO anon, authenticated;
GRANT ALL ON public.search_history TO service_role;

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert search entries"
  ON public.search_history FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    visitor_id IS NOT NULL
    AND char_length(visitor_id) BETWEEN 3 AND 64
    AND source IN ('mem0_demo','voice_chat','project_filter')
  );

CREATE POLICY "Public can read recent search entries"
  ON public.search_history FOR SELECT
  TO anon, authenticated
  USING (created_at > now() - interval '30 days');