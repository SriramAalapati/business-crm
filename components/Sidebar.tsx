import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiCalendar, FiUser, FiBriefcase, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { useUser } from '../contexts/UserContext';
import Logo from './Logo';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const { user } = useUser();
    
    const baseNavItems = [
        { to: '/dashboard', icon: <FiGrid className="w-6 h-6" />, label: 'Dashboard' },
        { to: '/calendar', icon: <FiCalendar className="w-6 h-6" />, label: 'Calendar' },
        { to: '/user-details', icon: <FiUser className="w-6 h-6" />, label: 'User Details' },
    ];

    const roleBasedNavItems = user?.role === 'admin'
     ? [
        { to: '/leads', icon: <FiUsers className="w-6 h-6" />, label: 'All Leads' },
        { to: '/manage-agents', icon: <FiBriefcase className="w-6 h-6" />, label: 'Manage Agents'},
       ]
     : [
        { to: '/leads', icon: <FiUsers className="w-6 h-6" />, label: 'My Pipeline' },
       ];
    
    const navItems = [baseNavItems[0], ...roleBasedNavItems, ...baseNavItems.slice(1)];


    const activeLinkClass = "bg-primary-500 text-white";
    const inactiveLinkClass = "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700";

    return (
        <div className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-30 ${isOpen ? 'w-64' : 'w-20'} flex flex-col flex-shrink-0`}>
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                 <div className="flex items-center gap-2 overflow-hidden">
                     <Logo className="w-8 h-8 text-primary-500 flex-shrink-0" />
                     <span className={`text-xl font-bold text-gray-800 dark:text-white transition-opacity duration-200 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0'}`}>CRM Pro</span>
                 </div>
                 <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
                 >
                    {isOpen ? <FiChevronsLeft className="w-5 h-5" /> : <FiChevronsRight className="w-5 h-5" />}
                 </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
                <ul>
                    {navItems.map(item => (
                        <li key={item.to} className="px-3">
                            <NavLink
                                to={item.to}
                                className={({ isActive }) => 
                                    `relative group flex items-center p-3 my-2 rounded-lg transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass} ${!isOpen ? 'justify-center' : ''}`
                                }
                            >
                                {item.icon}
                                {isOpen && <span className="ml-4 font-medium whitespace-nowrap">{item.label}</span>}
                                {!isOpen && (
                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className={`flex items-center ${isOpen ? 'p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg' : 'justify-center'}`}>
                    <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                    {isOpen && (
                        <div className="ml-3 text-left overflow-hidden">
                            <p className="font-semibold text-sm whitespace-nowrap">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap capitalize">{user?.role}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
