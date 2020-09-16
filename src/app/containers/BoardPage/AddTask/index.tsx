/**
 *
 * AddCard
 *
 */
import React, { useEffect, useRef, useState } from 'react';
import { useDialogState, DialogDisclosure } from 'reakit/Dialog';

import {
  Button,
  ButtonClear,
  Horizontal,
  ButtonOutlined,
} from 'app/components/UiComponents';
import { ProjectMap } from 'app/containers/Database/types';
import {
  DialogBackdrop,
  Dialog,
  DialogHeader,
  DialogContent,
  FormField,
  Label,
  Select,
  Textarea,
  DialogFooter,
} from 'app/components/UiComponents/Dialog';

interface Props {
  addTaskOnSubmit: (newTask: {
    description: string;
    projectId: string;
    title: string;
  }) => any;
  projects: ProjectMap;
}

export function AddCard({ addTaskOnSubmit, projects }: Props) {
  const node = useRef<HTMLDivElement>(null);
  const [description, setDescription] = useState<string>('');
  const [isClosed, setIsClosed] = useState<boolean>(true);
  const [projectId, setProjectId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const dialog = useDialogState();
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
                  value={projectId}
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
                disabled={Boolean(projectId && title) ? false : true}
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
    setProjectId(ev.target.value);
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
    addTaskOnSubmit({ description, projectId, title });
    dialog.hide();
    setDescription('');
    setTitle('');
  }
}
