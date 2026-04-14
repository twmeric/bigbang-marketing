/**
 * Cross-Account Cloudflare Pages Proxy
 * Deploy this Worker in Account B (the domain owner's account)
 * to proxy requests to the Pages site in Account A.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Target: Your Pages site in Account A
    const targetUrl = `https://bigbang-marketing.pages.dev${url.pathname}${url.search}`;
    
    // Clone headers and update Host
    const headers = new Headers(request.headers);
    headers.set('Host', 'bigbang-marketing.pages.dev');
    
    // Forward the request
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body
    });
    
    // Clone response to allow header modifications
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
    
    // Add CORS headers for API calls (optional but recommended)
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    
    return newResponse;
  }
};
