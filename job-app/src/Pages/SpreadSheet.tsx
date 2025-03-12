import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { JobApplication, StatusUpdate } from '../Interface/Sheets';
import { useFetchJobApplications, useAddNewStatus, useCreateNewJob } from '../api/Queries';
import { formatDisplayDate, formatDateForApi, extractDateForInput } from '../helpers/Date';

function SpreadSheet() {
  const { sheetId } = useParams<{ sheetId: string }>();
  const userId = localStorage.getItem('user') || '';
  const queryClient = useQueryClient();
  const fetchJobApplications = useFetchJobApplications();
  
  // Use useQuery to store and cache the data
  const { data: jobApplicationsData, isLoading, error } = useQuery({
    queryKey: ['jobApplications', sheetId],
    queryFn: async () => {
      const result = await fetchJobApplications.mutateAsync({ 
        user_id: userId, 
        sheet_id: sheetId as string 
      });
      
      return {
        jobApplications: result.jobApplications,
        sheetName: result.spreadsheetName
      };
    },
    enabled: !!sheetId && !!userId
  });
  
  // Get job applications and sheet name from query result
  const jobApplications = jobApplicationsData?.jobApplications || [];
  // Try to get sheet name from jobApplicationsData, or fall back to cache or default
  const sheetName = 
    jobApplicationsData?.sheetName || 
    queryClient.getQueryData<string>(['spreadsheets', sheetId]) || 
    'Unknown Sheet';
  
  // State for tracking expanded job rows
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});
  
  // State for new status updates - now using StatusUpdate interface
  const [newStatuses, setNewStatuses] = useState<Record<string, StatusUpdate>>({});
  
  // State for showing add status form
  const [showAddStatus, setShowAddStatus] = useState<Record<string, boolean>>({});
  
  // State for showing the add job form
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  
  // State for new job form
  const [newJob, setNewJob] = useState<Partial<JobApplication>>({
    position: '',
    company: '',
    location: '',
    date_applied: ''
  });

  // Use addNewStatus mutation
  const addStatusMutation = useAddNewStatus();

  // Use createNewJob mutation
  const createNewJobMutation = useCreateNewJob();

  // Toggle expanded state for a job
  const toggleExpandJob = (jobId: string) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };
  
  // Toggle add status form visibility
  const toggleAddStatus = (jobId: string) => {
    setShowAddStatus(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
    
    // Initialize the new status form with empty values when showing it
    if (!showAddStatus[jobId]) {
      setNewStatuses(prev => ({
        ...prev,
        [jobId]: {
          status_type: '',  
          comments: ''      
        }
      }));
    }
  };
  
  // Handle status update form input changes
  const handleStatusChange = (jobId: string, field: string, value: string) => {
    setNewStatuses(prev => ({
      ...prev,
      [jobId]: {
        ...(prev[jobId] || { status_type: '', comments: '' }),
        [field]: value
      }
    }));
  };
  
  // Handle adding a new status
  const handleAddNewStatus = (jobId: string) => {
    if (!newStatuses[jobId]?.status_type) return;
    // console.log("Status",newStatuses)
    addStatusMutation.mutate({
      user_id: userId,
      sheet_id: sheetId as string,
      job_id: jobId,
      status: newStatuses[jobId] // Now directly passing the StatusUpdate object
    });
     
    // Clear the form and hide it after submission
    setNewStatuses(prev => {
      const updated = { ...prev };
      delete updated[jobId];
      return updated;
    });
    
    setShowAddStatus(prev => ({
      ...prev,
      [jobId]: false
    }));
  };

  // Handle new job form input changes with proper typing
  const handleNewJobChange = (field: keyof Omit<JobApplication, 'job_id' | 'status'>, value: string) => {
    setNewJob(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle adding a new job with proper date formatting
  const addNewJob = () => {
    // Validate required fields
    if (!newJob.position || !newJob.company || !newJob.location) {
      return;
    }
    
    // Log the raw date value before formatting
    // console.log('Raw date value:', newJob.date_applied);
    
    // Format the date for API submission
    const formattedDate = formatDateForApi(newJob.date_applied);
    // console.log('Formatted date:', formattedDate);
    
    // Create job data object with properly formatted date
    const jobData: JobApplication = {
      
      position: newJob.position,
      company: newJob.company,
      location: newJob.location,
      status: [], // Initialize with empty status array
      date_applied: formattedDate
    };
    
    // console.log('Adding new job with formatted date:', jobData);
    
    createNewJobMutation.mutate({
      user_id: userId,
      sheet_id: sheetId as string,
      job_data: jobData
    });
    
    // Clear the form and hide it after submission
    setNewJob({
      position: '',
      company: '',
      location: '',
      date_applied: ''
    });
    setShowAddJobForm(false);
  };

  // Get the latest status for a job
  const getLatestStatus = (job: JobApplication) => {
    if (!job.status|| job.status.length === 0) return 'No status';
    return job.status[job.status.length - 1].status_type;
  };

  if (isLoading) return <div className="p-4 text-center">Loading job applications...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error loading job applications</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Job Applications for Sheet {sheetName}</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 bg-gray-100 p-4 font-semibold border-b">
          <div className="col-span-3">Position</div>
          <div className="col-span-2">Company</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-2">Applied Date</div>
          <div className="col-span-2">Current Status</div>
          <div className="col-span-1">Details</div>
        </div>
        
        {/* Job Rows */}
        {jobApplications && jobApplications.length > 0 ? (
          jobApplications.map((job) => (
            <div key={job.job_id} className="border-b last:border-b-0">
              {/* Main Job Row */}
              <div className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-gray-50">
                <div className="col-span-3 font-medium">{job.position}</div>
                <div className="col-span-2">{job.company}</div>
                <div className="col-span-2">{job.location}</div>
                <div className="col-span-2">{formatDisplayDate(job.date_applied)}</div>
                <div className="col-span-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {getLatestStatus(job)}
                  </span>
                </div>
                <div className="col-span-1">
                  <button 
                    onClick={() => job.job_id && toggleExpandJob(job.job_id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {job.job_id && expandedJobs[job.job_id] ? 'Hide' : 'View'}
                  </button>
                </div>
              </div>
              
              {/* Expanded Status Section */}
              {job.job_id && expandedJobs[job.job_id] && (
                <div className="bg-gray-50 p-4 pl-8 border-t">
                  <h3 className="font-medium mb-3">Status History</h3>
                  
                  {/* Status List */}
                  <div className="space-y-3 mb-4">
                    {job.status && job.status.length > 0 ? (
                      job.status.map((status, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 bg-white p-3 rounded border">
                          <div className="col-span-3 font-medium">{status.status_type}</div>
                          <div className="col-span-3 text-sm text-gray-500">{formatDisplayDate(status.date)}</div>
                          <div className="col-span-6 text-sm">{status.comments || 'No comments'}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No status updates yet</p>
                    )}
                  </div>
                  
                  {/* Add Status Button */}
                  {!showAddStatus[job.job_id] ? (
                    <button 
                      onClick={() => job.job_id && toggleAddStatus(job.job_id)}
                      className="mt-2 text-sm bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                    >
                      Add Status Update
                    </button>
                  ) : (
                    <div className="grid grid-cols-12 gap-2 bg-white p-3 rounded border mt-3">
                      <div className="col-span-3">
                        <select 
                          className="w-full p-2 border rounded"
                          value={newStatuses[job.job_id]?.status_type || ''}
                          onChange={(e) => job.job_id && handleStatusChange(job.job_id, 'status_type', e.target.value)}
                        >
                          <option value="">Select status...</option>
                          <option value="Applied">Applied</option>
                          <option value="Online Assessment">Online Assessment</option>
                          <option value="Phone Interview">Phone Interview</option>
                          <option value="Technical Interview">Technical Interview</option>
                          <option value="Onsite Interview">Onsite Interview</option>
                          <option value="Offer Received">Offer Received</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Accepted">Accepted</option>
                        </select>
                      </div>
                      
                      <div className="col-span-6">
                        <textarea 
                          className="w-full p-2 border rounded"
                          placeholder="Add comments (optional)"
                          value={newStatuses[job.job_id]?.comments || ''}
                          onChange={(e) => job.job_id && handleStatusChange(job.job_id, 'comments', e.target.value)}
                          rows={1}
                        />
                      </div>
                      
                      <div className="col-span-3 flex space-x-2">
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                          onClick={() => job.job_id && handleAddNewStatus(job.job_id)}
                          disabled={!newStatuses[job.job_id]?.status_type}
                        >
                          Save
                        </button>
                        <button 
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded"
                          onClick={() => job.job_id && toggleAddStatus(job.job_id)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">No job applications found.</div>
        )}
      </div>

      {/* Add Job Button */}
      {!showAddJobForm ? (
        <button 
          onClick={() => setShowAddJobForm(true)}
          className="mt-4 text-sm bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Add New Job
        </button>
      ) : (
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-3">Add New Job</h3>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-3">
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                placeholder="Position" 
                value={newJob.position} 
                onChange={(e) => handleNewJobChange('position', e.target.value)} 
              />
            </div>
            <div className="col-span-3">
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                placeholder="Company" 
                value={newJob.company} 
                onChange={(e) => handleNewJobChange('company', e.target.value)} 
              />
            </div>
            <div className="col-span-3">
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                placeholder="Location" 
                value={newJob.location} 
                onChange={(e) => handleNewJobChange('location', e.target.value)} 
              />
            </div>
            <div className="col-span-3">
              <input 
                type="date" 
                className="w-full p-2 border rounded" 
                value={newJob.date_applied ? extractDateForInput(newJob.date_applied) : ''} 
                onChange={(e) => handleNewJobChange('date_applied', e.target.value)} 
              />
            </div>
          </div>
          <div className="mt-3 flex space-x-2">
            <button 
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
              onClick={addNewJob}
              disabled={!newJob.position || !newJob.company || !newJob.location }
            >
              Save
            </button>
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded"
              onClick={() => setShowAddJobForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpreadSheet;