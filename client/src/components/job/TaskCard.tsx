import * as React from "react";
import { MachineTask } from "../../redux/workspace/types";
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
  // const { task } = props;

  // switch (task.type) {
  //   case "gcode": {

  //   }
  // }
  // const { design } = task;


  return (
    <div className="task-card">
      <ul>
        <li title="Power" className="power">
          <i className="fas fa-bolt" />
          <span>90</span>
        </li>
        <li title="Speed" className="speed">
          <i className="fas fa-angle-double-right" />
          <span>35</span>
        </li>
        <li title="DPI" className="dpi">
          <span>400</span>
          <small>DPI</small>
        </li>
      </ul>
    </div>
  );
};
