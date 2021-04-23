import React from 'react';
import {
  useMenuState,
  MenuItem,
  MenuButton,
  MenuVertical,
} from 'app/components/UiComponents/Menu';

import { ThreeDots } from 'styled-icons/bootstrap';

type Props = {};

export const BoardMenu: React.FC<Props> = ({ children }) => {
  const menu = useMenuState({ orientation: 'vertical' });
  return (
    <>
      <MenuButton {...menu} disabled={!React.Children.count(children)}>
        <ThreeDots size="1.5rem" />
      </MenuButton>
      <MenuVertical {...menu} aria-label="Preferences">
        {React.Children.map(children, child => (
          <MenuItem as="div" {...menu}>
            {child}
          </MenuItem>
        ))}
      </MenuVertical>
    </>
  );
};
