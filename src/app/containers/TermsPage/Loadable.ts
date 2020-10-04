/**
 *
 * Asynchronously loads the component for TermsPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TermsPage = lazyLoad(
  () => import('./index'),
  module => module.TermsPage,
);
