
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, UploadedFile, Language, ApplicantType } from "../types";
import { ANALYSIS_SYSTEM_PROMPT } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to robustly determine MIME type
const getMimeType = (file: File, storedMimeType: string): string => {
  // If browser detected it, use it (unless it's generic application/octet-stream which we might want to refine)
  if (storedMimeType && storedMimeType !== '' && storedMimeType !== 'application/octet-stream') {
    return storedMimeType;
  }
  
  // Fallback to extension check
  const extension = file.name.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf': return 'application/pdf';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'webp': return 'image/webp';
    case 'heic': return 'image/heic';
    case 'heif': return 'image/heif';
    default: return storedMimeType || 'application/pdf'; // Default to PDF for this specific loan app context
  }
};

// Helper to read file as Base64
const fileToPart = (uploadedFile: UploadedFile): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    if (uploadedFile.file.size === 0) {
      reject(new Error(`File ${uploadedFile.file.name} is empty (0 bytes).`));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (!result) {
        reject(new Error(`Failed to read file ${uploadedFile.file.name}`));
        return;
      }

      // Robustly extract base64, handling cases with or without the data URI prefix
      const base64String = result.includes(',') ? result.split(',')[1] : result;
      const finalMimeType = getMimeType(uploadedFile.file, uploadedFile.mimeType);

      resolve({
        inlineData: {
          data: base64String,
          mimeType: finalMimeType,
        },
      });
    };
    reader.onerror = () => reject(new Error(`Error reading file ${uploadedFile.file.name}`));
    reader.readAsDataURL(uploadedFile.file);
  });
};

export const analyzeDocuments = async (files: UploadedFile[], lang: Language = 'th', type: ApplicantType): Promise<AnalysisResult> => {
  try {
    // 1. Prepare files for Multimodal input
    const fileParts = await Promise.all(files.map((f) => fileToPart(f)));

    // 2. Define the Output Schema
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        creditworthinessScore: { type: Type.NUMBER, description: "Score from 0 to 100" },
        profile: {
          type: Type.OBJECT,
          properties: {
            estimatedMonthlyIncome: { type: Type.NUMBER },
            incomeBreakdown: {
                type: Type.OBJECT,
                properties: {
                    baseIncome: { type: Type.NUMBER, description: "Base salary/income before cuts" },
                    variableIncome: { type: Type.NUMBER, description: "OT, Bonus, Commission" },
                    haircutApplied: { type: Type.NUMBER, description: "Total amount removed due to risk/haircut" },
                    explanation: { type: Type.STRING, description: "Brief explanation of calculation, e.g. 'OT counted at 70%'" }
                },
                required: ["baseIncome", "variableIncome", "haircutApplied", "explanation"]
            },
            debtServiceRatio: { type: Type.NUMBER, description: "Estimated percentage 0-100" },
            debtBreakdown: {
                type: Type.OBJECT,
                properties: {
                    totalExistingDebt: { type: Type.NUMBER, description: "Sum of current monthly obligations" },
                    detectedDebts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of detected debts e.g. 'Co-op Loan', 'Car Installment'" },
                    estimatedHomeInstallment: { type: Type.NUMBER, description: "Estimated installment for the new home loan" }
                },
                required: ["totalExistingDebt", "detectedDebts", "estimatedHomeInstallment"]
            },
            employmentStability: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            applicantType: { type: Type.STRING, enum: ["Salaried", "Business Owner", "Freelance", "Farmer", "Investor"] },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["estimatedMonthlyIncome", "debtServiceRatio", "employmentStability", "applicantType", "strengths", "weaknesses"],
        },
        recommendations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              bankName: { type: Type.STRING },
              productName: { type: Type.STRING },
              matchScore: { type: Type.NUMBER },
              status: { type: Type.STRING, enum: ["Recommended", "Possible", "Unlikely"] },
              reason: { type: Type.STRING },
              interestRateHighlight: { type: Type.STRING },
            },
            required: ["bankName", "productName", "matchScore", "status", "reason", "interestRateHighlight"],
          },
        },
        summary: { type: Type.STRING },
      },
      required: ["creditworthinessScore", "profile", "recommendations", "summary"],
    };

    // 3. Call Gemini
    // Using gemini-2.5-flash for speed and cost-efficiency with multimodal docs
    const languageInstruction = lang === 'th' 
        ? "Respond in Thai language for all text fields (summary, reasons, strengths, weaknesses)."
        : "Respond in English language for all text fields (summary, reasons, strengths, weaknesses).";

    const typeContext = `The user is applying as a **${type}**. Focus analysis on documents relevant to this type (e.g. 50 Bis for Freelance, Farmer book for Farmers, Salary Slips for Salaried).`;
    
    // ENFORCE HOME LOAN CONTEXT
    const purposeContext = `User is applying for a **HOME LOAN (Mortgage)**. Analyze their ability to pay for a real estate property. IGNORE Personal Loan criteria.`;

    // Strict prompt addition to prevent hallucination on random files
    const validationInstruction = "IMPORTANT: First, VERIFY if the images are valid financial documents (IDs, Statements, Certificates). If the images are random photos or irrelevant, set score to 0 and explicitly state 'Invalid Documents' in the summary. Do not make up data.";

    // Math instructions for consistency
    const mathInstruction = "MATHEMATICAL PRECISION: Use exact values found in documents. Do not estimate unless necessary. Round all final monetary values to 2 decimal places. Ensure Income - Haircut = Estimated Monthly Income.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          ...fileParts,
          { text: `Analyze these loan documents and generate a Mortgage prediction profile. ${typeContext} ${purposeContext} ${validationInstruction} ${mathInstruction} ${languageInstruction} Calculate Income Breakdown and Debt Breakdown explicitly.` }
        ]
      },
      config: {
        systemInstruction: ANALYSIS_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.0, // Set to 0.0 for deterministic results (prevents variation between runs)
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Improve error message for user
    if (error instanceof Error && error.message.includes("no pages")) {
        throw new Error("Cannot read PDF file. Please ensure the file is not corrupted or password protected.");
    }
    throw error;
  }
};
