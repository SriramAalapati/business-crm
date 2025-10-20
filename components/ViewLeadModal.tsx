import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiUser, FiBriefcase, FiFlag, FiDollarSign, FiCalendar, FiEdit3, FiGitCommit, FiPlusCircle, FiCheckCircle, FiSend, FiEdit2, FiCheck, FiLoader } from 'react-icons/fi';
import { Lead, LeadActivity, Priority, LeadStatus } from '../types';
import { useLeads } from '../contexts/LeadsContext';
import { ASSIGNEES, KANBAN_COLUMNS } from '../constants';

interface ViewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
}

const priorityClasses: Record<Priority, { text: string, bg: string }> = {
    'High': { text: 'text-red-800 dark:text-red-200', bg: 'bg-red-100 dark:bg-red-900/50' },
    'Medium': { text: 'text-yellow-800 dark:text-yellow-200', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
    'Low': { text: 'text-green-800 dark:text-green-200', bg: 'bg-green-100 dark:bg-green-900/50' },
};

const statusClasses: Record<LeadStatus, { text: string, bg: string }> = {
    [LeadStatus.NEW]: { text: 'text-blue-800 dark:text-blue-200', bg: 'bg-blue-100 dark:bg-blue-900/50' },
    [LeadStatus.CONTACTED]: { text: 'text-indigo-800 dark:text-indigo-200', bg: 'bg-indigo-100 dark:bg-indigo-900/50' },
    [LeadStatus.QUALIFIED]: { text: 'text-purple-800 dark:text-purple-200', bg: 'bg-purple-100 dark:bg-purple-900/50' },
    [LeadStatus.WON]: { text: 'text-green-800 dark:text-green-200', bg: 'bg-green-100 dark:bg-green-900/50' },
    [LeadStatus.LOST]: { text: 'text-red-800 dark:text-red-200', bg: 'bg-red-100 dark:bg-red-900/50' },
};

const activityStyles: Record<LeadActivity['type'], { icon: React.ReactElement; title: string; bg: string; }> = {
    'Created': { icon: <FiPlusCircle className="w-5 h-5 text-white" />, title: 'Lead Created', bg: 'bg-green-500' },
    'Status Change': { icon: <FiGitCommit className="w-5 h-5 text-white" />, title: 'Status Changed', bg: 'bg-blue-500' },
    'Edited': { icon: <FiEdit3 className="w-5 h-5 text-white" />, title: 'Details Edited', bg: 'bg-yellow-500' },
    'Note Added': { icon: <FiCheckCircle className="w-5 h-5 text-white" />, title: 'Note Added', bg: 'bg-purple-500' },
};

type EditableLeadField = 'status' | 'priority' | 'assignedTo' | 'dealValue';

const EditableField: React.FC<{ lead: Lead, field: EditableLeadField, type: 'select' | 'number', options?: any[] }> = ({ lead, field, type, options }) => {
    const { editLead } = useLeads();
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(lead[field]);

    useEffect(() => {
        setValue(lead[field]);
    }, [lead, field]);

    const handleSave = async () => {
        if (lead[field] !== value) {
            await editLead({ ...lead, [field]: value });
        }
        setIsEditing(false);
    };

    const renderDisplay = () => {
        switch (field) {
            case 'dealValue': return `₹${Number(lead.dealValue).toLocaleString('en-IN')}`;
            case 'priority': return <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${priorityClasses[lead.priority].bg} ${priorityClasses[lead.priority].text}`}>{lead.priority}</span>
            case 'status': return <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${statusClasses[lead.status].bg} ${statusClasses[lead.status].text}`}>{lead.status}</span>
            default: return lead[field];
        }
    };
    
    return (
        <div className="group relative">
            {isEditing ? (
                <div className="flex items-center gap-2">
                    {type === 'select' && options && (
                        <select
                            value={value as string}
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={handleSave}
                            autoFocus
                            className="w-full text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    )}
                    {type === 'number' && (
                        <input
                            type="number"
                            value={value as number}
                            onChange={(e) => setValue(Number(e.target.value))}
                            onBlur={handleSave}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            autoFocus
                            className="w-full text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                    )}
                    <button onClick={handleSave} className="p-1.5 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full"><FiCheck className="w-4 h-4" /></button>
                </div>
            ) : (
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsEditing(true)}>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{renderDisplay()}</span>
                    <button className="p-1.5 opacity-25 group-hover:opacity-100 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-opacity"><FiEdit2 className="w-3 h-3" /></button>
                </div>
            )}
        </div>
    );
};

const ViewLeadModal: React.FC<ViewLeadModalProps> = ({ isOpen, onClose, lead }) => {
  const { addNoteToLead } = useLeads();
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      setIsAddingNote(true);
      await addNoteToLead(lead.id, newNote.trim());
      setNewNote('');
      setIsAddingNote(false);
    }
  };
  
  const priorityOptions = [{value: 'High', label: 'High'}, {value: 'Medium', label: 'Medium'}, {value: 'Low', label: 'Low'}];
  const statusOptions = KANBAN_COLUMNS.map(c => ({ value: c.id, label: c.title }));
  const assigneeOptions = ASSIGNEES.map(a => ({ value: a, label: a }));
  
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Not set';
    return new Date(isoString).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div ref={modalRef} tabIndex={-1} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl m-4 transform transition-all max-h-[90vh] flex flex-col outline-none" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b dark:border-gray-700 flex items-start justify-between">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h2>
                <p className="text-md text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <FiBriefcase className="w-4 h-4 mr-2"/> {lead.company}
                </p>
            </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Close dialog"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Left Panel: Details */}
                <div className="lg:col-span-1 p-6 border-r dark:border-gray-700">
                    <h3 className="font-semibold text-lg mb-4">Lead Details</h3>
                    <div className="space-y-5">
                        <div className="flex items-start"><div className="text-gray-400 mt-1"><FiGitCommit/></div><div className="ml-3"><p className="text-sm text-gray-500 dark:text-gray-400">Status</p><EditableField lead={lead} field="status" type="select" options={statusOptions} /></div></div>
                        <div className="flex items-start"><div className="text-gray-400 mt-1"><FiFlag/></div><div className="ml-3"><p className="text-sm text-gray-500 dark:text-gray-400">Priority</p><EditableField lead={lead} field="priority" type="select" options={priorityOptions} /></div></div>
                        <div className="flex items-start"><div className="text-gray-400 mt-1"><FiUser/></div><div className="ml-3"><p className="text-sm text-gray-500 dark:text-gray-400">Assigned To</p><EditableField lead={lead} field="assignedTo" type="select" options={assigneeOptions} /></div></div>
                        <div className="flex items-start"><div className="text-gray-400 mt-1"><FiDollarSign/></div><div className="ml-3"><p className="text-sm text-gray-500 dark:text-gray-400">Deal Value</p><EditableField lead={lead} field="dealValue" type="number" /></div></div>
                        <div className="flex items-start"><div className="text-gray-400 mt-1"><FiCalendar/></div><div className="ml-3"><p className="text-sm text-gray-500 dark:text-gray-400">Follow-up Date</p><p className="font-medium text-gray-800 dark:text-gray-200">{formatDateTime(lead.followUpDateTime)}</p></div></div>
                    </div>
                     <h3 className="font-semibold text-lg mt-8 mb-4">Notes</h3>
                     <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md whitespace-pre-wrap">
                        {lead.notes || 'No notes for this lead.'}
                     </p>
                </div>
                {/* Right Panel: Activity */}
                <div className="lg:col-span-2 p-6 flex flex-col">
                    <h3 className="font-semibold text-lg mb-4">Activity Timeline</h3>
                    <div className="relative flex-grow overflow-y-auto pr-2">
                        <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
                        <ul className="space-y-8">
                            {lead.activity.map(act => {
                                const style = activityStyles[act.type];
                                return (
                                    <li key={act.id} className="relative pl-12">
                                        <div className={`absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full z-10 ${style.bg}`}>
                                            {style.icon}
                                        </div>
                                        <div className="ml-4">
                                            <div className="flex justify-between items-baseline">
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{style.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(act.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{act.details}</p>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">By {act.user}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                     <form onSubmit={handleAddNote} className="mt-6 flex-shrink-0">
                        <div className="relative">
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                rows={3}
                                className="w-full p-3 pr-12 text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Add a note or update..."
                            />
                            <button
                                type="submit"
                                className="absolute right-2 bottom-2 p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600"
                                disabled={!newNote.trim() || isAddingNote}
                                aria-label="Add Note"
                            >
                                {isAddingNote ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiSend className="w-5 h-5"/>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLeadModal;
