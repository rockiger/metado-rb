/**
 *
 * AddGithubRepo
 *
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, Redirect, useParams } from 'react-router-dom';
import produce from 'immer';
import _ from 'lodash';
import styled from 'styled-components/macro';
import { Trello } from 'styled-icons/boxicons-logos';

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
import { getProjectsById } from '../Database';
import { AssignLists } from './AssignLists';

const BASE_ROUTE = '/projects/add/trello/';
/* const BASE_URL = `${window.location.protocol}//${window.location.hostname}${
  window.location.port ? `:${window.location.port}` : ''
}`; */
// Github OAuth-App 'Metado Board' https://github.com/settings/applications/1396171
// this is different from 'Metado' which is only used for login.
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
//const REDIRECT_URI = `https://metado.app/projects/add/github`;
const STEPS = ['0', '1', '2', '3', '4'];

interface Props {}

export function AddTrelloBoard() {
  const { user, profile } = useAuth();
  const codeParameter = getCodeParameter();
  //@ts-expect-error
  const { step } = useParams();
  const [repos, setRepos] = useState<any[]>([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [error, setError] = useState<any>(null);
  const [addingProjectStatus, setAddingProjectStatus] = useState<FetchStatus>(
    'init',
  );
  const [assignments, setAssignments] = useState<any[]>([]);
  const [, setGettingGithubTokenStatus] = useState<FetchStatus>('init');
  const [board, setBoard] = useState<Board | undefined>();
  const [selectedTrelloBoard, setSelectedTrelloBoard] = useState<number>(-1);
  const [trelloBoardLists, setTrelloBoardLists] = useState<any[]>([]);
  const [trellBoard, setTrelloBoard] = useState(repos[selectedTrelloBoard]);
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
      if (profile?.trelloToken && repos.length === 0) {
        await getTrelloBoards(profile.githubToken);
      }
    };
    getRepos();
  }, [profile, repos]);

  useEffect(() => {
    setTrelloBoard(repos[selectedTrelloBoard]);
  }, [repos, selectedTrelloBoard]);

  useEffect(() => {
    if (selectedTrelloBoard !== -1) {
      console.log(repos[selectedTrelloBoard]);
      getLists(repos[selectedTrelloBoard].id);
    }
  }, [repos, selectedTrelloBoard]);

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
        if (profile?.trelloToken) {
          setView(1);
        }
        break;
      case 1:
        if (selectedTrelloBoard !== -1) {
          setView(2);
        }
        break;
      case 2:
        if (selectedTrelloBoard === -1) {
          setView(1);
        } else if (isAssigned) {
          setView(3);
        }
        break;
      case 3:
        if (
          addingProjectStatus === 'error' ||
          addingProjectStatus === 'success'
        ) {
          setView(4);
        }
        break;

      case 4:
        break;

      default:
        break;
    }
  }, [
    addingProjectStatus,
    isAssigned,
    profile,
    selectedTrelloBoard,
    settingProject,
    view,
  ]);

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
                    <Description>Authenticate with GitHub.</Description>
                  </StepContent>
                </Step>
                <Step isActive={view === 1} isCompleted={1 < view}>
                  <StepContent>
                    <Title>Select board</Title>
                    <Description>Choose the Trello board to add.</Description>
                  </StepContent>
                </Step>
                <Step isActive={view === 2} isCompleted={2 < view}>
                  <StepContent>
                    <Title>Assign Lists</Title>
                    <Description>Assign lists to boord columns.</Description>
                  </StepContent>
                </Step>
                <Step isActive={view === 3} isCompleted={3 < view}>
                  <StepContent>
                    <Title>Add to board</Title>
                    <Description>Verify the board details.</Description>
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
                        <Trello size="1.5rem" /> GitHub - Login
                      </Button>
                    </ContainedView>
                  </View>
                </>
              )}
              {view === 1 && (
                <>
                  {selectedTrelloBoard !== -1 && (
                    <Redirect to={`${BASE_ROUTE}${STEPS[2]}`} />
                  )}
                  {step !== 1 && <Redirect to={`${BASE_ROUTE}${STEPS[1]}`} />}
                  <p>
                    Please select the repository from which you want to add the
                    issues to your tasks.
                  </p>
                  {isFetchingRepos && <p>Loading...</p>}
                  <List>
                    {repos.map((repo, index) =>
                      !addedProjectsFilter(repo) ? null : (
                        <ListItem
                          key={repo.id}
                          onClick={() => setSelectedTrelloBoard(index)}
                          isSelected={index === selectedTrelloBoard}
                        >
                          <ListIcon>
                            <TrelloIcon />
                          </ListIcon>
                          <ListContent>
                            <ListHeader as="div">{repo.name}</ListHeader>
                            <ListDescription>{repo.desc}</ListDescription>
                          </ListContent>
                        </ListItem>
                      ),
                    )}
                  </List>
                </>
              )}
              {view === 2 && (
                <>
                  <View>
                    <ContainedView>
                      <AssignLists
                        assignmentsState={[assignments, setAssignments]}
                        lists={trelloBoardLists}
                        onClickGoBack={onClickGoBack}
                        onClickSave={() => setIsAssigned(true)}
                      />
                    </ContainedView>
                  </View>
                </>
              )}
              {view === 3 && (
                <>
                  {step !== 3 && <Redirect to={`${BASE_ROUTE}${STEPS[3]}`} />}
                  {selectedTrelloBoard !== -1 && trellBoard && (
                    <>
                      <View>
                        <ContainedView>
                          <h4>Add {trellBoard.name} to your tasks?</h4>
                          <Card>
                            <h5>
                              <b>{trellBoard.full_name}</b>
                            </h5>
                            <div> {trellBoard.description} </div>
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
                              onClick={() =>
                                onClickAdd(trellBoard, assignments)
                              }
                            >
                              {addingProjectStatus === 'fetching'
                                ? 'Adding'
                                : 'Add'}{' '}
                              <b> {` ${trellBoard.name} `} </b>{' '}
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
              {view === 4 && (
                <>
                  {step !== 4 && <Redirect to={`${BASE_ROUTE}${STEPS[4]}`} />}
                  <View>
                    <ContainedView>
                      {addingProjectStatus === 'error' && (
                        <>
                          <h4>
                            We couldn't add {trellBoard && trellBoard.name} to
                            your tasks.
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
                          <h4>
                            We added {trellBoard && trellBoard.name} to your
                            tasks.
                          </h4>
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
    //!
    return true; /* !board?.projects.includes(
      `${user?.uid}-github-${repo.owner.login}-${repo.name}`,
    ); */
  }

  async function getLists(trelloBoardId) {
    const fetchLists = async boardId =>
      fetch(
        `https://api.trello.com/1/boards/${boardId}/lists?key=8204045abe5fcaf65f6d744dd8ff74c4&token=64ad461522fb64da49f91ae522fa245922c5267887cd3761bb9aa3ec194ce62f`,
      ).then(res => res.json());

    const lists: any[] = await fetchLists(trelloBoardId);
    setTrelloBoardLists(lists);
  }

  async function getTrelloBoards(githubToken) {
    const fetchTrelloBoards = () =>
      fetch(
        'https://api.trello.com/1/members/me/boards?key=8204045abe5fcaf65f6d744dd8ff74c4&token=64ad461522fb64da49f91ae522fa245922c5267887cd3761bb9aa3ec194ce62f',
      ).then(res => res.json());
    try {
      setIsFetchingRepos(true);
      const repos: any[] = await fetchTrelloBoards();
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
    setSelectedTrelloBoard(-1);
  }

  function onClickAdd(trelloBoard: Dict, listAssignments: Dict) {
    setSettingProject('setting');
    addTrelloBoard({
      activeBoard: profile?.activeBoard,
      trelloBoard,
      listAssignments,
      setAddingProjectStatus,
      setError,
      uid: user?.uid,
    });
  }
}

interface addTrelloBoardArguments {
  activeBoard: string;
  trelloBoard: Dict;
  listAssignments: Dict;
  setAddingProjectStatus: any;
  setError: any;
  uid: string;
}
export async function addTrelloBoard({
  activeBoard,
  trelloBoard,
  listAssignments,
  setAddingProjectStatus,
  setError,
  uid,
}) {
  setAddingProjectStatus('fetching');
  const projectId = `${uid}-trello-${trelloBoard.idMemberCreator}-${trelloBoard.name}`;

  const newProject = {
    created: now(),
    trelloBoardId: trelloBoard.id,
    id: projectId,
    listAssignments,
    name: trelloBoard.name,
    owner: trelloBoard.idMemberCreator,
    type: 'trello',
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
      const changedBoard = produce(board as Board, draftBoard => {
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

      await syncBoardFromProviders(
        changedBoard,
        await getProjectsById(changedBoard.projects),
        () => {},
        tasks,
        uid,
      );
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

const TrelloIcon = styled(Trello)`
  color: #0065ff;
`;
