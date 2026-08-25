export const applyPolyfills = async () => Promise.resolve();

export const defineCustomElements = async (win, opts = {}) => {
  if (typeof window === 'undefined') {
    return;
  }

  await import('../dist/recipe-components/recipe-components.esm.js');
};
