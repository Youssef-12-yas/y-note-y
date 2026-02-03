import { useState } from 'react';
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
  Check,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  Lightbulb,
  BookOpen,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const mockNote = {
  id: 'n1',
  title: 'Smart Pointers Overview',
  content: `# Smart Pointers in Modern C++

Smart pointers are a key feature in modern C++ that help manage dynamic memory automatically, preventing memory leaks and dangling pointers.

## Types of Smart Pointers

### 1. unique_ptr
- Owns the object exclusively
- Cannot be copied, only moved
- Automatically deletes when out of scope

\`\`\`cpp
std::unique_ptr<int> ptr = std::make_unique<int>(42);
\`\`\`

### 2. shared_ptr
- Multiple pointers can own the same object
- Uses reference counting
- Object deleted when last shared_ptr is destroyed

\`\`\`cpp
std::shared_ptr<int> ptr1 = std::make_shared<int>(42);
std::shared_ptr<int> ptr2 = ptr1; // Both own the object
\`\`\`

### 3. weak_ptr
- Non-owning reference to shared_ptr
- Prevents circular references
- Must be converted to shared_ptr to access object

## Best Practices

1. Prefer unique_ptr by default
2. Use shared_ptr when ownership is shared
3. Use weak_ptr to break cycles
4. Use make_unique and make_shared`,
  lessonTitle: 'Introduction to Modern C++',
  groupName: 'C++ Programming',
  lastSaved: '2 minutes ago',
};

interface AIReviewResult {
  correct: string[];
  mistakes: string[];
  improvements: string[];
  knowledge: string[];
  codeReview: { issue: string; fix: string }[];
  resources: { title: string; url: string }[];
}

const mockAIReview: AIReviewResult = {
  correct: [
    'Excellent understanding of unique_ptr ownership semantics',
    'Correct explanation of reference counting in shared_ptr',
    'Good use of code examples to illustrate concepts',
  ],
  mistakes: [
    'weak_ptr explanation is incomplete - should mention lock() method',
  ],
  improvements: [
    'Add information about custom deleters',
    'Include comparison with raw pointers',
    'Mention exception safety benefits',
  ],
  knowledge: [
    'Smart pointers were introduced in C++11 as part of the standard library',
    'The std::auto_ptr was deprecated in C++11 and removed in C++17',
    'make_shared is more efficient because it performs a single memory allocation',
  ],
  codeReview: [
    {
      issue: 'Consider showing unique_ptr with custom deleter',
      fix: 'std::unique_ptr<FILE, decltype(&fclose)> file(fopen("file.txt", "r"), &fclose);',
    },
  ],
  resources: [
    { title: 'C++ Core Guidelines on Resource Management', url: 'https://isocpp.github.io/CppCoreGuidelines/' },
    { title: 'cppreference - Smart Pointers', url: 'https://en.cppreference.com/w/cpp/memory' },
  ],
};

export function NoteEditor() {
  const { noteId } = useParams();
  const [content, setContent] = useState(mockNote.content);
  const [title, setTitle] = useState(mockNote.title);
  const [isSaving, setIsSaving] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [review, setReview] = useState<AIReviewResult | null>(null);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleAIReview = () => {
    setIsReviewing(true);
    // Simulate AI review
    setTimeout(() => {
      setIsReviewing(false);
      setReview(mockAIReview);
      setShowReview(true);
    }, 2500);
  };

  const toolbarButtons = [
    { icon: Bold, label: 'Bold' },
    { icon: Italic, label: 'Italic' },
    { icon: Heading1, label: 'Heading 1' },
    { icon: Heading2, label: 'Heading 2' },
    { icon: List, label: 'Bullet List' },
    { icon: ListOrdered, label: 'Numbered List' },
    { icon: Quote, label: 'Quote' },
    { icon: Code, label: 'Code' },
    { icon: Link2, label: 'Link' },
    { icon: Image, label: 'Image' },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-4">
          <Link to="/groups/1" className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold bg-transparent border-none outline-none focus:ring-0"
            />
            <p className="text-sm text-muted-foreground">
              {mockNote.groupName} → {mockNote.lessonTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{mockNote.lastSaved}</span>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className="btn-secondary flex items-center gap-2"
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
            onClick={handleAIReview}
            disabled={isReviewing}
            className="btn-primary flex items-center gap-2"
          >
            {isReviewing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Generate AI Review
          </motion.button>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-2 flex items-center gap-1 mb-4"
      >
        {toolbarButtons.map((button, index) => (
          <motion.button
            key={button.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title={button.label}
          >
            <button.icon className="w-4 h-4" />
          </motion.button>
        ))}
      </motion.div>

      {/* Editor & Review Panel */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Editor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`flex-1 glass rounded-2xl p-6 overflow-hidden flex flex-col transition-all ${
            showReview ? 'w-1/2' : 'w-full'
          }`}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed"
            placeholder="Start writing your notes..."
          />
        </motion.div>

        {/* AI Review Panel */}
        <AnimatePresence>
          {showReview && review && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: '50%' }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">AI Review</h3>
                </div>
                <button
                  onClick={() => setShowReview(false)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Correct */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <h4 className="font-medium text-success">What's Correct</h4>
                  </div>
                  <ul className="space-y-2">
                    {review.correct.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mistakes */}
                {review.mistakes.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-5 h-5 text-destructive" />
                      <h4 className="font-medium text-destructive">Issues Found</h4>
                    </div>
                    <ul className="space-y-2">
                      {review.mistakes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-warning" />
                    <h4 className="font-medium text-warning">Improvements</h4>
                  </div>
                  <ul className="space-y-2">
                    {review.improvements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Lightbulb className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Extra Knowledge */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h4 className="font-medium text-primary">Extra Knowledge</h4>
                  </div>
                  <ul className="space-y-2">
                    {review.knowledge.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Code Review */}
                {review.codeReview.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Terminal className="w-5 h-5 text-accent" />
                      <h4 className="font-medium text-accent">Code Suggestions</h4>
                    </div>
                    {review.codeReview.map((item, i) => (
                      <div key={i} className="bg-secondary/50 rounded-xl p-4 space-y-2">
                        <p className="text-sm text-muted-foreground">{item.issue}</p>
                        <pre className="bg-background/50 rounded-lg p-3 text-xs font-mono overflow-x-auto">
                          {item.fix}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* Resources */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ExternalLink className="w-5 h-5 text-info" />
                    <h4 className="font-medium text-info">Resources</h4>
                  </div>
                  <ul className="space-y-2">
                    {review.resources.map((item, i) => (
                      <li key={i}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="w-4 h-4 shrink-0" />
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Review Loading Overlay */}
      <AnimatePresence>
        {isReviewing && (
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
              <p className="text-muted-foreground">Validating concepts, checking code, finding improvements</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}