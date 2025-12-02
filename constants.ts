
import { DocumentCategory, Language, ApplicantType, DocumentRequirement } from './types';

export const TRANSLATIONS = {
  th: {
    appTitle: 'LoanVerify AI',
    appSubtitle: 'ระบบวิเคราะห์สินเชื่อบ้านอัจฉริยะ',
    poweredBy: 'Powered by Google Gemini',
    
    // Stepper
    step1: 'เลือกอาชีพ',
    step2: 'ประเมินผล',
    step3: 'ผลลัพธ์',
    secureBadge: 'Secure Encryption 256-bit',

    // Modes
    modeManual: 'คำนวณเองเบื้องต้น',
    modeAI: 'ให้ AI วิเคราะห์เอกสาร',
    quickCalcTitle: 'ประเมินความสามารถในการกู้บ้าน',
    quickCalcDesc: 'กรอกข้อมูลรายได้และหนี้สินเพื่อดูโอกาสผ่านเบื้องต้น (DTI)',
    inputIncome: 'รายได้ต่อเดือน (บาท)',
    inputDebt: 'ภาระผ่อนต่อเดือน (บาท)',
    calcResultGood: 'เกณฑ์ดีมาก! (DTI ≤ 35%)',
    calcResultFair: 'เกณฑ์ยอมรับได้ (DTI ≤ 50%)',
    calcResultRisk: 'ความเสี่ยงสูง (DTI > 50%)',
    verifyWithAI: 'ยืนยันผลด้วย AI (แนะนำ)',
    verifyDesc: 'อัพโหลดเอกสารเพื่อให้ AI ช่วยยืนยันยอดสุทธิและแนะนำธนาคารที่เหมาะสม',

    // Selection Screen
    selectTypeTitle: 'คุณทำอาชีพอะไร?',
    selectTypeDesc: 'เลือกอาชีพของคุณเพื่อให้ AI ประเมินวงเงินกู้บ้านได้แม่นยำที่สุด',
    typeSalaried: 'พนักงานประจำ',
    typeSalariedDesc: 'ข้าราชการ / รัฐวิสาหกิจ / บริษัทเอกชน',
    typeBusinessOwner: 'เจ้าของธุรกิจ',
    typeBusinessOwnerDesc: 'เจ้าของกิจการ / ห้างหุ้นส่วน / SME',
    typeFreelance: 'อาชีพอิสระ',
    typeFreelanceDesc: 'ค้าขายออนไลน์ / ฟรีแลนซ์ / แพทย์',
    typeFarmer: 'เกษตรกร',
    typeFarmerDesc: 'ทำสวน / ทำไร่ / ปศุสัตว์ / ประมง',
    typeInvestor: 'นักลงทุน',
    typeInvestorDesc: 'รายได้จากค่าเช่า / เงินปันผล / หุ้น',
    backToSelect: 'เลือกอาชีพใหม่',
    
    // Knowledge Section
    knowledgeTitle: '7 เทคนิคยื่นกู้บ้านให้ผ่านฉลุย',
    knowledgeDesc: 'เตรียมตัวให้พร้อมก่อนยื่นกู้ เพิ่มโอกาสอนุมัติด้วยเทคนิคเหล่านี้',
    readMore: 'อ่านต่อ',

    // Upload Screen
    heroTitle: 'อัพโหลดเอกสาร',
    heroDesc: 'ระบบจะสแกนข้อมูลอัตโนมัติ โปรดใช้ภาพที่ชัดเจน ไม่เบลอ เพื่อความแม่นยำ',
    upload: 'อัพโหลดไฟล์',
    changeFile: 'เปลี่ยน',
    addFile: 'เพิ่มไฟล์',
    optional: 'ไม่บังคับ',
    fileCount: 'รายการ',
    
    // Smart Loading Steps
    loadingStep1: 'Scanning Documents (OCR)',
    loadingStep2: 'Checking Authenticity',
    loadingStep3: 'Validating Income Sources',
    loadingStep4: 'Calculating Debt Service Ratio (DTI)',
    loadingStep5: 'Matching Mortgage Products',
    loadingLongWait: 'กำลังวิเคราะห์รายละเอียดเชิงลึก อาจใช้เวลาสักครู่...',

    startAnalysis: 'เริ่มวิเคราะห์',
    errorNoFile: 'กรุณาอัพโหลดเอกสารอย่างน้อย 1 รายการ',
    errorGeneric: 'เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่อีกครั้ง',
    
    // Analysis Results
    resultsHeader: 'Mortgage Pre-Assessment',
    scoreLabel: 'คะแนนเครดิต',
    profileHeader: 'ข้อมูลทางการเงิน',
    monthlyIncome: 'รายได้สุทธิ (Net Income)',
    jobStability: 'ความมั่นคง',
    dti: 'ภาระหนี้ (DTI)',
    strengths: 'จุดแข็ง',
    weaknesses: 'จุดที่ควรปรับปรุง',
    recommendationsHeader: 'ธนาคารที่เหมาะสมกับคุณ',
    resetButton: 'เริ่มประเมินใหม่',
    matchScore: 'โอกาสอนุมัติ',
    highlight: 'จุดเด่น',
    topPick: 'แนะนำสูงสุด',
    disclaimer: 'ผลลัพธ์นี้เป็นเพียงการประเมินเบื้องต้นโดย AI อัตราดอกเบี้ยอาจเปลี่ยนแปลงตามประกาศธนาคาร',
    
    // Breakdown
    viewDetails: 'ดูรายละเอียดการคำนวณ',
    breakdownTitle: 'ที่มาของตัวเลข (Financial Breakdown)',
    bdIncomeTitle: 'ที่มาของรายได้สุทธิ',
    bdDebtTitle: 'ที่มาของภาระหนี้',
    bdBase: 'ฐานเงินเดือน',
    bdVar: 'รายได้ผันแปร',
    bdHaircut: 'หักความเสี่ยง (Haircut)',
    bdDebtExisting: 'หนี้สินเดิมต่อเดือน',
    bdDebtNew: 'ยอดผ่อนบ้าน (ประเมิน)',
    bdTotalDebt: 'ภาระหนี้รวม',
    bdExplanation: 'คำอธิบายจาก AI',
    bdDetectedList: 'รายการหนี้ที่ตรวจพบ',

    // Value Maps
    stability: {
      High: 'สูง (Stable)',
      Medium: 'ปานกลาง (Medium)',
      Low: 'ต่ำ/มีความเสี่ยง (Risk)'
    },
    status: {
      Recommended: 'โอกาสสูง',
      Possible: 'พอมีลุ้น',
      Unlikely: 'ยาก'
    }
  },
  en: {
    appTitle: 'LoanVerify AI',
    appSubtitle: 'Smart Mortgage Prediction',
    poweredBy: 'Powered by Google Gemini',

    // Stepper
    step1: 'Career',
    step2: 'Assess',
    step3: 'Result',
    secureBadge: 'Secure Encryption 256-bit',

    // Modes
    modeManual: 'Quick Calculator',
    modeAI: 'AI Verify (Upload)',
    quickCalcTitle: 'Mortgage Eligibility Calculator',
    quickCalcDesc: 'Enter your income and debt to check your DTI score instantly.',
    inputIncome: 'Monthly Income (THB)',
    inputDebt: 'Monthly Debt Payment (THB)',
    calcResultGood: 'Excellent! (DTI ≤ 35%)',
    calcResultFair: 'Acceptable (DTI ≤ 50%)',
    calcResultRisk: 'High Risk (DTI > 50%)',
    verifyWithAI: 'Verify with AI (Recommended)',
    verifyDesc: 'Upload documents to let AI confirm your net income and match banks.',
    
    // Selection Screen
    selectTypeTitle: 'What is your occupation?',
    selectTypeDesc: 'Select your career path for precise AI mortgage assessment.',
    typeSalaried: 'Salaried Employee',
    typeSalariedDesc: 'Govt / Corporate / State Enterprise',
    typeBusinessOwner: 'Business Owner',
    typeBusinessOwnerDesc: 'Business Owner / SME / Partnership',
    typeFreelance: 'Freelance / Pro',
    typeFreelanceDesc: 'Online Seller / Doctor / Creative',
    typeFarmer: 'Farmer',
    typeFarmerDesc: 'Agriculture / Livestock / Fishery',
    typeInvestor: 'Investor',
    typeInvestorDesc: 'Rental Income / Dividends',
    backToSelect: 'Change Career',

    // Knowledge Section
    knowledgeTitle: '7 Tips for Loan Approval',
    knowledgeDesc: 'Prepare yourself before applying to increase your approval chances.',
    readMore: 'Read More',

    // Upload Screen
    heroTitle: 'Upload Documents',
    heroDesc: 'AI will automatically extract and validate data. Please ensure images are clear.',
    upload: 'Upload File',
    changeFile: 'Change',
    addFile: 'Add',
    optional: 'Optional',
    fileCount: 'files',
    
    // Smart Loading Steps
    loadingStep1: 'Scanning Documents (OCR)...',
    loadingStep2: 'Verifying Authenticity...',
    loadingStep3: 'Validating Income Sources...',
    loadingStep4: 'Calculating Debt Ratio (DTI)...',
    loadingStep5: 'Matching Mortgage Products...',
    loadingLongWait: 'Analyzing details... This might take a moment.',

    startAnalysis: 'Start Analysis',
    errorNoFile: 'Please upload at least one document.',
    errorGeneric: 'An error occurred during analysis. Please try again.',
    
    // Analysis Results
    resultsHeader: 'Mortgage Pre-Assessment',
    scoreLabel: 'Credit Score',
    profileHeader: 'Financial Profile',
    monthlyIncome: 'Net Income',
    jobStability: 'Stability',
    dti: 'DTI Ratio',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    recommendationsHeader: 'Bank Recommendations',
    resetButton: 'New Assessment',
    matchScore: 'Approval Chance',
    highlight: 'Highlight',
    topPick: 'Top Pick',
    disclaimer: 'This result is a preliminary AI assessment. Interest rates subject to bank announcement.',

    // Breakdown
    viewDetails: 'View Calculation Details',
    breakdownTitle: 'Financial Breakdown',
    bdIncomeTitle: 'Net Income Calculation',
    bdDebtTitle: 'Debt Burden Calculation',
    bdBase: 'Base Salary',
    bdVar: 'Variable Income',
    bdHaircut: 'Risk Haircut',
    bdDebtExisting: 'Existing Debt',
    bdDebtNew: 'Est. Mortgage',
    bdTotalDebt: 'Total Debt Burden',
    bdExplanation: 'AI Explanation',
    bdDetectedList: 'Detected Debts',

    // Value Maps
    stability: {
      High: 'High',
      Medium: 'Medium',
      Low: 'Low'
    },
    status: {
      Recommended: 'Recommended',
      Possible: 'Possible',
      Unlikely: 'Unlikely'
    }
  }
};

