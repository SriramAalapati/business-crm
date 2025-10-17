
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiCalendar, FiUser, FiChevronLeft, FiChevronRight, FiGitBranch } from 'react-icons/fi';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const navItems = [
        { to: '/dashboard', icon: <FiGrid className="w-6 h-6" />, label: 'Dashboard' },
        { to: '/leads', icon: <FiUsers className="w-6 h-6" />, label: 'Leads' },
        { to: '/calendar', icon: <FiCalendar className="w-6 h-6" />, label: 'Calendar' },
        { to: '/user-details', icon: <FiUser className="w-6 h-6" />, label: 'User Details' },
    ];

    const activeLinkClass = "bg-primary-500 text-white";
    const inactiveLinkClass = "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700";

    return (
        <div className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-30 ${isOpen ? 'w-64' : 'w-20'}`}>
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
                 <div className={`flex items-center gap-2 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                     <FiGitBranch className="w-8 h-8 text-primary-500" />
                     <span className="text-xl font-bold text-gray-800 dark:text-white">CRM Pro</span>
                 </div>
                 <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                     {isOpen ? <FiChevronLeft className="w-6 h-6" /> : <FiChevronRight className="w-6 h-6" />}
                 </button>
            </div>
            <nav className="mt-6">
                <ul>
                    {navItems.map(item => (
                        <li key={item.to} className="px-3">
                            <NavLink
                                to={item.to}
                                className={({ isActive }) => 
                                    `flex items-center p-3 my-2 rounded-lg transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass} ${!isOpen ? 'justify-center' : ''}`
                                }
                            >
                                {item.icon}
                                {isOpen && <span className="ml-4 font-medium">{item.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
