import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  FileText, 
  Sparkles, 
  Clock, 
  TrendingUp,
  Plus,
  ArrowRight,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Total Groups', value: '8', icon: FolderOpen, trend: '+2 this week' },
  { label: 'Total Notes', value: '47', icon: FileText, trend: '+12 this week' },
  { label: 'AI Reviews', value: '23', icon: Sparkles, trend: '+5 this week' },
];

const recentGroups = [
  { id: '1', name: 'C++ Programming', lessonsCount: 12, notesCount: 34, color: 'from-blue-500 to-cyan-500' },
  { id: '2', name: 'Data Structures', lessonsCount: 8, notesCount: 21, color: 'from-purple-500 to-pink-500' },
  { id: '3', name: 'Machine Learning', lessonsCount: 15, notesCount: 45, color: 'from-orange-500 to-red-500' },
  { id: '4', name: 'Web Development', lessonsCount: 10, notesCount: 28, color: 'from-green-500 to-teal-500' },
];

const recentNotes = [
  { id: '1', title: 'Understanding Pointers', group: 'C++ Programming', updatedAt: '2 hours ago' },
  { id: '2', title: 'Binary Search Trees', group: 'Data Structures', updatedAt: '5 hours ago' },
  { id: '3', title: 'Neural Networks Basics', group: 'Machine Learning', updatedAt: '1 day ago' },
];

export function Dashboard() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Good morning, John 👋</h1>
          <p className="text-muted-foreground">Ready to expand your knowledge today?</p>
        </motion.div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-interactive"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6 mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/groups/new">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Group
            </motion.button>
          </Link>
          <Link to="/ai-review">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Review
            </motion.button>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Groups */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Groups</h2>
            <Link to="/groups" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {recentGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="glass-hover rounded-xl p-4 cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${group.color} flex items-center justify-center mb-3`}>
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-medium mb-1 truncate">{group.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {group.lessonsCount} lessons • {group.notesCount} notes
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Notes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Notes</h2>
            <button className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 4 }}
                className="glass-hover rounded-xl p-4 cursor-pointer flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{note.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{note.group}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                  <Clock className="w-3 h-3" />
                  {note.updatedAt}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 gradient-border p-6 rounded-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">AI Insight</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Based on your recent notes, you might benefit from reviewing <span className="text-primary">Binary Trees</span> concepts. 
              You've made great progress in C++ - consider connecting it with your Data Structures knowledge.
            </p>
            <button className="text-sm text-primary hover:underline flex items-center gap-1">
              Get personalized recommendations <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}