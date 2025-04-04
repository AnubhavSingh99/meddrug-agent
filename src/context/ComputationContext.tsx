import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { computationApi } from '../services/api';

interface Job {
  id: string;
  type: 'docking' | 'dynamics' | 'generation' | 'prediction';
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  result?: any;
}

interface ComputationContextType {
  jobs: Job[];
  activeJobs: Job[];
  completedJobs: Job[];
  submitDockingJob: (moleculeId: string, targetId: string, options?: any) => Promise<string>;
  submitDynamicsJob: (moleculeId: string, options?: any) => Promise<string>;
  cancelJob: (jobId: string) => Promise<void>;
  getJobResult: (jobId: string) => any;
}

const ComputationContext = createContext<ComputationContextType | undefined>(undefined);

export const useComputation = () => {
  const context = useContext(ComputationContext);
  if (!context) {
    throw new Error('useComputation must be used within a ComputationProvider');
  }
  return context;
};

interface ComputationProviderProps {
  children: ReactNode;
}

export const ComputationProvider: React.FC<ComputationProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  // Poll for job updates
  useEffect(() => {
    const activeJobIds = jobs
      .filter(job => job.status === 'queued' || job.status === 'running')
      .map(job => job.id);
      
    if (activeJobIds.length === 0) return;
    
    const pollInterval = setInterval(async () => {
      try {
        for (const jobId of activeJobIds) {
          const updatedJob = await computationApi.getJobStatus(jobId);
          
          setJobs(prevJobs => 
            prevJobs.map(job => 
              job.id === jobId ? { ...job, ...updatedJob } : job
            )
          );
        }
      } catch (error) {
        console.error('Error polling job status:', error);
      }
    }, 5000);
    
    return () => clearInterval(pollInterval);
  }, [jobs]);

  const submitDockingJob = async (moleculeId: string, targetId: string, options: any = {}) => {
    try {
      // In a real implementation, this would call the API
      // For the MVP, we'll simulate a job
      const jobId = `docking-${Date.now()}`;
      
      const newJob: Job = {
        id: jobId,
        type: 'docking',
        status: 'queued',
        progress: 0,
        createdAt: new Date(),
      };
      
      setJobs(prevJobs => [...prevJobs, newJob]);
      
      // Simulate job progress
      simulateJobProgress(jobId);
      
      return jobId;
    } catch (error) {
      console.error('Error submitting docking job:', error);
      throw error;
    }
  };

  const submitDynamicsJob = async (moleculeId: string, options: any = {}) => {
    try {
      // In a real implementation, this would call the API
      // For the MVP, we'll simulate a job
      const jobId = `dynamics-${Date.now()}`;
      
      const newJob: Job = {
        id: jobId,
        type: 'dynamics',
        status: 'queued',
        progress: 0,
        createdAt: new Date(),
      };
      
      setJobs(prevJobs => [...prevJobs, newJob]);
      
      // Simulate job progress
      simulateJobProgress(jobId);
      
      return jobId;
    } catch (error) {
      console.error('Error submitting dynamics job:', error);
      throw error;
    }
  };

  const cancelJob = async (jobId: string) => {
    try {
      // In a real implementation, this would call the API
      // For the MVP, we'll just update the local state
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? { ...job, status: 'failed', progress: 0 } : job
        )
      );
    } catch (error) {
      console.error('Error canceling job:', error);
      throw error;
    }
  };

  const getJobResult = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.result;
  };

  // Helper function to simulate job progress for the MVP
  const simulateJobProgress = (jobId: string) => {
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job.id === jobId 
              ? { 
                  ...job, 
                  status: 'completed', 
                  progress: 100, 
                  completedAt: new Date(),
                  result: { success: true, data: { score: -9.3 } }
                } 
              : job
          )
        );
      } else {
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job.id === jobId 
              ? { ...job, status: 'running', progress } 
              : job
          )
        );
      }
    }, 2000);
  };

  const activeJobs = jobs.filter(job => job.status === 'queued' || job.status === 'running');
  const completedJobs = jobs.filter(job => job.status === 'completed' || job.status === 'failed');

  return (
    <ComputationContext.Provider
      value={{
        jobs,
        activeJobs,
        completedJobs,
        submitDockingJob,
        submitDynamicsJob,
        cancelJob,
        getJobResult,
      }}
    >
      {children}
    </ComputationContext.Provider>
  );
}; 