import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, CheckSquare, FileText, Users } from "lucide-react";
import { cn } from "../lib/utils";

export default function GlobalSearch() {
  const { classes, tasks, notes, contacts } = useData();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return null;
    return {
      classes: classes.filter((c) => c.name.toLowerCase().includes(query)).slice(0, 5),
      tasks: tasks.filter((t) => t.title.toLowerCase().includes(query)).slice(0, 5),
      notes: notes.filter((n) => n.title.toLowerCase().includes(query)).slice(0, 5),
      contacts: contacts.filter((c) => c.name.toLowerCase().includes(query)).slice(0, 5),
    };
  }, [q, classes, tasks, notes, contacts]);

  const go = (type: string, id?: string) => {
    setOpen(false);
    setQ("");
    if (type === "class" && id) navigate(`/dashboard/classes/${id}`);
    else if (type === "note" && id) navigate(`/dashboard/notes/${id}`);
    else if (type === "task") navigate(`/dashboard/tasks`);
    else if (type === "contact") navigate(`/dashboard/contacts`);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative w-full max-w-lg">
      {/* Search Input */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-3xl bg-background/70 px-4 py-2 text-sm text-muted-foreground shadow-md backdrop-blur-md transition-all duration-300 focus-within:shadow-lg"
        )}
      >
        <Search className="h-5 w-5 text-foreground/60" />
        <Input
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search everything…"
          className="h-10 flex-1 border-0 bg-transparent p-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
        />
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {open && results && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Card className="absolute left-0 right-0 top-14 rounded-2xl border border-border/40 bg-background/70 shadow-2xl backdrop-blur-lg overflow-hidden">
              <div className="max-h-80 overflow-auto">
                {/* Render Sections */}
                {[
                  { title: "Classes", items: results.classes, icon: BookOpen, type: "class" },
                  { title: "Tasks", items: results.tasks, icon: CheckSquare, type: "task" },
                  { title: "Notes", items: results.notes, icon: FileText, type: "note" },
                  { title: "Contacts", items: results.contacts, icon: Users, type: "contact" },
                ].map(({ title, items, icon: Icon, type }) =>
                  items.length > 0 ? (
                    <motion.div
                      key={title}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={sectionVariants}
                      transition={{ staggerChildren: 0.05 }}
                    >
                      <div className="px-3 py-2 text-xs font-medium text-foreground/70">{title}</div>
                      {items.map((item) => (
                        <motion.button
                          key={item.id}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground hover:bg-accent/50 transition-all duration-200"
                          onClick={() => go(type, item.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="h-4 w-4 text-foreground/70" />
                          <span className="truncate">{item.name || item.title}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  ) : null
                )}

                {/* No results */}
                {results.classes.length +
                  results.tasks.length +
                  results.notes.length +
                  results.contacts.length === 0 && (
                  <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                    No results found
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {open && <div className="fixed inset-0 -z-10" onClick={() => setOpen(false)} />}
    </div>
  );
}
