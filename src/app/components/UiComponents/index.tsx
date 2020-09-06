import { Button as ReaButton } from 'reakit/Button';
import styled from 'styled-components/macro';
import media from 'styled-media-query';

export * from './Step';

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

export const Content = styled.div`
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

export const Card = styled.div`
  background-color: white;
  border: 1px solid ${p => p.theme.palette.grey[300]};
  border-radius: 4px;
  padding: 1rem;
`;

export const Button = styled(ReaButton)`
  background-image: none;
  background-color: #fff;
  border: 1px solid ${p => p.theme.palette.grey[300]};
  border-radius: 2px;
  color: ${p => p.theme.palette.text.primary};
  cursor: pointer;
  display: inline-block;
  font-weight: 400;
  font-size: 0.875rem;
  height: 32px;
  line-height: 1.5rem;
  padding: 4px 15px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  &:hover {
    color: ${p => p.theme.palette.primary.main};
    border-color: ${p => p.theme.palette.primary.main};
  }
  &:focus {
    box-shadow: 0 0 0 0.2em rgba(0, 109, 255, 0.4);
  }
`;

export const A = styled.a``;
