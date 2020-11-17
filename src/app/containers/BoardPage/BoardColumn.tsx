import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import * as _ from 'lodash';
import styled from 'styled-components/macro';
import { RadioCircle } from 'styled-icons/boxicons-regular';
import { GearFill } from 'styled-icons/bootstrap';
import { Github } from 'styled-icons/boxicons-logos';
import GoogleTasksLogoSrc from 'app/containers/AddGoogleTasklist/google-tasks-logo.png';

import {
  Card,
  CardFooter,
  CardTitle,
  Label,
  Spacer,
} from 'app/components/UiComponents';
import {
  useMenuState,
  Menu,
  MenuItem,
  MenuButton,
  MenuSeparator,
} from 'app/components/UiComponents/Menu';
import {
  Column as ColumnType,
  ProjectMap,
  Task as TaskType,
  TaskMap,
} from 'app/containers/Database/types';

interface Props {
  col: ColumnType;
  handleClickTask: (task: TaskType) => void;
  index: number;
  projects: ProjectMap;
  tasks: TaskMap;
}

export function BoardColumn({
  col,
  handleClickTask,
  index,
  projects,
  tasks,
}: Props): JSX.Element {
  return (
    <Column key={col.title}>
      <ColumnTitle>
        <ColumnIcon size="2rem" /> <Spacer>{col.title}</Spacer>
        {col.title === 'Done' && <DoneColumnMenu />}
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
                  if (!task) {
                    console.log('Missing Task in Board. Task-Id:', id);
                    return null;
                  }
                  const project = projects[task.project];
                  return (
                    <Draggable draggableId={id} key={id} index={index}>
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Task key={id} onClick={() => handleClickTask(task)}>
                            <CardTitle>{task.title}</CardTitle>
                            <CardFooter>
                              <Spacer />
                              {project.type === 'github' && (
                                <Label color="black">
                                  <GithubLogo size="1.5rem" />
                                  {project.name}
                                </Label>
                              )}
                              {project.type === 'googletasks' && (
                                <Label color="#3f8ef1">
                                  <LogoWrapper>
                                    <LogoImg
                                      src={GoogleTasksLogoSrc}
                                      alt="Google Tasks Logo"
                                    />
                                  </LogoWrapper>
                                  {project.name}
                                </Label>
                              )}
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
    </Column>
  );
}

export function DoneColumnMenu() {
  const menu = useMenuState();

  return (
    <>
      <MenuButton {...menu}>
        <GearFill size="1.5rem" />
      </MenuButton>
      <Menu {...menu} aria-label="Preferences">
        <MenuItem {...menu}>Settings</MenuItem>
        <MenuItem {...menu} disabled>
          Extensions
        </MenuItem>
        <MenuSeparator {...menu} />
        <MenuItem {...menu}>Keyboard shortcuts</MenuItem>
      </Menu>
    </>
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
  padding: 1.6rem;
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

const LogoImg = styled.img`
  width: 1.5rem;
`;

const LogoWrapper = styled.span`
  border-radius: 100%;
  display: inline-block;
  height: 1.5rem;
  line-height: 1;
  margin-right: 0.2rem;
  vertical-align: middle;
`;
