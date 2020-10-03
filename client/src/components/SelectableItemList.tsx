import * as React from "react";
import { Set } from "immutable";
import { connect } from "react-redux";

interface SelectableItemProps {
  itemId: number;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  selected: boolean;
}

interface SelectableItemListProps {
  selectedIds: Set<number>;
  sortedItemIds: number[];
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

  private onClickItem = (clickIndex: number, e: React.MouseEvent<HTMLElement>) => {
    const { selectedIds, sortedItemIds: itemIds, setSelectedIds } = this.props;

    let newSelection: Set<number>;

    if (e.shiftKey) {
      // range selection from lastSelectedIndex to taskIndex
      // (or just the current item if lastSelectedIndex is null)
      // min/max ensures that start is always before end
      const start = this.lastSelectedIndex === null ? clickIndex : Math.min(clickIndex, this.lastSelectedIndex);
      const end = this.lastSelectedIndex === null ? clickIndex : Math.max(clickIndex, this.lastSelectedIndex);
      let selectionDelta: number[] = [];
      for (let index = start; index <= end; index++)
        selectionDelta.push(itemIds[index]);
      // if CTRL is down, keep previous selection, otherwise ignore it
      newSelection = e.ctrlKey ? selectedIds.union(selectionDelta) : Set(selectionDelta);
    } else if (e.ctrlKey) {
      // adding/subtracting an individual item
      if (selectedIds.has(clickIndex)) {
        newSelection = selectedIds.remove(itemIds[clickIndex]);
      } else {
        newSelection = selectedIds.add(itemIds[clickIndex]);
      }
      this.lastSelectedIndex = clickIndex;
    } else {
      // select an individual item, clearing the previous selection
      newSelection = Set([clickIndex]);
      this.lastSelectedIndex = clickIndex;
    }

    setSelectedIds(newSelection);
  }

  public render() {
    const { sortedItemIds, selectedIds, className } = this.props;

    const ListItemConponent = this.props.listItemConponent;

    const selectableItems = sortedItemIds.map((itemId, index) => (
        <ListItemConponent
          itemId={itemId}
          selected={selectedIds.has(itemId)}
          onClick={e => this.onClickItem(index, e)}
        />
    ));

    const classList = className ? [className] : [];
    classList.push("scrollable");

    return (
      <section className={classList.join(" ")} onClick={this.onClickEmpty}>
        {selectableItems}
      </section>
    );
  }
}

export const GCodeTaskButton: React.SFC<{onClick: () => void}> = props => (
  <button className="blue fas fa-plus" onClick={props.onClick} title="Add G-Code task" />
);

// const mapStateToProps = (state: RootState): StateProps => ({
//   activeJob: state.workspace.activeJob,
//   hoverTaskIndex: state.workspace.hoverTaskIndex,
//   selectedTasks: state.workspace.selectedTasks,
//   sharedTaskSettings: getSharedTaskSettings(state),
// });

// const mapDispatchToProps = {
//   // onDropDesign: addDesignToTemplate,
//   // updateJob: (job: Job) => { dispatch({ type: SET_ACTIVE_JOB, job }); },
//   updateSelectedTasks: actions.updateSelectedTasks,
//   deleteTask: actions.deleteTask,
//   hoverTask: actions.hoverTask,
//   setTaskSelection: actions.setTaskSelection,
//   appendTask: actions.appendTask,
// };

// export const JobPanelConnected = connect(mapStateToProps, mapDispatchToProps)(JobPanel);
