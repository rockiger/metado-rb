import styled from 'styled-components/macro';
import {
  useMenuState,
  Menu as ReaMenu,
  MenuItem as ReaMenuItem,
  MenuButton as ReaMenuButton,
  MenuSeparator as ReaMenuSeparator,
} from 'reakit/Menu';

export { useMenuState };

export const Menu = styled(ReaMenu)`
  background-color: var(--bg-color);
  display: flex;
  border: var(--border);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  margin-top: 0.25rem;
  min-height: var(--min-height);
  &:after {
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  &:first-child {
    margin-top: 0;
  }
  &::last-child {
    margin-bottom: 0;
  }
`;
export const MenuVertical = styled(Menu)`
  flex-direction: column;
`;

export const MenuButton = styled(ReaMenuButton).attrs(p => ({
  className: 'button button-clear',
}))`
  &&& {
    line-height: 1.25rem;
    padding: 0 1rem;
    margin: -0.9rem 0;

    &[aria-expanded='true'] {
      background-color: var(--bg-color-primary);
    }
  }
`;

export const MenuItem = styled(ReaMenuItem)`
  align-items: center;
  border-radius: 0;
  display: flex;
  position: relative;
  vertical-align: middle;
  line-height: 1;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  flex: 0 0 auto;
  user-select: none;

  padding: 1.3rem 1.6rem;
  color: var(--color-text);
  transition: var(--transition);

  &::first-child {
    border-radius: var(--border-radius) 0 0 var(--border-radius);
  }
`;

export const MenuSeparator = styled(ReaMenuSeparator)`
  margin: 0;
  padding: 0;
`;
