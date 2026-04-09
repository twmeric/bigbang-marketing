#!/usr/bin/env node
/**
 * CMS Audit Script
 * 檢測代碼中未使用 CMS 的硬編碼文本
 * 
 * Usage: node scripts/audit-cms.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 配置
const CONFIG = {
  // 要掃描的文件類型
  extensions: ['tsx', 'ts', 'jsx', 'js'],
  // 排除的文件/目錄
  exclude: [
    'node_modules/**',
    '.next/**',
    'dist/**',
    '**/*.test.*',
    '**/*.spec.*',
    'scripts/**',
    'lib/**',
    'hooks/**',
  ],
  // CMS 導入模式
  cmsPatterns: [
    'useCMS',
    'CMSContext',
    'cmsData',
    'cms.json',
    '@/data/cms'
  ],
  // 需要檢查的硬編碼文本模式
  hardcodedPatterns: [
    // 中文文本（常用詞語）
    /["'][^"']*?(?:市場|營銷|服務|關於|我們|專業|成功|案例|聯繫|客戶)[^"']*?["']/g,
    // 英文標題（大寫開頭，多個單詞）
    /["'][A-Z][a-zA-Z\s]{5,50}[\.\!]?["']/g,
  ],
  // 忽略的無害文本
  ignorePatterns: [
    /^["']\s*["']$/,  // 空字符串
    /className/,        // Tailwind 類名
    /href=|src=|alt=|title=/,  // HTML 屬性名
    /mx-auto|px-4|py-20|text-center/,  // Tailwind 工具類
    /duration-|transition-|transform-/,  // CSS 動畫
  ]
};

// 顏色輸出
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// 檢查文件是否使用 CMS
function checkCMSUsage(content, filePath) {
  const usesCMS = CONFIG.cmsPatterns.some(pattern => 
    content.includes(pattern)
  );
  
  // 檢查是否導入 cms.json
  const importsCmsJson = content.includes('cms.json') || 
                         content.includes('@/data/cms') ||
                         content.includes('from\'../data/cms\'');
  
  return { usesCMS, importsCmsJson };
}

// 提取潛在的硬編碼文本
function extractHardcodedText(content, filePath) {
  const matches = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // 跳過註釋行
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
    
    // 檢查是否包含中文文本
    const chineseMatch = line.match(/["']([^"']*[\u4e00-\u9fa5]{2,}[^"]*)["']/);
    if (chineseMatch) {
      // 檢查是否應該忽略
      const shouldIgnore = CONFIG.ignorePatterns.some(pattern => 
        pattern.test(line) || pattern.test(chineseMatch[1])
      );
      
      if (!shouldIgnore) {
        matches.push({
          line: index + 1,
          text: chineseMatch[1],
          context: line.trim()
        });
      }
    }
    
    // 檢查英文標題（常見的硬編碼）
    const titleMatch = line.match(/["']([A-Z][a-zA-Z\s]{5,30})["']/);
    if (titleMatch) {
      const commonTitles = ['useEffect', 'useState', 'useRef', 'useCMS', 'useCallback', 'useMemo'];
      if (!commonTitles.includes(titleMatch[1]) && !line.includes('import')) {
        matches.push({
          line: index + 1,
          text: titleMatch[1],
          context: line.trim(),
          type: 'english'
        });
      }
    }
  });
  
  return matches;
}

// 掃描單個文件
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { usesCMS, importsCmsJson } = checkCMSUsage(content, filePath);
  const hardcodedTexts = extractHardcodedText(content, filePath);
  
  return {
    filePath,
    usesCMS,
    importsCmsJson,
    hardcodedTexts,
    hasIssues: hardcodedTexts.length > 0
  };
}

// 主函數
function main() {
  console.log(`${colors.bold}${colors.blue}🔍 CMS Audit Tool${colors.reset}\n`);
  
  // 查找所有源文件
  const srcDir = path.join(__dirname, '..', 'src');
  const files = glob.sync('**/*.{tsx,ts,jsx,js}', {
    cwd: srcDir,
    ignore: CONFIG.exclude
  });
  
  const results = {
    total: files.length,
    usesCMS: 0,
    hardcoded: 0,
    issues: []
  };
  
  files.forEach(file => {
    const fullPath = path.join(srcDir, file);
    const result = scanFile(fullPath);
    
    if (result.usesCMS) results.usesCMS++;
    if (result.hasIssues) {
      results.hardcoded++;
      results.issues.push(result);
    }
  });
  
  // 輸出摘要
  console.log(`${colors.bold}📊 掃描摘要${colors.reset}`);
  console.log(`   總文件數: ${results.total}`);
  console.log(`   已使用 CMS: ${colors.green}${results.usesCMS}${colors.reset}`);
  console.log(`   有硬編碼: ${colors.red}${results.hardcoded}${colors.reset}`);
  console.log();
  
  // 輸出詳細問題
  if (results.issues.length > 0) {
    console.log(`${colors.bold}${colors.red}⚠️  發現硬編碼內容${colors.reset}\n`);
    
    results.issues.forEach(issue => {
      const relativePath = issue.filePath.replace(srcDir, 'src');
      const status = issue.usesCMS 
        ? `${colors.yellow}⚠️  已用CMS但仍有硬編碼${colors.reset}`
        : `${colors.red}❌ 未使用CMS${colors.reset}`;
      
      console.log(`${colors.bold}${relativePath}${colors.reset} ${status}`);
      
      issue.hardcodedTexts.forEach(item => {
        console.log(`   第 ${item.line} 行: "${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}"`);
      });
      console.log();
    });
    
    console.log(`${colors.bold}${colors.yellow}💡 建議操作${colors.reset}`);
    console.log('   1. 為每個組件添加 useCMS hook');
    console.log('   2. 將硬編碼文本移到 cms.json');
    console.log('   3. 使用 cmsData.sectionName 動態渲染');
    console.log();
    
    process.exit(1);
  } else {
    console.log(`${colors.green}✅ 所有組件都正確使用 CMS！${colors.reset}`);
    process.exit(0);
  }
}

main();
