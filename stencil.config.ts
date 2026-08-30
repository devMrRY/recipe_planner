import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'recipe-planner',

  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },

    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },

    {
      type: 'docs-readme',
    },
  ],
};