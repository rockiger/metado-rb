import { Clickable } from 'reakit/Clickable';
import styled from 'styled-components/macro';

export const List = styled.div`
  list-style-type: none;
  padding: var(--verticalPadding) var(--horizontalPadding);

  &:first-child {
    margin-top: 0;
    padding-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

type ListItemProps = {
  isSelected?: boolean;
};
export const ListItem = styled.div<ListItemProps>`
  cursor: pointer;
  border-top: 1px solid var(--border-color-default);
  display: list-item;
  line-height: 3.6rem;
  list-style-type: none;
  list-style-position: outside;
  padding: 0.8rem;
  table-layout: fixed;
  transition: var(--transition-default);

  &:first-child {
    border-top: none;
  }

  &:hover {
    background: var(--bg-color-secondary);
  }
  &:last-child {
    padding-bottom: 0;
  }
`;

export const ListContent = styled.div`
  display: table-cell;
  line-height: 1.6rem;
`;

export const ListHeader = styled(Clickable)`
  display: block;
  margin: 0;
  font-weight: 700;
`;

export const ListDescription = styled.div`
  display: block;
  padding-top: 0.4rem;
`;

export const ListIcon = styled.div`
  display: table-cell;
  padding-right: 1rem;
  vertical-align: middle;

  svg {
    height: 2.5rem;
    width: 2.5rem;
  }
`;
