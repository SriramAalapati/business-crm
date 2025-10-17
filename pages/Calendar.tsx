
import React, { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useLeads } from '../contexts/LeadsContext';
import { useTheme } from '../contexts/ThemeContext';

const Calendar: React.FC = () => {
  const { leads } = useLeads();
  const { theme } = useTheme();

  const events = useMemo(() => {
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
  
  // This is a workaround to apply dark mode styles to FullCalendar
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .fc .fc-button-primary {
        background-color: ${theme === 'dark' ? '#374151' : '#3b82f6'};
        border-color: ${theme === 'dark' ? '#374151' : '#3b82f6'};
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


  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full">
      <h1 className="text-3xl font-bold mb-6">Team Calendar</h1>
      <div className="text-gray-800 dark:text-gray-200">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          height="auto"
        />
      </div>
    </div>
  );
};

export default Calendar;
