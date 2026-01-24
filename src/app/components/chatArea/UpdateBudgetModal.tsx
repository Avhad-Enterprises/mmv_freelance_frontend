"use client";
import React, { useState, useEffect } from 'react';
import { X, DollarSign, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface Project {
  projects_task_id: number;
  project_title: string;
  budget: number;
  currency: string;
  client_id: number;
  status: number; // 0: Pending, 1: Ongoing, 2: Completed, 3: Rejected
  client_user_id: number;
}

interface UpdateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  otherParticipantId?: string;
}

const UpdateBudgetModal: React.FC<UpdateBudgetModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  otherParticipantId,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [newBudget, setNewBudget] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [error, setError] = useState<string>('');

  const selectedProject = projects.find(p => p.projects_task_id === selectedProjectId);

  // Fetch projects when modal opens
  useEffect(() => {
    if (isOpen && currentUserId) {
      fetchProjects();
    }
  }, [isOpen, currentUserId]);

  // Reset form when project is selected
  useEffect(() => {
    if (selectedProject) {
      setNewBudget(selectedProject.budget.toString());
      setError('');
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    setError('');

    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Fetch all projects
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects-tasks`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();

      // Filter projects where current user is client and status is ongoing

      // Filter projects where current user is client and status is ongoing

      // Filter projects where:
      // 1. Current user is the client (owner)
      // 2. Project is ongoing (status = 1)
      const eligibleProjects = (data.data || []).filter((project: Project) => {
        // Check if client_user_id matches currentUserId
        const isClient = Number(project.client_user_id) === Number(currentUserId);
        const isOngoing = project.status === 1;

        return isClient && isOngoing;
      });

      setProjects(eligibleProjects);

      // Auto-select if only one project
      if (eligibleProjects.length === 1) {
        setSelectedProjectId(eligibleProjects[0].projects_task_id);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleUpdateBudget = async () => {
    if (!selectedProject) {
      setError('Please select a project');
      return;
    }

    const budgetValue = parseFloat(newBudget);

    if (isNaN(budgetValue) || budgetValue <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }

    if (budgetValue === selectedProject.budget) {
      setError('New budget must be different from current budget');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects-tasks/${selectedProject.projects_task_id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            budget: budgetValue,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update budget');
      }

      const currencySymbol = getCurrencySymbol(selectedProject.currency);
      toast.success(
        `Budget updated successfully from ${currencySymbol}${selectedProject.budget} to ${currencySymbol}${budgetValue}`
      );

      // Update the project budget in local state
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.projects_task_id === selectedProject.projects_task_id
            ? { ...project, budget: budgetValue }
            : project
        )
      );

      onClose();
    } catch (err: any) {
      console.error('Error updating budget:', err);
      setError(err.message || 'Failed to update budget');
      toast.error('Failed to update budget');
    } finally {
      setLoading(false);
    }
  };

  const getCurrencySymbol = (currency: string): string => {
    const symbols: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      AUD: '$',
      CAD: '$',
    };
    return symbols[currency] || currency;
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedProjectId(null);
      setNewBudget('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid rgba(49,121,90,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                background: '#E9F7EF',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DollarSign size={20} style={{ color: '#31795A' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#244034', fontSize: '1.25rem', fontWeight: 600 }}>
                Update Project Budget
              </h3>
              <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '0.875rem' }}>
                Modify the budget after negotiation
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.12s ease',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <X size={20} color="#6B7280" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {loadingProjects ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #E9F7EF',
                  borderTopColor: '#31795A',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto',
                }}
              />
              <p style={{ marginTop: '16px', color: '#6B7280' }}>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <AlertCircle size={48} color="#F59E0B" style={{ margin: '0 auto' }} />
              <p style={{ marginTop: '16px', color: '#6B7280', fontSize: '0.95rem' }}>
                No ongoing projects found for budget update.
              </p>
            </div>
          ) : (
            <>
              {/* Project Selector */}
              {projects.length > 1 && (
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#244034',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                    }}
                  >
                    Select Project
                  </label>
                  <select
                    value={selectedProjectId || ''}
                    onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      height: '48px',
                      border: '2px solid #E9F7EF',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      background: '#FFFFFF',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2331795A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      backgroundSize: '20px',
                      paddingRight: '40px',
                      color: '#244034',
                    } as React.CSSProperties}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#31795A';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E9F7EF';
                    }}
                  >
                    <option value="">Choose a project...</option>
                    {projects.map((project) => (
                      <option key={project.projects_task_id} value={project.projects_task_id}>
                        {project.project_title} - Current: {getCurrencySymbol(project.currency)}
                        {project.budget}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Budget Information */}
              {selectedProject && (
                <>
                  <div
                    style={{
                      background: '#F0F5F3',
                      padding: '16px',
                      borderRadius: '10px',
                      marginBottom: '24px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>Project:</span>
                      <span style={{ color: '#244034', fontSize: '0.875rem', fontWeight: 500 }}>
                        {selectedProject.project_title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>Current Budget:</span>
                      <span style={{ color: '#31795A', fontSize: '1.125rem', fontWeight: 600 }}>
                        {getCurrencySymbol(selectedProject.currency)}{selectedProject.budget}
                      </span>
                    </div>
                  </div>

                  {/* New Budget Input */}
                  <div style={{ marginBottom: '24px' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: '#244034',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                      }}
                    >
                      New Budget Amount*
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span
                        style={{
                          position: 'absolute',
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#31795A',
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        {getCurrencySymbol(selectedProject.currency)}
                      </span>
                      <input
                        type="number"
                        value={newBudget}
                        onChange={(e) => setNewBudget(e.target.value)}
                        placeholder="Enter new budget"
                        min="0"
                        step="0.01"
                        style={{
                          width: '100%',
                          padding: '12px 16px 12px 40px',
                          height: '48px',
                          border: '2px solid #E9F7EF',
                          borderRadius: '10px',
                          fontSize: '0.95rem',
                          outline: 'none',
                          transition: 'border-color 0.2s ease',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#31795A';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#E9F7EF';
                        }}
                      />
                    </div>
                    <p style={{ margin: '8px 0 0', color: '#6B7280', fontSize: '0.8125rem' }}>
                      Currency: {selectedProject.currency} (locked to project currency)
                    </p>
                  </div>
                </>
              )}

              {/* Error Message */}
              {error && (
                <div
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertCircle size={16} color="#DC2626" />
                  <span style={{ color: '#DC2626', fontSize: '0.875rem' }}>{error}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!loadingProjects && projects.length > 0 && (
          <div
            style={{
              padding: '24px',
              borderTop: '1px solid rgba(49,121,90,0.1)',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={handleClose}
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: '2px solid #E9F7EF',
                borderRadius: '10px',
                color: '#244034',
                fontSize: '0.95rem',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#F0F5F3';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateBudget}
              disabled={loading || !selectedProjectId || !newBudget}
              style={{
                padding: '12px 24px',
                background: loading || !selectedProjectId || !newBudget ? '#D1D5DB' : '#244034',
                border: 'none',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 500,
                cursor: loading || !selectedProjectId || !newBudget ? 'not-allowed' : 'pointer',
                transition: 'all 0.12s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                if (!loading && selectedProjectId && newBudget) {
                  e.currentTarget.style.background = '#1a2d26';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(36,64,52,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  loading || !selectedProjectId || !newBudget ? '#D1D5DB' : '#244034';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.35)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  Updating...
                </>
              ) : (
                'Update Budget'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Add keyframes for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default UpdateBudgetModal;
