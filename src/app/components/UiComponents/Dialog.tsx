import {
  Dialog as ReaDialog,
  DialogBackdrop as ReaDialogBackdrop,
} from 'reakit/Dialog';
import styled from 'styled-components/macro';
import media from 'styled-media-query';

export const Dialog = styled(ReaDialog)`
  background: var(--bg-color);
  border-radius: var(--border-radius);
  display: block;
  flex: 0 0 auto;
  margin: 2rem auto;
  text-align: left;
  position: absolute;
  transform-origin: 50% 25%;
  transition: var(--transition);
  user-select: text;
  will-change: top, left, margin, transform, opacity;
  z-index: 1001;


  ${media.greaterThan('medium')`
  width: 70%;
`}

${media.greaterThan('large')`
  width: 680px;
`}

${media.greaterThan('huge')`
  width: 760px;
`}

`;
export const DialogBackdrop = styled(ReaDialogBackdrop)`
  align-items: center;
  animation-fill-mode: both;
  animation-duration: 0.5s;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  height: 100%;
  inset: 0px;
  justify-content: center;
  left: 0;
  position: fixed;
  text-align: center;
  transform-origin: center center;
  transition: background-color 0.5s linear;
  top: 0;
  user-select: none;
  width: 100%;
  will-change: opacity;
  z-index: 1000;
`;
export const DialogContent = styled.div`
  padding: var(--padding-dialog);
`;
export const DialogFooter = styled.div`
  background-color: var(--bg-color-secondary);
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  border-top: var(--border);
  padding: 1.4rem 2.2rem;
  text-align: right;

  button:last-child {
    margin-left: 1rem;
  }
  button:hover,
  button.button-outline:hover {
    color: var(--color-darkGrey);
    border: 1px solid var(--color-darkGrey);
  }
`;
export const DialogHeader = styled.header`
  border-bottom: var(--border);
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  padding: var(--padding-dialog);

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0;
  }
`;
export const FormField = styled.div`
  margin-bottom: 1.6rem;
`;
export const Label = styled.label`
  margin-bottom: 0.6rem;
  font-weight: 700;
`;
type SelectProps = { unselected?: boolean };
export const Select = styled.select<SelectProps>`
  color: ${p => (p.unselected ? 'var(--color-darkGrey)' : 'inherit')};
`;
export const Textarea = styled.textarea`
  height: 17rem;
  max-height: 34rem;
  min-height: 12rem;
`;
