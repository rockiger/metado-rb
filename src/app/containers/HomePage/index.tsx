import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import media from 'styled-media-query';

import { Helmet } from 'react-helmet-async';
import { Navbar } from 'app/components/Navbar';
import { Button, Section } from 'app/components/UiComponents';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>

      <Navbar />
      <main>
        <Section>
          <Left>
            <h1>
              <b>All</b> your todos in <b>one</b> board.
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
                  alt="Works with Githbub, Google Tasks, Microsoft Todo (Soon), Microsoft Planner (Soon), Jira (Soon), Confluence (Soon)."
                  title="Works with Githbub, Google Tasks, Microsoft Todo (Soon), Microsoft Planner (Soon), Jira (Soon), Confluence (Soon)."
                />
              </p>
            </div>
          </Left>
          <Right>
            <Img
              src={`${process.env.PUBLIC_URL}/images/metado-board.png`}
              alt="Metado app"
            />
          </Right>
        </Section>
      </main>
    </>
  );
}

const SectionPart = styled.div`
  ${media.greaterThan('medium')`
    padding: 2.4rem;
  `}
`;

const Left = styled(SectionPart)`
  ${media.greaterThan('medium')`
    width: 60%;

    h1 {
      padding-top: 6rem;
    }
  `}
`;

const Right = styled(SectionPart)``;

const Img = styled.img`
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;
