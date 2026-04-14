/**
 * Big Bang CMS Worker
 * Cloudflare Workers + KV + Analytics + WhatsApp
 */

import { defaultCMSData } from "./data/default";

// Environment types
export interface Env {
  CMS_DATA: KVNamespace;
  CF_ACCOUNT_ID: string;
  CF_PROJECT_NAME: string;
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string;
  ADMIN_WHATSAPP?: string;
  CLOUDWAPI_API_KEY?: string;
  CLOUDWAPI_SENDER?: string;
}

const CLOUDWAPI_ENDPOINT = 'https://unofficial.cloudwapi.in/send-message';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const origin = request.headers.get('Origin') || '*';

    // 允許的域名列表
    const allowedOrigins = [
      'https://bigbang.jkdcoding.com',
      'https://bigbangmarketing.hk',
      'https://www.bigbangmarketing.hk',
      'https://bigbang-marketing-cms.jimsbond007.workers.dev',
    ];
    
    // 動態允許 pages.dev 子域名
    const isPagesDev = origin.match(/^https:\/\/[a-z0-9-]+\.bigbang-marketing\.pages\.dev$/);
    const isAllowed = allowedOrigins.includes(origin) || isPagesDev || origin === '*';

    const corsHeaders = {
      'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cache-Control, Pragma, *',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const routeKey = `${method} ${path}`;
      
      switch (routeKey) {
        case 'GET /api/cms/data':
          return await getCMSData(env, corsHeaders);
        
        case 'POST /api/cms/data':
          return await saveCMSData(request, env, corsHeaders);
        
        case 'POST /api/cms/deploy':
          return await deployWebsite(request, env, corsHeaders);
        
        case 'GET /api/cms/deploy-test':
          return jsonResponse({
            githubRepo: env.GITHUB_REPO,
            tokenSet: !!env.GITHUB_TOKEN,
            tokenPrefix: env.GITHUB_TOKEN ? env.GITHUB_TOKEN.substring(0, 4) + '****' : null,
          }, 200, corsHeaders);
        
        case 'POST /api/cms/reset':
          return await resetCMSData(env, corsHeaders);
        
        case 'POST /api/contact':
          return await handleContactForm(request, env, corsHeaders);
        
        case 'POST /api/inquiries':
          return await saveInquiry(request, env, corsHeaders);
        
        case 'GET /api/inquiries':
          return await getInquiries(env, corsHeaders);
        
        case 'PUT /api/inquiries':
          return await updateInquiry(request, env, corsHeaders);
        
        case 'POST /api/analytics/pageview':
          return await handlePageView(request, env, corsHeaders);
        
        case 'POST /api/analytics/track':
          return await handleTrack(request, env, corsHeaders);
        
        case 'GET /api/analytics/dashboard':
          return await getDashboard(env, corsHeaders);
        
        case 'GET /api/analytics/realtime':
          return await getRealtime(env, corsHeaders);
        
        case 'GET /':
          return jsonResponse({
            service: 'Big Bang CMS API',
            version: '1.0.0',
            status: 'running',
            endpoints: {
              'CMS': {
                'GET /api/cms/data': 'Get CMS data',
                'POST /api/cms/data': 'Save CMS data',
                'POST /api/cms/deploy': 'Trigger deployment',
                'POST /api/cms/reset': 'Reset to default',
              },
              'Inquiries': {
                'POST /api/contact': 'Submit contact form',
                'POST /api/inquiries': 'Save inquiry',
                'GET /api/inquiries': 'Get all inquiries',
                'PUT /api/inquiries': 'Update inquiry status',
              },
              'Analytics': {
                'POST /api/analytics/pageview': 'Record page view',
                'POST /api/analytics/track': 'Track visit',
                'GET /api/analytics/dashboard': 'Get dashboard',
                'GET /api/analytics/realtime': 'Get realtime visitors',
              },
            },
          }, 200, corsHeaders);
        
        default:
          return jsonResponse({
            success: false,
            error: 'Not Found',
            timestamp: new Date().toISOString(),
          }, 404, corsHeaders);
      }
    } catch (error) {
      return jsonResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }, 500, corsHeaders);
    }
  },
};

