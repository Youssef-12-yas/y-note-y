import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  FolderOpen, 
  BookOpen, 
  FileText,
  ChevronRight,
  Brain,
  Zap,
  CheckCircle,
  Clock
} from 'lucide-react';

const mockGroups = [
  { 
    id: '1', 
    name: 'C++ Programming', 
    icon: '💻',
    lessonsCount: 12,
    reviewedCount: 8,
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: '2', 
    name: 'Data Structures', 
    icon: '🌳',
    lessonsCount: 8,
    reviewedCount: 3,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: '3', 
    name: 'Machine Learning', 
    icon: '🤖',
    lessonsCount: 15,
    reviewedCount: 15,
    color: 'from-orange-500 to-red-500'
  },
];

const recentReviews = [
  {
    id: '1',
    noteTitle: 'Smart Pointers Overview',
    groupName: 'C++ Programming',
    reviewedAt: '2 hours ago',
    score: 92,
    issuesFound: 1,
  },
  {
    id: '2',
    noteTitle: 'Binary Search Trees',
    groupName: 'Data Structures',
    reviewedAt: '1 day ago',
    score: 85,
    issuesFound: 3,
  },
  {
    id: '3',
    noteTitle: 'Neural Networks Basics',
    groupName: 'Machine Learning',
    reviewedAt: '2 days ago',
    score: 98,
    issuesFound: 0,
  },
];

export function AIReviewPage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">AI Review</h1>
        <p className="text-muted-foreground">Let AI analyze and improve your knowledge</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Reviews', value: '47', icon: Sparkles, color: 'text-primary' },
          { label: 'Notes Improved', value: '38', icon: Zap, color: 'text-warning' },
          { label: 'Issues Fixed', value: '126', icon: CheckCircle, color: 'text-success' },
          { label: 'Avg. Score', value: '91%', icon: Brain, color: 'text-accent' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Review */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-4">Quick Review</h2>
          <div className="space-y-3">
            {mockGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedGroup(group.id)}
                className={`glass-hover rounded-xl p-4 cursor-pointer transition-all ${
                  selectedGroup === group.id ? 'border-primary/50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center text-xl`}>
                    {group.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{group.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{group.lessonsCount} lessons</span>
                      <span>•</span>
                      <span className="text-success">{group.reviewedCount} reviewed</span>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Math.round((group.reviewedCount / group.lessonsCount) * 100)}%
                    </p>
                    <div className="w-24 h-2 rounded-full bg-secondary mt-1">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${(group.reviewedCount / group.lessonsCount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Review All Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Review All Unreviewed Notes
          </motion.button>
        </motion.div>

        {/* Recent Reviews */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-4">Recent Reviews</h2>
          <div className="space-y-3">
            {recentReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ x: 4 }}
                className="glass-hover rounded-xl p-4 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{review.noteTitle}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{review.groupName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {review.reviewedAt}
                      </span>
                    </div>
                  </div>
                  
                  {/* Score */}
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      review.score >= 90 ? 'text-success' : 
                      review.score >= 70 ? 'text-warning' : 'text-destructive'
                    }`}>
                      {review.score}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {review.issuesFound === 0 ? 'Perfect!' : `${review.issuesFound} issues`}
                    </p>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Agents Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 gradient-border p-6 rounded-2xl"
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Multi-Agent AI System
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Validator', desc: 'Checks accuracy', icon: '✓' },
            { name: 'Teacher', desc: 'Explains concepts', icon: '📚' },
            { name: 'Code Reviewer', desc: 'Fixes code issues', icon: '💻' },
            { name: 'Knowledge Expander', desc: 'Adds insights', icon: '💡' },
          ].map((agent) => (
            <div key={agent.name} className="text-center p-4 rounded-xl bg-secondary/30">
              <div className="text-2xl mb-2">{agent.icon}</div>
              <p className="font-medium text-sm">{agent.name}</p>
              <p className="text-xs text-muted-foreground">{agent.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}