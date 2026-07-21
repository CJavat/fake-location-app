import * as ExpoLocation from "expo-location";
import { Linking, PermissionsAndroid, Platform } from "react-native";

import MockLocationModule from "../../modules/expo-mock-location/src/MockLocationModule";

const MOCK_LOCATION_APP_NOT_SELECTED_CODE =
  "ERR_MOCK_LOCATION_APP_NOT_SELECTED";

async function ensureLocationPermission(): Promise<boolean> {
  const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
  return status === "granted";
}

async function ensureNotificationPermission(): Promise<void> {
  if (Platform.OS !== "android" || Platform.Version < 33) return;

  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
}

export type StartFakeLocationResult =
  | { success: true }
  | {
      success: false;
      reason:
        | "permission-denied"
        | "mock-location-app-not-selected"
        | "native-error";
      message?: string;
    };

export async function startFakeLocation(
  latitude: number,
  longitude: number,
): Promise<StartFakeLocationResult> {
  const hasLocationPermission = await ensureLocationPermission();
  if (!hasLocationPermission) {
    return { success: false, reason: "permission-denied" };
  }

  await ensureNotificationPermission();

  try {
    MockLocationModule.startService(latitude, longitude);
    return { success: true };
  } catch (error) {
    const code = (error as { code?: string } | null)?.code;

    return {
      success: false,
      reason:
        code === MOCK_LOCATION_APP_NOT_SELECTED_CODE
          ? "mock-location-app-not-selected"
          : "native-error",
      message: error instanceof Error ? error.message : undefined,
    };
  }
}

export async function openDeveloperOptions(): Promise<void> {
  try {
    await Linking.sendIntent(
      "android.settings.APPLICATION_DEVELOPMENT_SETTINGS",
    );
  } catch {
    await Linking.openSettings();
  }
}

export function stopFakeLocation(): void {
  MockLocationModule.stopService();
}

export function onFakeLocationStopped(callback: () => void): () => void {
  const subscription = MockLocationModule.addListener(
    "onMockLocationStopped",
    callback,
  );
  return () => subscription.remove();
}