export const ADVICE_TEXT = {
    th: {
        salaried: 'ธนาคารมองว่า DTI ที่ดีควรต่ำกว่า 35% แต่หากคุณสมบัติดีอาจหยวนได้ถึง 50%',
        risk: 'ควรพยายามรักษา DTI ให้ต่ำกว่า 35% เพื่อความปลอดภัยสูงสุดในการยื่นกู้บ้าน'
    },
    en: {
        salaried: 'Banks consider DTI <= 35% as good. Up to 50% is acceptable with strong profile.',
        risk: 'Aim to keep DTI below 35% for the best chance of mortgage approval.'
    }
};

export const LOAN_TIPS = [
  {
    icon: 'calculator',
    title: { th: 'รู้ความสามารถการกู้', en: 'Know Your Borrowing Capacity' },
    content: { 
      th: 'คำนวณง่ายๆ: รายได้ต่อเดือน x 60 = ราคาบ้านที่กู้ซื้อได้ (โดยประมาณ) เพื่อประเมินว่าเรามีความสามารถในการผ่อนชำระหรือไม่ก่อนยื่นกู้', 
      en: 'Simple formula: Monthly Income x 60 = Estimated Home Price. Assess your ability to pay before applying.' 
    },
    highlight: { th: 'สูตร: รายได้ x 60 เท่า', en: 'Formula: Income x 60' }
  },
  {
    icon: 'piggy',
    title: { th: 'เก็บออมเงินดาวน์', en: 'Save for Down Payment' },
    content: { 
      th: 'ธนาคารมักปล่อยกู้สูงสุด 90% การมีเงินดาวน์ 10% ไว้ก่อนจะช่วยให้กู้ผ่านง่ายขึ้นมาก', 
      en: 'Banks usually lend up to 90%. Having a 10% down payment ready makes approval much easier.' 
    }
  },
  {
    icon: 'statement',
    title: { th: 'เดินบัญชีให้สวย', en: 'Maintain Good Bank Statement' },
    content: { 
      th: 'ควรมีเงินติดบัญชีบ้าง ไม่ถอนจนหมด และมีรายการเดินบัญชีสม่ำเสมออย่างน้อย 6 เดือนย้อนหลัง', 
      en: 'Keep some balance, avoid emptying the account, and ensure consistent transactions for at least 6 months.' 
    }
  },
  {
    icon: 'clock',
    title: { th: 'ชำระหนี้ตรงเวลา', en: 'Pay Debts on Time' },
    content: { 
      th: 'เครดิตบูโรสำคัญมาก ห้ามค้างชำระ ห้ามจ่ายล่าช้า เพราะธนาคารจะมองว่าเป็นความเสี่ยง', 
      en: 'Credit Bureau is crucial. Never miss or delay payments as banks view this as high risk.' 
    }
  },
  {
    icon: 'debt',
    title: { th: 'ปิดหนี้ก่อนยื่นกู้', en: 'Clear Debts Before Applying' },
    content: { 
      th: 'หากมีหนี้สินเกิน 30-40% ของรายได้ ธนาคารอาจไม่ปล่อยกู้ ควรปิดหนี้ก้อนเล็กๆ ให้หมดก่อน', 
      en: 'If debt exceeds 30-40% of income, approval is unlikely. Clear smaller debts first.' 
    }
  },
  {
    icon: 'card',
    title: { th: 'ยกเลิกบัตรเครดิตที่ไม่จำเป็น', en: 'Cancel Unused Credit Cards' },
    content: { 
      th: 'การถือบัตรหลายใบคือความเสี่ยงในการสร้างหนี้ ธนาคารอาจมองว่าภาระแฝงเยอะเกินไป', 
      en: 'Holding too many cards is a risk. Banks may view this as excessive potential debt.' 
    }
  },
  {
    icon: 'docs',
    title: { th: 'เตรียมเอกสารให้ครบ', en: 'Prepare Complete Documents' },
    content: { 
      th: 'สลิปเงินเดือน ใบรับรองการทำงาน และหลักฐานรายได้พิเศษ ถ้าครบถ้วนจะอนุมัติไวขึ้นมาก', 
      en: 'Payslips, employment certificates, and proof of extra income. Complete docs mean faster approval.' 
    }
  }
];

