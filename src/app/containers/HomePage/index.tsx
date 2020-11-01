import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components/macro';
import media from 'styled-media-query';

import {
  Edit as EditIcon,
  MapAlt as PlanIcon,
  Sync as SyncIcon,
} from 'styled-icons/boxicons-regular';

import { ArrowRightAlt } from 'styled-icons/material-rounded';

import { Helmet } from 'react-helmet-async';
import { Navbar } from 'app/components/Navbar';
import { Button, Container, Section } from 'app/components/UiComponents';
import { useAuth } from '../Database/firebase';
import { Footer } from 'app/components/Footer';

export function HomePage() {
  const { user } = useAuth();

  if (user) {
    return <Redirect to="/b" />;
  }

  return (
    <>
      <Helmet>
        <title>All your to-dos on one board.</title>
        <meta
          name="description"
          content="Metado shows all your task from different web apps and projects in one place. So you can focus on your work and not on task list management."
        />
      </Helmet>

      <Navbar />
      <Main>
        <Section>
          <Right>
            <Img
              src={`${process.env.PUBLIC_URL}/images/metado-board.png`}
              alt="Metado app"
            />
          </Right>
          <Left>
            <h1>
              <b>All</b> your to-dos on <b>one</b> board.
            </h1>
            <h3>
              Metado shows all your task from different web apps and projects in
              one place. So you can focus on your work and not on task list
              management.{' '}
            </h3>
            <p>
              <Button as={Link} to="/login">
                Get Started - It's Free!
              </Button>
            </p>
            <div>
              <p>
                <b>Works with:</b>
              </p>
              <p>
                <img
                  src={`${process.env.PUBLIC_URL}/images/works-with.png`}
                  alt="Works with Github, Google Tasks, Microsoft to-do (Soon), Microsoft Planner (Soon), Jira (Soon), Confluence (Soon)."
                  title="Works with Githbub, Google Tasks, Microsoft to-do (Soon), Microsoft Planner (Soon), Jira (Soon), Confluence (Soon)."
                />
              </p>
            </div>
          </Left>
        </Section>
        <Container>
          <Section>
            <Right>
              <Img src="https://www.fulcrum.wiki/static/media/assistant.0e787f5e.jpg" />
            </Right>
            <Left>
              <h2>
                You shouldn't need to juggle several apps to stay on top of your
                work.
              </h2>
              <p>
                Have you ever felt frustrated that you have to manage an
                overview of a multitude of apps just to know all your
                assignments?
              </p>
              <ul>
                <li>
                  Are you <b>tired</b> of watching for your tasks in your team's
                  project management software <b>and</b> your personal to-do
                  list?
                </li>
                <li>
                  Do you have to <b>follow issues from several platforms</b>{' '}
                  like Github, Gitlab, or Bitbucket?
                </li>
                <li>
                  Did you ever <b>miss an assignment</b> from a platform you
                  didn't watch for new tasks?
                </li>
              </ul>
              <p>
                Metado <b>manages all your tasks</b> for you. Like an assistant
                that always has your back.
              </p>
            </Left>
          </Section>
        </Container>
        <Blue>
          <Container>
            <FeatureSection>
              <h2>Manage all your work from one board.</h2>
              <Features>
                <Feature>
                  <FeatureIcon>
                    <SyncIcon size="4.8rem" />
                  </FeatureIcon>
                  <h3>Sync your work</h3>
                  <p>
                    <b>Easily</b> sync tasks from <b>different sources</b>. Add
                    issues from Github, Gitlab, and Bitbucket or task from
                    Google Tasks, Microsoft To Do, and many more.
                  </p>
                </Feature>
                <Feature>
                  <FeatureIcon>
                    <EditIcon size="4.8rem" />
                  </FeatureIcon>
                  <h3>Edit your tasks</h3>
                  <p>
                    Need to change a task description? You can{' '}
                    <b>edit your tasks</b> right <b>from your board</b>. Your
                    team members will see the changes automatically.
                  </p>
                </Feature>
                <Feature>
                  <FeatureIcon>
                    <PlanIcon size="4.8rem" />
                  </FeatureIcon>
                  <h3>Plan your work</h3>
                  <p>
                    Get your work into the order you prefer. You can{' '}
                    <b>sort your tasks</b> in a Kanban board - even if your
                    source app doesn't allow it. Your work{' '}
                    <b>is always planned the way you want</b>.
                  </p>
                </Feature>
              </Features>
            </FeatureSection>
          </Container>
        </Blue>
        <Container>
          <StepsSection>
            <h2>3 Steps to being effortlessly organized.</h2>
            <Steps>
              <Step>
                <StepNumber>1</StepNumber>
                <h3>Log in to the service you want to sync.</h3>
                <StepArrow />
              </Step>
              <Step>
                <StepNumber>2</StepNumber>
                <h3>Choose the project or list you want to keep track of.</h3>
                <StepArrow />
              </Step>
              <Step>
                <StepNumber>3</StepNumber>
                <h3>Add, edit, and sort all your tasks on one board.</h3>
                <StepArrow />
              </Step>
            </Steps>
            <p style={{ paddingTop: '10rem' }}>
              <Button as={Link} to="/login">
                Get Started - It's Free!
              </Button>
            </p>
          </StepsSection>
        </Container>
      </Main>
      <Footer />
    </>
  );
}

