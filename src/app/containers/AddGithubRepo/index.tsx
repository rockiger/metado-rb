/**
 *
 * AddGithubRepo
 *
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Github } from 'styled-icons/boxicons-logos';

import { Navbar } from 'app/components/Navbar';
import {
  A,
  Button,
  ButtonOutlined,
  Card,
  Container,
  Content,
  PageHeader,
  PageTitle,
  PrivatePage,
} from 'app/components/UiComponents';
import {
  Content as StepContent,
  Description,
  Step,
  Steps,
  Title,
} from 'app/components/UiComponents/Step';
import {
  List,
  ListDescription,
  ListHeader,
  ListItem,
  ListContent,
  ListIcon,
} from 'app/components/UiComponents/List';
import {
  selectAddingProject,
  selectBoard,
  selectError,
  selectUserProfile,
} from 'app/containers/Database/selectors';
import { actions as databaseActions } from 'app/containers/Database/slice';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { selectAddGithubRepo } from './selectors';
import { addGithubRepoSaga } from './saga';

const BASE_URL = `${window.location.protocol}//${window.location.hostname}${
  window.location.port ? `:${window.location.port}` : ''
}`;
const CLIENT_ID = '58f80a76bbfb3166f37f';
const REDIRECT_URI = `${BASE_URL}/projects/add/github`;
const STEPS = ['0', '1', '2', '3'];

interface Props {}

export function AddGithubRepo(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: addGithubRepoSaga });
  const dispatch = useDispatch();

  const { step } = useParams();
  const { repos, status } = useSelector(selectAddGithubRepo);
  const addingProjectStatus = useSelector(selectAddingProject);
  // WARNING projects is not always filled, only when we are comming from board
  const {
    board: { projects },
  } = useSelector(selectBoard);
  const error = useSelector(selectError);
  const { githubToken, activeBoard } = useSelector(selectUserProfile);
  const [selectedRepo, setSelectedRepo] = useState<number>(-1);
  const [repo, setRepo] = useState(repos[selectedRepo]);
  const [view, setView] = useState(0);
  const [settingProject, setSettingProject] = useState<
    'init' | 'setting' | 'finished'
  >('init');

  useEffect(() => {
    dispatch(databaseActions.resetAddProject());
    return () => {
      dispatch(databaseActions.resetAddProject());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (githubToken && repos.length === 0)
      dispatch(actions.fetchGithubRepos({ githubToken }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [githubToken, repos]);

  useEffect(() => {
    setRepo(repos[selectedRepo]);
  }, [repos, selectedRepo]);

  useEffect(() => {
    switch (view) {
      case 0:
        if (githubToken) {
          setView(1);
        }
        break;
      case 1:
        if (selectedRepo !== -1) {
          setView(2);
        }
        break;
      case 2:
        if (selectedRepo === -1) {
          setView(1);
        } else if (
          addingProjectStatus === 'error' ||
          addingProjectStatus === 'success'
        ) {
          setView(3);
        }
        break;

      case 3:
        break;

      default:
        break;
    }
  }, [addingProjectStatus, githubToken, selectedRepo, settingProject, view]);

  console.log({ activeBoard, githubToken, step, steps: STEPS });

  if (!STEPS.includes(step)) {
    return <Redirect to={`/projects/add/github/${STEPS[0]}`} />;
  }

  if (view === 1 && step === STEPS[0] && githubToken) {
    return <Redirect to={`/projects/add/github/${STEPS[1]}`} />;
  }

  return (
    <>
      <Helmet>
        <title>AddGithubRepo</title>
        <meta name="description" content="Description of AddGithubRepo" />
      </Helmet>
      <PrivatePage>
        <Navbar />
        <Container>
          <PageHeader>
            <PageTitle>Add Github Project</PageTitle>
          </PageHeader>
          <Content>
            <StepsWrapper>
              <Steps>
                <Step isActive={view === 0} isCompleted={0 < view}>
                  <StepContent>
                    <Title>Generate API-Token</Title>
                    <Description>
                      Get an API-token to authenticate with GitHub.
                    </Description>
                  </StepContent>
                </Step>
                <Step isActive={view === 1} isCompleted={1 < view}>
                  <StepContent>
                    <Title>Select repository</Title>
                    <Description>
                      Choose the repo you want to add your board.
                    </Description>
                  </StepContent>
                </Step>
                <Step isActive={view === 2} isCompleted={2 < view}>
                  <StepContent>
                    <Title>Add to board</Title>
                    <Description>Verify the repo details</Description>
                  </StepContent>
                </Step>
              </Steps>
            </StepsWrapper>
            <Card>
              {view === 0 && (
                <>
                  {step !== 0 && (
                    <Redirect to={`/projects/add/github/${STEPS[0]}`} />
                  )}
                  <View>
                    <View1>
                      <p>
                        We need you to login to GitHub and authorize Metado to
                        access your repositorys. This will allow us, to fetch
                        your issues.
                      </p>
                      <Button
                        as={A}
                        href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo&redirect_uri=${REDIRECT_URI}`}
                      >
                        <Github size="1.5rem" /> GitHub - Login
                      </Button>
                    </View1>
                  </View>
                </>
              )}
              {view === 1 && (
                <>
                  {selectedRepo !== -1 && (
                    <Redirect to={`/projects/add/github/${STEPS[2]}`} />
                  )}
                  {step !== 1 && (
                    <Redirect to={`/projects/add/github/${STEPS[1]}`} />
                  )}
                  <p>
                    Please select the repository from which you want to add the
                    issues to your tasks.
                  </p>
                  {status === 'fetching' && <p>Loading...</p>}
                  <List>
                    {repos.filter(addedProjectsFilter).map((repo, index) => (
                      <ListItem
                        key={repo.node_id}
                        onClick={() => setSelectedRepo(index)}
                        isSelected={index === selectedRepo}
                      >
                        <ListIcon>
                          <GithubIcon />
                        </ListIcon>
                        <ListContent>
                          <ListHeader as="div">{repo.full_name}</ListHeader>
                          <ListDescription>{repo.description}</ListDescription>
                        </ListContent>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              {view === 2 && (
                <>
                  {step !== 2 && (
                    <Redirect to={`/projects/add/github/${STEPS[2]}`} />
                  )}
                  {selectedRepo !== -1 && repo && (
                    <>
                      <View>
                        <View1>
                          <h4>Add {repo.name} to your tasks?</h4>
                          <Card>
                            <h5>
                              <b>{repo.full_name}</b>
                            </h5>
                            <div> {repo.description} </div>
                          </Card>
                          <p></p>
                          <p>
                            Open GitHub issues will show in your 'Backlog'
                            column. When you move an issue to your 'Done'
                            column, it will be automatically closed.
                          </p>
                          <p>
                            Vice verca if an issue is already closed it will
                            show in the 'Done' column. If you move it to any
                            other column it will automatically re-open again.
                          </p>
                          <div>
                            <ButtonOutlined onClick={onClickGoBack}>
                              Back to Selection
                            </ButtonOutlined>{' '}
                            <Button onClick={() => onClickAdd(repo)}>
                              Add <b> {` ${repo.name} `} </b> to task
                            </Button>
                          </div>
                        </View1>
                      </View>
                    </>
                  )}
                </>
              )}
              {view === 3 && (
                <>
                  {step !== 3 && (
                    <Redirect to={`/projects/add/github/${STEPS[3]}`} />
                  )}
                  <View>
                    <View1>
                      {addingProjectStatus === 'error' && (
                        <>
                          <h4>
                            We couldn't add {repo && repo.name} to your tasks.
                          </h4>
                          <p>{error}</p>
                          <div>
                            <ButtonOutlined
                              as={RouterLink}
                              to={`/projects/add/github`}
                            >
                              Start over
                            </ButtonOutlined>{' '}
                            <Button as={RouterLink} to={`/b`}>
                              Go to board
                            </Button>
                          </div>
                        </>
                      )}
                      {addingProjectStatus === 'success' && (
                        <>
                          <h4>We added {repo && repo.name} to your tasks.</h4>
                          <div>
                            <Button as={RouterLink} to={`/b`}>
                              Go to board
                            </Button>
                          </div>
                        </>
                      )}
                    </View1>
                  </View>
                </>
              )}
            </Card>
          </Content>
        </Container>
      </PrivatePage>
    </>
  );

  function addedProjectsFilter(repo) {
    return !projects.includes(`github-${repo.owner.login}-${repo.name}`);
  }

  function onClickGoBack() {
    setSelectedRepo(-1);
  }

  function onClickAdd(repo: { [x: string]: any }) {
    setSettingProject('setting');
    dispatch(databaseActions.addGithubProject({ activeBoard, repo }));
  }
}

const StepsWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 1.6rem;
`;

const View = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const View1 = styled(View)`
  max-width: 60rem;
  text-align: center;
`;

const GithubIcon = styled(Github)`
  color: black;
`;