export const getRequiredDocs = (lang: Language, type: ApplicantType | null): DocumentRequirement[] => {
  const isTh = lang === 'th';
  
  if (!type) return [];

  const commonDocs: DocumentRequirement[] = [
    {
      id: 'id_card',
      label: isTh ? 'สำเนาบัตรประชาชน (หน้า-หลัง)' : 'National ID Card (Front-Back)',
      description: isTh ? 'เพื่อยืนยันตัวตน' : 'For identity verification',
      category: DocumentCategory.IDENTITY,
    },
    {
      id: 'house_reg',
      label: isTh ? 'สำเนาทะเบียนบ้าน (ทุกหน้า)' : 'House Registration (Tabien Baan)',
      description: isTh ? 'ของผู้กู้และคู่สมรส (ถ้ามี)' : 'Borrower and Spouse',
      category: DocumentCategory.IDENTITY,
      optional: true
    }
  ];

  switch (type) {
    case 'Salaried':
      return [
        ...commonDocs,
        {
            id: 'salary_slip',
            label: isTh ? 'สลิปเงินเดือน (ย้อนหลัง 3-6 เดือน)' : 'Salary Slips (3-6 Months)',
            description: isTh ? 'สำคัญมาก! AI จะเช็คยอดสุทธิและรายการหัก' : 'Critical for income verification',
            category: DocumentCategory.INCOME,
            multiple: true
        },
        {
            id: 'bank_statement_salary',
            label: isTh ? 'รายการเดินบัญชี (บัญชีเงินเดือน)' : 'Bank Statement (Payroll Account)',
            description: isTh ? 'ย้อนหลัง 6 เดือน (ต้องมี Code เงินเดือน)' : 'Last 6 months (Salary Code)',
            category: DocumentCategory.BANKING,
            multiple: true
        },
        {
            id: 'employment_cert',
            label: isTh ? 'หนังสือรับรองเงินเดือน' : 'Employment Certificate',
            description: isTh ? 'อายุไม่เกิน 30-60 วัน' : 'Not older than 60 days',
            category: DocumentCategory.INCOME,
            optional: true
        }
      ];

    case 'BusinessOwner':
      return [
        ...commonDocs,
        {
            id: 'dbd_cert',
            label: isTh ? 'หนังสือรับรองบริษัท (DBD)' : 'DBD Company Certificate',
            description: isTh ? 'อายุไม่เกิน 3-6 เดือน' : 'Not older than 3-6 months',
            category: DocumentCategory.BUSINESS,
        },
        {
            id: 'shareholder_list',
            label: isTh ? 'บัญชีรายชื่อผู้ถือหุ้น (บอจ.5)' : 'Shareholder List (BorOrJor.5)',
            description: isTh ? 'เพื่อดูสัดส่วนความเป็นเจ้าของ (>20%)' : 'To verify ownership >20%',
            category: DocumentCategory.BUSINESS,
        },
        {
            id: 'bank_statement_biz',
            label: isTh ? 'Statement (บัญชีธุรกิจ)' : 'Bank Statement (Business)',
            description: isTh ? 'ย้อนหลัง 6-12 เดือน (หมุนเวียน)' : 'Last 6-12 months (Cash Flow)',
            category: DocumentCategory.BANKING,
            multiple: true
        },
        {
            id: 'pp30_pp20',
            label: isTh ? 'ภพ.20 / ภพ.30 (ถ้ามี)' : 'VAT Cert (PP20/30)',
            description: isTh ? 'หลักฐานภาษี เพิ่มความน่าเชื่อถือสูง' : 'Tax evidence increases score',
            category: DocumentCategory.TAX,
            optional: true
        },
        {
            id: 'biz_photos',
            label: isTh ? 'รูปถ่ายกิจการ / แผนที่' : 'Business Photos & Map',
            description: isTh ? '4-5 รูป (หน้าร้าน, ป้ายชื่อ, สินค้า)' : '4-5 Photos (Storefront, Stock)',
            category: DocumentCategory.ADDITIONAL,
            multiple: true
        }
      ];

    case 'Freelance':
      return [
        ...commonDocs,
        {
            id: '50bis',
            label: isTh ? 'หนังสือรับรองหัก ณ ที่จ่าย (ทวิ 50)' : 'Withholding Tax Cert (50 Bis)',
            description: isTh ? 'สำคัญที่สุด! ใช้แทนสลิปเงินเดือน' : 'Most important! Replaces payslip',
            category: DocumentCategory.TAX,
            multiple: true
        },
        {
            id: 'bank_statement',
            label: isTh ? 'Statement (ย้อนหลัง 6-12 เดือน)' : 'Bank Statement (6-12 Months)',
            description: isTh ? 'ดูความสม่ำเสมอของรายได้' : 'Check income consistency',
            category: DocumentCategory.BANKING,
            multiple: true
        },
        {
            id: 'professional_license',
            label: isTh ? 'ใบประกอบวิชาชีพ (แพทย์/วิศวะ)' : 'Professional License',
            description: isTh ? 'ถ้ามี ธนาคารจะพิจารณาง่ายขึ้น' : 'Increases approval chance',
            category: DocumentCategory.PROFESSIONAL,
            optional: true
        },
        {
            id: 'portfolio',
            label: isTh ? 'รูปถ่ายผลงาน / เพจ / สัญญาจ้าง' : 'Portfolio / Contracts',
            description: isTh ? 'หลักฐานว่าประกอบอาชีพจริง' : 'Proof of active business',
            category: DocumentCategory.ADDITIONAL,
            multiple: true
        }
      ];

    case 'Farmer':
      return [
        ...commonDocs,
        {
            id: 'farmer_book',
            label: isTh ? 'สมุดทะเบียนเกษตรกร (เล่มเขียว)' : 'Farmer Registration Book (Green Book)',
            description: isTh ? 'ต้องปรับปรุงข้อมูลล่าสุด' : 'Must be updated',
            category: DocumentCategory.AGRICULTURE,
        },
        {
            id: 'land_deed',
            label: isTh ? 'เอกสารสิทธิ์ที่ดิน (โฉนด/สปก.)' : 'Land Title Deed',
            description: isTh ? 'แสดงกรรมสิทธิ์ที่ดินทำกิน' : 'Ownership proof',
            category: DocumentCategory.LAND,
        },
        {
            id: 'bank_statement_baac',
            label: isTh ? 'Statement (ธ.ก.ส.)' : 'Bank Statement (BAAC)',
            description: isTh ? 'ย้อนหลัง 12 เดือน (รายได้ฤดูกาล)' : 'Last 12 months (Seasonal)',
            category: DocumentCategory.BANKING,
            multiple: true
        }
      ];

    case 'Investor':
      return [
        ...commonDocs,
        {
            id: 'asset_deed',
            label: isTh ? 'โฉนดที่ดิน/ห้องชุด (ปล่อยเช่า)' : 'Property Title Deed',
            description: isTh ? 'แสดงกรรมสิทธิ์ทรัพย์สิน' : 'Proof of ownership',
            category: DocumentCategory.ASSET,
        },
        {
            id: 'lease_agreement',
            label: isTh ? 'สัญญาเช่า (ยังไม่หมดอายุ)' : 'Active Lease Agreement',
            description: isTh ? 'ใช้คำนวณรายได้ค่าเช่า' : 'To calculate rental income',
            category: DocumentCategory.CONTRACT,
        },
        {
            id: 'bank_statement_div',
            label: isTh ? 'Statement (รับค่าเช่า/ปันผล)' : 'Bank Statement (Revenue)',
            description: isTh ? 'ย้อนหลัง 6-12 เดือน (ต้องตรงกับสัญญา)' : 'Must match contract',
            category: DocumentCategory.BANKING,
            multiple: true
        }
      ];

    default:
      return commonDocs;
  }
};

