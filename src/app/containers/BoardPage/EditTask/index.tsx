import React, { useEffect, useState } from 'react';

import { Button, ButtonOutlined } from 'app/components/UiComponents';
import {
  DialogBackdrop,
  Dialog,
  DialogHeader,
  DialogContent,
  FormField,
  Label,
  Textarea,
  DialogFooter,
} from 'app/components/UiComponents/Dialog';
import { DialogStateReturn } from 'reakit/ts';
import { Task } from 'app/containers/Database/types';

interface Props {
  dialogState: DialogStateReturn;
  finalFocusRef: any;
  handleCancelEdit: () => void;
  handleEditTask: (oldTask: Task, task: Task) => void;
  task: Task | null;
}

export function EditTask({
  dialogState,
  finalFocusRef,
  handleCancelEdit,
  handleEditTask,
  task,
}: Props) {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (task) {
      setDescription(task.description);
      setTitle(task.title);
    }
  }, [task]);
  return (
    <DialogBackdrop {...dialogState}>
      <Dialog
        {...dialogState}
        aria-label="Edit task"
        hideOnEsc
        hideOnClickOutside
        preventBodyScroll={false}
        unstable_finalFocusRef={finalFocusRef}
      >
        <form action="#" name="addtask" onSubmit={onSubmit}>
          <DialogHeader>
            <h5>Edit Task: {task?.id}</h5>
          </DialogHeader>
          <DialogContent>
            <FormField>
              <Label form="addtask" htmlFor="title">
                Title*
              </Label>
              <input
                name="title"
                onChange={ev => setTitle(ev.target.value)}
                placeholder="Concisely summarize the task."
                required
                value={title || ''}
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
                value={description || ''}
              ></Textarea>
            </FormField>
          </DialogContent>
          <DialogFooter>
            <ButtonOutlined onClick={onClickCancel} type="reset">
              Cancel
            </ButtonOutlined>{' '}
            <Button disabled={Boolean(title) ? false : true} type="submit">
              Edit Task
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </DialogBackdrop>
  );

  function onClickCancel() {
    setDescription('');
    setTitle('');
    handleCancelEdit();
    dialogState.hide();
  }

  function onSubmit(ev) {
    ev.preventDefault();
    if (task && (task?.description !== description || task?.title !== title)) {
      handleEditTask(task, { ...task, description, title });
    }
    //! handleSubmit
    onClickCancel();
  }
}
