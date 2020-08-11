import React from 'react';
import { render } from '@testing-library/react';

import { PrivateRoute } from '..';

describe('<PrivateRoute  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<PrivateRoute />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
