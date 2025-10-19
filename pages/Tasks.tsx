import React, { useState } from 'react';
import { useTasks } from '../contexts/TasksContext';
import { Task, TaskStatus, Priority } from '../types';
import { FiPlus, FiEdit, FiTrash2, FiFlag } from 'react-icons/fi';
import TaskFormModal from '../components/TaskFormModal';
import ConfirmationDialog from '../components/ConfirmationDialog';

const priorityClasses: Record<Priority, { text: string, bg: string }> = {
    'High': { text: 'text-red-800 dark:text-red-200', bg: 'bg-red-100 dark:bg-red-900/50' },
    'Medium': { text: 'text-yellow-800 dark:text-yellow-200', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
    'Low': { text: 'text-green-800 dark:text-green-200', bg: 'bg-green-100 dark:bg-green-900/50' },
};

const statusClasses: Record<TaskStatus, { text: string, bg: string }> = {
    [TaskStatus.TODO]: { text: 'text-gray-800 dark:text-gray-200', bg: 'bg-gray-100 dark:bg-gray-600' },
    [TaskStatus.IN_PROGRESS]: { text: 'text-blue-800 dark:text-blue-200', bg: 'bg-blue-100 dark:bg-blue-900/50' },
    [TaskStatus.DONE]: { text: 'text-green-800 dark:text-green-200', bg: 'bg-green-100 dark:bg-green-900/50' },
};

const Tasks: React.FC = () => {
    const { filteredTasks, deleteTask } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const openModal = (task?: Task) => {
        setEditingTask(task || null);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const handleConfirmDelete = () => {
        if (taskToDelete) {
            deleteTask(taskToDelete);
        }
        setTaskToDelete(null);
    };

    const taskBeingDeleted = filteredTasks.find(t => t.id === taskToDelete);

    return (
        <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold">Tasks</h1>
                <button 
                    onClick={() => openModal()}
                    className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                >
                    <FiPlus className="w-5 h-5" />
                    <span>Add Task</span>
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Task</th>
                                <th scope="col" className="px-6 py-3">Due Date</th>
                                <th scope="col" className="px-6 py-3">Priority</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Assigned To</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map((task) => (
                                <tr key={task.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{task.title}</td>
                                    <td className="px-6 py-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center w-fit ${priorityClasses[task.priority].bg} ${priorityClasses[task.priority].text}`}>
                                           <FiFlag className="w-3 h-3 mr-1" /> {task.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[task.status].bg} ${statusClasses[task.status].text}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{task.assignedTo}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openModal(task)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" aria-label="Edit task"><FiEdit className="w-5 h-5"/></button>
                                            <button onClick={() => setTaskToDelete(task.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400" aria-label="Delete task"><FiTrash2 className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isModalOpen && <TaskFormModal isOpen={isModalOpen} onClose={closeModal} task={editingTask} />}
            {taskBeingDeleted && (
                <ConfirmationDialog
                    isOpen={!!taskBeingDeleted}
                    title="Delete Task"
                    onClose={() => setTaskToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                    confirmText="Confirm Delete"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to permanently delete the task: <strong>{taskBeingDeleted.title}</strong>? This action cannot be undone.
                    </p>
                </ConfirmationDialog>
            )}
        </>
    );
};

export default Tasks;