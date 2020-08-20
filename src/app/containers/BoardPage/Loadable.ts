/**
 *
 * Asynchronously loads the component for BoardPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const BoardPage = lazyLoad(
  () => import('./index'),
  module => module.BoardPage,
);
