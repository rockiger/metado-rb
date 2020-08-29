/**
 *
 * AddGithubRepo
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectAddGithubRepo } from './selectors';
import { addGithubRepoSaga } from './saga';
import { Navbar } from 'app/components/Navbar';
import {
  Content,
  Horizontal,
  PageHeader,
  PageTitle,
  PrivatePage,
  Spacer,
} from 'app/components/UiComponents';

interface Props {}

const steps = ['1', '2', '3'];

export function AddGithubRepo(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: addGithubRepoSaga });
  const { step } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addGithubRepo = useSelector(selectAddGithubRepo);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  console.log({ step, steps });

  if (!steps.includes(step)) {
    return <Redirect to={`/projects/add/github/1`} />;
  }

  return (
    <>
      <Helmet>
        <title>AddGithubRepo</title>
        <meta name="description" content="Description of AddGithubRepo" />
      </Helmet>
      <PrivatePage>
        <Navbar />
        <PageHeader>
          <PageTitle>Add Github Project</PageTitle>
        </PageHeader>
        <Content>
          <Steps>
            <Step isActive={steps[0] === step}>Login with GitHub</Step>
            <Spacer />
            <Step isActive={steps[1] === step}>Select repository</Step>
            <Spacer />
            <Step isActive={steps[2] === step}>Add to board</Step>
          </Steps>
        </Content>
      </PrivatePage>
    </>
  );
}

type StepProps = {
  isActive: boolean;
};

const Steps = styled(Horizontal)`
  display: flex;
`;

const Step = styled.div<StepProps>`
  font-weight: ${p => (p.isActive ? 600 : 'normal')};
`;
