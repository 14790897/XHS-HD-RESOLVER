/**
 * Core Logic for XHS HD Resolver
 * 1. Extract Trace ID (starts with 1040g, ends before !)
 * 2. Replace domain with valid CDN (Huawei/Baidu)
 * 3. Append parameters for PNG format
 */

const TARGET_DOMAIN = "https://sns-img-hw.xhscdn.com/";
const SUFFIX_PARAM = "?imageView2/2/w/format/png";
const TRACE_ID_REGEX = /(1040g[^!]+)/;

export const extractTraceId = (input: string): string | null => {
  const match = input.match(TRACE_ID_REGEX);
  return match ? match[1] : null;
};

export const generateHdUrl = (traceId: string): string => {
  return `${TARGET_DOMAIN}${traceId}${SUFFIX_PARAM}`;
};

export const resolveXhsUrl = (input: string): { traceId: string; url: string } | null => {
  const traceId = extractTraceId(input);
  if (!traceId) {
    return null;
  }
  return {
    traceId,
    url: generateHdUrl(traceId),
  };
};

export const triggerDownload = async (url: string, filename: string) => {
  try {
    // Attempt to fetch as blob to force download (avoids opening in tab if possible)
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (e) {
    // Fallback if CORS blocks fetch (though XHS CDN is usually permissible)
    console.warn("Direct blob download failed, opening in new tab", e);
    window.open(url, '_blank');
  }
};
