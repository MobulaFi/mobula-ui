import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Postbula } from "./postbula";

let supabaseDO: SupabaseClient;

const createSupabaseDOClient = (settings?: { noCache: boolean }) => {
  if (settings && settings.noCache) {
    return new Postbula(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidW5hdXRoZW50aWZpZWQifQ.Fwr7hObDoGDsWDgmfMX8-xVqHoP-4f_DrAR3apJKIrw",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidW5hdXRoZW50aWZpZWQifQ.Fwr7hObDoGDsWDgmfMX8-xVqHoP-4f_DrAR3apJKIrw",
      process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:3000",
      { headers: { "Cache-Control": "no cache" } }
    );
  }
  if (!supabaseDO) {
    supabaseDO = new Postbula(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidW5hdXRoZW50aWZpZWQifQ.Fwr7hObDoGDsWDgmfMX8-xVqHoP-4f_DrAR3apJKIrw",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidW5hdXRoZW50aWZpZWQifQ.Fwr7hObDoGDsWDgmfMX8-xVqHoP-4f_DrAR3apJKIrw",
      process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:3000"
    );
  }
  return supabaseDO;
};

export { createSupabaseDOClient };

export const createPairsSupabaseClient = () => new MetaSupabase();

export class MetaSupabase {
  clusters: { [index: string]: SupabaseClient };

  tables: { [index: string]: string[] };

  constructor() {
    this.tables = {
      "pairs-1": ["0x0", "0x1", "0x2", "0x3"],
      "pairs-2": ["0x4", "0x5", "0x6", "0x7"],
      "pairs-3": ["0x8", "0x9", "0xa", "0xb"],
      "pairs-4": ["0xc", "0xd", "0xe", "0xf"],
    };

    this.clusters = {
      "pairs-1": createClient(
        "https://yggsdmqfwpntpjbdnpfo.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZ3NkbXFmd3BudHBqYmRucGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY5NDMxNzksImV4cCI6MTk4MjUxOTE3OX0.Ql5545w-bkVDIr7llFoJI7vygthkLPE05kBFHhCnklY"
      ),
      "pairs-2": createClient(
        "https://lisnecmeheedtflucdxy.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpc25lY21laGVlZHRmbHVjZHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY5NDY2MzMsImV4cCI6MTk4MjUyMjYzM30.hY7UsqDtyxBaRANspF9MbwR4d6kN_TjpFE5dDSWASgA"
      ),
      "pairs-3": createClient(
        "https://cganiivuxawwfdqtebjk.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnYW5paXZ1eGF3d2ZkcXRlYmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY5NDc1OTYsImV4cCI6MTk4MjUyMzU5Nn0.oeTupeLT8Ch0iM5wamGiymWnStM3KpA1J31FoWb3AGo"
      ),
      "pairs-4": createClient(
        "https://eznupqzoqqsywujpqbsf.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bnVwcXpvcXFzeXd1anBxYnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY5NDczODYsImV4cCI6MTk4MjUyMzM4Nn0.sSfKNms3RLCQHE6WswmGVk-tU3JDYnSo6eE7LBkPBQk"
      ),
      default: createClient(
        "https://ylcxvfbmqzwinymcjlnx.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsY3h2ZmJtcXp3aW55bWNqbG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjAyMTMxMzksImV4cCI6MTk3NTc4OTEzOX0.nuNpRLu2mWB5hvrJqwlishqGxfzm1qT2hPAXLCv6gNY"
      ),
    };
  }

  getRightSupabase(table: string) {
    for (const cluster of Object.keys(this.clusters)) {
      if (this.tables[cluster]?.includes(table)) {
        return this.clusters[cluster];
      }
    }
    return this.clusters.default;
  }

  from(table: string) {
    return this.getRightSupabase(table).from(table);
  }
}