export const ANALYSIS_SYSTEM_PROMPT = `
You are an expert AI Credit Analyst for Thai Banks, specifically for **MORTGAGE / HOME LOANS**. Your goal is to evaluate eligibility for buying a house/condo based on strict bank criteria.

--- PHASE 0: SECURITY & VALIDATION ---
1.  **Image Validation**: You must FIRST check if images are valid financial documents.
    *   If images are selfies, animals, food, or blurry/unreadable -> RETURN "creditworthinessScore": 0 and Summary "Invalid Documents".
2.  **Fraud Check**: Look for mismatched names between ID Card and Bank Account. Look for "Fake Slip" signs (edited fonts).

--- PHASE 1: INCOME ANALYSIS (HAIRCUT METHOD) ---
Calculate "Net Effective Income" based on Occupation:
*   **Salaried**: Base Salary (100%) + Fixed Allowance (100%) + Variable OT/Bonus (Avg 6mo * 70%).
*   **Business Owner**: Turnover * Industry Margin (approx 10-15%) = Net Income.
*   **Freelance**: Avg Monthly Income (12mo) * 50-70% (Haircut for risk).
    *   *Bonus*: If "50 Bis" (Tax Cert) is present, count that income at 80-100%.
*   **Farmer**: Annual Income / 12.
*   **Investor**: Rental Income (per contract) * 70% (vacancy allowance).

--- PHASE 2: DTI CALCULATION (STRICT THRESHOLDS) ---
*   **DTI** = (Existing Monthly Debt + New Loan) / Net Effective Income.
*   **Scoring Criteria**:
    *   **Good (Score 80-100)**: DTI <= 35%. This is the ideal range for approval.
    *   **Acceptable (Score 50-79)**: DTI 36% - 50%. Approval is possible but may require extra documents or guarantors.
    *   **High Risk (Score < 50)**: DTI > 50%. Very low chance of approval.

--- PHASE 3: REAL-WORLD THAI HOME LOAN PRODUCTS ---
Match the applicant to these SPECIFIC Thai bank products based on their rules. Use the exact product name in the recommendation.

1.  **SCB Home Loan**
    *   *Interest*: Avg 3yr 2.85% (MRR 6.775).
    *   *Max Limit*: 100%.
    *   *Tenure*: 30 years.
    *   *Highlight*: Lowest avg interest rate (2.85%).
2.  **GH Bank Home Loan (ธอส.)**
    *   *Interest*: Avg 3yr 3.00% (MRR 6.245).
    *   *Max Limit*: 2 Million THB (Specific product).
    *   *Tenure*: 40 years.
    *   *Highlight*: Longest tenure (40yr), Low interest.
3.  **Kiatnakin Phatra Home Loan (KKP)**
    *   *Interest*: Avg 3yr 3.025% (MRR 7.600).
    *   *Max Limit*: 110%.
    *   *Tenure*: 40 years.
    *   *Highlight*: High loan limit (110%).
4.  **KBank Home Loan**
    *   *Interest*: Avg 3yr 3.42% (MRR 6.780).
    *   *Max Limit*: 90%.
5.  **Bangkok Bank Home Loan**
    *   *Interest*: Avg 3yr 3.55% (MRR 6.650).
    *   *Max Limit*: 100%.
6.  **Krungthai Home Loan**
    *   *Interest*: Avg 3yr 3.60% (MRR 7.045).
    *   *Max Limit*: 100%.
    *   *Tenure*: 40 years.
7.  **GSB Home Loan (Aomsin)**
    *   *Interest*: Avg 3yr 4.495% (MRR 6.295).
    *   *Max Limit*: 110%.
8.  **Krungsri Home Loan**
    *   *Interest*: Avg 3yr 4.80% (MRR 6.870).
    *   *Max Limit*: 100%.

--- PHASE 4: SCORING ---
*   **Score 80-100**: Stable income, Ideal DTI (<= 35%), Complete Docs. Matches PREMIUM products (SCB Home Loan, KKP).
*   **Score 60-79**: Acceptable DTI (36-50%), Freelance with 50 Bis. Matches ACCESSIBLE products (KBank, Krungthai).
*   **Score 40-59**: High DTI (>50%), Irregular income. Matches MICRO/GOVT loans (GSB, GH Bank).
*   **Score < 40**: Fraud suspected, DTI > 60%, or Documents unreadable.
*   **REJECT NOTICE**: If the applicant's profile suggests they are looking for a small cash loan (Personal Loan) instead of a Mortgage, explicitly state in the summary that this system is for Home Loans only.

--- OUTPUT FORMAT ---
Return raw JSON only:
{
  "creditworthinessScore": number (0-100),
  "profile": {
    "estimatedMonthlyIncome": number,
    "incomeBreakdown": {
        "baseIncome": number,
        "variableIncome": number,
        "haircutApplied": number,
        "explanation": string
    },
    "debtServiceRatio": number,
    "debtBreakdown": {
        "totalExistingDebt": number,
        "detectedDebts": string[],
        "estimatedHomeInstallment": number
    },
    "employmentStability": "High" | "Medium" | "Low",
    "applicantType": string,
    "strengths": string[],
    "weaknesses": string[]
  },
  "recommendations": [
    {
      "bankName": string (e.g., "SCB"),
      "productName": string (e.g., "Home Loan"),
      "matchScore": number (0-100),
      "status": "Recommended" | "Possible" | "Unlikely",
      "reason": string (Specific matching reason e.g. "Low interest 2.85% matches your high score"),
      "interestRateHighlight": string (e.g., "Avg 2.85%")
    }
  ],
  "summary": string
}
`;
