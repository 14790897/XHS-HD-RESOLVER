export interface ResolutionResult {
  originalInput: string;
  traceId: string;
  hdUrl: string;
  timestamp: number;
}

export interface ResolverState {
  input: string;
  result: ResolutionResult | null;
  error: string | null;
  isLoading: boolean;
  history: ResolutionResult[];
  autoDownload: boolean;
}

export const TEST_CASE_URL = "https://sns-webpic-qc.xhscdn.com/202511292028/30ab642bea120348cf64a607c9eb8141/1040g00830t2hgqelk4005o49b2u097vri7c1ij8!nd_dft_wlteh_webp_3";
