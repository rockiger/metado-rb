import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import {
  useToolbarState,
  Toolbar,
  ToolbarItem,
  ToolbarSeparator,
} from 'reakit/Toolbar';

export function Navbar() {
  const toolbar = useToolbarState({ loop: true });
  return (
    <NavbarWrapper {...toolbar} aria-label="Board Navbar" role="navigation">
      <ToolbarSeparator {...toolbar} />
      <LogoLink as={Link} to="/">
        <Logo
          src={`${process.env.PUBLIC_URL}/metado_logo_primary.svg`}
          alt="Metado logo"
        />
      </LogoLink>
      <ToolbarSeparator {...toolbar} />
    </NavbarWrapper>
  );
}

export const NavbarWrapper = styled(Toolbar)`
  background-color: white;
  box-shadow: ${p => p.theme.shadows[3]};
  display: flex;
  height: 4rem;
  padding: 1rem 2rem;
`;

export const LogoLink = styled(ToolbarItem)`
  align-items: center;
  display: flex;
`;

export const Logo = styled.img`
  height: 1.25rem;
`;
