/**
 *
 * AddGithubRepo
 *
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, Redirect, useParams } from 'react-router-dom';
import produce from 'immer';
import styled from 'styled-components/macro';
import { Github } from 'styled-icons/boxicons-logos';

import { View, ContainedView } from 'app/components/AddToBoardComponents';
import { Navbar } from 'app/components/PrivateNavbar';
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
  StepsWrapper,
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

import { db, useAuth } from '../Database/firebase';
import { now } from 'utils/helper';
import { Board } from '../Database/types';
import { syncBoardFromProviders } from '../BoardPage/helpers';

const BASE_ROUTE = '/projects/add/github/';
/* const BASE_URL = `${window.location.protocol}//${window.location.hostname}${
  window.location.port ? `:${window.location.port}` : ''
}`; */
// Github OAuth-App 'Metado Board' https://github.com/settings/applications/1396171
// this is different from 'Metado' which is only used for login.
const CLIENT_ID = '87b8d6bfb033d2c5d68a';
//const REDIRECT_URI = `https://metado.app/projects/add/github`;
const STEPS = ['0', '1', '2', '3'];

interface Props {}

export function AddGithubRepo() {
  const { user, profile } = useAuth();
  const codeParameter = getCodeParameter();
  //@ts-expect-error
  const { step } = useParams();
  const [repos, setRepos] = useState<any[]>([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [error, setError] = useState<any>(null);
  const [addingProjectStatus, setAddingProjectStatus] = useState<FetchStatus>(
    'init',
  );
  const [, setGettingGithubTokenStatus] = useState<FetchStatus>('init');
  const [board, setBoard] = useState<Board | undefined>();
  const [selectedEl, setSelectedEl] = useState<number>(-1);
  const [repo, setRepo] = useState(repos[selectedEl]);
  const [view, setView] = useState(0);
  const [settingProject, setSettingProject] = useState<
    'init' | 'setting' | 'finished'
  >('init');

  useEffect(() => {
    const getBoard = async () => {
      if (profile?.activeBoard && user?.uid) {
        const boardRef = db
          .collection('users')
          .doc(user.uid)
          .collection('boards')
          .doc(profile.activeBoard);
        const boardSnapshot = (await boardRef.get()) as firebase.firestore.DocumentSnapshot<
          Board
        >;
        const boardData = boardSnapshot.data();
        setBoard(boardData);
      }
    };
    getBoard();
  }, [profile, user]);

  useEffect(() => {
    const getRepos = async () => {
      if (profile?.githubToken && repos.length === 0) {
        await fetchGithubRepos(profile.githubToken);
      }
    };
    getRepos();
  }, [profile, repos]);

  useEffect(() => {
    setRepo(repos[selectedEl]);
  }, [repos, selectedEl]);

  useEffect(() => {
    const setGithubToken = async () => {
      if (codeParameter && user?.uid) {
        setGettingGithubTokenStatus('fetching');
        try {
          const githubToken = await fetchGithubToken(codeParameter);
          console.log(githubToken);
          const userRef = db.collection('users').doc(user.uid);
          userRef
            .set({ githubToken }, { merge: true })
            .then(() => console.log('onSuccessGithubLoginSuccess'))
            .catch(error => console.error(error));
          setGettingGithubTokenStatus('success');
        } catch (error) {
          console.error(error);
          setGettingGithubTokenStatus('error');
        }
      }
    };
    setGithubToken();
  }, [codeParameter, user]);

  useEffect(() => {
    switch (view) {
      case 0:
        if (profile?.githubToken) {
          setView(1);
        }
        break;
      case 1:
        if (selectedEl !== -1) {
          setView(2);
        }
        break;
      case 2:
        if (selectedEl === -1) {
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
  }, [addingProjectStatus, profile, selectedEl, settingProject, view]);

  if (!STEPS.includes(step)) {
    return <Redirect to={`${BASE_ROUTE}${STEPS[0]}`} />;
  }

  if (view === 1 && step === STEPS[0] && profile?.githubToken) {
    return <Redirect to={`${BASE_ROUTE}${STEPS[1]}`} />;
  }

  return (
    <>
      <Helmet>
        <title>Add Github Repo</title>
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
                    <Title>Login to GitHub</Title>
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
                    <Description>Verify the repo details.</Description>
                  </StepContent>
                </Step>
              </Steps>
            </StepsWrapper>
            <Card>
              {view === 0 && (
                <>
                  {step !== 0 && <Redirect to={`${BASE_ROUTE}${STEPS[0]}`} />}
                  <View>
                    <ContainedView>
                      <p>
                        We need you to login to GitHub and authorize Metado to
                        access your repositorys. This will allow us, to fetch
                        your issues.
                      </p>
                      <Button
                        as={A}
                        href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`}
                      >
                        <Github size="1.5rem" /> GitHub - Login
                      </Button>
                    </ContainedView>
                  </View>
                </>
              )}
              {view === 1 && (
                <>
                  {selectedEl !== -1 && (
                    <Redirect to={`${BASE_ROUTE}${STEPS[2]}`} />
                  )}
                  {step !== 1 && <Redirect to={`${BASE_ROUTE}${STEPS[1]}`} />}
                  <p>
                    Please select the repository from which you want to add the
                    issues to your tasks.
                  </p>
                  {isFetchingRepos && <p>Loading...</p>}
                  <List>
                    {repos.filter(addedProjectsFilter).map((repo, index) => (
                      <ListItem
                        key={repo.node_id}
                        onClick={() => setSelectedEl(index)}
                        isSelected={index === selectedEl}
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
                  {step !== 2 && <Redirect to={`${BASE_ROUTE}${STEPS[2]}`} />}
                  {selectedEl !== -1 && repo && (
                    <>
                      <View>
                        <ContainedView>
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
                            <Button
                              disabled={addingProjectStatus === 'fetching'}
                              onClick={() => onClickAdd(repo)}
                            >
                              {addingProjectStatus === 'fetching'
                                ? 'Adding'
                                : 'Add'}{' '}
                              <b> {` ${repo.name} `} </b>{' '}
                              {addingProjectStatus === 'fetching'
                                ? '...'
                                : 'to board'}
                            </Button>
                          </div>
                        </ContainedView>
                      </View>
                    </>
                  )}
                </>
              )}
              {view === 3 && (
                <>
                  {step !== 3 && <Redirect to={`${BASE_ROUTE}${STEPS[3]}`} />}
                  <View>
                    <ContainedView>
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
                    </ContainedView>
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
    return !board?.projects.includes(
      `${user?.uid}-github-${repo.owner.login}-${repo.name}`,
    );
  }

  async function fetchGithubRepos(githubToken) {
    const getReposFromGithub = () =>
      fetch('https://api.github.com/user/repos?per_page=100', {
        headers: {
          Authorization: `token ${githubToken}`,
        },
      }).then(res => res.json());
    try {
      setIsFetchingRepos(true);
      const repos: any[] = await getReposFromGithub();
      console.log(repos);
      setRepos(repos);
      setIsFetchingRepos(false);
    } catch (error) {
      console.error(error);
      setError(error);
      setIsFetchingRepos(false);
    }
  }

  function onClickGoBack() {
    setSelectedEl(-1);
  }

  function onClickAdd(repo: { [x: string]: any }) {
    setSettingProject('setting');
    addGithubProject(
      profile?.activeBoard,
      repo,
      setAddingProjectStatus,
      setError,
      user?.uid,
    );
  }
}

export async function addGithubProject(
  activeBoard,
  repo,
  setAddingProjectStatus,
  setError,
  uid,
) {
  setAddingProjectStatus('fetching');
  const projectId = `${uid}-github-${repo.owner.login}-${repo.name}`;

  const newProject = {
    created: now(),
    fullname: repo.full_name,
    id: projectId,
    name: repo.name,
    owner: repo.owner.login,
    type: 'github',
    user: uid,
  };
  const projectsRef = db.collection('projects').doc(projectId);
  const boardRef = db
    .collection('users')
    .doc(uid)
    .collection('boards')
    .doc(activeBoard);

  try {
    await projectsRef.set(newProject, { merge: true });
    const boardSnapshot = await boardRef.get();
    const board = boardSnapshot.data();
    // Check if board has less than 10 projects, otherwise abort, because there
    // are only searches for 10 projects possible with firestore.
    // See syncBoardFromProviders
    if (board && board.projects && board.projects.length < 10) {
      const changedBoard = produce(board, draftBoard => {
        draftBoard.projects.push(projectId);
      });
      await boardRef.set(changedBoard);

      // get tasks
      const tasksRef = db
        .collection('tasks')
        .where('project', 'in', changedBoard?.projects)
        .where('user', '==', uid);
      const tasksSnapshot = await tasksRef.get();
      let tasks = {};
      tasksSnapshot.forEach(doc => (tasks[doc.id] = doc.data()));

      await syncBoardFromProviders(changedBoard, () => {}, tasks, uid);
      setAddingProjectStatus('success');
    } else {
      console.error('Board already has maximum of 10 projects.');
      setAddingProjectStatus('error');
      setError('Board already has maximum of 10 projects.');
    }
  } catch (error) {
    console.error(error);
    setAddingProjectStatus('error');
    setError(error);
  }
}

async function fetchGithubToken(code) {
  try {
    const baseUrl =
      process.env.NODE_ENV !== 'development'
        ? 'https://metado.app/'
        : 'http://localhost:5000';
    const requestUrl = `${baseUrl}/githubToken?code=${code}`;
    console.log(requestUrl);
    const response = await fetch(requestUrl);
    const json = await response.json();
    console.log({ response, json });
    const { token } = json;

    if (token) {
      return token;
    } else {
      return Error("Couldn't fetch token from Github.");
    }
  } catch (error) {
    console.error(error);
    return error;
  }
}

/**
 * Returns the code parameter in the url
 * @returns string
 */
function getCodeParameter() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get('code');
  return code;
}

const GithubIcon = styled(Github)`
  color: black;
`;
