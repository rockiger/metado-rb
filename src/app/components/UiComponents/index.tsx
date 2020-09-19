import { Button as ReaButton } from 'reakit/Button';
import styled from 'styled-components/macro';
import media from 'styled-media-query';

export * from './Step';

export const Card = styled.div`
  background-color: white;
  border: 1px solid ${p => p.theme.palette.grey[300]};
  border-radius: 4px;
  margin-bottom: 1.6rem;
  padding: 1.6rem;
`;

export const CardTitle = styled.div``;

export const CardFooter = styled.div`
  display: flex;
  padding-top: 0.5rem;
`;

type RowProps = { align?: 'left' | 'center' | 'right' };
export const Row = styled.div<RowProps>`
  align-items: center;
  display: flex;
  justify-content: ${p => p.align};
  width: 100%;
`;

export const PrivatePage = styled.div`
  background-color: ${p => p.theme.palette.background.default};
  min-height: 100vh;
`;

export const PageHeader = styled.header`
  align-items: center;
  display: flex;
  padding: 3.2rem 3.2rem 0;
  width: 100%;
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
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

export const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;

export const Button = styled(ReaButton).attrs(p => ({ className: 'button' }))``;
export const ButtonOutlined = styled(ReaButton).attrs(p => ({
  className: 'button button-outline',
}))``;
export const ButtonClear = styled(ReaButton).attrs(p => ({
  className: 'button button-clear',
}))``;

export const A = styled.a``;

export const Label = styled.div`
  display: inline-block;
  line-height: 1;
  vertical-align: middle;

  background-color: black;
  padding: 0.7rem 1rem;
  color: white;
  font-size: 1.2rem;
  font-weight: 700;

  border-radius: var(--border-radius);
  transition: var(--transition);
`;

type ColumnProps = { align?: 'left' | 'center' | 'right' };
export const Column = styled.div<ColumnProps>`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: ${p => p.align};
  width: 100%;
`;
