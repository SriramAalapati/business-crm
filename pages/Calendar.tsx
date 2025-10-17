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

  // Dynamically injects styles for FullCalendar based on theme and selected calendar view.
  React.useEffect(() => {
    const teamLight = { primary: '#3b82f6', hover: '#2563eb', today: 'rgba(59, 130, 246, 0.1)' };
    const teamDark = { primary: '#374151', hover: '#4b5563', today: 'rgba(59, 130, 246, 0.2)' };
    const personalLight = { primary: '#10B981', hover: '#059669', today: 'rgba(16, 185, 129, 0.1)' };
    const personalDark = { primary: '#065f46', hover: '#047857', today: 'rgba(16, 185, 129, 0.2)' };

    let colors;
    if (calendarView === 'team') {
      colors = theme === 'dark' ? teamDark : teamLight;
    } else {
      colors = theme === 'dark' ? personalDark : personalLight;
    }

    const style = document.createElement('style');
    style.id = 'fullcalendar-dynamic-styles';
    style.textContent = `
      .fc .fc-button-primary {
        background-color: ${colors.primary} !important;
        border-color: ${colors.primary} !important;
      }
       .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active {
        background-color: ${colors.hover} !important;
        border-color: ${colors.hover} !important;
      }
      .fc .fc-button-primary:hover {
        background-color: ${colors.hover} !important;
        border-color: ${colors.hover} !important;
      }
      .fc .fc-daygrid-day.fc-day-today {
        background-color: ${colors.today} !important;
      }
      .fc-theme-standard .fc-list-day-cushion {
        background-color: ${theme === 'dark' ? '#1f2937': '#f3f4f6'};
      }
      .fc-event-main-frame {
        color: white !important;
      }
      .fc-toolbar-title {
        color: ${colors.primary};
        transition: color 0.3s ease-in-out;
      }
    `;
    
    // Remove old style tag before adding new one to prevent style conflicts
    const oldStyle = document.getElementById('fullcalendar-dynamic-styles');
    if (oldStyle) {
      oldStyle.remove();
    }
    
    document.head.appendChild(style);

    return () => {
      const styleElement = document.getElementById('fullcalendar-dynamic-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [theme, calendarView]);

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