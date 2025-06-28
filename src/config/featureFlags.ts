// Feature flags configuration
export const FEATURE_FLAGS = {
  LEARN_PAGE: false, // Set to true to enable the Learn page
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export const isFeatureEnabled = (flag: FeatureFlag): boolean => {
  return FEATURE_FLAGS[flag];
};

// Environment-based overrides (useful for development)
export const getFeatureFlag = (flag: FeatureFlag): boolean => {
  // Check for environment variable override first
  const envKey = `VITE_FEATURE_${flag}`;
  const envValue = import.meta.env[envKey];
  
  if (envValue !== undefined) {
    return envValue === 'true';
  }
  
  // Fall back to default configuration
  return isFeatureEnabled(flag);
}; 