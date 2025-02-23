export type Disease = 'psoriasis' | 'eczema' | 'unknown';

export type Severity = 'mild' | 'moderate' | 'severe';

export interface Symptoms {
  redness?: boolean;  // 红斑
  scaling?: boolean;  // 鳞屑
  thinMembrane?: boolean;  // 薄膜现象
  itching?: Severity;  // 瘙痒程度
  blisters?: boolean;  // 丘疹和水疱
  exudation?: boolean;  // 渗出
  thickening?: boolean;  // 苔藓样变
}

export interface DiagnosisResult {
  id: string;
  userId?: string;
  timestamp: string;
  disease: Disease;
  confidence: number;  // 置信度 0-100
  details: {
    symptoms: string[];
    severity: Severity;
    affectedAreas: string[];  // 受影响的身体部位
    recommendations: string[];  // 建议
  };
  imageUrls: string[];  // 上传图片的URL
}

export interface DiagnosisHistoryItem {
  id: string;
  timestamp: string;
  disease: Disease;
  severity: Severity;
  imageUrl: string;  // 主要图片的URL
  confidence: number;  // 置信度 0-1
  details: {
    symptoms: string[];
  };
}

export interface DiagnosisResponse {
  success: boolean;
  result?: DiagnosisResult;
  error?: string;
}

export interface PASIScore {
  head: {
    erythema: number;     // 红斑
    thickness: number;    // 浸润
    scaling: number;      // 鳞屑
    area: number;         // 面积
  };
  trunk: {
    erythema: number;
    thickness: number;
    scaling: number;
    area: number;
  };
  upperLimbs: {
    erythema: number;
    thickness: number;
    scaling: number;
    area: number;
  };
  lowerLimbs: {
    erythema: number;
    thickness: number;
    scaling: number;
    area: number;
  };
  totalScore?: number;
}

export interface BSAScore {
  head: number;          // 头部BSA (9%)
  trunk: number;         // 躯干BSA (36%)
  upperLimbs: number;    // 上肢BSA (18%)
  lowerLimbs: number;    // 下肢BSA (37%)
  totalScore?: number;   // 总BSA
}

export interface CMSSSScore {
  // 主症
  primarySymptoms: {
    skinLesion: number;      // 皮损
    scaling: number;         // 鳞屑
    itching: number;         // 瘙痒
    pain: number;           // 疼痛
  };
  // 次症
  secondarySymptoms: {
    insomnia: number;       // 失眠
    fatigue: number;        // 疲劳
    irritability: number;   // 烦躁
    dryMouth: number;      // 口干
    constipation: number;  // 便秘
  };
  // 舌象
  tongue: {
    color: string;         // 舌色
    coating: string;       // 舌苔
  };
  // 脉象
  pulse: string;           // 脉象
  totalScore?: number;     // 总分
}

export interface SyndromeAnalysis {
  pasiScore?: PASIScore;
  bsaScore?: BSAScore;
  cmsssScore?: CMSSSScore;
  laboratoryIndicators?: {
    scc?: number;
    tnfAlpha?: number;
    il23?: number;
    il17?: number;
  };
  syndromeType?: string;  // 最终辨证分型结果
  timestamp: string;
}

export interface Medicine {
  name: string;
  amount: string;
}

export interface Treatment {
  syndrome: string;        // 证型
  principle: string;       // 基本治则
  prescription: {
    name: string;         // 方剂名
    medicines: Medicine[];  // 药物组成
  };
  usage: string;          // 煎服法
}
