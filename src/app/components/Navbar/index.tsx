/**
 *
 * Navbar
 *
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useToolbarState, Toolbar, ToolbarItem } from 'reakit/Toolbar';
import styled from 'styled-components/macro';
import { Button } from '../UiComponents';

interface Props {}

export function Navbar(props: Props) {
  const toolbar = useToolbarState({ loop: true });
  return (
    <NavbarContainer {...toolbar} role="navbar" aria-label="Main navigation">
      <Left>
        <LogoLink as={Link} to="/">
          <Logo
            src={`${process.env.PUBLIC_URL}/metado_logo_primary.svg`}
            alt="Metado logo"
          />
        </LogoLink>
      </Left>
      <Middle>
        <NavbarLink to="/">Privacy</NavbarLink>
        <NavbarLink to="/">Terms</NavbarLink>
      </Middle>
      <Right>
        <NavbarLink to="/login">Login</NavbarLink>
        <Button as={Link} to={`/login`}>
          Sign up
        </Button>
      </Right>
    </NavbarContainer>
  );
}

const NavbarContainer = styled(Toolbar)`
  align-items: center;
  display: grid;
  grid-template: auto 1fr auto / auto 1fr auto;
  height: 6rem;
  box-shadow: var(--box-shadow);
`;

const NavbarLink = styled(Link)`
  padding: 1.6rem 2.4rem;
`;
const NavbarPart = styled.div`
  align-items: center;
  display: flex;
  height: 6rem;
  min-width: 250px;
  padding: 0 2rem;
`;
const Left = styled(NavbarPart)``;
const Middle = styled(NavbarPart)`
  display: flex;
  justify-content: center;
`;
const Right = styled(NavbarPart)`
  justify-content: flex-end;
`;

export const LogoLink = styled(ToolbarItem)`
  align-items: center;
  display: flex;
`;

export const Logo = styled.img`
  height: 1.8rem;
`;