// CMS Data Handlers
async function getCMSData(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const data = await env.CMS_DATA.get('cms_data', 'json');
    if (!data) {
      return jsonResponse(defaultCMSData, 200, corsHeaders);
    }
    return jsonResponse(data, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: 'Failed to get CMS data' }, 500, corsHeaders);
  }
}

async function saveCMSData(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const data = await request.json();
    if (!data || typeof data !== 'object') {
      return jsonResponse({ success: false, error: 'Invalid data' }, 400, corsHeaders);
    }
    
    // Deep merge with existing KV data to avoid losing other sections
    let existingData: any = {};
    try {
      const kvData = await env.CMS_DATA.get('cms_data', 'json');
      if (kvData && typeof kvData === 'object') {
        existingData = kvData;
      }
    } catch (e) {}
    
    const deepMerge = (target: any, source: any) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
            target[key] = {};
          }
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    };
    
    const mergedData = deepMerge(JSON.parse(JSON.stringify(existingData)), data);
    const dataToSave = { ...mergedData, lastUpdated: new Date().toISOString() };
    await env.CMS_DATA.put('cms_data', JSON.stringify(dataToSave));
    
    const timestamp = new Date().toISOString();
    await env.CMS_DATA.put(`cms_history_${timestamp}`, JSON.stringify(dataToSave), {
      expirationTtl: 86400 * 30,
    });
    
    return jsonResponse({ success: true, message: 'CMS data saved', timestamp }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: 'Failed to save CMS data' }, 500, corsHeaders);
  }
}

async function resetCMSData(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    await env.CMS_DATA.put('cms_data', JSON.stringify(defaultCMSData));
    return jsonResponse({ success: true, message: 'CMS data reset' }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: 'Failed to reset' }, 500, corsHeaders);
  }
}

async function deployWebsite(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const githubToken = env.GITHUB_TOKEN;
    const githubRepo = env.GITHUB_REPO || 'jimsbond/bigbang-marketing';
    
    if (!githubToken) {
      return jsonResponse({ 
        success: false, 
        error: 'GitHub token not configured. Please set GITHUB_TOKEN secret in Cloudflare Worker.',
        debug: { repo: githubRepo, tokenSet: false }
      }, 500, corsHeaders);
    }
    
    // Parse request body for custom reason
    let reason = 'CMS update from admin';
    try {
      const body = await request.json() as { reason?: string };
      if (body.reason) reason = body.reason;
    } catch (e) {}
    
    async function triggerDeploy(inputs?: Record<string, string>) {
      return fetch(
        `https://api.github.com/repos/${githubRepo}/actions/workflows/deploy.yml/dispatches`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'BigBang-CMS',
            'X-GitHub-Api-Version': '2022-11-28',
          },
          body: JSON.stringify({
            ref: 'main',
            ...(inputs && { inputs }),
          }),
        }
      );
    }
    
    let response = await triggerDeploy({ 
      reason: `${reason} - ${new Date().toLocaleString('zh-HK')}` 
    });

    // If GitHub rejects inputs, retry without inputs
    if (response.status !== 204) {
      let errorMsg = '';
      try {
        const errorData = await response.clone().json() as { message?: string };
        errorMsg = errorData.message || '';
      } catch (e) {}
      
      if (errorMsg.includes('Unexpected inputs')) {
        response = await triggerDeploy();
      }
    }

    if (response.status === 204) {
      return jsonResponse({ 
        success: true, 
        message: 'Deployment triggered successfully',
        repo: githubRepo,
        timestamp: new Date().toISOString(),
      }, 200, corsHeaders);
    }

    let errorMsg = `GitHub API Error: ${response.status}`;
    let errorDetails = '';
    let errorCode = '';
    try {
      const errorData = await response.json() as { message?: string; documentation_url?: string; errors?: any };
      errorMsg = errorData.message || errorMsg;
      errorCode = response.status.toString();
      if (errorData.documentation_url) {
        errorDetails = `Documentation: ${errorData.documentation_url}`;
      }
      if (errorData.errors) {
        errorDetails += ` Errors: ${JSON.stringify(errorData.errors)}`;
      }
    } catch (e) {}

    // Provide helpful error messages
    let helpText = '';
    if (response.status === 404) {
      helpText = `Repository '${githubRepo}' not found. Please create it on GitHub or check the repository name in wrangler.toml.`;
    } else if (response.status === 401) {
      helpText = 'GitHub token is invalid or expired. Please generate a new token at https://github.com/settings/tokens';
    } else if (response.status === 403) {
      helpText = 'GitHub token does not have permission to trigger workflows. Please ensure it has "repo" and "workflow" scopes.';
    } else if (errorMsg.includes('Unexpected inputs')) {
      helpText = 'GitHub Actions workflow "deploy.yml" does not accept "reason" input. Please add workflow_dispatch.inputs.reason to .github/workflows/deploy.yml, or update the CMS Worker to not send inputs.';
    }

    return jsonResponse({ 
      success: false, 
      error: errorMsg,
      errorCode: errorCode,
      details: errorDetails,
      repo: githubRepo,
      help: helpText,
      setupGuide: 'See DEPLOY_SETUP.md for setup instructions',
    }, 500, corsHeaders);
  } catch (error) {
    return jsonResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Deploy failed',
      timestamp: new Date().toISOString(),
    }, 500, corsHeaders);
  }
}

