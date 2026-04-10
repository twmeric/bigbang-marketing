#!/usr/bin/env node
/**
 * Environment Variables Check Script
 * 驗證構建時環境變量配置
 */

const requiredVars = [
  'NEXT_PUBLIC_CMS_API_URL',
];

console.log('\n🔍 環境變量檢查\n');

let hasError = false;

for (const varName of requiredVars) {
  const value = process.env[varName];
  if (!value) {
    console.error(`❌ ${varName}: 未設置`);
    hasError = true;
  } else {
    // 遮罩敏感信息
    const displayValue = value.length > 20 
      ? value.substring(0, 20) + '...' 
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
    
    // 驗證 URL 格式
    if (varName.includes('URL')) {
      try {
        new URL(value);
        console.log(`   └─ URL 格式正確`);
      } catch (e) {
        console.error(`   └─ ❌ URL 格式錯誤: ${value}`);
        hasError = true;
      }
    }
  }
}

console.log('\n' + (hasError ? '❌ 檢查失敗' : '✅ 所有環境變量已正確設置'));
console.log('');

process.exit(hasError ? 1 : 0);
