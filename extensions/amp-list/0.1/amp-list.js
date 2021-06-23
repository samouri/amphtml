const TAG = 'amp-list';
AMP.extension(TAG, '0.1', (AMP) => {
  return import('./list').then(({AmpList, CSS}) => {
    AMP.registerElement(TAG, AmpList, CSS);
  })
});
