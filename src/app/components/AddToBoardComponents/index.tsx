import styled from 'styled-components/macro';

export const View = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

export const ContainedView = styled(View)`
  max-width: 60rem;
  text-align: center;
`;
