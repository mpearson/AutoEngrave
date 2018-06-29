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
import { createSelector } from "reselect";

interface StateProps {
  activeJob: Job;
  globalDesignSettings: DesignTask;
  hoverTaskIndex: number;
  selectedTasks: Set<number>;
  catalog: OrderedMap<number, Design>;
  sharedTaskSettings: MachineTask;
}

interface DispatchProps {
  // updateJob: (job: Job) => void;
  updateTask: (index: number, task: MachineTask) => any;
  removeTask: (index: number) => any;
  hoverTask: (index: number) => any;
  setTaskSelection: (selection: Set<number>) => any;
}

type JobPanelProps = StateProps & DispatchProps;

export class JobPanel extends React.Component<JobPanelProps> {
  // keep track of the previous item clicked, for selecting ranges
  private lastSelectedIndex: number = null;

  private onClickEmpty = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget && !(e.shiftKey || e.ctrlKey)) {
      this.lastSelectedIndex = null;
      this.props.setTaskSelection(Set());
    }
  }

  private onClickTask = (taskIndex: number, e: React.MouseEvent<HTMLElement>) => {
    const { selectedTasks, setTaskSelection } = this.props;

    let newSet: Set<number>;

    if (e.shiftKey) {
      // range selection from lastSelectedIndex to taskIndex
      // (or just the current item if lastSelectedIndex is null)
      // min/max ensures that start is always before end
      const start = this.lastSelectedIndex === null ? taskIndex : Math.min(taskIndex, this.lastSelectedIndex);
      const end = this.lastSelectedIndex === null ? taskIndex : Math.max(taskIndex, this.lastSelectedIndex);
      let indices: number[] = [];
      for (let i = start; i <= end; i++)
        indices.push(i);
      // if CTRL is down, keep previous selection, otherwise ignore it
      newSet = e.ctrlKey ? selectedTasks.union(indices) : Set(indices);
    } else if (e.ctrlKey) {
      // adding/subtracting an individual item
      if (selectedTasks.has(taskIndex)) {
        newSet = selectedTasks.remove(taskIndex);
      } else {
        newSet = selectedTasks.add(taskIndex);
      }
      this.lastSelectedIndex = taskIndex;
    } else {
      // select an individual item, clearing the previous selection
      newSet = Set([taskIndex]);
      this.lastSelectedIndex = taskIndex;
    }

    setTaskSelection(newSet);
  }

  public render() {
    const { activeJob, hoverTaskIndex, selectedTasks, removeTask, hoverTask } = this.props;
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
          onClick={e => this.onClickTask(index, e)}
          highlight={index === hoverTaskIndex}
          selected={selectedTasks.has(index)}
        />
      ));
    }

    return (
      <div className="job-panel">
        <TaskEditor model={null} onUpdate={() => null} />
        <section className="scrollable" onClick={this.onClickEmpty}>
          {globalTaskCard}
          {taskCards}
        </section>
      </div>
    );
  }
}

const getSharedTaskSettings = createSelector(
  (state: RootState) => state.workspace.activeJob,
  (state: RootState) => state.workspace.selectedTasks,
  (job, selectedTasks) => {
    if (job === null || selectedTasks.isEmpty())
      return null;

    let sharedTask: MachineTask = null;

    selectedTasks.forEach(taskIndex => {
      const task = job.tasks[taskIndex];
      if (sharedTask === null || sharedTask.type === task.type) {

      }
      // if (task.type === "gcode") {
      // }


    });

    return sharedTask;
  }
);

const mapStateToProps = (state: RootState): StateProps => ({
  activeJob: state.workspace.activeJob,
  globalDesignSettings: state.workspace.globalDesignSettings,
  hoverTaskIndex: state.workspace.hoverTaskIndex,
  selectedTasks: state.workspace.selectedTasks,
  catalog: state.catalog.items,
  sharedTaskSettings: getSharedTaskSettings(state),
});

const mapDispatchToProps = {
  // onDropDesign: addDesignToTemplate,
  // updateJob: (job: Job) => { dispatch({ type: SET_ACTIVE_JOB, job }); },
  updateTask: actions.updateActiveJobTask,
  removeTask: actions.removeActiveJobTask,
  hoverTask: actions.hoverActiveJobTask,
  setTaskSelection: actions.setTaskSelection,
};

export const JobPanelConnected = connect(mapStateToProps, mapDispatchToProps)(JobPanel);
