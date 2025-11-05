import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { supabaseClient as supabase } from '../services/supabaseClient';

const Icon: React.FC<{ path: string; className?: string }> = ({ path, className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const popularGoogleFonts = ['Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Oswald', 'Source Sans Pro', 'Nunito', 'Merriweather', 'Playfair Display', 'Roboto Slab', 'Noto Sans'];

const GoogleFontModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedFonts: string[]) => void;
    initialSelection: string[];
}> = ({ isOpen, onClose, onSave, initialSelection }) => {
    const [selection, setSelection] = useState<string[]>(initialSelection);

    useEffect(() => {
        if (isOpen) setSelection(initialSelection);
    }, [isOpen, initialSelection]);

    const handleToggleFont = (fontName: string) => {
        setSelection(prev => 
            prev.includes(fontName) ? prev.filter(f => f !== fontName) : [...prev, fontName]
        );
    };

    const handleSave = () => {
        onSave(selection);
        onClose();
    };
    
    if (!isOpen) return null;
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-raisin-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-deep-ocean-surface w-full max-w-2xl rounded-lg shadow-2xl border border-eggshell-white/10 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold p-6 text-eggshell-white border-b border-eggshell-white/10">Add Google Fonts</h3>
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {popularGoogleFonts.map(font => {
                            const isSelected = selection.includes(font);
                            return (
                                <label key={font} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${isSelected ? 'border-action-blue bg-action-blue/10 dark:border-vibrant-magenta dark:bg-vibrant-magenta/10' : 'border-eggshell-white/20 hover:border-action-blue/50 dark:hover:border-vibrant-magenta/50'}`}>
                                    <input type="checkbox" checked={isSelected} onChange={() => handleToggleFont(font)} className="h-5 w-5 rounded border-eggshell-white/30 bg-deep-ocean-surface text-action-blue dark:text-vibrant-magenta focus:ring-action-blue dark:focus:ring-vibrant-magenta focus:ring-offset-transparent" />
                                    <span className="ml-3 font-semibold text-eggshell-white">{font}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>
                <div className="p-6 border-t border-eggshell-white/10 flex justify-end gap-4">
                    <button onClick={onClose} className="font-bold py-2 px-6 rounded-full text-eggshell-white/80 hover:bg-eggshell-white/10 transition">Cancel</button>
                    <button onClick={handleSave} className="bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition">Save Selection</button>
                </div>
            </div>
        </div>,
        modalRoot
    );
};

interface AssetSectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const AssetSection: React.FC<AssetSectionProps> = ({ title, description, children }) => (
    <section className="bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 p-6 rounded-lg border border-raisin-black/10 dark:border-eggshell-white/10">
        <h3 className="text-xl font-bold text-raisin-black dark:text-eggshell-white">{title}</h3>
        <p className="text-sm text-raisin-black/60 dark:text-eggshell-white/60 mt-1 mb-4">{description}</p>
        <div className="mt-4 pt-4 border-t border-raisin-black/10 dark:border-eggshell-white/10">
            {children}
        </div>
    </section>
);

// Define types for stored assets
type StoredFile = { name: string; url: string; path: string; };

export const BrandingPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const [logos, setLogos] = useState<StoredFile[]>([]);
    const [colors, setColors] = useState<string[]>(['#212020', '#FAF9F6', '#101D42', '#D6B585', '#2563EB']);
    const [newColor, setNewColor] = useState('#FFFFFF');
    const [customFonts, setCustomFonts] = useState<StoredFile[]>([]);
    const [googleFonts, setGoogleFonts] = useState<string[]>(['Roboto', 'Lato']);
    const [guidelines, setGuidelines] = useState<StoredFile | null>(null);

    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isFontModalOpen, setIsFontModalOpen] = useState(false);
    
    const logoInputRef = useRef<HTMLInputElement>(null);
    const fontInputRef = useRef<HTMLInputElement>(null);
    const guidelinesInputRef = useRef<HTMLInputElement>(null);

    // Effect to load brand assets from Supabase
    useEffect(() => {
        const loadBrandAssets = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("User not found. Please log in.");
                setUserId(user.id);

                const { data, error: dbError } = await supabase
                    .from('branding')
                    .select('*')
                    .eq('client_id', user.id)
                    .single();

                if (dbError && dbError.code !== 'PGRST116') { // Ignore 'exact one row' error for new users
                    throw dbError;
                }

                if (data) {
                    setLogos(data.logos || []);
                    setColors(data.colors || []);
                    setCustomFonts(data.custom_fonts || []);
                    setGoogleFonts(data.google_fonts || []);
                    setGuidelines(data.guidelines || null);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load brand assets.");
            } finally {
                setIsLoading(false);
            }
        };
        loadBrandAssets();
    }, []);

    // Effect to manage dynamic @font-face rules for uploaded fonts
    useEffect(() => {
        const styleId = 'dynamic-brand-fonts';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        const fontFaces = customFonts.map(font => {
            // Remove file extension to get a clean font-family name
            const fontFamily = font.name.replace(/\.[^/.]+$/, "");
            return `
            @font-face {
                font-family: "${fontFamily}";
                src: url(${font.url});
            }
        `}).join('\n');

        styleElement.innerHTML = fontFaces;
    }, [customFonts]);
    
    // Effect to manage loading Google Fonts via stylesheet
    useEffect(() => {
        const styleId = 'dynamic-google-fonts';
        let linkElement = document.getElementById(styleId) as HTMLLinkElement | null;

        if (googleFonts.length > 0) {
            if (!linkElement) {
                linkElement = document.createElement('link');
                linkElement.id = styleId;
                linkElement.rel = 'stylesheet';
                document.head.appendChild(linkElement);
            }
            const fontQuery = googleFonts.map(font => `family=${font.replace(/ /g, '+')}`).join('&');
            linkElement.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
        } else if (linkElement) {
            linkElement.remove();
        }
    }, [googleFonts]);
    
    const uploadFile = async (file: File, folder: string): Promise<StoredFile> => {
        if (!userId) throw new Error("User ID not available for upload.");
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const path = `${userId}/${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('brand_assets').upload(path, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('brand_assets').getPublicUrl(path);
        
        return { name: file.name, url: publicUrl, path: path };
    };

    const handleLogoUpload = async (files: FileList) => {
        try {
            const newLogos = await Promise.all(Array.from(files).map(file => uploadFile(file, 'logos')));
            setLogos(prev => [...prev, ...newLogos]);
            setHasChanges(true);
        } catch (err: any) {
            setError(err.message || "Failed to upload logo(s).");
        }
    };
    
    const handleFontUpload = async (files: FileList) => {
        try {
            const newFonts = await Promise.all(Array.from(files).map(file => uploadFile(file, 'fonts')));
            setCustomFonts(prev => [...prev, ...newFonts]);
            setHasChanges(true);
        } catch (err: any) {
             setError(err.message || "Failed to upload font(s).");
        }
    };
    
    const handleGuidelinesUpload = async (files: FileList) => {
        if (files.length === 0) return;
        try {
             if (guidelines) { // Remove old file first
                await supabase.storage.from('brand_assets').remove([guidelines.path]);
            }
            const newGuidelines = await uploadFile(files[0], 'guidelines');
            setGuidelines(newGuidelines);
            setHasChanges(true);
        } catch (err: any) {
            setError(err.message || "Failed to upload guidelines.");
        }
    };

    const handleAddColor = () => {
        if (/^#[0-9A-F]{6}$/i.test(newColor) && !colors.includes(newColor)) {
            setColors([...colors, newColor]);
            setHasChanges(true);
        }
    };

    const handleSaveChanges = async () => {
        if (!userId) {
            setError("Cannot save changes: user is not authenticated.");
            return;
        }
        setIsSaving(true);
        setShowSuccess(false);
        setError(null);

        try {
            const { error: dbError } = await supabase
                .from('branding')
                .upsert({
                    client_id: userId,
                    logos,
                    colors,
                    custom_fonts: customFonts,
                    google_fonts: googleFonts,
                    guidelines,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'client_id' });

            if (dbError) throw dbError;

            setIsSaving(false);
            setHasChanges(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to save brand assets.");
            setIsSaving(false);
        }
    };
    
    const createRemoveFileHandler = <T extends StoredFile>(
      setter: React.Dispatch<React.SetStateAction<T[]>>, 
      itemToRemove: T
    ) => async () => {
        try {
            await supabase.storage.from('brand_assets').remove([itemToRemove.path]);
            setter(prev => prev.filter(item => item.path !== itemToRemove.path));
            setHasChanges(true);
        } catch (err: any) {
            setError(err.message || "Failed to remove file.");
        }
    };
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-action-blue dark:border-vibrant-magenta border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif text-raisin-black dark:text-eggshell-white">Brand Hub</h2>
                <div className="flex items-center gap-4">
                    {showSuccess && <span className="text-green-400 text-sm animate-fade-in">Changes saved!</span>}
                    {error && <span className="text-red-400 text-sm animate-fade-in max-w-xs text-right">{error}</span>}
                    <button 
                        onClick={handleSaveChanges} 
                        disabled={!hasChanges || isSaving}
                        className="bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition disabled:bg-action-blue/50 dark:disabled:bg-vibrant-magenta/50 disabled:cursor-wait button-inset-shadow"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <AssetSection title="Logos" description="Upload your company logos in PNG, JPG, or SVG format.">
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {logos.map((logo, index) => (
                                <div key={index} className="relative group p-2 bg-eggshell-white/30 dark:bg-deep-ocean-surface rounded-lg">
                                    <img src={logo.url} alt={logo.name} className="w-full h-24 object-contain" />
                                    <p className="text-xs text-raisin-black/50 dark:text-eggshell-white/50 truncate mt-1 text-center">{logo.name}</p>
                                    <button onClick={createRemoveFileHandler(setLogos, logo)} className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Icon path="M6 18L18 6M6 6l12 12" className="w-3 h-3"/>
                                    </button>
                                </div>
                            ))}
                             <button onClick={() => logoInputRef.current?.click()} className="flex flex-col items-center justify-center h-full p-4 border-2 border-dashed border-raisin-black/20 dark:border-eggshell-white/20 rounded-lg hover:bg-raisin-black/5 dark:hover:bg-eggshell-white/5 transition">
                                <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-8 h-8 text-raisin-black/40 dark:text-eggshell-white/40 mb-2"/>
                                <span className="text-sm font-semibold text-raisin-black/60 dark:text-eggshell-white/60">Add Logos</span>
                            </button>
                            <input type="file" ref={logoInputRef} onChange={e => e.target.files && handleLogoUpload(e.target.files)} accept="image/png, image/jpeg, image/svg+xml" multiple className="hidden"/>
                         </div>
                    </AssetSection>

                    <AssetSection title="Fonts" description="Manage web and custom uploaded fonts for your brand.">
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-raisin-black/80 dark:text-eggshell-white/80">Google Fonts</h4>
                                {googleFonts.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {googleFonts.map(font => (
                                            <div key={font} className="bg-raisin-black/10 text-raisin-black dark:bg-eggshell-white/10 dark:text-eggshell-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                                <span>{font}</span>
                                                <button onClick={() => { setGoogleFonts(gf => gf.filter(f => f !== font)); setHasChanges(true); }} className="text-red-400/70 hover:text-red-400">
                                                    <Icon path="M6 18L18 6M6 6l12 12" className="w-3 h-3"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-sm text-raisin-black/50 dark:text-eggshell-white/50 mt-2">No Google Fonts selected.</p>}
                            </div>
                             <div>
                                <h4 className="font-semibold text-raisin-black/80 dark:text-eggshell-white/80">Custom Fonts</h4>
                                {customFonts.length > 0 ? (
                                    <div className="space-y-2 mt-2">
                                        {customFonts.map((font, index) => (
                                            <div key={index} className="flex justify-between items-center p-2 bg-raisin-black/5 dark:bg-eggshell-white/5 rounded-md">
                                                <span style={{ fontFamily: `"${font.name.replace(/\.[^/.]+$/, "")}"` }} className="text-lg text-raisin-black dark:text-eggshell-white">{font.name.replace(/\.[^/.]+$/, "")}</span>
                                                <button onClick={createRemoveFileHandler(setCustomFonts, font)} className="text-red-400/70 hover:text-red-400">
                                                    <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-5 h-5"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-sm text-raisin-black/50 dark:text-eggshell-white/50 mt-2">No custom fonts uploaded.</p>}
                            </div>
                             <div className="flex gap-4 pt-4">
                                <button onClick={() => setIsFontModalOpen(true)} className="flex-1 text-center bg-raisin-black/10 text-raisin-black dark:bg-eggshell-white/10 dark:text-eggshell-white font-bold py-2 px-4 rounded-full hover:bg-raisin-black/20 dark:hover:bg-eggshell-white/20 transition button-inset-shadow">Manage Google Fonts</button>
                                <button onClick={() => fontInputRef.current?.click()} className="flex-1 text-center bg-raisin-black/10 text-raisin-black dark:bg-eggshell-white/10 dark:text-eggshell-white font-bold py-2 px-4 rounded-full hover:bg-raisin-black/20 dark:hover:bg-eggshell-white/20 transition button-inset-shadow">Upload Custom Fonts</button>
                                <input type="file" ref={fontInputRef} onChange={e => e.target.files && handleFontUpload(e.target.files)} accept=".ttf,.otf,.woff,.woff2" multiple className="hidden"/>
                            </div>
                        </div>
                    </AssetSection>
                </div>

                <div className="space-y-8">
                     <AssetSection title="Color Palette" description="Define the primary and secondary colors for your brand.">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                            {colors.map((color: string, index: number) => (
                                <div key={index} className="relative group">
                                    <div style={{ backgroundColor: color }} className="w-full h-20 rounded-lg border-2 border-raisin-black/10 dark:border-white/10 shadow-md"></div>
                                    <p className="text-xs font-serif text-raisin-black/60 dark:text-eggshell-white/60 text-center mt-1">{color.toUpperCase()}</p>
                                    <button onClick={() => { setColors(prev => prev.filter((_, i) => i !== index)); setHasChanges(true); }} className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Icon path="M6 18L18 6M6 6l12 12" className="w-3 h-3"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                             <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} className="w-10 h-10 p-0 border-none rounded cursor-pointer bg-transparent" />
                             <input type="text" value={newColor} onChange={e => setNewColor(e.target.value)} className="flex-grow bg-eggshell-white/80 dark:bg-deep-ocean-surface p-2 rounded-md border-2 border-raisin-black/20 dark:border-eggshell-white/20 text-raisin-black dark:text-eggshell-white font-serif focus:border-action-blue dark:focus:border-vibrant-magenta" />
                             <button onClick={handleAddColor} className="bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold p-2 rounded-full hover:bg-opacity-90 transition">
                                <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-6 h-6"/>
                            </button>
                        </div>
                    </AssetSection>

                    <AssetSection title="Brand Guidelines" description="Upload your official brand guidelines document (PDF recommended).">
                         {guidelines ? (
                            <div className="flex justify-between items-center p-3 bg-raisin-black/5 dark:bg-eggshell-white/5 rounded-md">
                                <a href={guidelines.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-raisin-black/80 dark:text-eggshell-white/80 hover:text-action-blue dark:hover:text-vibrant-magenta">
                                    <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" className="w-6 h-6"/>
                                    <span>{guidelines.name}</span>
                                </a>
                                <button onClick={async () => {
                                  try {
                                    await supabase.storage.from('brand_assets').remove([guidelines.path]);
                                    setGuidelines(null);
                                    setHasChanges(true);
                                  } catch (err: any) { setError(err.message || "Failed to remove guidelines."); }
                                }} className="text-red-400/70 hover:text-red-400">
                                    <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-5 h-5"/>
                                </button>
                            </div>
                         ) : (
                            <button onClick={() => guidelinesInputRef.current?.click()} className="w-full text-center bg-raisin-black/10 text-raisin-black dark:bg-eggshell-white/10 dark:text-eggshell-white font-bold py-3 px-4 rounded-full hover:bg-raisin-black/20 dark:hover:bg-eggshell-white/20 transition button-inset-shadow">
                                Upload Document
                            </button>
                         )}
                         <input type="file" ref={guidelinesInputRef} onChange={e => e.target.files && handleGuidelinesUpload(e.target.files)} accept=".pdf" className="hidden"/>
                    </AssetSection>
                </div>
            </div>
            <GoogleFontModal 
                isOpen={isFontModalOpen} 
                onClose={() => setIsFontModalOpen(false)} 
                onSave={(fonts) => { setGoogleFonts(fonts); setHasChanges(true); }} 
                initialSelection={googleFonts}
            />
        </div>
    );
};