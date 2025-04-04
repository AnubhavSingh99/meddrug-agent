import React from 'react'
import JobManager from '../components/JobManager'

const Testing: React.FC = () => {
  return (
    <div className="testing">
      <header className="page-header">
        <h1>Testing & Validation</h1>
        <p>Validate compounds with in-silico methods</p>
      </header>
      
      <div className="testing-content">
        <div className="testing-section">
          <h2>Computational Jobs</h2>
          <JobManager />
        </div>
      </div>
    </div>
  )
}

export default Testing 