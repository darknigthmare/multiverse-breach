import baseConfig from '../vite.config.js';

// The repository keeps multi-gigabyte static catalogs in public/. Their files
// are validated by dedicated audits; this profile verifies the executable
// bundle without duplicating that already-audited corpus on constrained disks.
export default {
  ...baseConfig,
  build: {
    ...baseConfig.build,
    copyPublicDir: false
  }
};
