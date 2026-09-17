import React, { useState, useRef } from 'react';
import { Layout, Type, Save, CheckCircle2, RefreshCw, ChevronRight, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useData } from '../../contexts/DataContext';
import { supabase, isSupabaseConfigured } from '../../services/supabase';

export default function AdminContent() {
  const { content, updateContent } = useData();
  const [activeView, setActiveView] = useState('homepage');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [quoteImage, setQuoteImage] = useState(content.quoteImage);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image must be under 10MB.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `cms/quote-image-${Date.now()}.${ext}`;
        const { error } = await supabase.storage
          .from('gallery')
          .upload(path, file, { contentType: file.type, upsert: false });
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(path);
        setQuoteImage(urlData?.publicUrl || '');
      } else {
        // No backend: downscale to a DataURL so it still previews locally
        const bitmap = await createImageBitmap(file).catch(() => null);
        if (!bitmap) throw new Error('Failed to process image');
        const maxDim = 1600;
        const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to process image');
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
        setQuoteImage(canvas.toDataURL('image/jpeg', 0.85));
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. You can still paste a URL below.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!formRef.current) return;
    
    setIsSaving(true);
    setSaveError(null);
    const formData = new FormData(formRef.current);
    
    const updates: any = {};
    if (activeView === 'homepage') {
      updates.hero = {
        title: formData.get('heroTitle'),
        subtitle: formData.get('heroSubtitle'),
        cta: formData.get('heroCta'),
        bgImage: formData.get('heroBg'),
      };
      updates.quote = formData.get('quote');
      updates.quoteImage = quoteImage;
    } else if (activeView === 'about') {
      updates.about = {
        title: formData.get('aboutTitle'),
        description: formData.get('aboutDesc'),
      };
    }

    try {
      await updateContent(updates);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in h-[calc(100vh-9rem)] flex flex-col">
      <div className="flex justify-between items-center bg-ivory p-8 border border-stone-200 shrink-0">
        <div>
          <h2 className="font-heading text-2xl text-stone-800 tracking-wide uppercase">Artisan CMS</h2>
          <p className="text-micro tracking-[0.3em] text-stone-600 uppercase mt-1">Curation & Creative Control</p>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 border border-green-100"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-micro uppercase tracking-widest font-bold">Changes Published</span>
              </motion.div>
            )}
            {saveError && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 border border-rose-100"
              >
                <span className="text-micro uppercase tracking-widest font-bold">{saveError}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="btn-luxury flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Publishing...' : 'Save & Publish'}
          </button>
        </div>
      </div>

      <div className="flex-grow flex gap-8 min-h-0">
        {/* Navigation */}
        <aside className="w-64 bg-ivory border border-stone-200 shrink-0 overflow-y-auto">
          <nav className="p-4 space-y-1">
             <CMSNavLink 
               label="L'Aube (Homepage)" 
               active={activeView === 'homepage'} 
               onClick={() => setActiveView('homepage')}
               icon={Layout} 
             />
             <CMSNavLink 
               label="Heritage (About)" 
               active={activeView === 'about'} 
               onClick={() => setActiveView('about')}
               icon={Type} 
             />
          </nav>
        </aside>

        {/* Editor Area */}
        <form ref={formRef} className="flex-grow bg-ivory border border-stone-200 overflow-y-auto p-12">
          {activeView === 'homepage' && (
            <div className="max-w-3xl space-y-12">
              <section className="space-y-6">
                <EditorHeader title="Hero Experience" subtitle="First impressions of the Riman Aura" />
                <CMSInput label="Main Headline" name="heroTitle" defaultValue={content.hero.title} />
                <CMSInput label="Sub-headline" name="heroSubtitle" defaultValue={content.hero.subtitle} />
                <CMSInput label="CTA Button Text" name="heroCta" defaultValue={content.hero.cta} />
                <CMSInput label="Hero Backdrop URL" name="heroBg" defaultValue={content.hero.bgImage} />
              </section>

              <section className="space-y-6">
                <EditorHeader title="Brand Narrative" subtitle="The artisanal story told on home" />
                <CMSTextarea 
                   label="Atelier Quote" 
                   name="quote"
                   defaultValue={content.quote} 
                />
                <ImageUploader
                  label="Atelier Backdrop (the dark interstitial behind the quote)"
                  value={quoteImage}
                  isUploading={isUploading}
                  uploadError={uploadError}
                  onUpload={handleImageUpload}
                  onClear={() => { setQuoteImage(''); setUploadError(null); }}
                  onUrlChange={setQuoteImage}
                />
              </section>
            </div>
          )}

          {activeView === 'about' && (
             <div className="max-w-3xl space-y-12">
                <section className="space-y-6">
                  <EditorHeader title="The Heritage Page" subtitle="Defining the Riman legacy" />
                  <CMSInput label="Header Title" name="aboutTitle" defaultValue={content.about.title} />
                  <CMSTextarea 
                     label="Founding Story" 
                     name="aboutDesc"
                     defaultValue={content.about.description} 
                   />
                </section>
             </div>
          )}
        </form>
      </div>
    </div>
  );
}

