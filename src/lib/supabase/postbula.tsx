import { SupabaseClient } from "@supabase/supabase-js";

export class Postbula extends SupabaseClient {
  restUrl: string;
  constructor(
    publicKey: string,
    anonKey: string,
    restUrl: string,
    options?: any
  ) {
    super(publicKey, anonKey, {
      ...options,
    });
    this.restUrl = restUrl;
  }
}
