/**
 *
 * Asynchronously loads the component for AddGithubRepo
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AddGithubRepo = lazyLoad(
  () => import('./index'),
  module => module.AddGithubRepo,
);
