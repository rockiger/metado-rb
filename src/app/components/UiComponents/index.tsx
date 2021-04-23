import React from 'react';
import { Button as ReaButton } from 'reakit/Button';
import { Checkbox as ReaCheckbox } from 'reakit/Checkbox';
import styled from 'styled-components/macro';
import media from 'styled-media-query';

export * from './Step';

export const Card = styled.div`
  background-color: white;
  border: 1px solid ${p => p.theme.palette.grey[300]};
  border-radius: 4px;
  margin-bottom: 1.6rem;
  padding: 4.8rem;
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
  gap: 0.5rem;
  padding: 3.2rem 5.92rem 0;
  width: 100%;
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  margin: 0;
  padding-right: var(--margin-button);
`;

export const Section = styled.section`
  padding: 4.8rem 3.2rem;
  ${media.greaterThan('medium')`
    display: flex;
    margin: 0 auto;
    padding: 8rem 6%;
  `}
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

export const ContentPage = styled.div`
  padding: 8rem 6%;
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

export const ButtonGroup = styled.div`
  display: inline-flex;
  flex-direction: row;
  font-size: 0;
  vertical-align: baseline;

  &:after {
    content: '.';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
`;

export const GroupButton = styled(ButtonOutlined)`
  && {
    flex: 1 0 auto;
    border-radius: 0;
    border-left-width: 0;
    height: 3rem;
    line-height: 3rem;
    padding: 0 2.4rem;

    &:first-child {
      margin-left: 0;
      border-bottom-left-radius: var(--border-radius);
      border-bottom-right-radius: 0;
      border-left-width: 1px;
      border-top-left-radius: var(--border-radius);
      border-top-right-radius: 0;
    }

    &:last-child {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: var(--border-radius);
      border-top-left-radius: 0;
      border-top-right-radius: var(--border-radius);
    }

    &[aria-selected='true'],
    &[aria-selected='true']:focus {
      border-color: var(--color-primary);
      background-color: var(--bg-color-primary);
      color: var(bg-color-primary);
    }
  }
`;

export const A = styled.a``;

export const IconButton = styled(ButtonClear)`
  && {
    line-height: 1.25rem;
    padding: 0 1rem;
    margin: -0.9rem 0;

    &&[aria-checked='true'] {
      background-color: var(--bg-color-primary);
    }
  }
`;

type LabelProps = { color?: string; round?: boolean };
export const Label = styled.div<LabelProps>`
  display: inline-block;
  line-height: 1;
  vertical-align: middle;

  background-color: ${p => p.color || 'var(--color-lightGrey)'};
  padding: 0.7rem 1rem;
  color: ${p => (p.color ? 'white' : 'var(--color-grey)')};
  font-size: 1.2rem;
  font-weight: 700;

  border-radius: ${p => (p.round ? '500rem' : 'var(--border-radius)')};
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

type ToggleButtonProps = {
  isActive?: boolean;
  onClick?: (ev) => void;
  title?: string;
};
export const ToggleButton: React.FunctionComponent<ToggleButtonProps> = ({
  children,
  isActive = false,
  onClick = () => {},
  title,
}) => {
  return (
    <ReaCheckbox
      as={IconButton}
      checked={isActive}
      onClick={onClick}
      title={title || ''}
    >
      {children}
    </ReaCheckbox>
  );
};
