# Mobile App Testing

## Current Status

Mobile app testing is not yet implemented. This document outlines options for future consideration.

## Testing Approaches

### 1. Web Layer Testing (Current Option)
- Test the Angular app in a browser using Playwright
- Tests run before the app is wrapped in Capacitor
- Fast and easy to set up
- **Limitation:** Doesn't test native functionality or mobile-specific features

### 2. Native Mobile Testing (Future Consideration)

Playwright **does not work** for native mobile apps. Consider these alternatives:

#### Appium
- Industry standard for native mobile testing
- Works with both iOS and Android
- Similar API to Selenium/Playwright
- Tests actual native apps on devices/emulators
- **Use case:** Comprehensive e2e testing of native features

#### Detox (by Wix)
- Gray box testing framework
- Great developer experience
- Fast and reliable
- Works well with Capacitor apps
- **Use case:** Developer-friendly mobile testing with better performance

#### Maestro
- Newer, simpler mobile testing tool
- YAML-based configuration
- Works with iOS and Android
- Easy to learn and use
- **Use case:** Quick setup, simple test scenarios

## Recommendation

For a Capacitor/Angular app:
1. Use Playwright for web layer testing (can be added to this app)
2. Choose Appium, Detox, or Maestro when native testing is needed
3. Start with Maestro if simplicity is preferred, or Appium for comprehensive testing

## Resources

- [Appium Documentation](https://appium.io/docs/en/latest/)
- [Detox Documentation](https://wix.github.io/Detox/)
- [Maestro Documentation](https://maestro.mobile.dev/)
- [Capacitor Testing Guide](https://capacitorjs.com/docs/guides/automated-configuration)
