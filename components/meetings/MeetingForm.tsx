"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Meeting } from './MeetingCard';

const formSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  date: z.date({
    required_error: 'Please select a date',
  }),
  time: z.string().min(1, 'Please select a time'),
  duration: z.string().or(z.number()).transform(val => Number(val)),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MeetingFormProps {
  onSubmit: (data: Partial<Meeting>) => void;
  initialValues?: Meeting;
  submitLabel?: string;
}

const MeetingForm = ({ 
  onSubmit, 
  initialValues,
  submitLabel = "Schedule Meeting" 
}: MeetingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: initialValues?.subject || '',
      date: initialValues?.date || new Date(),
      time: initialValues?.time || '09:00',
      duration: initialValues?.duration || 30,
      notes: initialValues?.notes || '',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      onSubmit({
        subject: data.subject,
        date: data.date,
        time: data.time,
        duration: data.duration,
        notes: data.notes,
      });
      if (!initialValues) {
        form.reset({
          subject: '',
          date: new Date(),
          time: '09:00',
          duration: 30,
          notes: '',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-secondary/10 blur-3xl"></div>
      <div className="absolute -left-20 -bottom-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl"></div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 relative z-10">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-gray-200">Meeting Subject</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter meeting subject" 
                    {...field} 
                    className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-800 dark:text-gray-200">Meeting Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-200">Meeting Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field} 
                      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-gray-200">Duration (minutes)</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-gray-200">Notes (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Any additional notes" 
                    {...field} 
                    className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all"
          >
            {isSubmitting ? "Processing..." : submitLabel}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MeetingForm;