// Inquiry Handlers
async function handleContactForm(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const data = await request.json() as { name: string; phone: string; email?: string; service?: string; message?: string };

    if (!data.name || !data.phone) {
      return jsonResponse({ success: false, error: 'Name and phone required' }, 400, corsHeaders);
    }

    const whatsappMessage = formatWhatsAppMessage(data);
    let sendResult = { success: false, error: 'Not configured' };
    
    if (env.CLOUDWAPI_API_KEY) {
      const notificationPhone = env.ADMIN_WHATSAPP || '85252768052';
      sendResult = await sendWhatsAppMessage(env, notificationPhone, whatsappMessage);
    }

    const inquiryId = `inquiry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const inquiryData = {
      id: inquiryId,
      ...data,
      whatsappSent: sendResult.success,
      status: 'new',
      submittedAt: new Date().toISOString(),
    };

    await env.CMS_DATA.put(inquiryId, JSON.stringify(inquiryData));

    return jsonResponse({
      success: true,
      message: 'Inquiry submitted',
      data: { inquiryId, whatsappNotified: sendResult.success },
    }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: 'Submit failed' }, 500, corsHeaders);
  }
}

async function saveInquiry(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const data = await request.json() as { name: string; phone: string; email?: string; service?: string; message?: string };
    if (!data.name || !data.phone) {
      return jsonResponse({ success: false, error: 'Name and phone required' }, 400, corsHeaders);
    }

    const inquiryId = `inquiry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await env.CMS_DATA.put(inquiryId, JSON.stringify({
      id: inquiryId,
      ...data,
      source: 'website',
      status: 'new',
      submittedAt: new Date().toISOString(),
    }));

    return jsonResponse({ success: true, data: { inquiryId } }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: 'Save failed' }, 500, corsHeaders);
  }
}

async function getInquiries(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const { keys } = await env.CMS_DATA.list({ prefix: 'inquiry_' });
    const inquiries = [];
    for (const key of keys) {
      const data = await env.CMS_DATA.get(key.name);
      if (data) inquiries.push(JSON.parse(data));
    }
    inquiries.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    
    return jsonResponse({ success: true, data: inquiries, count: inquiries.length }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: 'Failed to get inquiries' }, 500, corsHeaders);
  }
}

