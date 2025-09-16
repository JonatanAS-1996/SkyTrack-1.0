import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { toast } from '../hooks/use-toast';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Palette,
  Monitor,
  Sun,
  Moon,
  Eye,
} from 'lucide-react';

const themeColors = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
  { name: 'Emerald', value: 'emerald', class: 'bg-emerald-500' },
  { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
];

export default function Settings() {
  const { theme, setTheme, actualTheme, themeColor, setThemeColor } = useTheme();
  const navigate = useNavigate();
  const [previewMode, setPreviewMode] = useState(false);

  const handleSaveTheme = () => {
    toast({
      title: "Theme Updated",
      description: `Color ${themeColors.find(c => c.value === themeColor)?.name} applied successfully.`,
    });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast({
      title: "Theme Mode Updated",
      description: `Changed to ${newTheme === 'light' ? 'Light' : newTheme === 'dark' ? 'Dark' : 'System'} mode.`,
    });
  };

  return (
    <motion.div
      className="space-y-6 p-6 md:p-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize the app appearance.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Theme Customization */}
          <Card className="rounded-2xl border border-gray-200/30 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" /> Theme Customization
              </CardTitle>
              <CardDescription>Choose the main color that best suits your style.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme Mode</Label>
                <div className="flex gap-3">
                  <Button variant={theme==='light'?'default':'outline'} size="sm" onClick={()=>handleThemeChange('light')} className="flex items-center gap-2"><Sun className="h-4 w-4" />Light</Button>
                  <Button variant={theme==='dark'?'default':'outline'} size="sm" onClick={()=>handleThemeChange('dark')} className="flex items-center gap-2"><Moon className="h-4 w-4" />Dark</Button>
                  <Button variant={theme==='system'?'default':'outline'} size="sm" onClick={()=>handleThemeChange('system')} className="flex items-center gap-2"><Monitor className="h-4 w-4" />System</Button>
                </div>
                <p className="text-xs text-muted-foreground">Current Mode: <strong>{actualTheme==='dark'?'Dark':'Light'}</strong></p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Theme Color</Label>
                  <Button variant="outline" size="sm" onClick={()=>setPreviewMode(!previewMode)} className="flex items-center gap-2"><Eye className="h-4 w-4"/>{previewMode?'Disable':'Enable'} Preview</Button>
                </div>

                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-3">
                  {themeColors.map(color=>(
                    <motion.button
                      key={color.value}
                      onClick={()=>{setThemeColor(color.value);}}
                      whileHover={{ scale:1.1 }}
                      whileTap={{ scale:0.95 }}
                      className={`relative h-10 w-10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${color.class} ${themeColor===color.value?'ring-2 ring-foreground ring-offset-2 scale-110':''}`}
                      title={color.name}
                    >
                      {themeColor===color.value && <div className="absolute inset-0 rounded-lg bg-white/20 flex items-center justify-center"><div className="h-3 w-3 rounded-full bg-white"/></div>}
                      <span className="sr-only">{color.name}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground">
                  Selected Color: <strong>{themeColors.find(c=>c.value===themeColor)?.name}</strong>
                  {previewMode && <span className="ml-2 text-primary">• Preview Enabled</span>}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSaveTheme}><Palette className="h-4 w-4 mr-2"/>Apply Theme</Button>
                <Button variant="outline" onClick={()=>setThemeColor('blue')}>Restore Default</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
