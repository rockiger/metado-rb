/**
 *
 * AddGithubRepo
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Github } from 'styled-icons/boxicons-logos';

import { Navbar } from 'app/components/Navbar';
import {
  A,
  Card,
  Content,
  Horizontal,
  PageHeader,
  PageTitle,
  PrivatePage,
  Spacer,
  Button,
} from 'app/components/UiComponents';
import { selectUserProfile } from 'app/containers/Database/selectors';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { selectAddGithubRepo } from './selectors';
import { addGithubRepoSaga } from './saga';

const CLIENT_ID = '58f80a76bbfb3166f37f';
const BASE_URL = `${window.location.protocol}//${window.location.hostname}${
  window.location.port ? `:${window.location.port}` : ''
}`;
const REDIRECT_URI = `${BASE_URL}/projects/add/github`;

interface Props {}

const STEPS = ['1', '2', '3'];

console.log({ BASE_URL });

export function AddGithubRepo(props: Props) {
  // DONE look for github key of user
  // TODO log into github if how githubToken is present
  // TODO get repos
  // TODO Add repo/project to board and user if not allready present
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: addGithubRepoSaga });
  const { step } = useParams();
  const { githubToken, activeBoard } = useSelector(selectUserProfile);
  const { repos, status } = useSelector(selectAddGithubRepo);
  const dispatch = useDispatch();

  useEffect(() => {
    if (githubToken && repos.length === 0)
      dispatch(actions.fetchGithubRepos({ githubToken }));
  }, [githubToken, repos]);

  console.log({ activeBoard, githubToken, step, steps: STEPS });

  if (!STEPS.includes(step)) {
    return <Redirect to={`/projects/add/github/1`} />;
  }

  if (step === STEPS[0] && githubToken) {
    return <Redirect to={`/projects/add/github/2`} />;
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
            <Step isActive={step === STEPS[0]}>Login with GitHub</Step>
            <Spacer />
            <Step isActive={step === STEPS[1]}>Select repository</Step>
            <Spacer />
            <Step isActive={step === STEPS[2]}>Add to board</Step>
          </Steps>
          <Card>
            {step === STEPS[0] && (
              <>
                <Button
                  as={A}
                  href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo&redirect_uri=${REDIRECT_URI}`}
                >
                  <Github size="1.5rem" /> GitHub - Login
                </Button>
                <p>
                  We need you to login to GitHub and authorize Metado to access
                  your repositorys.
                </p>
              </>
            )}
            {step === STEPS[1] && (
              <>
                <p>
                  Please select the repository from which you want to add the
                  issues to your tasks.
                </p>
                <table>
                  {repos.map(repo => (
                    <tr key={repo.node_id}>
                      <td>
                        <div>
                          <b>{repo.full_name}</b>
                        </div>
                        <p>{repo.description}</p>
                      </td>
                    </tr>
                  ))}
                </table>
              </>
            )}
            {step === STEPS[2] && <p>Step 3</p>}
          </Card>
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
  padding: 2rem 0;
`;

const Step = styled.div<StepProps>`
  font-weight: ${p => (p.isActive ? 600 : 'normal')};
`;