const Main = styled.main`
  font-size: 1.8rem;
`;
const SectionPart = styled.div`
  ${media.greaterThan('medium')`
    padding: 2.4rem;
  `}
`;

const Left = styled(SectionPart)`
  ${media.greaterThan('medium')`
    width: 60%;
    padding-left: 4rem;
    h1 {
      padding-top: 6rem;
    }
  `}
`;

const Right = styled(SectionPart)`
  padding-bottom: 2rem;

  ${media.greaterThan('medium')`
    padding-right: 4rem;
    order: 1;
  `}
`;

const Img = styled.img`
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;

const Blue = styled.div`
  color: white;
  background-color: var(--color-primary);
`;

const Badge = styled.div`
  align-items: center;
  border-radius: 50%;
  display: flex;
  font-size: 4.8rem;
  font-weight: bold;
  height: 9.6rem;
  justify-content: center;
  margin-bottom: 1.2rem;
  min-width: 96px;
  width: 9.6rem;
`;

const FeatureSection = styled(Section)`
  align-items: center;
  flex-direction: column;
  text-align: center;
`;
const Features = styled(Section)`
  padding-top: 2rem;
  ${media.greaterThan('medium')`
    padding: 8rem 0;
    max-width: 1280px;
  `}
`;
const Feature = styled(SectionPart)`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
  text-align: center;

  ${media.greaterThan('medium')`
    padding-bottom: 0;
    width: 33%;
  `}
`;
const FeatureIcon = styled(Badge)`
  border: 0.4rem solid white;
`;

const StepsSection = styled(Section)`
  align-items: center;
  flex-direction: column;
  text-align: center;
`;

const Steps = styled.div`
  padding-top: 2rem;
  ${media.greaterThan('medium')`
    display: flex;
  `}
`;
const Step = styled(SectionPart)`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
  text-align: center;

  ${media.greaterThan('medium')`
    padding-bottom: 0;
    width: 33%;
  `}
`;

const StepNumber = styled.div`
  align-items: center;
  background-color: var(--color-primary);
  border-radius: 50%;
  color: white;
  display: flex;
  font-size: 4.8rem;
  font-weight: bold;
  height: 9.6rem;
  justify-content: center;
  margin-bottom: 1.2rem;
  min-width: 96px;
  width: 9.6rem;
`;

const StepArrow = styled(ArrowRightAlt)`
  color: var(--color-primary);
  height: 3rem;
  width: 3rem;
`;
