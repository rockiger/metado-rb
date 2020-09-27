/**
 *
 * Asynchronously loads the component for AddGoogleTasklist
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AddGoogleTasklist = lazyLoad(
  () => import('./index'),
  module => module.AddGoogleTasklist,
);
