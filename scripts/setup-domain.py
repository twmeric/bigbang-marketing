#!/usr/bin/env python3
"""
Big Bang Marketing - Cloudflare 自訂域名設定腳本
目標: 設定 bigbang.jkdcoding.com
"""

import subprocess
import json
import sys

def run_wrangler_command(args):
    """執行 wrangler 命令並返回結果"""
    cmd = ["npx", "wrangler"] + args
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, cwd=r"C:\Users\Owner\cloudflare\bigbang\my-app")
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def get_account_info():
    """獲取帳戶資訊"""
    success, stdout, stderr = run_wrangler_command(["whoami"])
    if success:
        print("✅ 已登入 Cloudflare")
        return True
    else:
        print(f"❌ 未登入: {stderr}")
        return False

def setup_custom_domain():
    """設定 Pages 自訂域名"""
    print("\n🚀 開始設定自訂域名...")
    print("=" * 50)
    
    # 檢查登入狀態
    if not get_account_info():
        print("\n請先執行: npx wrangler login")
        return False
    
    # 由於 wrangler pages domain 命令有限，我們輸出指引
    print("\n📋 設定步驟:")
    print("-" * 50)
    print("""
由於需要瀏覽器授權，請按照以下步驟手動設定:

1. 開啟 Cloudflare Dashboard:
   https://dash.cloudflare.com

2. 進入 Workers & Pages → bigbang-marketing

3. 點擊 "自定義域" (Custom Domains) 分頁

4. 點擊 "設置自定義域"

5. 輸入: bigbang.jkdcoding.com

6. 在 jkdcoding.com 的 DNS 設定中添加:
   
   類型:  CNAME
   名稱:  bigbang  
   目標:  bigbang-marketing.pages.dev
   代理:  已代理 (橙色雲朵)

7. 等待 5-30 分鐘生效
    """)
    
    print("=" * 50)
    return True

if __name__ == "__main__":
    print("🌐 Big Bang Marketing 自訂域名設定工具")
    print("目標: bigbang.jkdcoding.com")
    print()
    
    setup_custom_domain()
