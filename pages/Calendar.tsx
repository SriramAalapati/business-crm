import React, { useMemo, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, EventContentArg } from '@fullcalendar/core';
import { useLeads } from '../contexts/LeadsContext';
import { useTasks } from '../contexts/TasksContext';
import { useTheme } from '../contexts/ThemeContext';
import { PersonalEvent, Lead, Task } from '../types';
import AddTaskModal from '../components/AddTaskModal';
import EventViewModal from '../components/EventViewModal';
import { FiPlus, FiBriefcase, FiFlag, FiCheckSquare } from 'react-icons/fi';
import './Calendar.css';

// FIX: Alias the imported Event type to avoid name collision with the global DOM Event type.
type BigCalendarEvent = import('@fullcalendar/core').Event;

interface CalendarEvent extends BigCalendarEvent {
  extendedProps: {
    type: 'lead' | 'task' | 'personal';
    lead?: Lead;
    task?: Task;
  }
}

const Calendar: React.FC = () => {
  const { leads } = useLeads();
  const { filteredTasks: tasks } = useTasks();
  const { theme } = useTheme();
  const [personalEvents, setPersonalEvents] = useState<PersonalEvent[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<CalendarEvent | null>(null);

  const allEvents = useMemo(() => {
    const leadEvents = leads
      .filter(lead => lead.followUpDateTime)
      .map(lead => ({
        id: `lead-${lead.id}`,
        title: `Follow-up: ${lead.name}`,
        start: lead.followUpDateTime,
        extendedProps: { type: 'lead', lead },
        color: '#3b82f6',
      }));
      
    const taskEvents = tasks
        .map(task => ({
            id: `task-${task.id}`,
            title: task.title,
            start: task.dueDateTime,
            extendedProps: { type: 'task', task },
            color: task.priority === 'High' ? '#EF4444' : task.priority === 'Medium' ? '#F59E0B' : '#10B981',
        }));

    const personalCalEvents = personalEvents.map((event, i) => ({
      id: `personal-${i}`,
      title: event.title,
      start: event.start,
      extendedProps: { type: 'personal' },
      color: '#8B5CF6',
    }));

    return [...leadEvents, ...taskEvents, ...personalCalEvents];
  }, [leads, tasks, personalEvents]);


  const handleAddTask = (task: PersonalEvent) => {
    setPersonalEvents(prevEvents => [...prevEvents, task]);
    setIsTaskModalOpen(false);
  };
  
  const handleEventClick = (clickInfo: EventClickArg) => {
    setViewingEvent(clickInfo.event as CalendarEvent);
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    const { type, lead, task } = eventInfo.event.extendedProps;
    let icon = null;
    let details = null;

    if (type === 'lead' && lead) {
        icon = <FiBriefcase className="w-4 h-4 mr-2" />;
        details = <p className="text-xs truncate">{lead.company}</p>;
    } else if (type === 'task' && task) {
        icon = <FiCheckSquare className="w-4 h-4 mr-2" />;
        details = (
            <div className="flex items-center text-xs">
                <FiFlag className={`w-3 h-3 mr-1 ${task.priority === 'High' ? 'text-red-200' : task.priority === 'Medium' ? 'text-yellow-200' : 'text-green-200'}`} />
                {task.priority}
            </div>
        );
    }
    
    return (
        <div className="p-1 overflow-hidden">
            <div className="flex items-center font-semibold">
                {icon}
                <p className="truncate">{eventInfo.event.title}</p>
            </div>
            {details}
        </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Team Calendar</h1>
           <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <FiPlus />
              Add Personal Event
            </button>
        </div>
        <div className={`text-gray-800 dark:text-gray-200 flex-grow calendar-container ${theme}`}>
          <FullCalendar
            key={theme} // Force re-render on theme change
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={allEvents}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            height="100%"
            eventContent={renderEventContent}
            eventClick={handleEventClick}
          />
        </div>
      </div>
      <AddTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />
      {viewingEvent && (
        <EventViewModal 
            isOpen={!!viewingEvent}
            onClose={() => setViewingEvent(null)}
            event={viewingEvent}
        />
      )}
    </>
  );
};

export default Calendar;