import React from 'react';
import { Link } from 'react-router-dom';
import { Clickable } from 'reakit/Clickable';
import { useToolbarState, Toolbar, ToolbarItem } from 'reakit/Toolbar';
import styled from 'styled-components/macro';
import { LogOut } from 'styled-icons/boxicons-regular';

import { firebaseAuth } from 'app/containers/Database/firebase';

export function Navbar() {
  const toolbar = useToolbarState({ loop: true });
  return (
    <NavbarWrapper {...toolbar} aria-label="Board Navbar" role="navigation">
      <LogoLink as={Link} to="/">
        <Logo
          src={`${process.env.PUBLIC_URL}/metado_logo_primary.svg`}
          alt="Metado logo"
        />
      </LogoLink>
      <Clickable as="a" onClick={onClick}>
        <LogOut size="1.5rem" />
      </Clickable>
    </NavbarWrapper>
  );

  function onClick() {
    console.log('logout');
    firebaseAuth.signOut();
  }
}

export const NavbarWrapper = styled(Toolbar)`
  background-color: white;
  box-shadow: var(--box-shadow);
  display: flex;
  height: 6rem;
  justify-content: center;
  padding: 1.6rem 3.2rem;
`;

export const LogoLink = styled(ToolbarItem)`
  align-items: center;
  display: flex;
`;

export const Logo = styled.img`
  height: 1.8rem;
`;
