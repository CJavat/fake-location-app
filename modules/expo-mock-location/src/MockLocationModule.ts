import { NativeModule, requireNativeModule } from 'expo';

declare class MockLocationModule extends NativeModule<{
  onMockLocationStopped: () => void;
}> {
  startService(latitude: number, longitude: number): void;
  stopService(): void;
}

export default requireNativeModule<MockLocationModule>('MockLocation');
