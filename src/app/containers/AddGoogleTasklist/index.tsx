/**
 *
 * AddGoogleTasklist
 *
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectAddGoogleTasklist } from './selectors';
import { addGoogleTasklistSaga } from './saga';

import { View, ContainedView } from 'app/components/AddToBoardComponents';
import {
  Button,
  Card,
  Content,
  Container,
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
import { Navbar } from 'app/components/Navbar';
import GoogleTasksService, { TaskList } from 'utils/GoogleTasksService';

import logo from './google-tasks-logo.png';

const BASE_URL = '/projects/add/googletasks/';
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

  const { step } = useParams();
  const [googleLoaded, setGoogleLoaded] = React.useState(false);
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [googleErroed, setGoogleErroed] = React.useState<string | undefined>(
    undefined,
  );
  const [taskLists, setTaskLists] = useState([]);
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
        const taskListsArr = await GoogleTasksService.listTaskLists();
        console.log({ taskListsArr });
        setTaskLists(taskListsArr);
      }
    };
    getTaskLists();
  }, [taskLists, isSignedIn]);

  useEffect(() => {
    switch (view) {
      case 0:
        if (isSignedIn) {
          //setView(1);
        }
        break;
      /* case 1:
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
        break; */

      default:
        break;
    }
  }, [isSignedIn, view]);

  console.log({ googleErroed, googleLoaded, isSignedIn });

  if (!STEPS.includes(step)) {
    return <Redirect to={`${BASE_URL}${STEPS[0]}`} />;
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
                  {step !== 0 && <Redirect to={`${BASE_URL}${STEPS[0]}`} />}
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
                <div>
                  {taskLists.map((taskList: TaskList) => (
                    <p
                      key={taskList.id}
                    >{`${taskList.id} | ${taskList.title}`}</p>
                  ))}
                </div>
              )}
            </Card>
          </Content>
        </Container>
      </PrivatePage>
    </>
  );

  function updateSigninStatus(signedIn: boolean) {
    setIsSignedIn(signedIn);
  }

  function signIn() {
    GoogleTasksService.signIn();
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
