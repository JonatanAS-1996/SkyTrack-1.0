import React, { useState, useMemo } from "react";
import { useData } from "../contexts/DataContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Badge } from "../components/ui/badge";
import {
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { Event } from "../contexts/DataContext";

export default function Calendar() {
  const { classes, events, addEvent, updateEvent, removeEvent } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    classID: "none",
  });

  // Calculate calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), day));
  };

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setFormData({
      ...formData,
      date: format(day, "yyyy-MM-dd"),
      time: "09:00",
    });
    setShowAddDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) return;

    const eventDate = new Date(`${formData.date}T${formData.time || "00:00"}:00`);

    if (editingEvent) {
      updateEvent(editingEvent, {
        title: formData.title,
        description: formData.description,
        date: eventDate,
        classID: formData.classID === "none" ? "" : formData.classID,
      });
      setEditingEvent(null);
    } else {
      addEvent({
        title: formData.title,
        description: formData.description,
        date: eventDate,
        classID: formData.classID === "none" ? "" : formData.classID,
      });
    }

    resetForm();
    setShowAddDialog(false);
  };

  const handleEdit = (event: Event) => {
    const eventDate = new Date(event.date);
    setFormData({
      title: event.title,
      description: event.description,
      date: format(eventDate, "yyyy-MM-dd"),
      time: format(eventDate, "HH:mm"),
      classID: event.classID || "none",
    });
    setEditingEvent(event.id);
    setShowAddDialog(true);
  };

  const handleDelete = (eventId: string) => removeEvent(eventId);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      classID: "none",
    });
    setEditingEvent(null);
    setSelectedDate(null);
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Calendar
          </h1>
          <p className="text-muted-foreground">
            Manage your schedule and academic events.
          </p>
        </div>
        <Dialog
          open={showAddDialog}
          onOpenChange={(open) => {
            setShowAddDialog(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingEvent ? "Edit Event" : "New Event"}</DialogTitle>
                <DialogDescription>
                  {editingEvent
                    ? "Update the event details."
                    : "Create a new event in your calendar."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Math Exam"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Optional event description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class (Optional)</Label>
                  <Select
                    value={formData.classID}
                    onValueChange={(value) =>
                      setFormData({ ...formData, classID: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No associated class</SelectItem>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: classItem.color }}
                            />
                            {classItem.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingEvent ? "Update Event" : "Create Event"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-2xl">
                  {format(currentDate, "MMMM yyyy", { locale: enUS })}
                </CardTitle>
                <CardDescription>Click a day to add an event</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full" onClick={handlePreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isCurrentDay = isToday(day);

                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => handleDayClick(day)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const eventId = e.dataTransfer.getData("text/plain");
                        if (eventId) updateEvent(eventId, { date: day });
                      }}
                      className={`
                        aspect-square p-2 rounded-xl cursor-pointer transition-all border border-border/50 bg-gradient-to-br from-card/70 to-card/40 backdrop-blur hover:shadow-sm
                        ${isCurrentMonth ? "" : "opacity-70 text-muted-foreground"}
                        ${isCurrentDay ? "outline outline-2 outline-primary/60" : ""}
                      `}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className={`text-sm font-medium ${isCurrentDay ? "text-primary" : ""}`}>
                          {format(day, "d")}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => {
                          const classItem = classes.find((c) => c.id === event.classID);
                          return (
                            <div
                              key={event.id}
                              draggable
                              onDragStart={(e) => e.dataTransfer.setData("text/plain", event.id)}
                              className="text-[11px] px-2 py-1 rounded-full text-white truncate"
                              style={{ backgroundColor: classItem?.color || "#6366f1" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(event);
                              }}
                            >
                              {event.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-[11px] text-muted-foreground">+{dayEvents.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>
                {upcomingEvents.length === 0
                  ? "No upcoming events"
                  : `${upcomingEvents.length} upcoming events`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming events</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowAddDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </div>
              ) : (
                upcomingEvents.map((event) => {
                  const classItem = classes.find((c) => c.id === event.classID);
                  const eventDate = new Date(event.date);

                  return (
                    <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{event.title}</p>
                        {event.description && (
                          <p className="text-sm text-muted-foreground truncate">{event.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {classItem && (
                            <Badge variant="secondary" className="text-xs">
                              <div className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: classItem.color }} />
                              {classItem.name}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {format(eventDate, "MMM d, HH:mm", { locale: enUS })}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Event</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{event.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(event.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
