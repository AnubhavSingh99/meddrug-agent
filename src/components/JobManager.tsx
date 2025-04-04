import React from 'react';
import { useComputation } from '../context/ComputationContext';

const JobManager: React.FC = () => {
  const { activeJobs, completedJobs, cancelJob } = useComputation();

  const formatDuration = (startDate: Date, endDate?: Date) => {
    const end = endDate || new Date();
    const durationMs = end.getTime() - startDate.getTime();
    
    const seconds = Math.floor(durationMs / 1000);
    if (seconds < 60) return `${seconds}s`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  return (
    <div className="job-manager">
      <div className="job-section">
        <h3>Active Jobs ({activeJobs.length})</h3>
        {activeJobs.length === 0 ? (
          <p className="no-jobs">No active jobs</p>
        ) : (
          <div className="jobs-list">
            {activeJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div className="job-title">
                    {job.type.charAt(0).toUpperCase() + job.type.slice(1)} Job
                  </div>
                  <div className="job-status">{job.status}</div>
                </div>
                
                <div className="job-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">{Math.round(job.progress)}%</div>
                </div>
                
                <div className="job-details">
                  <div className="job-time">
                    Running for {formatDuration(job.createdAt)}
                  </div>
                  <button 
                    className="cancel-btn"
                    onClick={() => cancelJob(job.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="job-section">
        <h3>Completed Jobs ({completedJobs.length})</h3>
        {completedJobs.length === 0 ? (
          <p className="no-jobs">No completed jobs</p>
        ) : (
          <div className="jobs-list">
            {completedJobs.map(job => (
              <div 
                key={job.id} 
                className={`job-card ${job.status === 'failed' ? 'job-failed' : 'job-completed'}`}
              >
                <div className="job-header">
                  <div className="job-title">
                    {job.type.charAt(0).toUpperCase() + job.type.slice(1)} Job
                  </div>
                  <div className="job-status">{job.status}</div>
                </div>
                
                <div className="job-details">
                  <div className="job-time">
                    Completed in {formatDuration(job.createdAt, job.completedAt)}
                  </div>
                  <div className="job-actions">
                    <button className="view-results-btn">View Results</button>
                    <button className="rerun-btn">Rerun</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobManager; 