import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'recipe-components',
  outputTargets: [
    { type: 'dist' },
    { type: 'dist-custom-elements' },
    { type: 'www', serviceWorker: null }
  ],
  extras: {
    scriptDataOpts: true
  }
};
