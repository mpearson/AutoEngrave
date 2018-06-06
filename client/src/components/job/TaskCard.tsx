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
        <li title="Power"><i className="fas fa-bolt" />90</li>
        <li title="Speed"><i className="fas fa-angle-double-right" />35</li>
        <li title="DPI"><i className="fas fa-align-justify" />400</li>
      </ul>
    </div>
  );
};
