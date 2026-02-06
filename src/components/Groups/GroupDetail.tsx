import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  BookOpen, 
  FileText, 
  Sparkles,
  Clock,
  ChevronRight,
  X,
  Trash2,
  Loader2
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useGroup } from '@/hooks/useGroups';
import { useLessons, useCreateLesson, useDeleteLesson } from '@/hooks/useLessons';
import { useCreateNote, useGenerateAINote } from '@/hooks/useNotes';
import { formatDistanceToNow } from 'date-fns';

const gradientColors = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-teal-500',
];

export function GroupDetail() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [showNewLesson, setShowNewLesson] = useState(false);
  const [newLessonName, setNewLessonName] = useState('');
  const [generatingAI, setGeneratingAI] = useState<string | null>(null);

  const { data: group, isLoading: groupLoading } = useGroup(groupId);
  const { data: lessons = [], isLoading: lessonsLoading } = useLessons(groupId);
  const createLesson = useCreateLesson();
  const deleteLesson = useDeleteLesson();
  const createNote = useCreateNote();
  const generateAINote = useGenerateAINote();

  const filteredLessons = lessons.filter(lesson =>
    lesson.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId) return;
    
    await createLesson.mutateAsync({
      groupId,
      name: newLessonName,
    });
    setShowNewLesson(false);
    setNewLessonName('');
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!groupId) return;
    if (confirm('Are you sure you want to delete this lesson? All notes will be deleted.')) {
      await deleteLesson.mutateAsync({ lessonId, groupId });
    }
  };

  const handleAddNote = async (lessonId: string) => {
    const note = await createNote.mutateAsync({
      lessonId,
      title: 'New Note',
      content: '',
    });
    navigate(`/notes/${note.id}`);
  };

  const handleGenerateAI = async (lessonId: string, notes: { title: string; content: string | null }[]) => {
    const userNotes = notes
      .filter(n => !n.title.startsWith('🤖'))
      .map(n => ({ title: n.title, content: n.content || '' }));

    if (userNotes.length === 0) {
      alert('Please add some notes first before generating AI content.');
      return;
    }

    setGeneratingAI(lessonId);
    try {
      await generateAINote.mutateAsync({
        lessonId,
        userNotes,
      });
    } finally {
      setGeneratingAI(null);
    }
  };

  if (groupLoading || lessonsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Group not found</h2>
        <Link to="/groups" className="text-primary hover:underline">
          Back to Groups
        </Link>
      </div>
    );
  }

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
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientColors[0]} flex items-center justify-center text-3xl`}>
            {group.icon || '📚'}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{group.name}</h1>
            <p className="text-muted-foreground">{group.description || 'No description'}</p>
          </div>
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
      {filteredLessons.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No lessons yet</h3>
          <p className="text-muted-foreground mb-4">Create your first lesson to start learning</p>
          <button
            onClick={() => setShowNewLesson(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Lesson
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredLessons.map((lesson, index) => {
              const hasAINotes = lesson.notes?.some(n => n.is_ai_generated);
              const isGenerating = generatingAI === lesson.id;

              return (
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
                        <h3 className="font-semibold truncate">{lesson.name}</h3>
                        {hasAINotes && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI Enhanced
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          {lesson.notesCount || 0} notes
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDistanceToNow(new Date(lesson.updated_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateAI(lesson.id, lesson.notes || []);
                        }}
                        disabled={isGenerating}
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors disabled:opacity-50"
                        title="Generate AI Summary"
                      >
                        {isGenerating ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Sparkles className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLesson(lesson.id);
                        }}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                        expandedLesson === lesson.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </motion.div>

                  {/* Expanded Notes */}
                  <AnimatePresence>
                    {expandedLesson === lesson.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border/50"
                      >
                        <div className="p-4 space-y-2">
                          {lesson.notes && lesson.notes.length > 0 ? (
                            lesson.notes.map((note) => (
                              <Link key={note.id} to={`/notes/${note.id}`}>
                                <motion.div
                                  whileHover={{ x: 4 }}
                                  className={`p-3 rounded-xl transition-colors flex items-center gap-3 cursor-pointer ${
                                    note.is_ai_generated 
                                      ? 'bg-primary/5 hover:bg-primary/10 border border-primary/20' 
                                      : 'hover:bg-secondary/30'
                                  }`}
                                >
                                  {note.is_ai_generated ? (
                                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate flex items-center gap-2">
                                      {note.title}
                                      {note.is_ai_generated && (
                                        <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">AI Generated</span>
                                      )}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {note.content?.slice(0, 100) || 'Empty note'}
                                    </p>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </motion.div>
                              </Link>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No notes yet. Add your first note!
                            </p>
                          )}

                          {/* Add new note */}
                          <motion.button
                            whileHover={{ x: 4 }}
                            onClick={() => handleAddNote(lesson.id)}
                            disabled={createNote.isPending}
                            className="w-full p-3 rounded-xl border border-dashed border-border/50 hover:border-primary/50 
                                       hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-muted-foreground 
                                       hover:text-primary text-sm disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                            Add Note
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

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

              <form onSubmit={handleCreateLesson} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Lesson Title</label>
                  <input
                    type="text"
                    value={newLessonName}
                    onChange={(e) => setNewLessonName(e.target.value)}
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
                  <button 
                    type="submit" 
                    className="btn-primary flex-1"
                    disabled={createLesson.isPending}
                  >
                    {createLesson.isPending ? 'Creating...' : 'Create Lesson'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Generation Overlay */}
      <AnimatePresence>
        {generatingAI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow">
                <Sparkles className="w-10 h-10 text-primary-foreground animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI is analyzing your notes...</h3>
              <p className="text-muted-foreground">Creating a comprehensive summary with insights</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
