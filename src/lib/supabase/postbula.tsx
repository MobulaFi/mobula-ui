import { SupabaseClient, SupabaseClientOptions } from "@supabase/supabase-js";

export class Postbula extends SupabaseClient {
  constructor(
    publicKey: string,
    anonKey: string,
    restUrl: string,
    options?: SupabaseClientOptions
  ) {
    super(publicKey, anonKey, {
      ...options,
    });
    this.restUrl = restUrl;
  }
}
