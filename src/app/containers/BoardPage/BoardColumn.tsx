import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import * as _ from 'lodash';
import styled from 'styled-components/macro';
import { RadioCircle } from 'styled-icons/boxicons-regular';
import { Github } from 'styled-icons/boxicons-logos';

import { Label, Spacer } from 'app/components/UiComponents';
import { Column as ColumnType, TaskMap } from 'app/containers/Database/types';

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
          <Cards
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
                          <Card key={id}>
                            <CardTitle>{task.title}</CardTitle>
                            <CardFooter>
                              <Spacer />
                              <Label>
                                <GithubLogo size="1.5rem" />
                                {task.project.split('-')[2]}
                              </Label>
                            </CardFooter>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              {provided.placeholder}
            </div>
          </Cards>
        )}
      </Droppable>
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

const Cards = styled.div`
  min-height: 10rem;
`;

const Card = styled.div`
  background-color: white;
  border: 1px solid ${p => p.theme.palette.grey[300]};
  border-radius: 4px;
  margin-bottom: 1.6rem;
  padding: 1.6rem;
  &:hover {
    box-shadow: ${p => p.theme.shadows[3]};
  }
  &:last-child {
    margin-bottom: 1.6rem;
  }
`;

const CardTitle = styled.div``;

const CardFooter = styled.div`
  display: flex;
  padding-top: 0.5rem;
`;

const GithubLogo = styled(Github)`
  padding-right: 0.2rem;
`;
