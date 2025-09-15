import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  Paperclip,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";

export default function Notes() {
  const { classes, notes, addNote, updateNote, removeNote } = useData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    classID: "none",
    attachments: [] as string[],
  });

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const matchesSearch =
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass =
          selectedClass === "all" || note.classID === selectedClass;
        return matchesSearch && matchesClass;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [notes, searchQuery, selectedClass]);

  const notesByClass = useMemo(() => {
    const grouped: { [key: string]: any[] } = {};
    classes.forEach((cls) => {
      grouped[cls.id] = filteredNotes.filter((note) => note.classID === cls.id);
    });
    grouped["unassigned"] = filteredNotes.filter((note) => !note.classID);
    return grouped;
  }, [filteredNotes, classes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (editingNote) {
      updateNote(editingNote, {
        title: formData.title,
        content: formData.content,
        classID: formData.classID === "none" ? "" : formData.classID,
        attachments: formData.attachments,
      });
      setEditingNote(null);
    } else {
      addNote({
        title: formData.title,
        content: formData.content,
        classID: formData.classID === "none" ? "" : formData.classID,
        attachments: formData.attachments,
      });
    }

    resetForm();
    setShowAddDialog(false);
  };

  const handleEdit = (note: any) => {
    setFormData({
      title: note.title,
      content: note.content,
      classID: note.classID || "none",
      attachments: note.attachments,
    });
    setEditingNote(note.id);
    setShowAddDialog(true);
  };

  const handleDelete = (noteId: string) => removeNote(noteId);

  const resetForm = () => {
    setFormData({ title: "", content: "", classID: "none", attachments: [] });
    setEditingNote(null);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  const NoteCard = ({ note }: { note: any }) => {
    const classItem = classes.find((c) => c.id === note.classID);
    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer group bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-4 rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <Link to={`/dashboard/notes/${note.id}`} className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                {note.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {classItem && (
                  <Badge variant="secondary" className="text-xs">
                    <div
                      className="h-2 w-2 rounded-full mr-1"
                      style={{ backgroundColor: classItem.color }}
                    />
                    {classItem.name}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {format(note.createdAt, "MMM d, yyyy")}
                </span>
                {note.attachments.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Paperclip className="h-3 w-3 mr-1" />
                    {note.attachments.length}
                  </Badge>
                )}
              </div>
            </Link>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link to={`/dashboard/notes/${note.id}`}>
                <Button variant="ghost" size="sm" title="View Details">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(note);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Note</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{note.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(note.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <Link to={`/dashboard/notes/${note.id}`}>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {truncateContent(note.content)}
            </p>
          </CardContent>
        </Link>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notes</h1>
          <p className="text-muted-foreground">
            Create and organize your study notes.
          </p>
        </div>

        {/* Add/Edit Note Modal */}
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
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingNote ? "Edit Note" : "New Note"}</DialogTitle>
                <DialogDescription>
                  {editingNote
                    ? "Update your note content."
                    : "Create a new note for your studies."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Math Notes - Chapter 5"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
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
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No class</SelectItem>
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
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your note here..."
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={8}
                    className="resize-none"
                    required
                  />
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
                <Button type="submit">
                  {editingNote ? "Update Note" : "Save Note"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-4 rounded-xl shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="classFilter">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notes</SelectItem>
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
        </CardContent>
      </Card>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Notes</h3>
          <p className="text-muted-foreground mb-4">
            Create your first note to start organizing your studies.
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create First Note
          </Button>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Notes Found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms.
          </p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All
              <Badge variant="secondary" className="text-xs">
                {filteredNotes.length}
              </Badge>
            </TabsTrigger>
            {classes.slice(0, 4).map((classItem) => (
              <TabsTrigger
                key={classItem.id}
                value={classItem.id}
                className="flex items-center gap-2"
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: classItem.color }}
                />
                <span className="truncate">{classItem.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {notesByClass[classItem.id]?.length || 0}
                </Badge>
              </TabsTrigger>
            ))}
            {classes.length > 4 && (
              <TabsTrigger value="more" className="flex items-center gap-2">
                <MoreHorizontal className="h-4 w-4" />
                More
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </TabsContent>

          {classes.map((classItem) => (
            <TabsContent
              key={classItem.id}
              value={classItem.id}
              className="space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {notesByClass[classItem.id]?.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
              {notesByClass[classItem.id]?.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No notes for {classItem.name}
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
