import { API_ENDPOINT } from "../constants";

export const GET = (
  path: string,
  options: Record<string, string | number | boolean | null>,
  external = false,
  params = {}
): Promise<Response> => {
  const signature = localStorage.getItem("signature");
  const accountBuffer = localStorage.getItem("signatureAddress");
  const stringOptions = options;
  if (!stringOptions?.account) stringOptions.account = accountBuffer;

  Object.keys(options).forEach((entry) => {
    stringOptions[entry] = String(options[entry]);
  });
  return fetch(
    `${external ? "" : API_ENDPOINT}${path}?${new URLSearchParams(
      stringOptions as Record<string, string>
    ).toString()}&signature=${signature}`,
    {
      ...params,
    }
  );
};

export const POST = (
  path: string,
  body: Record<string, unknown>
): Promise<Response> => {
  const signature = localStorage.getItem("signature");
  return fetch(`${API_ENDPOINT}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body, signature }),
  });
};

// Content-Type: application/json
// Referer: http://localhost:3000/
// sec-ch-ua: "Chromium";v="106", "Sidekick";v="106", "Not;A=Brand";v="99"
// sec-ch-ua-mobile: ?0
// sec-ch-ua-platform: "macOS"
// Signature: 0xa446e1cdcc12ca9991d178f5ccfcdc9ff6a89b424493efaa032b537c50154a043c99f8646931ebb7d99960f887df4a1324312aa6767dbdb75cd6d099f8325d631c
// User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.5249.119 Safari/537.36

// Accept-Encoding: gzip, deflate, br
// Accept-Language: fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7
// Connection: keep-alive
// Host: localhost
// If-None-Match:
// Origin: http://localhost:3000
// Sec-Fetch-Dest: empty
// Sec-Fetch-Mode: cors
// Sec-Fetch-Site: same-site
