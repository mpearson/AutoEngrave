import * as React from "react";
import { Job } from "../../redux/workspace/types";
import { RootState } from "../../redux/types";
import { OrderedMap } from "immutable";
import { Design } from "../../redux/catalog/types";
import { connect, Dispatch } from "react-redux";
import { SET_ACTIVE_JOB } from "../../redux/workspace/actions";

import "./job.less";

export interface JobPanelProps {
  activeJob: Job;
  catalog: OrderedMap<number, Design>;
}

export const JobPanel: React.SFC<JobPanelProps> = props => {
  const { activeJob } = props;


  return (
    <div className="job-panel">
      <section>
        <input type="text" className="simple-input" />
      </section>
      <section className="scrollable">
        {activeJob ? activeJob.tasks.length : "Get a job!"}
      </section>
    </div>
  );
};


const mapStateToProps = (state: RootState) => ({
  activeJob: state.workspace.activeJob,
  catalog: state.catalog.items,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  // onDropDesign: addDesignToTemplate,
  updateJob: (job: Job) => dispatch({ type: SET_ACTIVE_JOB, job }),
});


export const JobPanelConnected = connect(mapStateToProps, mapDispatchToProps)(JobPanel);
