import styled from 'styled-components/macro';

export const Horizontal = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-evenly;
  height: 5rem;
  box-shadow: ${p => p.theme.shadows[4]};
`;
