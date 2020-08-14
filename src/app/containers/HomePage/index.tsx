import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Composite, useCompositeState } from 'reakit/Composite';
import styled from 'styled-components/macro';

import { Horizontal } from 'app/components/Horizontal';

export function HomePage() {
  const composite = useCompositeState();
  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>

      <Navbar {...composite} role="navbar" aria-label="Main navigation">
        <Link to="/">Home</Link>
        <Link to="/boards">Boards</Link>
        <Link to="/login">Login</Link>
      </Navbar>
      <span>HomePage container</span>
    </>
  );
}

const Navbar = styled(Composite)`
  align-items: center;
  display: flex;
  justify-content: space-evenly;
  height: 5rem;
  box-shadow: ${p => p.theme.shadows[4]};
`;
