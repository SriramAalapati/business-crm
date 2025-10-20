import React, { useEffect } from 'react';
import KanbanBoard from '../components/KanbanBoard/KanbanBoard';
import ConfirmationDialog from '../components/ConfirmationDialog';
import LeadFormModal from '../components/LeadFormModal';
import ViewLeadModal from '../components/ViewLeadModal';
import { useLeads } from '../contexts/LeadsContext';
import { useUser } from '../contexts/UserContext';
import { ASSIGNEES, KANBAN_COLUMNS } from '../constants';
import { SortOption } from '../types';
import { FiFilter, FiPlus, FiBarChart2, FiDownload } from 'react-icons/fi';

const KanbanSkeleton: React.FC = () => (
    <div className="flex overflow-x-auto gap-4 p-1 pb-4 -mx-1">
        {KANBAN_COLUMNS.map(column => (
            <div key={column.id} className="flex flex-col w-80 min-w-[320px] bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                 <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </div>
                <div className="p-2 space-y-2">
                    {[...Array(3)].map((_, i) => (
                         <div key={i} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6 mb-3"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                         </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const Leads: React.FC = () => {
    const { 
        loading,
        leads, 
        leadToDelete, 
        setLeadToDelete, 
        deleteLead,
        isModalOpen,
        openModal,
        closeModal,
        editingLead,
        isViewModalOpen,
        viewingLead,
        closeViewModal,
        filterAssignee,
        setFilterAssignee,
        sortBy,
        setSortBy,
        filteredLeads
    } = useLeads();
    const { user } = useUser();
    
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key.toLowerCase() === 'c') {
          if (
            (event.target as HTMLElement).tagName !== 'INPUT' &&
            (event.target as HTMLElement).tagName !== 'TEXTAREA' &&
            (event.target as HTMLElement).tagName !== 'SELECT' &&
            !isModalOpen && !isViewModalOpen && !leadToDelete
          ) {
            event.preventDefault();
            openModal();
          }
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isModalOpen, isViewModalOpen, leadToDelete, openModal]);

    const leadBeingDeleted = leads.find(l => l.id === leadToDelete);

    const handleConfirmDelete = async () => {
        if (leadToDelete) {
            await deleteLead(leadToDelete);
        }
        setLeadToDelete(null);
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Name', 'Company', 'Priority', 'Deal Value', 'Status', 'Assigned To', 'Contacted Date', 'Follow-up Date', 'Notes'];
        
        const rows = filteredLeads.map(lead => [
            lead.id,
            `"${lead.name.replace(/"/g, '""')}"`,
            `"${lead.company.replace(/"/g, '""')}"`,
            lead.priority,
            lead.dealValue,
            lead.status,
            lead.assignedTo,
            lead.contactedDate,
            lead.followUpDateTime ? new Date(lead.followUpDateTime).toLocaleString() : '',
            `"${(lead.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "leads_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const controlClasses = "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800";


    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold">{user?.role === 'admin' ? 'All Leads' : 'My Pipeline'}</h1>
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    {user?.role === 'admin' && (
                        <div className="relative">
                            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select 
                              value={filterAssignee}
                              onChange={(e) => setFilterAssignee(e.target.value)}
                              className={`${controlClasses} pl-8 appearance-none`}
                            >
                                <option value="All">All Assignees</option>
                                {ASSIGNEES.map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="relative">
                         <FiBarChart2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90" />
                         <select
                           value={sortBy}
                           onChange={(e) => setSortBy(e.target.value as SortOption)}
                           className={`${controlClasses} pl-8 appearance-none`}
                         >
                            <option value="priority-desc">Sort by Priority</option>
                            <option value="name-asc">Sort by Name (A-Z)</option>
                            <option value="date-asc">Sort by Follow-up Date</option>
                        </select>
                    </div>

                    <button 
                        onClick={handleExportCSV}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                    >
                        <FiDownload className="w-5 h-5" />
                        <span>Export</span>
                    </button>

                    <button 
                        onClick={() => openModal()} 
                        className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>Add Lead</span>
                    </button>
                </div>
            </div>
            {loading ? <KanbanSkeleton /> : <KanbanBoard />}
            {leadBeingDeleted && (
                <ConfirmationDialog
                    isOpen={!!leadBeingDeleted}
                    title="Delete Lead"
                    onClose={() => setLeadToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                    confirmText="Confirm Delete"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to permanently delete the lead for <strong>{leadBeingDeleted.name}</strong> from <strong>{leadBeingDeleted.company}</strong>? This action cannot be undone.
                    </p>
                </ConfirmationDialog>
            )}
            {isModalOpen && (
              <LeadFormModal 
                isOpen={isModalOpen}
                onClose={closeModal}
                lead={editingLead}
              />
            )}
            {isViewModalOpen && viewingLead && (
              <ViewLeadModal
                isOpen={isViewModalOpen}
                onClose={closeViewModal}
                lead={viewingLead}
              />
            )}
        </div>
    );
};

export default Leads;
