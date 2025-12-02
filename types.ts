
export type Language = 'th' | 'en';

export type ApplicantType = 'Salaried' | 'BusinessOwner' | 'Freelance' | 'Farmer' | 'Investor';

export type EvaluationMode = 'manual' | 'ai';

export enum DocumentCategory {
  IDENTITY = 'IDENTITY',
  INCOME = 'INCOME',
  BANKING = 'BANKING',
  ADDITIONAL = 'ADDITIONAL',
  SPOUSE = 'SPOUSE',
  BUSINESS = 'BUSINESS',
  TAX = 'TAX',
  CONTRACT = 'CONTRACT',
  AGRICULTURE = 'AGRICULTURE',
  ASSET = 'ASSET',
  LAND = 'LAND',
  INVESTMENT = 'INVESTMENT',
  PROFESSIONAL = 'PROFESSIONAL'
}

export interface DocumentRequirement {
  id: string;
  label: string;
  description: string;
  category: DocumentCategory;
  optional?: boolean;
  multiple?: boolean;
}

export interface UploadedFile {
  id: string;
  file: File;
  category: DocumentCategory;
  previewUrl?: string;
  base64?: string;
  mimeType: string;
}

export interface BankRecommendation {
  bankName: string;
  productName: string;
  matchScore: number; // 0-100
  status: 'Recommended' | 'Possible' | 'Unlikely';
  reason: string;
  interestRateHighlight: string;
}

export interface IncomeBreakdown {
  baseIncome: number;
  variableIncome: number; // OT, Bonus
  haircutApplied: number; // Amount removed due to risk
  explanation: string; // e.g. "Variable income calculated at 70%"
}

export interface DebtBreakdown {
  totalExistingDebt: number;
  detectedDebts: string[]; // e.g. ["Co-op deduction", "Car Loan"]
  estimatedHomeInstallment: number; // The projected new loan payment
}

export interface FinancialProfile {
  estimatedMonthlyIncome: number;
  incomeBreakdown?: IncomeBreakdown;
  debtServiceRatio: number; // Estimated DTI
  debtBreakdown?: DebtBreakdown;
  employmentStability: 'High' | 'Medium' | 'Low';
  applicantType: 'Salaried' | 'Business Owner' | 'Freelance' | 'Farmer' | 'Investor';
  strengths: string[];
  weaknesses: string[];
}

export interface AnalysisResult {
  creditworthinessScore: number; // 0-100
  profile: FinancialProfile;
  recommendations: BankRecommendation[];
  summary: string;
}
