/**
 * IRONMIND Ad Configuration - Unity Ads
 * 
 * Active Configuration:
 * - Provider: Unity Ads
 * - Unity Game ID (Android): 800382946
 * - Banner Placement ID: BP_Banner_Android
 * - Interstitial Placement ID: BP_Interstitial_Android
 */

export const AD_CONFIG = {
  // Active Ad Network Provider: 'unity'
  activeProvider: 'unity' as 'unity' | 'admob' | 'startio',

  // Master switch to enable or disable ads across the app
  enabled: true,

  // Unity Ads Configuration (ACTIVE)
  unity: {
    gameId: '800382946',
    platform: 'android' as const,
    bannerPlacementId: 'BP_Banner_Android',
    interstitialPlacementId: 'BP_Interstitial_Android',
    testMode: true,
  },

  // Legacy Ad Networks (DISABLED)
  admob: {
    enabled: false,
    appId: 'ca-app-pub-3940256099942544~3347511713',
    bannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111',
    interstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712',
  },

  startio: {
    enabled: false,
    appId: '208745129',
    bannerPlacementId: 'startio_tools_banner_320x50',
    interstitialPlacementId: 'startio_workout_finish_interstitial',
  },

  // Visual settings for development & verification
  displayTestBadge: true,
};
