import { registerWebModule, NativeModule } from 'expo';

// MockLocationModule is not available on the web platform.
class MockLocationModule extends NativeModule<{}> {
  startService(_latitude: number, _longitude: number) {
    console.warn('MockLocation no está disponible en web.');
  }

  stopService() {
    console.warn('MockLocation no está disponible en web.');
  }
}

export default registerWebModule(MockLocationModule, 'MockLocationModule');
