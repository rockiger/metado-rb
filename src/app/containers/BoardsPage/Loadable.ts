/**
 *
 * Asynchronously loads the component for BoardsPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const BoardsPage = lazyLoad(
  () => import('./index'),
  module => module.BoardsPage,
);
