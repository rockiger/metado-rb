/**
 *
 * AddCard
 *
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  useDialogState,
  Dialog as ReaDialog,
  DialogDisclosure,
  DialogBackdrop as ReaDialogBackdrop,
} from 'reakit/Dialog';
import styled from 'styled-components/macro';
import media from 'styled-media-query';

import {
  Button,
  ButtonClear,
  Horizontal,
  ButtonOutlined,
} from 'app/components/UiComponents';
import { ProjectMap } from 'app/containers/Database/types';

interface Props {
  projects: ProjectMap;
}

export function AddCard({ projects }: Props) {
  const node = useRef<HTMLDivElement>(null);
  const [description, setDescription] = useState<string>('');
  const [isClosed, setIsClosed] = useState<boolean>(true);
  const [selectValue, setSelectValue] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const dialog = useDialogState({ visible: true });
  const ref = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (dialog.visible) {
      ref?.current?.focus();
    }
  }, [dialog.visible]);

  useEffect(() => {
    if (!isClosed) {
      document.addEventListener('mousedown', onClickOutside);
    } else {
      document.removeEventListener('mousedown', onClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [isClosed]);

  console.log(Boolean(selectValue && title));
  return (
    <div ref={node}>
      <Horizontal align="center">
        <DialogDisclosure as={ButtonClear} {...dialog}>
          <b>+ Add Card</b>
        </DialogDisclosure>
      </Horizontal>
      <DialogBackdrop {...dialog}>
        <Dialog
          {...dialog}
          aria-label="Add task to board"
          hideOnEsc
          hideOnClickOutside
          preventBodyScroll={false}
        >
          <form action="#" name="addtask" onSubmit={onSubmit}>
            <DialogHeader>
              <h5>Add Task</h5>
            </DialogHeader>
            <DialogContent>
              <FormField>
                <Label form="addtask" htmlFor="project">
                  Project*
                </Label>
                <Select
                  name="project"
                  onChange={onChangeSelect}
                  required
                  unselected
                  value={selectValue}
                >
                  <option value="" disabled>
                    Select your project
                  </option>
                  {Object.values(projects).map(project => (
                    <option key={project.id} value={project.id}>
                      {project.fullname}
                    </option>
                  ))}
                </Select>
              </FormField>
              <hr />
              <FormField>
                <Label form="addtask" htmlFor="title">
                  Title*
                </Label>
                <input
                  name="title"
                  onChange={ev => setTitle(ev.target.value)}
                  placeholder="Concisely summarize the task."
                  required
                  value={title}
                />
              </FormField>
              <FormField>
                <Label form="addtask" htmlFor="description">
                  Description
                </Label>
                <Textarea
                  name="description"
                  onChange={ev => setDescription(ev.target.value)}
                  placeholder="Describe the task in detail. Styling with Markdown is
                  supported."
                  value={description}
                ></Textarea>
              </FormField>
            </DialogContent>
            <DialogFooter>
              <ButtonOutlined onClick={onClickCancel} type="reset">
                Cancel
              </ButtonOutlined>{' '}
              <Button
                disabled={Boolean(selectValue && title) ? false : true}
                type="submit"
              >
                Add Task
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      </DialogBackdrop>
    </div>
  );

  function onChangeSelect(ev) {
    setSelectValue(ev.target.value);
  }

  function onClickOutside(e) {
    console.log({ node });
    if (node?.current?.contains(e.target)) {
      // inside click
      console.log('clicking inside');

      return;
    }
    // outside click
    console.log('clicking anywhere');
    setIsClosed(true);
  }

  function onClickCancel(ev) {
    dialog.toggle();
  }

  function onSubmit(ev) {
    ev.preventDefault();
    console.log('onSubmit');
    // add task to github
    dialog.hide();
    setDescription('');
    setTitle('');
  }
}

const Dialog = styled(ReaDialog)`
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

const DialogBackdrop = styled(ReaDialogBackdrop)`
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

const DialogContent = styled.div`
  padding: var(--padding-dialog);
`;

const DialogFooter = styled.div`
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

const DialogHeader = styled.header`
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

const FormField = styled.div`
  margin-bottom: 1.6rem;
`;

const Label = styled.label`
  margin-bottom: 0.6rem;
  font-weight: 700;
`;

type SelectProps = { unselected?: boolean };
const Select = styled.select<SelectProps>`
  color: ${p => (p.unselected ? 'var(--color-darkGrey)' : 'inherit')};
`;

const Textarea = styled.textarea`
  height: 17rem;
  max-height: 34rem;
  min-height: 12rem;
`;
