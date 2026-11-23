import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Api from "../api/Api";

const VISITOR_ID_KEY = "rbsga_visitor_id";
const SESSION_ID_KEY = "rbsga_session_id";

function getOrCreateVisitorId(): string {
  try {
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid) {
      vid = "v_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    return vid;
  } catch {
    return "v_anon_" + Date.now();
  }
}

function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sid) {
      sid = "s_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      sessionStorage.setItem(SESSION_ID_KEY, sid);
    }
    return sid;
  } catch {
    return "s_anon_" + Date.now();
  }
}

function detectClientInfo() {
  const ua = navigator.userAgent || "";
  let deviceType = "Desktop";
  if (/mobile|android|iphone/i.test(ua)) deviceType = "Mobile";
  else if (/tablet|ipad/i.test(ua)) deviceType = "Tablet";

  let browser = "Other";
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome/i.test(ua) && !/chromium/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/opera|opr/i.test(ua)) browser = "Opera";

  let os = "Other";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad/i.test(ua)) os = "iOS";

  return { deviceType, browser, os };
}

export function useVisitorTracker() {
  const location = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const prevPathRef = useRef<string>(location.pathname);

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const { deviceType, browser, os } = detectClientInfo();

    // 1. Send duration of previous page if moving between routes
    const now = Date.now();
    const durationSeconds = Math.max(0, Math.round((now - startTimeRef.current) / 1000));
    startTimeRef.current = now;

    // 2. Track new page view
    const trackPayload = {
      visitorId,
      sessionId,
      pageUrl: location.pathname,
      pageTitle: document.title || location.pathname,
      referrerUrl: document.referrer || prevPathRef.current || "",
      deviceType,
      browser,
      os,
      durationSeconds: durationSeconds > 0 && durationSeconds < 3600 ? durationSeconds : 0
    };

    prevPathRef.current = location.pathname;

    Api.post("/api/analytics/track", trackPayload).catch(() => {
      // Non-blocking: fail-safe silently if offline
    });
  }, [location.pathname]);
}

export default useVisitorTracker;
