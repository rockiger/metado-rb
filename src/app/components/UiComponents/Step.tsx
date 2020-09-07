/**
 *
 * Step
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
// TODO Mobile
interface Props {}

export function UiComponents(props: Props) {
  return <Div></Div>;
}

const Div = styled.div``;

export const Steps = styled.div`
  counter-reset: ordered;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  margin: 1.4rem 0;
  line-height: 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

type StepProps = {
  isActive?: boolean;
  isCompleted?: boolean;
};
export const Step = styled.div<StepProps>`
  color: ${p => (p.isActive ? 'var(--color-primary)' : 'var(--color-text)')};
  position: relative;
  display: flex;
  flex: 1 0 auto;
  flex-wrap: wrap;
  flex-direction: row;
  vertical-align: middle;
  align-items: center;
  justify-content: center;

  margin: 0;
  padding: 1.6rem 2.8rem;
  background: ${p =>
    p.isActive ? 'var(--bg-color-secondary)' : 'var(--bg-color)'};
  border-right: 1px solid var(--border-color);
  transition: var(--transition);

  &:after {
    display: block;
    position: absolute;
    z-index: 2;
    content: '';
    top: 50%;
    right: 0%;
    background: ${p =>
      p.isActive ? 'var(--bg-color-secondary)' : 'var(--bg-color)'};
    width: 1rem;
    height: 1rem;

    border-style: solid;
    border-color: var(--border-color);
    border-width: 0 1px 1px 0;

    transition: var(--transition);
    transform: translateY(-50%) translateX(50%) rotate(-45deg);
  }

  :before {
    color: ${p =>
      p.isCompleted ? 'var(--color-success)' : 'var(--color-text)'};
    content: ${p => (p.isCompleted ? '"\\2713"' : 'counter(ordered)')};
    display: block;
    position: static;
    text-align: center;
    align-self: center;
    margin-right: 1.4rem;
    font-size: ${p => (p.isCompleted ? '3.5rem' : '3rem')};
    counter-increment: ordered;
    font-family: inherit;
    font-weight: 700;
  }

  /* First Step */
  &:first-child {
    border-radius: var(--border-radius) 0 0 var(--border-radius);
  }

  /* Last Step */
  &:last-child {
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
    border-right: none;
    margin-right: 0;

    :after {
      display: none;
    }
  }

  /* Only Step */
  &:only-child {
    border-radius: var(--border-radius);
  }
`;

export const Content = styled.div`
  display: block;
  flex: 0 1 auto;
  align-self: center;
`;

export const Title = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  width: 100%;
`;

export const Description = styled.div`
  color: var(--color-text);
  font-size: 1.4rem;
  margin-top: 0.4rem;
  width: 100%;
`;
