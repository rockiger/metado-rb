import { BoardPageState } from 'app/containers/BoardPage/types';
import { PrivateRouteState } from 'app/containers/PrivateRoute/types';
import { DatabaseState } from 'app/containers/Database/types';
import { AddGithubRepoState } from 'app/containers/AddGithubRepo/types';
import { AddGoogleTasklistState } from 'app/containers/AddGoogleTasklist/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  boardPage?: BoardPageState;
  privateRoute?: PrivateRouteState;
  database?: DatabaseState;
  addGithubRepo?: AddGithubRepoState;
  addGoogleTasklist?: AddGoogleTasklistState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
