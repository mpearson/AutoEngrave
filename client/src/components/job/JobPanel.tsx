import "./job.less";

import * as React from "react";
import { Job, MachineTask, DesignTask } from "../../redux/workspace/types";
import { RootState } from "../../redux/types";
import { OrderedMap, Set } from "immutable";
import { Design } from "../../redux/catalog/types";
import { connect } from "react-redux";
import * as actions from "../../redux/workspace/actions";
import { TaskCard } from "./TaskCard";
import { TaskEditor } from "./TaskEditor";

interface StateProps {
  activeJob: Job;
  globalDesignSettings: DesignTask;
  hoverTaskIndex: number;
  selectedTasks: Set<number>;
  catalog: OrderedMap<number, Design>;
}

interface DispatchProps {
  // updateJob: (job: Job) => void;
  updateTask: (index: number, task: MachineTask) => any;
  removeTask: (index: number) => any;
  hoverTask: (index: number) => any;
  selectTasks: (taskIndex: number, ctrl: boolean, shift: boolean) => any;
}

type JobPanelProps = StateProps & DispatchProps;

export const JobPanel: React.SFC<JobPanelProps> = props => {
  const { activeJob, hoverTaskIndex, selectedTasks, removeTask, hoverTask, selectTasks } = props;
  let globalTaskCard: JSX.Element = null;
  let taskCards: JSX.Element[] = null;
  if (activeJob) {
    taskCards = activeJob.tasks.map((task, index) => (
      <TaskCard
        model={task}
        key={index}
        onDelete={() => removeTask(index)}
        onMouseOver={() => hoverTask(index)}
        onMouseOut={() => hoverTask(null)}
        onClick={e => selectTasks(index, e.ctrlKey, e.shiftKey)}
        highlight={index === hoverTaskIndex}
        selected={selectedTasks.has(index)}
      />
    ));
  }

  return (
    <div className="job-panel">
      <TaskEditor model={null} onUpdate={() => null} />
      <section className="scrollable">
        {globalTaskCard}
        {taskCards}
      </section>
    </div>
  );
};


const mapStateToProps = (state: RootState): StateProps => ({
  activeJob: state.workspace.activeJob,
  globalDesignSettings: state.workspace.globalDesignSettings,
  hoverTaskIndex: state.workspace.hoverTaskIndex,
  selectedTasks: state.workspace.selectedTasks,
  catalog: state.catalog.items,
});

const mapDispatchToProps = {
  // onDropDesign: addDesignToTemplate,
  // updateJob: (job: Job) => { dispatch({ type: SET_ACTIVE_JOB, job }); },
  updateTask: actions.updateActiveJobTask,
  removeTask: actions.removeActiveJobTask,
  hoverTask: actions.hoverActiveJobTask,
  selectTasks: actions.selectTasks,
};

export const JobPanelConnected = connect(mapStateToProps, mapDispatchToProps)(JobPanel);
