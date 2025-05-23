"use client"
import { useState } from 'react';
import { Meeting } from './MeetingCard';
import MeetingCard from './MeetingCard';
import { cn } from '@/lib/utils';

interface MeetingListProps {
  meetings: Meeting[];
  onUpdateMeeting: (id: string, updatedMeeting: Partial<Meeting>) => void;
  onDeleteMeeting: (id: string) => void;
}

const MeetingList = ({ meetings, onUpdateMeeting, onDeleteMeeting }: MeetingListProps) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  
  const filteredMeetings = meetings.filter(meeting => {
    const meetingDateTime = new Date(meeting.date);
    const [hours, minutes] = meeting.time.split(':').map(Number);
    meetingDateTime.setHours(hours || 0, minutes || 0);
    
    const now = new Date();
    
    if (filter === 'upcoming') {
      return meetingDateTime > now;
    } else if (filter === 'past') {
      return meetingDateTime < now;
    }
    return true;
  });
  
  const sortedMeetings = [...filteredMeetings].sort((a, b) => {
    const dateA = new Date(a.date);
    const [hoursA, minutesA] = a.time.split(':').map(Number);
    dateA.setHours(hoursA || 0, minutesA || 0);
    
    const dateB = new Date(b.date);
    const [hoursB, minutesB] = b.time.split(':').map(Number);
    dateB.setHours(hoursB || 0, minutesB || 0);
    
    if (filter === 'past') {
      return dateB.getTime() - dateA.getTime(); // Most recent past meetings first
    }
    return dateA.getTime() - dateB.getTime(); // Closest upcoming meetings first
  });

  const renderFilterButton = (buttonFilter: 'all' | 'upcoming' | 'past', label: string) => (
    <button
      onClick={() => setFilter(buttonFilter)}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-full transition-all",
        filter === buttonFilter
          ? "bg-primary text-white shadow-md shadow-primary/20"
          : "bg-white/50 hover:bg-white/80 text-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800/80 dark:text-gray-300"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center md:justify-start backdrop-blur-sm bg-white/10 p-2 rounded-full">
        {renderFilterButton('all', 'All Meetings')}
        {renderFilterButton('upcoming', 'Upcoming')}
        {renderFilterButton('past', 'Past')}
      </div>
      
      {sortedMeetings.length === 0 ? (
        <div className="text-center p-8 rounded-xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/10">
          <p className="text-gray-600 dark:text-gray-400">
            {filter === 'all' 
              ? "You don't have any meetings yet." 
              : filter === 'upcoming'
                ? "You don't have any upcoming meetings."
                : "You don't have any past meetings."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMeetings.map(meeting => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onUpdate={onUpdateMeeting}
              onDelete={onDeleteMeeting}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingList;
