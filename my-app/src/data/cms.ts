// Default CMS Data
// 這是構建時使用的默認數據，客戶端會從 API 獲取實際數據

import type { CMSData } from "@/types/cms";
import cmsData from "./cms.json";

export const defaultCMSData = cmsData as CMSData;
export default cmsData as CMSData;
