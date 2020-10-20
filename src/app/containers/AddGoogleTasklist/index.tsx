/**
 *
 * AddGoogleTasklist
 *
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, Redirect, useParams } from 'react-router-dom';
import produce from 'immer';
import styled from 'styled-components/macro';

import { View, ContainedView } from 'app/components/AddToBoardComponents';
import { Navbar } from 'app/components/PrivateNavbar';
import {
  Button,
  Card,
  Content,
  Container,
  PageHeader,
  PageTitle,
  PrivatePage,
  ButtonOutlined,
} from 'app/components/UiComponents';
import {
  List,
  ListHeader,
  ListItem,
  ListContent,
  ListIcon,
} from 'app/components/UiComponents/List';
import {
  Content as StepContent,
  Description,
  Step,
  Steps,
  StepsWrapper,
  Title,
} from 'app/components/UiComponents/Step';
import { useAuth } from 'app/containers/Database/firebase';
import { db } from 'app/containers/Database/firebase';
import { Board } from 'app/containers/Database/types';
import GoogleTasksService, { TaskList } from 'utils/GoogleTasksService';

import logo from './google-tasks-logo.png';
import { now } from 'utils/helper';
import { syncBoardFromProviders } from '../BoardPage/helpers';

const BASE_ROUTE = '/projects/add/googletasks/';
const STEPS = ['0', '1', '2', '3'];

export function AddGoogleTasklist() {
  //@ts-expect-error
  const { step } = useParams();
  const { user, profile } = useAuth();
  const [addingProjectStatus, setAddingProjectStatus] = useState<FetchStatus>(
    'init',
  );
  const [board, setBoard] = useState<Board | undefined>();
  const [error, setError] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [googleErroed, setGoogleErroed] = useState<string | undefined>(
    undefined,
  );
  const [selectedEl, setSelectedEl] = useState<number>(-1);
  const [settingProject, setSettingProject] = useState<FetchStatus>('init');
  const [status, setStatus] = useState<FetchStatus>('init');
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [view, setView] = useState(0);

  // Initialize google gapi only on the first load
  useEffect(() => {
    GoogleTasksService.load(updateSigninStatus)
      .then(() => {
        setGoogleLoaded(true);
        updateSigninStatus(GoogleTasksService.isSignedIn());
      })
      .catch(error => {
        console.error('Error loading google services:', error);
        setGoogleErroed(error);
      });
  }, []);

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
    const getTaskLists = async () => {
      if (isSignedIn && !taskLists.length) {
        setStatus('fetching');
        try {
          const taskListsArr = await GoogleTasksService.listTaskLists();
          console.log({ taskListsArr });
          setTaskLists(taskListsArr);
          setStatus('success');
        } catch (e) {
          console.error(e);
          setStatus('error');
        }
      }
    };
    getTaskLists();
  }, [taskLists, isSignedIn]);

  useEffect(() => {
    switch (view) {
      case 0:
        if (isSignedIn) {
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
  }, [addingProjectStatus, isSignedIn, selectedEl, settingProject, view]);

  // console.log({ googleErroed, googleLoaded, isSignedIn });

  if (!STEPS.includes(step)) {
    return <Redirect to={`${BASE_ROUTE}${STEPS[0]}`} />;
  }

  return (
    <>
      <Helmet>
        <title>Add Google Tasklist</title>
        <meta name="description" content="Description of AddGoogleTasklist" />
      </Helmet>
      <PrivatePage>
        <Navbar />
        <Container>
          <PageHeader>
            <PageTitle>Add Google Tasks List</PageTitle>
          </PageHeader>
          <Content>
            <StepsWrapper>
              <Steps>
                <Step isActive={view === 0} isCompleted={0 < view}>
                  <StepContent>
                    <Title>Login to Google Tasks</Title>
                    <Description>
                      Give Metado permissen to edit your tasks.
                    </Description>
                  </StepContent>
                </Step>
                <Step isActive={view === 1} isCompleted={1 < view}>
                  <StepContent>
                    <Title>Select task list</Title>
                    <Description>
                      Choose the list you want to add your board.
                    </Description>
                  </StepContent>
                </Step>
                <Step isActive={view === 2} isCompleted={2 < view}>
                  <StepContent>
                    <Title>Add to board</Title>
                    <Description>Verify the task list details.</Description>
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
                        We need you to login to your Google account and
                        authorize Metado to read, write your tasks. This will
                        allow us, to get your tasks and sync them with your
                        board.
                      </p>
                      <Button onClick={signIn}>
                        <LogoWrapper>
                          <LogoImg src={logo} alt="Google Task Logo" />
                        </LogoWrapper>{' '}
                        Google Tasks - Login
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
                    Please select the task list from which you want to add the
                    issues to your tasks.
                  </p>
                  {status === 'fetching' && <p>Loading...</p>}
                  <List>
                    {taskLists
                      .filter(addedProjectsFilter)
                      .map((el: { id: string; title: string }, index) => (
                        <ListItem
                          key={el.id}
                          onClick={() => setSelectedEl(index)}
                          isSelected={index === selectedEl}
                        >
                          <ListIcon>
                            <LogoImg src={logo} alt="Google Task Logo" />
                          </ListIcon>
                          <ListContent>
                            <ListHeader as="div">{el.title}</ListHeader>
                          </ListContent>
                        </ListItem>
                      ))}
                  </List>
                </>
              )}
              {view === 2 && (
                <>
                  {step !== 2 && <Redirect to={`${BASE_ROUTE}${STEPS[2]}`} />}
                  {selectedEl !== -1 && taskLists[selectedEl] && (
                    <>
                      <View>
                        <ContainedView>
                          <h4>
                            Add {taskLists[selectedEl].title} to your tasks?
                          </h4>
                          <Card>
                            <h5>
                              <p>
                                <b>{taskLists[selectedEl].title}</b>
                              </p>
                            </h5>
                            <img src={logo} alt="Google Task Logo" />
                          </Card>
                          <p></p>
                          <p>
                            Open tasks will show in your 'Backlog' column. When
                            you move a task to your 'Done' column, it will be
                            automatically set to finish.
                          </p>
                          <p>
                            Vice verca if a task is already finished it will
                            show in the 'Done' column. If you move it to any
                            other column it will automatically re-open again.
                          </p>
                          <div>
                            <ButtonOutlined onClick={onClickGoBack}>
                              Back to Selection
                            </ButtonOutlined>{' '}
                            <Button
                              disabled={addingProjectStatus === 'fetching'}
                              onClick={() => onClickAdd(taskLists[selectedEl])}
                            >
                              {addingProjectStatus === 'fetching'
                                ? 'Adding'
                                : 'Add'}{' '}
                              <b> {` ${taskLists[selectedEl].title} `} </b>{' '}
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
                            We couldn't add{' '}
                            {taskLists[selectedEl] &&
                              taskLists[selectedEl].title}{' '}
                            to your tasks.
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
                            We added{' '}
                            {taskLists[selectedEl] &&
                              taskLists[selectedEl].title}{' '}
                            to your tasks.
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

  function addedProjectsFilter(tasklist) {
    return !board?.projects.includes(
      `${user?.uid}-googletasks-${GoogleTasksService.getUserId()}-${
        tasklist.id
      }`,
    );
  }

  function signIn() {
    GoogleTasksService.signIn();
  }

  async function onClickAdd(taskList: { [x: string]: any }) {
    setSettingProject('fetching');
    await addGoogleTasksProject(
      profile?.activeBoard,
      setAddingProjectStatus,
      setError,
      { ...taskList, ownerId: GoogleTasksService.getUserId() },
      user?.uid,
    );
  }

  function onClickGoBack() {
    setSelectedEl(-1);
  }

  function updateSigninStatus(signedIn: boolean) {
    setIsSignedIn(signedIn);
  }
}

async function addGoogleTasksProject(
  activeBoard,
  setAddingProjectStatus,
  setError,
  taskList,
  uid,
) {
  setAddingProjectStatus('fetching');
  const projectId = `${uid}-googletasks-${taskList.ownerId}-${taskList.id}`;

  const newProject = {
    created: now(),
    id: projectId,
    name: taskList.title,
    owner: taskList.ownerId,
    type: 'googletasks',
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
    const boardSnapshot = (await boardRef.get()) as firebase.firestore.DocumentSnapshot<
      Board
    >;
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

const LogoImg = styled.img`
  width: 2.4rem;
`;

const LogoWrapper = styled.span`
  background-color: white;
  border-radius: 100%;
  display: inline-block;
  height: 2.4rem;
  line-height: 1;
  margin-top: -2px;
  vertical-align: middle;
`;
