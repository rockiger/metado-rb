import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button, ButtonOutlined } from 'app/components/UiComponents';
import { Select } from 'app/components/UiComponents/Dialog';
import { TaskState } from '../Database/types';

export function AssignLists({
  assignmentsState,
  lists,
  onClickGoBack,
  onClickSave,
}) {
  const [assignments, setAssignments] = assignmentsState;

  useEffect(() => {
    setAssignments(
      lists.reduce((acc, el) => {
        console.log({ acc, el });
        return { ...acc, [el.id]: 'Backlog' };
      }, {}),
    );
  }, [lists]);

  const onChangeAssignment = ev => {
    ev.persist();
    console.log(ev.target.name);
    console.log(ev.target.value);
    setAssignments(oldVal => ({
      ...oldVal,
      [ev.target.name]: ev.target.value,
    }));
  };
  return (
    <>
      <Table>
        <tbody>
          {_.map(lists, el => (
            <tr>
              <th>
                <div key={el.id}>{el.name}</div>
              </th>
              <td>
                <Select
                  name={el.id}
                  onChange={onChangeAssignment}
                  required
                  unselected
                  value={assignments[el.id]}
                >
                  <option value="Backlog">{TaskState.Backlog}</option>
                  <option value="Todo">{TaskState.Todo}</option>
                  <option value="Doing">{TaskState.Doing}</option>
                  <option value="Done">{TaskState.Done}</option>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        <ButtonOutlined onClick={onClickGoBack}>
          Back to Selection
        </ButtonOutlined>
        <Button onClick={() => onClickSave()}>Save assignments</Button>
      </div>
    </>
  );
}

const Table = styled.table`
  max-width: 100%;
  min-width: 400px;
  margin-bottom: 1.6rem;
  text-align: left;
  width: 400px;
`;
