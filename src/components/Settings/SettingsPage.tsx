import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Database, 
  Download,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Trash2
} from 'lucide-react';
import { useState } from 'react';

const settingsSections = [
  {
    title: 'Account',
    icon: User,
    items: [
      { label: 'Profile', description: 'Update your personal information' },
      { label: 'Email', description: 'Manage email preferences' },
      { label: 'Password', description: 'Change your password' },
    ]
  },
  {
    title: 'Preferences',
    icon: Palette,
    items: [
      { label: 'Theme', description: 'Choose light or dark mode', toggle: true },
      { label: 'Language', description: 'Select your preferred language' },
      { label: 'Editor', description: 'Customize editor settings' },
    ]
  },
  {
    title: 'Notifications',
    icon: Bell,
    items: [
      { label: 'Push Notifications', description: 'Enable desktop notifications', toggle: true },
      { label: 'Email Digest', description: 'Weekly summary emails', toggle: true },
      { label: 'AI Updates', description: 'Notify when AI review completes', toggle: true },
    ]
  },
  {
    title: 'Privacy & Security',
    icon: Shield,
    items: [
      { label: 'Two-Factor Auth', description: 'Add extra security to your account' },
      { label: 'Sessions', description: 'Manage active sessions' },
      { label: 'Data Privacy', description: 'Control your data usage' },
    ]
  },
  {
    title: 'Data',
    icon: Database,
    items: [
      { label: 'Export Data', description: 'Download all your notes and groups' },
      { label: 'Import', description: 'Import from other apps' },
      { label: 'Delete Account', description: 'Permanently delete your account', danger: true },
    ]
  },
];

export function SettingsPage() {
  const [isDark, setIsDark] = useState(true);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    'Push Notifications': true,
    'Email Digest': false,
    'AI Updates': true,
  });

  const handleToggle = (label: string) => {
    setToggleStates(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      {/* Settings sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="glass rounded-2xl overflow-hidden"
          >
            {/* Section header */}
            <div className="px-6 py-4 border-b border-border/50 flex items-center gap-3">
              <section.icon className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">{section.title}</h2>
            </div>

            {/* Section items */}
            <div className="divide-y divide-border/50">
              {section.items.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ x: 4 }}
                  className={`px-6 py-4 flex items-center justify-between cursor-pointer transition-colors ${
                    item.danger ? 'hover:bg-destructive/10' : 'hover:bg-secondary/30'
                  }`}
                >
                  <div>
                    <p className={`font-medium ${item.danger ? 'text-destructive' : ''}`}>
                      {item.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>

                  {item.toggle ? (
                    <button
                      onClick={() => handleToggle(item.label)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        toggleStates[item.label] ? 'bg-primary' : 'bg-secondary'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                          toggleStates[item.label] ? 'left-6' : 'left-0.5'
                        }`}
                      />
                    </button>
                  ) : item.danger ? (
                    <Trash2 className="w-5 h-5 text-destructive" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* App info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center text-sm text-muted-foreground"
      >
        <p>Y Note v1.0.0</p>
        <p className="mt-1">© 2024 YouAsas. All rights reserved.</p>
      </motion.div>
    </div>
  );
}