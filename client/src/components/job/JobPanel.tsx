import * as React from "react";
import { Job, MachineTask } from "../../redux/workspace/types";
import { RootState } from "../../redux/types";
import { OrderedMap } from "immutable";
import { Design } from "../../redux/catalog/types";
import { connect } from "react-redux";
import * as actions from "../../redux/workspace/actions";
import { TaskCard } from "./TaskCard";

import "./job.less";

interface StateProps {
  activeJob: Job;
  catalog: OrderedMap<number, Design>;
}

interface DispatchProps {
  // updateJob: (job: Job) => void;
  updateTask: (index: number, task: MachineTask) => any;
  removeTask: (index: number) => any;
  hoverTask: (index: number) => any;
}

type JobPanelProps = StateProps & DispatchProps;

export const JobPanel: React.SFC<JobPanelProps> = props => {
  const { activeJob, removeTask, hoverTask } = props;
  let taskCards: JSX.Element[] = null;
  if (activeJob) {
    taskCards = activeJob.tasks.map((task, index) => (
      <TaskCard
        model={task}
        key={index}
        onDelete={() => removeTask(index)}
        onMouseOver={() => hoverTask(index)}
        onMouseOut={() => hoverTask(null)}
        />
      )
    );
  }

  return (
    <div className="job-panel">
      <section>
        <input type="text" className="simple-input" />
      </section>
      <section className="scrollable">
        {taskCards}
      </section>
    </div>
  );
};


const mapStateToProps = (state: RootState): StateProps => ({
  activeJob: state.workspace.activeJob,
  catalog: state.catalog.items,
});

const mapDispatchToProps = {
  // onDropDesign: addDesignToTemplate,
  // updateJob: (job: Job) => { dispatch({ type: SET_ACTIVE_JOB, job }); },
  updateTask: actions.updateActiveJobTask,
  removeTask: actions.removeActiveJobTask,
  hoverTask: actions.hoverActiveJobTask,
};

export const JobPanelConnected = connect(mapStateToProps, mapDispatchToProps)(JobPanel);
