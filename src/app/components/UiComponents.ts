import styled from 'styled-components/macro';
import media from 'styled-media-query';

export const Horizontal = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
`;

export const PrivatePage = styled.div`
  background-color: ${p => p.theme.palette.background.default};
  min-height: 100vh;
`;

export const PageHeader = styled(Horizontal)`
  padding: 2rem 2rem 0;
`;

export const PageTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
`;

export const Content = styled(Horizontal)`
  align-items: flex-start;
  gap: 1.5rem;
  justify-content: space-evenly;
  overflow: auto;
  padding: 2rem;
  width: 100% ${media.greaterThan('medium')`
    padding: 2rem 4rem;
  `};
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;
