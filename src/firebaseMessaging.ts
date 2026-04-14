import { messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { userService } from '@/services/userService';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

export async function requestPermissionAndGetToken(): Promise<string | null> {
  if (!('Notification' in window)) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;
    if (!messaging) return null;
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    return token || null;
  } catch (err) {
    console.warn('FCM token error:', err);
    return null;
  }
}

/** Save FCM token to backend via POST /user/save-fcm-token */
export async function saveFCMTokenToBackend(token: string, _jwt?: string): Promise<void> {
  try {
    // ── POST /user/save-fcm-token ─────────────────────────────────
    await userService.saveFcmToken({ fcmToken: token });
    console.log('FCM token saved to backend.');
  } catch (err) {
    console.warn('Could not save FCM token to backend:', err);
  }
}

export function onForegroundMessage(callback: (payload: any) => void) {
  if (!messaging) return;
  onMessage(messaging, callback);
}
