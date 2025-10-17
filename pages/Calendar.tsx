import React, { useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useLeads } from '../contexts/LeadsContext';
import { useTheme } from '../contexts/ThemeContext';

interface PersonalEvent {
  title: string;
  date: string;
}

const Calendar: React.FC = () => {
  const { leads } = useLeads();
  const { theme } = useTheme();
  const [personalEvents, setPersonalEvents] = useState<PersonalEvent[]>([]);
  const [calendarView, setCalendarView] = useState<'team' | 'personal'>('team');

  const teamEvents = useMemo(() => {
    return leads
      .filter(lead => lead.followUpDate)
      .map(lead => ({
        title: `Follow up with ${lead.name}`,
        date: lead.followUpDate,
        extendedProps: {
          leadId: lead.id,
          company: lead.company,
        },
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
      }));
  }, [leads]);
  
  const eventsToShow = useMemo(() => {
    if (calendarView === 'team') {
      return teamEvents;
    }
    return personalEvents.map(event => ({
      ...event,
      backgroundColor: '#10B981',
      borderColor: '#10B981',
    }));
  }, [calendarView, teamEvents, personalEvents]);

  const handleDateClick = (arg: { dateStr: string }) => {
    if (calendarView === 'personal') {
      const title = prompt('Enter event title for your personal calendar:');
      if (title) {
        setPersonalEvents(prevEvents => [...prevEvents, { title, date: arg.dateStr }]);
      }
    } else {
      alert('To add a personal event, please switch to the "Personal Calendar" view.');
    }
  };

  // This is a workaround to apply dark mode styles to FullCalendar
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .fc .fc-button-primary {
        background-color: ${theme === 'dark' ? '#374151' : '#3b82f6'};
        border-color: ${theme === 'dark' ? '#374151' : '#3b82f6'};
      }
       .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active {
        background-color: ${theme === 'dark' ? '#4b5563' : '#2563eb'} !important;
        border-color: ${theme === 'dark' ? '#4b5563' : '#2563eb'} !important;
      }
      .fc .fc-button-primary:hover {
        background-color: ${theme === 'dark' ? '#4b5563' : '#2563eb'};
        border-color: ${theme === 'dark' ? '#4b5563' : '#2563eb'};
      }
      .fc .fc-daygrid-day.fc-day-today {
        background-color: ${theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'};
      }
      .fc-theme-standard .fc-list-day-cushion {
        background-color: ${theme === 'dark' ? '#1f2937': '#f3f4f6'};
      }
      .fc-event-main-frame {
        color: white !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);

  const buttonBaseClass = "font-bold py-2 px-4 rounded-lg transition-colors";
  const activeBtnClass = "bg-primary-500 text-white";
  const inactiveBtnClass = "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600";

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">{calendarView === 'team' ? 'Team' : 'Personal'} Calendar</h1>
        <div className="flex space-x-2">
            <button onClick={() => setCalendarView('team')} className={`${buttonBaseClass} ${calendarView === 'team' ? activeBtnClass : inactiveBtnClass}`}>
                Team Calendar
            </button>
            <button onClick={() => setCalendarView('personal')} className={`${buttonBaseClass} ${calendarView === 'personal' ? activeBtnClass : inactiveBtnClass}`}>
                Personal Calendar
            </button>
        </div>
      </div>
      {calendarView === 'personal' && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Click on any date to add a new personal event.
        </p>
      )}
      <div className="text-gray-800 dark:text-gray-200 flex-grow">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={eventsToShow}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          height="100%"
          dateClick={handleDateClick}
        />
      </div>
    </div>
  );
};

export default Calendar;