async function updateInquiry(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const { id, status, notes } = await request.json() as { id: string; status?: string; notes?: string };
    if (!id) return jsonResponse({ success: false, error: 'ID required' }, 400, corsHeaders);
    
    const existing = await env.CMS_DATA.get(id);
    if (!existing) return jsonResponse({ success: false, error: 'Not found' }, 404, corsHeaders);
    
    const inquiry = JSON.parse(existing);
    if (status) inquiry.status = status;
    if (notes !== undefined) inquiry.notes = notes;
    inquiry.updatedAt = new Date().toISOString();
    
    await env.CMS_DATA.put(id, JSON.stringify(inquiry));
    return jsonResponse({ success: true, data: inquiry }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: 'Update failed' }, 500, corsHeaders);
  }
}

// WhatsApp
function formatWhatsAppMessage(data: { name: string; phone: string; email?: string; service?: string; message?: string }): string {
  const timestamp = new Date().toLocaleString('zh-HK', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  return `【Big Bang Marketing】新询盘

━━━━━━━━━━━━━━━━━━━━

👤 *客户资料*
• 姓名：${data.name}
• 电话：${data.phone}
${data.email ? `• 电邮：${data.email}` : ''}

📋 *查询内容*
• 服务项目：${data.service || '未指定'}

📝 *详细需求*
${data.message || '（客户未填写）'}

━━━━━━━━━━━━━━━━━━━━

⏰ 提交时间：${timestamp}

💡 请尽快回复客户！`;
}

async function sendWhatsAppMessage(env: Env, to: string, message: string): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = env.CLOUDWAPI_API_KEY;
    const sender = env.CLOUDWAPI_SENDER || '85252768052';
    if (!apiKey) return { success: false, error: 'API key not configured' };

    const response = await fetch(CLOUDWAPI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        sender: sender.replace(/\D/g, ''),
        number: to.replace(/\D/g, ''),
        message,
      }),
    });

    const result = await response.json() as { status?: boolean | string; msg?: string };
    if (result.status === true || result.status === 'success') {
      return { success: true };
    }
    return { success: false, error: result.msg || 'Unknown error' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown' };
  }
}

