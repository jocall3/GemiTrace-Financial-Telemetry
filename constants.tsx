
import React from 'react';

export const C_N = "Citibank demo business Inc";
export const C_B_U_R_L = "citibankdemobusiness.dev";

export enum AccNumTypEnum {
  IBAN = "IBAN",
  CLABE = "CLABE",
  SWIFT = "SWIFT",
  ABA = "ABA",
  BIC = "BIC",
  ACCOUNT = "ACCOUNT",
  CARD = "CARD",
  CRYPTO_WALLET = "CRYPTO_WALLET",
  UPI = "UPI",
  PIX = "PIX",
  FPS = "FPS",
  PAYPAL_ID = "PAYPAL_ID",
  VENMO_ID = "VENMO_ID",
  ZELLE_ID = "ZELLE_ID",
  CHAPS = "CHAPS",
  FEDWIRE = "FEDWIRE",
  SEPA = "SEPA",
  RTP = "RTP",
  OTHER = "OTHER",
  TAX_ID = "TAX_ID",
  NATIONAL_ID = "NATIONAL_ID"
}

export enum GMI_TLM_EVT_TYP {
  INF = "INF",
  DBG = "DBG",
  WRN = "WRN",
  ERR = "ERR",
  CRT = "CRT",
  CPL_EVL_STRT = "ComplianceEvaluationStarted",
  CPL_EVL_CMPL = "ComplianceEvaluationCompleted",
  CPL_VIO = "AccountNumberComplianceViolation",
  CPL_ADPT_INIT = "ComplianceAdaptationInitiated",
  CPL_RUL_ADPT = "ComplianceRuleAdapted",
  PRM_PRC = "PromptProcessed",
  SVC_DSC = "ServiceDiscovery",
  MSK_SST_ADJ = "MaskingSensitivityAdjusted",
  ACC_CPL_CHK = "AccountNumberComplianceChecked",
  ACC_MSK = "AccountNumberMasked",
  VAL_ANM_DET = "ValidationAnomalyDetected",
  CIR_BRK_WRN = "CircuitBreakerWarning",
  CIR_BRK_OPN = "CircuitBreakerOpen",
  CPL_SNC_CHK_FIL = "ComplianceSanctionCheckFailure",
  USR_LOG_IN = "UserLoggedIn",
  SEC_EVN_DET = "SecurityEventDetected",
  DATA_BRH_SUS = "DataBreachSuspected",
  UN_AUTH_ACC = "UnauthorizedAccessAttempt",
  DB_CON_FL = "DatabaseConnectionFailed",
  TXN_RT_LIM_HIT = "TransactionRateLimitHit",
  API_KEY_COMP = "APIKeyCompromised",
  INSIDER_THRD = "InsiderThreatDetected"
}

// Generate a smaller, stable company list for the demo
const cmpPfx = ["Gem", "ChA", "Pip", "Git", "Hug", "Pla", "Mod", "Goo", "OnD", "Azu", "Sup", "Ver", "Sal", "Ora", "Mar", "Cit", "Sho", "Woo", "GoD", "Cpa"];
const cmpSfx = ["ini", "Gpt", "Drm", "Hub", "Fac", "aid", "Trs", "Dri", "Drv", "Clu", "Bas", "Cel", "Frc", "cle", "qta", "Ban", "ify", "Com"];
const cmpWrd = ["Bank", "Trade", "Pay", "Credit", "Capital", "Digital", "Cloud", "Data", "Smart", "Global", "Fin", "Money", "Wallet", "Ledger"];

export const cmpList = Array.from({ length: 50 }, (_, i) => {
  const pI = i % cmpPfx.length;
  const sI = (i * 3) % cmpSfx.length;
  const wI = (i * 7) % cmpWrd.length;
  return (cmpPfx[pI] + cmpWrd[wI] + cmpSfx[sI]).replace(/\s/g, '');
});

export const getSeverityColor = (sev: string) => {
  switch (sev) {
    case 'CRT': return 'bg-red-600 text-white';
    case 'ERR': return 'bg-red-100 text-red-700 border-red-200';
    case 'WRN': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'DBG': return 'bg-slate-100 text-slate-700 border-slate-200';
    default: return 'bg-blue-100 text-blue-700 border-blue-200';
  }
};
