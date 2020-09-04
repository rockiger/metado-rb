/**
 *
 * AddGithubRepo
 *
 */

import React, { useEffect, useState } from 'react';
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
import {
  selectUserProfile,
  selectBoard,
} from 'app/containers/Database/selectors';
import { actions as databaseActions } from 'app/containers/Database/slice';

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
  // TODO if github token is not present, let the user create one.
  // DONE get repos
  //  DONE filter projects that are allready part of board
  // DONE Add repo/project to board
  //  DONE Handler
  //  TODO Check if project allready in database
  // TODO Think about state machine
  // TODO Step 4 with Confirmation or directly redirecting to board
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: addGithubRepoSaga });
  const dispatch = useDispatch();

  const { step } = useParams();
  const { githubToken, activeBoard } = useSelector(selectUserProfile);
  const { repos, status } = useSelector(selectAddGithubRepo);
  // WARNING projects is not always filled, only when we are comming from board
  const { projects } = useSelector(selectBoard);
  const [selectedRepo, setSelectedRepo] = useState<number>(-1);
  const [repo, setRepo] = useState(repos[selectedRepo]);

  useEffect(() => {
    if (githubToken && repos.length === 0)
      dispatch(actions.fetchGithubRepos({ githubToken }));
  }, [githubToken, repos]);

  useEffect(() => {
    setRepo(repos[selectedRepo]);
  }, [repos, selectedRepo]);

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
                {selectedRepo !== -1 && (
                  <Redirect to={`/projects/add/github/3`} />
                )}
                <p>
                  Please select the repository from which you want to add the
                  issues to your tasks.
                </p>
                {status === 'fetching' && <p>Loading...</p>}
                <table>
                  {repos.filter(addedProjectsFilter).map((repo, index) => (
                    <Row
                      key={repo.node_id}
                      onClick={() => setSelectedRepo(index)}
                      isSelected={index === selectedRepo}
                    >
                      <td>
                        <div>
                          <b>{repo.full_name}</b>
                        </div>
                        <p>{repo.description}</p>
                      </td>
                    </Row>
                  ))}
                </table>
              </>
            )}
            {step === STEPS[2] && (
              <>
                {selectedRepo === -1 && (
                  <Redirect to={`/projects/add/github/2`} />
                )}
                {selectedRepo !== -1 && repo && (
                  <>
                    <h2>Add {repo.name} to your tasks ?</h2>
                    <Card>
                      <h3>{repo.full_name} </h3>
                      <div> {repo.description} </div>
                    </Card>
                    <p>
                      Open GitHub issues will show in your 'Backlog' column.When
                      you move a an issue to your 'Done' column, we will be
                      automatically closed.Vice verca if it is closed it is
                      automatically in the 'Done' column.
                    </p>
                    <div>
                      <Button onClick={onClickGoBack}>
                        Back to Selection{' '}
                      </Button>
                      <Button onClick={() => onClickAdd(repo)}>
                        Add <b> {` ${repo.name} `} </b> to task
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </Card>
        </Content>
      </PrivatePage>
    </>
  );

  function addedProjectsFilter(repo) {
    console.log(`github-${repo.owner.login}-${repo.name}`, projects);
    return !projects.includes(`github-${repo.owner.login}-${repo.name}`);
  }

  function onClickGoBack() {
    setSelectedRepo(-1);
  }

  function onClickAdd(repo: { [x: string]: any }) {
    dispatch(databaseActions.addGithubProject({ activeBoard, repo }));
  }
}

const Steps = styled(Horizontal)`
  display: flex;
  padding: 2rem 0;
`;

type StepProps = {
  isActive: boolean;
};
const Step = styled.div<StepProps>`
  font-weight: ${p => (p.isActive ? 600 : 'normal')};
`;

type RowProps = {
  isSelected: boolean;
};
const Row = styled.tr<RowProps>`
  background-color: ${p =>
    p.isSelected ? 'var(--bg-color-secondary)' : 'var(--bg-color)'};
`;
