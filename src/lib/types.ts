// src/lib/types.ts

export interface AIResponse {
    requestId: string;
    output: string;
  }
  
  export interface TransactionReceipt {
    logs: { topics: string[] }[];
  }
  
