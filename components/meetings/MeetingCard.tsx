"use client"
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import MeetingForm from './MeetingForm';

export interface Meeting {
  id: string;
  subject: string;
  date: Date;
  time: string;
  duration: number;
  attendees?: string[];
  notes?: string;
}

interface MeetingCardProps {
  meeting: Meeting;
  onUpdate: (id: string, updatedMeeting: Partial<Meeting>) => void;
  onDelete: (id: string) => void;
}

const MeetingCard = ({ meeting, onUpdate, onDelete }: MeetingCardProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const formattedDate = format(meeting.date, 'EEEE, MMMM d, yyyy');
  
  const getGradientClass = () => {
    // Create different gradient patterns based on meeting subject to have visual variety
    const hash = meeting.subject.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + acc;
    }, 0);
    
    const gradientOptions = [
      'from-blue-500/30 via-purple-500/20 to-pink-500/30',
      'from-emerald-500/30 via-teal-500/20 to-sky-500/30',
      'from-amber-500/30 via-orange-500/20 to-rose-500/30',
      'from-indigo-500/30 via-violet-500/20 to-fuchsia-500/30',
    ];
    
    return gradientOptions[hash % gradientOptions.length];
  };

  return (
    <>
      <Card className={`overflow-hidden backdrop-blur-md bg-white/30 dark:bg-gray-800/50 border border-white/20 shadow-lg hover:shadow-xl transition-all group relative rounded-xl`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass()} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-secondary/20 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-40 h-40 rounded-full bg-primary/20 blur-3xl"></div>
        
        <CardContent className="p-6 relative z-10">
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
            {meeting.subject}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              {formattedDate}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              {meeting.time} ({meeting.duration} min)
            </div>
            {meeting.attendees && meeting.attendees.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Attendees:</span>{' '}
                {meeting.attendees.join(', ')}
              </div>
            )}
          </div>

          {meeting.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {meeting.notes}
            </p>
          )}
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/50 dark:bg-gray-800/50 hover:bg-red-100 hover:text-red-600 backdrop-blur-sm"
              onClick={() => onDelete(meeting.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20">
          <DialogHeader>
            <DialogTitle>Edit Meeting</DialogTitle>
          </DialogHeader>
          <MeetingForm 
            initialValues={meeting}
            onSubmit={(data) => {
              onUpdate(meeting.id, data);
              setEditDialogOpen(false);
            }}
            submitLabel="Update Meeting"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MeetingCard;
