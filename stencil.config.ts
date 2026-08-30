import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'recipe-planner',

  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        {
          src: 'assets',
        },
      ],
    },

    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
      copy: [
        {
          src: 'assets',
        },
      ],
    },

    {
      type: 'docs-readme',
    },
  ],
};