// Analytics
async function handlePageView(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const data = await request.json() as { page: string; referrer?: string; userAgent?: string; sessionId: string };
    const country = request.headers.get('CF-IPCountry') || 'unknown';
    const city = (request.cf?.city as string) || 'unknown';

    const viewId = `pageview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await env.CMS_DATA.put(viewId, JSON.stringify({ ...data, country, city, timestamp: new Date().toISOString() }), {
      expirationTtl: 86400 * 30,
    });

    const today = new Date().toISOString().split('T')[0];
    const pvKey = `stats:${today}:pv`;
    const currentPV = parseInt(await env.CMS_DATA.get(pvKey) || '0');
    await env.CMS_DATA.put(pvKey, String(currentPV + 1));

    const uvKey = `stats:${today}:uv`;
    const uvData = JSON.parse(await env.CMS_DATA.get(uvKey) || '[]') as string[];
    if (!uvData.includes(data.sessionId)) {
      uvData.push(data.sessionId);
      await env.CMS_DATA.put(uvKey, JSON.stringify(uvData));
    }

    return jsonResponse({ success: true }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: 'Track failed' }, 500, corsHeaders);
  }
}

async function handleTrack(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const data = await request.json() as { sessionId: string; path: string; referrer?: string; userAgent?: string };
    const today = new Date().toISOString().split('T')[0];
    
    const visitorKey = `visitor:${data.sessionId}`;
    let visitor = await env.CMS_DATA.get(visitorKey, 'json') as any;
    
    if (!visitor) {
      visitor = {
        sessionId: data.sessionId,
        firstVisit: new Date().toISOString(),
        pages: [],
        device: getDeviceType(data.userAgent || ''),
        browser: getBrowser(data.userAgent || ''),
      };
    }
    
    visitor.pages.push({ path: data.path, timestamp: new Date().toISOString() });
    visitor.lastActivity = new Date().toISOString();
    
    await env.CMS_DATA.put(visitorKey, JSON.stringify(visitor), { expirationTtl: 86400 * 7 });

    const pvKey = `stats:${today}:pv`;
    const currentPV = parseInt(await env.CMS_DATA.get(pvKey) || '0');
    await env.CMS_DATA.put(pvKey, String(currentPV + 1));

    return jsonResponse({ success: true }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: 'Track failed' }, 500, corsHeaders);
  }
}

async function getDashboard(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const todayPV = parseInt(await env.CMS_DATA.get(`stats:${today}:pv`) || '0');
    const todayUV = JSON.parse(await env.CMS_DATA.get(`stats:${today}:uv`) || '[]').length;
    const yesterdayPV = parseInt(await env.CMS_DATA.get(`stats:${yesterday}:pv`) || '0');
    const yesterdayUV = JSON.parse(await env.CMS_DATA.get(`stats:${yesterday}:uv`) || '[]').length;

    const visitorList = await env.CMS_DATA.list({ prefix: 'visitor:' });
    const devices: Record<string, number> = {};
    const browsers: Record<string, number> = {};
    
    for (const key of visitorList.keys.slice(0, 100)) {
      const visitor = await env.CMS_DATA.get(key.name, 'json') as any;
      if (visitor) {
        devices[visitor.device] = (devices[visitor.device] || 0) + 1;
        browsers[visitor.browser] = (browsers[visitor.browser] || 0) + 1;
      }
    }

    return jsonResponse({
      success: true,
      today: { visitors: todayUV, pageViews: todayPV },
      yesterday: { visitors: yesterdayUV, pageViews: yesterdayPV },
      trends: {
        visitorsChange: yesterdayUV > 0 ? Math.round(((todayUV - yesterdayUV) / yesterdayUV) * 100) : 0,
        pageViewsChange: yesterdayPV > 0 ? Math.round(((todayPV - yesterdayPV) / yesterdayPV) * 100) : 0,
      },
      devices,
      browsers,
    }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: 'Failed' }, 500, corsHeaders);
  }
}

async function getRealtime(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000).toISOString();
    const visitorList = await env.CMS_DATA.list({ prefix: 'visitor:' });
    const activeVisitors = [];
    
    for (const key of visitorList.keys) {
      const visitor = await env.CMS_DATA.get(key.name, 'json') as any;
      if (visitor && visitor.lastActivity > fiveMinutesAgo) {
        activeVisitors.push({
          sessionId: visitor.sessionId,
          device: visitor.device,
          browser: visitor.browser,
          currentPage: visitor.pages?.[visitor.pages.length - 1]?.path || 'unknown',
          lastActivity: visitor.lastActivity,
        });
      }
    }

    return jsonResponse({
      success: true,
      count: activeVisitors.length,
      visitors: activeVisitors.slice(0, 20),
    }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: 'Failed' }, 500, corsHeaders);
  }
}

// Helpers
function getDeviceType(ua: string): string {
  const s = ua.toLowerCase();
  if (/mobile|android|iphone/.test(s)) return 'mobile';
  if (/ipad|tablet/.test(s)) return 'tablet';
  return 'desktop';
}

function getBrowser(ua: string): string {
  const s = ua.toLowerCase();
  if (/chrome/.test(s)) return 'Chrome';
  if (/safari/.test(s)) return 'Safari';
  if (/firefox/.test(s)) return 'Firefox';
  if (/edge/.test(s)) return 'Edge';
  return 'Unknown';
}

function jsonResponse(data: any, status: number = 200, corsHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      ...corsHeaders,
    },
  });
}