interface CMSNavLinkProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
}

function CMSNavLink({ label, active, onClick, icon: Icon }: CMSNavLinkProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 text-micro tracking-widest uppercase transition-all group",
        active ? "bg-stone-900 text-white font-bold" : "text-stone-600 hover:text-stone-800 hover:bg-stone-50"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <ChevronRight className={cn("w-3 h-3 transition-transform", active ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0")} />
    </button>
  );
}

interface EditorHeaderProps {
  title: string;
  subtitle: string;
}

function EditorHeader({ title, subtitle }: EditorHeaderProps) {
  return (
    <div className="border-b border-stone-100 pb-4">
      <h4 className="font-heading text-lg text-stone-800 tracking-wide uppercase">{title}</h4>
      <p className="text-micro text-stone-600 uppercase tracking-[0.2em] italic mt-1">{subtitle}</p>
    </div>
  );
}

interface CMSInputProps {
  label: string;
  name: string;
  defaultValue: string;
}

function CMSInput({ label, name, defaultValue }: CMSInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-micro font-black text-stone-600 uppercase tracking-widest">{label}</label>
      <input 
        type="text" 
        name={name}
        defaultValue={defaultValue}
        className="w-full bg-stone-50 border border-stone-100 p-4 text-xs tracking-widest outline-none focus:border-gold transition-colors font-medium text-stone-800"
      />
    </div>
  );
}

interface CMSTextareaProps {
  label: string;
  name: string;
  defaultValue: string;
}

function CMSTextarea({ label, name, defaultValue }: CMSTextareaProps) {
  return (
    <div className="space-y-2">
      <label className="text-micro font-black text-stone-600 uppercase tracking-widest">{label}</label>
      <textarea 
        name={name}
        defaultValue={defaultValue}
        rows={6}
        className="w-full bg-stone-50 border border-stone-100 p-4 text-xs tracking-widest leading-relaxed outline-none focus:border-gold transition-colors font-medium text-stone-800 resize-none shadow-inner"
      />
    </div>
  );
}

interface ImageUploaderProps {
  label: string;
  value: string;
  isUploading: boolean;
  uploadError: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onUrlChange: (url: string) => void;
}

function ImageUploader({ label, value, isUploading, uploadError, onUpload, onClear, onUrlChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <label className="text-micro font-black text-stone-600 uppercase tracking-widest">{label}</label>

      {value ? (
        <div className="relative w-full max-w-sm">
          <img
            src={value}
            alt="Backdrop preview"
            className="w-full h-44 object-cover border border-stone-200 bg-stone-100"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.2'; }}
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 w-7 h-7 bg-stone-900/80 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
            aria-label="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm h-44 border border-dashed border-stone-300 bg-stone-50 flex items-center justify-center">
          <span className="text-micro text-stone-400 uppercase tracking-widest">No image selected</span>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-2 bg-stone-900 text-white px-5 py-3 text-micro uppercase tracking-widest font-bold hover:bg-stone-700 disabled:opacity-50 transition-colors"
        >
          {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="text-micro uppercase tracking-widest text-stone-500 hover:text-rose-600 transition-colors"
          >
            Reset to default
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-micro text-stone-400 uppercase tracking-widest shrink-0">or URL</span>
        <input
          type="text"
          value={value.startsWith('data:') ? '' : value}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 bg-stone-50 border border-stone-100 p-3 text-xs tracking-widest outline-none focus:border-gold transition-colors font-medium text-stone-800"
        />
      </div>

      {uploadError && (
        <p className="text-xs text-rose-600">{uploadError}</p>
      )}
    </div>
  );
}
