/**
 *
 * Footer
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { Container } from '../UiComponents';

interface Props {}

export function Footer(props: Props) {
  return (
    <FooterContainer>
      <Container>
        <b>© Metado</b>
      </Container>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  padding: 4rem 0;
  background-color: var(--bg-color-secondary);
`;
