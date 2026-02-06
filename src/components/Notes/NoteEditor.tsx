import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  Code, 
  Bold, 
  Italic, 
  List, 
  ListOrdered,
  Link2,
  Image,
  Quote,
  Heading1,
  Heading2,
  Loader2,
  Trash2
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useNote, useUpdateNote, useDeleteNote } from '@/hooks/useNotes';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import debounce from 'lodash.debounce';

export function NoteEditor() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: note, isLoading } = useNote(noteId);
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || '');
    }
  }, [note]);

  // Debounced auto-save
  const debouncedSave = useCallback(
    debounce(async (id: string, newTitle: string, newContent: string) => {
      setIsSaving(true);
      try {
        await updateNote.mutateAsync({
          id,
          title: newTitle,
          content: newContent,
        });
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 2000),
    [updateNote]
  );

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
    if (noteId) {
      debouncedSave(noteId, title, newContent);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setHasUnsavedChanges(true);
    if (noteId) {
      debouncedSave(noteId, newTitle, content);
    }
  };

  const handleSave = async () => {
    if (!noteId) return;
    setIsSaving(true);
    try {
      await updateNote.mutateAsync({
        id: noteId,
        title,
        content,
      });
      setHasUnsavedChanges(false);
      toast.success('Note saved!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note) return;
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote.mutateAsync({
        noteId: note.id,
        lessonId: note.lesson_id,
      });
      navigate(`/groups/${note.lesson?.group_id}`);
    }
  };

  const toolbarButtons = [
    { icon: Bold, label: 'Bold', action: () => insertText('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertText('*', '*') },
    { icon: Heading1, label: 'Heading 1', action: () => insertText('# ', '') },
    { icon: Heading2, label: 'Heading 2', action: () => insertText('## ', '') },
    { icon: List, label: 'Bullet List', action: () => insertText('- ', '') },
    { icon: ListOrdered, label: 'Numbered List', action: () => insertText('1. ', '') },
    { icon: Quote, label: 'Quote', action: () => insertText('> ', '') },
    { icon: Code, label: 'Code', action: () => insertText('```\n', '\n```') },
    { icon: Link2, label: 'Link', action: () => insertText('[', '](url)') },
  ];

  const insertText = (before: string, after: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    handleContentChange(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Note not found</h2>
        <Link to="/groups" className="text-primary hover:underline">
          Back to Groups
        </Link>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-4">
          <Link 
            to={`/groups/${note.lesson?.group_id}`} 
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-2xl font-bold bg-transparent border-none outline-none focus:ring-0 w-full"
              placeholder="Note title..."
            />
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              {note.lesson?.groups?.name} → {note.lesson?.name}
              {note.is_ai_generated && (
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Generated
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {hasUnsavedChanges ? 'Unsaved changes' : `Saved ${formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}`}
          </span>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDelete}
            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Toolbar */}
      {!note.is_ai_generated && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-2 flex items-center gap-1 mb-4"
        >
          {toolbarButtons.map((button) => (
            <motion.button
              key={button.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={button.action}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              title={button.label}
            >
              <button.icon className="w-4 h-4" />
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Editor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 glass rounded-2xl p-6 overflow-hidden flex flex-col"
      >
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed"
          placeholder="Start writing your notes..."
          readOnly={note.is_ai_generated}
        />
      </motion.div>
    </div>
  );
}
