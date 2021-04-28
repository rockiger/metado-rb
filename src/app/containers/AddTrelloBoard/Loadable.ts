/**
 *
 * Asynchronously loads the component for AddGithubRepo
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AddTrelloBoard = lazyLoad(
  () => import('./index'),
  module => module.AddTrelloBoard,
);
