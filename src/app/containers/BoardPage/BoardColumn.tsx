import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import * as _ from 'lodash';
import styled from 'styled-components/macro';
import { RadioCircle } from 'styled-icons/boxicons-regular';
import { Github } from 'styled-icons/boxicons-logos';

import {
  Card,
  CardFooter,
  CardTitle,
  Label,
  Spacer,
} from 'app/components/UiComponents';
import { Column as ColumnType, TaskMap } from 'app/containers/Database/types';
import { AddCard } from './AddCard';

export function BoardColumn(
  col: ColumnType,
  index: number,
  tasks: TaskMap,
): JSX.Element {
  return (
    <Column key={col.title}>
      <ColumnTitle>
        <ColumnIcon size="2rem" /> {col.title}
      </ColumnTitle>
      <Droppable droppableId={`${index}`}>
        {provided => (
          <Tasks
            className="list-content"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {!_.isEmpty(tasks) &&
                col.taskIds.map((id, index) => {
                  const task = tasks[id];
                  return (
                    <Draggable draggableId={id} key={id} index={index}>
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => 'onClick(task)'}
                        >
                          <Task key={id}>
                            <CardTitle>{task.title}</CardTitle>
                            <CardFooter>
                              <Spacer />
                              <Label>
                                <GithubLogo size="1.5rem" />
                                {task.project.split('-')[2]}
                              </Label>
                            </CardFooter>
                          </Task>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              {provided.placeholder}
            </div>
          </Tasks>
        )}
      </Droppable>
      <AddCard />
    </Column>
  );
}

const Column = styled.div`
  background-color: white;
  min-height: 16rem;
  padding: 1.6rem;
  width: 25%;
`;

const ColumnTitle = styled.h2`
  align-items: center;
  display: flex;
  font-size: 2rem;
  font-weight: 400;
  margin: 0;
  padding: 1.6rem 0 3.2rem;
`;

const ColumnIcon = styled(RadioCircle)`
  color: ${p => p.theme.palette.grey[600]};
  margin-right: 0.3rem;
`;

const Tasks = styled.div`
  min-height: 10rem;
`;

const Task = styled(Card)`
  &:hover {
    box-shadow: ${p => p.theme.shadows[3]};
  }
  &:last-child {
    margin-bottom: 1.6rem;
  }
`;

const GithubLogo = styled(Github)`
  padding-right: 0.2rem;
`;
