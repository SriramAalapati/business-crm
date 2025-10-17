
import React from 'react';
import { useUser } from '../contexts/UserContext';
import { FiUser, FiMail, FiBriefcase } from 'react-icons/fi';

const UserDetails: React.FC = () => {
    const { user } = useUser();

    if (!user) {
        return <div>Loading user details...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">User Details</h1>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
                    <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full mb-6 md:mb-0 shadow-lg"/>
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{user.role}</p>
                        
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <FiMail className="w-5 h-5 mr-3 text-primary-500" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <FiBriefcase className="w-5 h-5 mr-3 text-primary-500" />
                                <span>Sales Department</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <FiUser className="w-5 h-5 mr-3 text-primary-500" />
                                <span>ID: {user.id}</span>
                            </div>
                        </div>

                         <button className="mt-8 bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
