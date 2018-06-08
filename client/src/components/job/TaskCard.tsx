import * as React from "react";
import { MachineTask, GCodeTask, DesignTask } from "../../redux/workspace/types";
// import { RootState } from "../../redux/types";
// import { OrderedMap } from "immutable";
// import { Design } from "../../redux/catalog/types";
// import { connect, Dispatch } from "react-redux";
// import { SET_ACTIVE_JOB } from "../../redux/workspace/actions";

import "./job.less";

export interface TaskCardProps {
  task: MachineTask;
}

export const TaskCard: React.SFC<TaskCardProps> = props => {
  const { task } = props;
  if (task.type === "gcode") {
    return <GCodeTaskCard task={task} />;
  } else if (task.type === "vector-raster") {
    return <DesignTaskCard task={task} />;
  } else {
    return null;
  }
};

export const DesignTaskCard: React.SFC<{task: DesignTask}> = props => (
  <div className="task-card">
    <div title="Power" className="power parameter">
      <i className="fas fa-bolt" />
      <span>90</span>
    </div>
    <div title="Speed" className="speed parameter">
      <i className="fas fa-angle-double-right" />
      <span>35</span>
    </div>
    <div title="DPI" className="dpi parameter">
      <span>400</span>
      <small>DPI</small>
    </div>
  </div>
);

export const GCodeTaskCard: React.SFC<{task: GCodeTask}> = props => (
  <div className="task-card">
    [G-Code]
  </div>
);
