export interface ExtractSettingRequest {
  txt: string;
  episode?: number;
  subtitle: string;
  check: Record<string, never>; // empty object
  title: string;
  writer: string;
}

export interface ExtractSettingResponse {
  // The code doesn't show the response structure used, it just alerts success.
  // We can assume it returns something, but for now we can use any or void.
  // But usually axios returns data.
  [key: string]: any;
}
