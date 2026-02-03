import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  BookOpen, 
  FileText, 
  MoreVertical,
  Sparkles,
  Clock,
  ChevronRight,
  X,
  Edit3
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const mockGroup = {
  id: '1',
  name: 'C++ Programming',
  description: 'Advanced C++ concepts and modern practices',
  color: 'from-blue-500 to-cyan-500',
  icon: '💻',
};

const mockLessons = [
  {
    id: '1',
    title: 'Introduction to Modern C++',
    notesCount: 5,
    aiReviewed: true,
    lastUpdated: '2 hours ago',
    notes: [
      { id: 'n1', title: 'Smart Pointers Overview', preview: 'Understanding unique_ptr, shared_ptr, and weak_ptr...' },
      { id: 'n2', title: 'RAII Pattern', preview: 'Resource Acquisition Is Initialization explained...' },
      { id: 'n3', title: 'Move Semantics', preview: 'How move semantics improve performance...' },
    ]
  },
  {
    id: '2',
    title: 'Object-Oriented Programming',
    notesCount: 8,
    aiReviewed: false,
    lastUpdated: '1 day ago',
    notes: [
      { id: 'n4', title: 'Classes and Objects', preview: 'Defining classes in C++...' },
      { id: 'n5', title: 'Inheritance', preview: 'Single and multiple inheritance...' },
    ]
  },
  {
    id: '3',
    title: 'Templates and Metaprogramming',
    notesCount: 12,
    aiReviewed: true,
    lastUpdated: '3 days ago',
    notes: [
      { id: 'n6', title: 'Template Basics', preview: 'Function and class templates...' },
    ]
  },
  {
    id: '4',
    title: 'Standard Template Library',
    notesCount: 9,
    aiReviewed: false,
    lastUpdated: '1 week ago',
    notes: []
  },
];

export function GroupDetail() {
  const { groupId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLesson, setExpandedLesson] = useState<string | null>('1');
  const [showNewLesson, setShowNewLesson] = useState(false);

  const filteredLessons = mockLessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* Back button */}
        <Link to="/groups" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Groups
        </Link>

        {/* Group info */}
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mockGroup.color} flex items-center justify-center text-3xl`}>
            {mockGroup.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{mockGroup.name}</h1>
            <p className="text-muted-foreground">{mockGroup.description}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Review All
          </motion.button>
        </div>
      </motion.div>

      {/* Actions bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between gap-4 mb-6"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-glass pl-10 pr-4 py-2 w-full"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowNewLesson(true)}
          className="btn-secondary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Lesson
        </motion.button>
      </motion.div>

      {/* Lessons List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl overflow-hidden"
            >
              {/* Lesson Header */}
              <motion.div
                onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                className="p-5 cursor-pointer hover:bg-secondary/30 transition-colors flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{lesson.title}</h3>
                    {lesson.aiReviewed && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Reviewed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {lesson.notesCount} notes
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {lesson.lastUpdated}
                    </span>
                  </div>
                </div>

                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                  expandedLesson === lesson.id ? 'rotate-90' : ''
                }`} />
              </motion.div>

              {/* Expanded Notes */}
              <AnimatePresence>
                {expandedLesson === lesson.id && lesson.notes.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border/50"
                  >
                    <div className="p-4 space-y-2">
                      {lesson.notes.map((note) => (
                        <Link key={note.id} to={`/notes/${note.id}`}>
                          <motion.div
                            whileHover={{ x: 4 }}
                            className="p-3 rounded-xl hover:bg-secondary/30 transition-colors flex items-center gap-3 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{note.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{note.preview}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                        </Link>
                      ))}

                      {/* Add new note */}
                      <motion.button
                        whileHover={{ x: 4 }}
                        className="w-full p-3 rounded-xl border border-dashed border-border/50 hover:border-primary/50 
                                   hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-muted-foreground 
                                   hover:text-primary text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Note
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* New Lesson Modal */}
      <AnimatePresence>
        {showNewLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewLesson(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Create New Lesson</h2>
                <button
                  onClick={() => setShowNewLesson(false)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Lesson Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Exception Handling"
                    className="input-glass w-full"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewLesson(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Create Lesson
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}