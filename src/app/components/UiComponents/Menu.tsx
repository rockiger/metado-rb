import styled from 'styled-components/macro';
import {
  useMenuState,
  Menu,
  MenuItem,
  MenuButton as ReaMenuButton,
  MenuSeparator,
} from 'reakit/Menu';

export { useMenuState, Menu, MenuItem, MenuSeparator };

export const MenuButton = styled(ReaMenuButton).attrs(p => ({
  className: 'button button-clear',
}))`
  &&& {
    line-height: 1.25rem;
    padding: 0 1rem;
    margin: -0.9rem 0;
  }
`;
