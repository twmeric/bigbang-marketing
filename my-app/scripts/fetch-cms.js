#!/usr/bin/env node
/**
 * 構建前從 Worker 獲取最新 CMS 數據
 * 確保靜態網站使用最新內容
 */

const fs = require('fs');
const path = require('path');

const WORKER_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'https://bigbang-marketing-cms.jimsbond007.workers.dev';
const CMS_JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'cms.json');

async function fetchCMSData() {
  console.log('🔄 Fetching CMS data from Worker...');
  console.log(`   URL: ${WORKER_URL}/api/cms/data`);

  try {
    const response = await fetch(`${WORKER_URL}/api/cms/data`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // 備份原文件
    if (fs.existsSync(CMS_JSON_PATH)) {
      const backupPath = `${CMS_JSON_PATH}.backup.${Date.now()}`;
      fs.copyFileSync(CMS_JSON_PATH, backupPath);
      console.log(`   💾 Backup created`);
    }

    // 寫入新數據
    fs.writeFileSync(CMS_JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
    
    console.log('✅ CMS data updated successfully!');
    console.log(`   Hero title: ${data.hero?.titleLine1}`);
    console.log(`   Last updated: ${data.lastUpdated || 'N/A'}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to fetch CMS data:', error.message);
    console.log('⚠️ Using existing cms.json file');
    return false;
  }
}

fetchCMSData();
