/**
 *
 * AddGithubRepo
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectAddGithubRepo } from './selectors';
import { addGithubRepoSaga } from './saga';

interface Props {}

export function AddGithubRepo(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: addGithubRepoSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addGithubRepo = useSelector(selectAddGithubRepo);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  return (
    <>
      <Helmet>
        <title>AddGithubRepo</title>
        <meta name="description" content="Description of AddGithubRepo" />
      </Helmet>
      <Div></Div>
    </>
  );
}

const Div = styled.div``;
