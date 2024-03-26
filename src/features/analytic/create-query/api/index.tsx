import { createSupabaseDOClient } from "lib/supabase";

const REQUEST_SELECT = "request,visualization,title";

export const fetchUserQueries = (userId: number) => {
  if (!userId) return;
  const supabase = createSupabaseDOClient();

  return supabase
    .from("queries")
    .select(REQUEST_SELECT)
    .eq("user", userId)
    .then((response) => {
      if (response.data) {
        const queries = response.data.map((query) => {
          const unformattedVisualization = JSON.parse(query.visualization);
          return { ...query, visualization: unformattedVisualization };
        });
        return queries;
      }
    });
};

export const fetchAllQueries = (input: string) => {
  const supabase = createSupabaseDOClient();
  let query = supabase.from("queries").select(REQUEST_SELECT);
  if (input) query = query.ilike("title", `%${input}%`);

  return query.then((response) => {
    if (response.data) {
      return response.data;
    }
  });
};
