/**
 *
 * AddGoogleTasklist
 *
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectAddGoogleTasklist } from './selectors';
import { addGoogleTasklistSaga } from './saga';

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
import {
  selectAddingProject,
  selectBoard,
  selectError,
  selectUserProfile,
} from 'app/containers/Database/selectors';
import { actions as databaseActions } from 'app/containers/Database/slice';
import GoogleTasksService, { TaskList } from 'utils/GoogleTasksService';

import logo from './google-tasks-logo.png';

const BASE_ROUTE = '/projects/add/googletasks/';
const STEPS = ['0', '1', '2', '3'];

interface Props {}

export function AddGoogleTasklist(props: Props) {
  useInjectReducer({
    key: sliceKey,
    reducer: reducer,
  });
  useInjectSaga({
    key: sliceKey,
    saga: addGoogleTasklistSaga,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addGoogleTasklist = useSelector(selectAddGoogleTasklist);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  //@ts-expect-error
  const { step } = useParams();
  const { activeBoard } = useSelector(selectUserProfile);
  const addingProjectStatus = useSelector(selectAddingProject);
  // WARNING projects is not always filled, only when we are comming from board
  const {
    board: { projects },
  } = useSelector(selectBoard);
  const error = useSelector(selectError);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
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

  console.log({ googleErroed, googleLoaded, isSignedIn });

  if (!STEPS.includes(step)) {
    return <Redirect to={`${BASE_ROUTE}${STEPS[0]}`} />;
  }

  return (
    <>
      <Helmet>
        <title>AddGoogleTasklist</title>
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
                              onClick={() => onClickAdd(taskLists[selectedEl])}
                            >
                              Add <b> {` ${taskLists[selectedEl].title} `} </b>{' '}
                              to board
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
    return !projects.includes(
      `googletasks-${GoogleTasksService.getUserId()}-${tasklist.id}`,
    );
  }

  function signIn() {
    GoogleTasksService.signIn();
  }

  function onClickAdd(taskList: { [x: string]: any }) {
    setSettingProject('fetching');
    dispatch(
      databaseActions.addGoogleTasksProject({
        activeBoard,
        taskList: { ...taskList, ownerId: GoogleTasksService.getUserId() },
      }),
    );
  }

  function onClickGoBack() {
    setSelectedEl(-1);
  }

  function updateSigninStatus(signedIn: boolean) {
    setIsSignedIn(signedIn);
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
