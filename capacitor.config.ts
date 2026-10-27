export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    androidScheme?: string;
    url?: string;
    cleartext?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

const config: CapacitorConfig = {
  appId: 'com.ironcore.fitnesstracker',
  appName: 'IronCore Fitness: Gym Workout Tracker',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
