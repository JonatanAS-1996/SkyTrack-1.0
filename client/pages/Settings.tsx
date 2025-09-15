import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
import { Switch } from '../components/ui/switch';
import LanguageSelect from '../components/LanguageSelect';
import { toast } from '../hooks/use-toast';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Palette,
  Monitor,
  Sun,
  Moon,
  Smartphone,
  Eye,
} from 'lucide-react';

const themeColors = [
  { name: 'Azul', value: 'blue', class: 'bg-blue-500' },
  { name: 'Rojo', value: 'red', class: 'bg-red-500' },
  { name: 'Verde', value: 'green', class: 'bg-green-500' },
  { name: 'Púrpura', value: 'purple', class: 'bg-purple-500' },
  { name: 'Naranja', value: 'orange', class: 'bg-orange-500' },
  { name: 'Rosa', value: 'pink', class: 'bg-pink-500' },
  { name: 'Esmeralda', value: 'emerald', class: 'bg-emerald-500' },
  { name: 'Índigo', value: 'indigo', class: 'bg-indigo-500' },
];

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme, actualTheme, themeColor, setThemeColor } = useTheme();
  const navigate = useNavigate();
  const [previewMode, setPreviewMode] = useState(false);

  if (!user) return null;

  const handleSaveTheme = () => {
    toast({
      title: "Tema actualizado",
      description: `Color ${themeColors.find(c => c.value === themeColor)?.name} aplicado exitosamente.`,
    });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast({
      title: "Modo de tema actualizado",
      description: `Cambiado a modo ${newTheme === 'light' ? 'claro' : newTheme === 'dark' ? 'oscuro' : 'sistema'}.`,
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
        <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
      </Button>

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Personaliza tu perfil y la apariencia de la aplicación.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* General Settings */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-2xl border border-gray-200/30 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" /> Preferencias Generales
              </CardTitle>
              <CardDescription>Idioma, notificaciones y personalización.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Idioma</Label>
                <LanguageSelect />
                <p className="text-xs text-muted-foreground">El idioma se aplicará en toda la app.</p>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-xl border p-3 transition hover:shadow-md">
                  <div>
                    <p className="text-sm font-medium">Notificaciones por Email</p>
                    <p className="text-xs text-muted-foreground">Recordatorios y actualizaciones importantes.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-xl border p-3 transition hover:shadow-md">
                  <div>
                    <p className="text-sm font-medium">Notificaciones Push</p>
                    <p className="text-xs text-muted-foreground">Alertas en tiempo real en tu dispositivo.</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Customization */}
          <Card className="rounded-2xl border border-gray-200/30 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" /> Personalización de Tema
              </CardTitle>
              <CardDescription>
                Elige el color principal de la aplicación que mejor se adapte a tu estilo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Modo de Tema</Label>
                <div className="flex gap-3">
                  <Button variant={theme==='light'?'default':'outline'} size="sm" onClick={()=>handleThemeChange('light')} className="flex items-center gap-2"><Sun className="h-4 w-4" />Claro</Button>
                  <Button variant={theme==='dark'?'default':'outline'} size="sm" onClick={()=>handleThemeChange('dark')} className="flex items-center gap-2"><Moon className="h-4 w-4" />Oscuro</Button>
                  <Button variant={theme==='system'?'default':'outline'} size="sm" onClick={()=>handleThemeChange('system')} className="flex items-center gap-2"><Monitor className="h-4 w-4" />Sistema</Button>
                </div>
                <p className="text-xs text-muted-foreground">Modo actual: <strong>{actualTheme==='dark'?'Oscuro':'Claro'}</strong></p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Color del Tema</Label>
                  <Button variant="outline" size="sm" onClick={()=>setPreviewMode(!previewMode)} className="flex items-center gap-2"><Eye className="h-4 w-4"/>{previewMode?'Desactivar':'Activar'} Vista Previa</Button>
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
                  Color seleccionado: <strong>{themeColors.find(c=>c.value===themeColor)?.name}</strong>
                  {previewMode && <span className="ml-2 text-primary">• Vista previa activada</span>}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSaveTheme}><Palette className="h-4 w-4 mr-2"/>Aplicar Tema</Button>
                <Button variant="outline" onClick={()=>setThemeColor('blue')}>Restaurar por Defecto</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
