import * as React from "react";
import { Set } from "immutable";
import { connect } from "react-redux";

import { CrudItem } from "../redux/CRUD/types";


interface SelectableItemProps {
  item: CrudItem;
  itemId: number;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  selected: boolean;
}

// interface SelectableEntr {
//   id: number;
//   selected: boolean;
// }

interface SelectableItemListProps<S extends SelectableItemProps> {
  // items: List<any>;
  ids: Iterable<number>;
  selectedIds: Set<number>;
  setSelectedIds: (selectedIds: Set<number>) => void;
  listItemConponent: React.ComponentClass<SelectableItemProps>;
  className?: string;
}

export class SelectableItemList extends React.Component<SelectableItemListProps> {
  // keep track of the previous item clicked, for selecting ranges
  private lastSelectedIndex: number = null;

  private onClickEmpty = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget && !(e.shiftKey || e.ctrlKey)) {
      this.lastSelectedIndex = null;
      this.props.setSelectedIds(Set());
    }
  }

  private onClickTask = (taskIndex: number, e: React.MouseEvent<HTMLElement>) => {
    const { selectedIds, setSelectedIds } = this.props;

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
      newSet = e.ctrlKey ? selectedIds.union(indices) : Set(indices);
    } else if (e.ctrlKey) {
      // adding/subtracting an individual item
      if (selectedIds.has(taskIndex)) {
        newSet = selectedIds.remove(taskIndex);
      } else {
        newSet = selectedIds.add(taskIndex);
      }
      this.lastSelectedIndex = taskIndex;
    } else {
      // select an individual item, clearing the previous selection
      newSet = Set([taskIndex]);
      this.lastSelectedIndex = taskIndex;
    }

    setSelectedIds(newSet);
  }

  public render() {
    const {
      selectedIds,
      // ListItemConponent,
      // activeJob, hoverTaskIndex, selectedTasks, updateSelectedTasks,
      // deleteTask, hoverTask, sharedTaskSettings
    } = this.props;

    const ListItemConponent = this.props.listItemConponent;
    let globalTaskCard: JSX.Element = null;
    let taskCards: JSX.Element[] = null;
    // if (activeJob) {
    //   taskCards = activeJob.tasks.map((task, index) => (
    //     <DraggableTaskCard
    //       model={task}
    //       key={index}
    //       onDelete={() => deleteTask(index)}
    //       onMouseOver={() => hoverTask(index)}
    //       onMouseOut={() => hoverTask(null)}
    //       onClick={e => this.onClickTask(index, e)}
    //       highlight={index === hoverTaskIndex}
    //       selected={selectedTasks.has(index)}
    //     />
    //   ));
    // }
    // const selectableItems = selectedIds.map(

    return (
      <div className={className}>

        <section className="task-list scrollable" onClick={this.onClickEmpty}>
          {globalTaskCard}
          {taskCards}

          {selectedIds.map(id => (



          ))}
        </section>
        <section className="task-actions">
          <GCodeTaskButton onClick={this.appendGCodeTask} />
        </section>
      </div>
    );
  }
}

export const GCodeTaskButton: React.SFC<{onClick: () => void}> = props => (
  <button className="blue fas fa-plus" onClick={props.onClick} title="Add G-Code task" />
);

const mapStateToProps = (state: RootState): StateProps => ({
  activeJob: state.workspace.activeJob,
  hoverTaskIndex: state.workspace.hoverTaskIndex,
  selectedTasks: state.workspace.selectedTasks,
  sharedTaskSettings: getSharedTaskSettings(state),
});

const mapDispatchToProps = {
  // onDropDesign: addDesignToTemplate,
  // updateJob: (job: Job) => { dispatch({ type: SET_ACTIVE_JOB, job }); },
  updateSelectedTasks: actions.updateSelectedTasks,
  deleteTask: actions.deleteTask,
  hoverTask: actions.hoverTask,
  setTaskSelection: actions.setTaskSelection,
  appendTask: actions.appendTask,
};

export const JobPanelConnected = connect(mapStateToProps, mapDispatchToProps)(JobPanel);
