import * as React from "react";
import { Job } from '../../redux/workspace/types';
import { RootState } from '../../redux/types';
import { OrderedMap } from 'immutable';
import { Design } from '../../redux/catalog/types';

import "./job.less";
import { connect } from 'react-redux';

export interface JobPanelProps {
  activeJob: Job;
  catalog: OrderedMap<number, Design>;
}

export const JobPanel: React.SFC<JobPanelProps> = props => {
  const { activeJob } = props;


  return (
    <div className="job-panel">
      {activeJob ? activeJob.tasks.length : "Get a job!"}
    </div>
  );
};


const mapStateToProps = (state: RootState) => ({
  activeJob: state.workspace.activeJob,
  catalog: state.catalog.items,
});

const mapDispatchToProps = ({
  // onDropDesign: addDesignToTemplate,
});


export const JobPanelConnected = connect(mapStateToProps, mapDispatchToProps)(JobPanel);
