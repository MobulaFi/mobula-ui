import { SiteMap } from "../../features/misc/sitemap";
import { Asset } from "../../interfaces/assets";
import { createSupabaseDOClient } from "../../lib/supabase";

const fetchAssets = async ({ searchParams }) => {
  const page = searchParams?.page || 1;
  const supabase = createSupabaseDOClient();
  const { data } = await supabase.from("assets").select("id");
  const { data: assets } = await supabase
    .from("assets")
    .select("name")
    .range(Number(page) * 200, page * 200 + 200)
    .limit(200);

  if (data)
    return {
      assets,
      count: data?.length,
    };
  return {
    assets,
    count: 0,
  };
};

export default async function SitemapPage({ searchParams }) {
  const data = await fetchAssets({ searchParams });
  return (
    <>
      <head>
        <title>Cryptocurrencies Sitemap | Mobula</title>
        <meta name="url" content="https://mobula.fi/sitemap" />
        <meta name="keywords" content="Mobula" />
        <meta name="author" content="Mobula" />
        <meta name="copyright" content="Mobula" />
        <meta name="robots" content="index, follow" />
      </head>
      <SiteMap assets={data.assets as Asset[]} count={data.count} />
    </>
  );
}
