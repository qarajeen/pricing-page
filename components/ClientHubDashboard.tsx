import React, { useState, useEffect, useRef } from 'react';
import { NewProjectModal } from './NewProjectModal';
import { EditProjectModal } from './EditProjectModal';
import { FeedbackStudio } from './FeedbackStudio';
import type { Project, User, Language } from '../types';
import { supabaseClient as supabase } from '../services/supabaseClient';
import { BillingPage } from './BillingPage';
import { BrandingPage } from './BrandingPage';

interface PartnerHubDashboardProps {
    user: User;
    onLogout: () => void;
    language: Language;
}

const Icon: React.FC<{ path: string; className?: string }> = ({ path, className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const PROJECTS_PER_PAGE = 9;

export const PartnerHubDashboard: React.FC<PartnerHubDashboardProps> = ({ user, onLogout, language }) => {
    type View = 'projects' | 'account' | 'projectDetail' | 'feedbackStudio' | 'billing' | 'branding';
    const [view, setView] = useState<View>('projects');
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const triggerRef = useRef<HTMLElement | null>(null);

    // Effect to restore focus when a modal closes
    useEffect(() => {
        if (!isNewProjectModalOpen && !isEditModalOpen) {
            // A small delay allows the modal's exit animation to complete before restoring focus.
            setTimeout(() => triggerRef.current?.focus(), 100);
        }
    }, [isNewProjectModalOpen, isEditModalOpen]);

    const openNewProjectModal = () => {
        if (document.activeElement instanceof HTMLElement) {
            triggerRef.current = document.activeElement;
        }
        setIsNewProjectModalOpen(true);
    };
    
    const openEditModal = () => {
        if (document.activeElement instanceof HTMLElement) {
            triggerRef.current = document.activeElement;
        }
        setIsEditModalOpen(true);
    };

    const fetchProjects = async (pageToFetch: number, isInitialLoad = false) => {
        if (isInitialLoad) {
            setIsLoading(true);
            setProjects([]);
            setHasMore(true);
        } else {
            setIsFetchingMore(true);
        }
        setError(null);
        try {
            const from = pageToFetch * PROJECTS_PER_PAGE;
            const to = from + PROJECTS_PER_PAGE - 1;

            const { data, error: dbError } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false })
                .range(from, to);
            
            if (dbError) throw dbError;

            if (data) {
                setProjects(prev => [...prev, ...(data as Project[])]);
                if (data.length < PROJECTS_PER_PAGE) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (err: unknown) {
             console.error('Error fetching projects:', err);
             let message = 'Could not fetch your projects. Please try again later.';
             if (err && typeof err === 'object' && 'message' in err) {
                message = String(err.message);
             }
             setError(message);
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    };
    
    useEffect(() => {
        if (view === 'projects') {
            setPage(0);
            fetchProjects(0, true);
        } else {
            setIsLoading(false);
        }
    }, [view]);

    useEffect(() => {
        if (page > 0) {
            fetchProjects(page);
        }
    }, [page]);


    const handleAddNewProject = async (data: Omit<Project, 'id' | 'status' | 'client_id'>) => {
        try {
            setError(null);
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) throw new Error("Authentication error. Please sign in again.");

            const projectToInsert = {
                ...data,
                status: 'Pending Approval' as const,
                client_id: authUser.id,
            };

            const { data: newProject, error: dbError } = await supabase
                .from('projects')
                .insert(projectToInsert)
                .select()
                .single();

            if (dbError) throw dbError;

            if (newProject) {
                setProjects(prev => [newProject as Project, ...prev]);
            }
        } catch (err: unknown) {
            console.error('Error creating project:', err);
            let message = 'An unexpected error occurred during project creation.';
            if (err && typeof err === 'object' && 'message' in err) {
                message = String(err.message);
            }
            setError(message);
        }
        setIsNewProjectModalOpen(false);
    };

    const handleViewProject = (project: Project) => {
        setSelectedProject(project);
        if (project.status === 'Awaiting Feedback') {
            setView('feedbackStudio');
        } else {
            setView('projectDetail');
        }
    };

    const handleSaveChanges = async (data: Partial<Omit<Project, 'id' | 'status' | 'client_id'>>) => {
        if (!selectedProject) return;
        
        try {
            setError(null);
            const { data: updatedProject, error: dbError } = await supabase
                .from('projects')
                .update(data)
                .eq('id', selectedProject.id)
                .select()
                .single();

            if (dbError) throw dbError;
            
            if (updatedProject) {
                const updated = updatedProject as Project;
                setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
                setSelectedProject(updated);
            }
            setIsEditModalOpen(false);
        } catch (err: unknown) {
            console.error('Error updating project:', err);
            let message = 'Failed to save changes to the project.';
            if (err && typeof err === 'object' && 'message' in err) {
                message = String(err.message);
            }
            setError(message);
            throw err;
        }
    };
    
    const handleLoadMore = () => {
        if (!isFetchingMore) {
            setPage(prev => prev + 1);
        }
    };

    const renderEmptyState = () => (
        <div className="text-center p-12 bg-eggshell-white/30 dark:bg-deep-ocean-surface/30 rounded-lg border-2 border-dashed border-raisin-black/20 dark:border-eggshell-white/20">
            <div className="flex justify-center items-center mb-4">
                <Icon path="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5-4.5V6.75A2.25 2.25 0 015.25 4.5h9.5A2.25 2.25 0 0117.25 6.75v3" className="w-12 h-12 text-raisin-black/40 dark:text-eggshell-white/40" />
            </div>
            <h3 className="text-xl font-bold text-raisin-black dark:text-eggshell-white">Your Project Journey Starts Here</h3>
            <p className="text-raisin-black/60 dark:text-eggshell-white/60 mt-2 mb-6">As we begin working together, your projects will appear right here.</p>
        </div>
    );
    
    const getStatusChipClass = (status: Project['status']) => {
        switch(status) {
            case 'Completed': return 'bg-green-500/20 text-green-600 dark:text-green-300';
            case 'In Progress': return 'bg-blue-500/20 text-blue-600 dark:text-blue-300';
            case 'Awaiting Feedback': return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-300';
            case 'Pending Approval': return 'bg-purple-500/20 text-purple-600 dark:text-purple-300';
            default: return 'bg-gray-500/20 text-gray-600 dark:text-gray-300';
        }
    };
    
    const renderProjectsGrid = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <div key={project.id} className="bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 rounded-lg p-6 border border-raisin-black/10 dark:border-eggshell-white/10 transition-transform transform hover:-translate-y-1 text-start">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-raisin-black dark:text-eggshell-white pe-4">{project.title}</h3>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${getStatusChipClass(project.status)}`}>{project.status}</span>
                        </div>
                        <p className="text-sm text-raisin-black/60 dark:text-eggshell-white/60 mt-2 h-10 overflow-hidden">{project.description}</p>
                        <div className="mt-4 pt-4 border-t border-raisin-black/10 dark:border-eggshell-white/10 flex justify-end">
                            <button onClick={() => handleViewProject(project)} className="text-action-blue dark:text-vibrant-magenta font-bold text-sm hover:underline">View Project &rarr;</button>
                        </div>
                    </div>
                ))}
            </div>
            {hasMore && (
                <div className="mt-8 text-center">
                    <div className="interactive-shadow-container">
                        <button onClick={handleLoadMore} disabled={isFetchingMore} className="bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition disabled:bg-action-blue/50 dark:disabled:bg-vibrant-magenta/50 disabled:cursor-wait relative overflow-hidden shine-effect button-inset-shadow">
                            <span className="relative z-10">{isFetchingMore ? 'Loading...' : 'Load More Projects'}</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );

    const renderProjectsView = () => (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif text-raisin-black dark:text-eggshell-white">Your Projects</h2>
                 <button 
                    onClick={openNewProjectModal} 
                    className="bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition transform hover:scale-105 flex items-center gap-2 shine-effect interactive-shadow-container button-inset-shadow"
                >
                    <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5"/>
                    <span>New Project</span>
                </button>
            </div>
            {error ? (
                <div className="text-center p-8 bg-red-900/30 border border-red-600 text-red-300 rounded-lg">
                    <h3 className="font-bold text-lg">Oops! Something went wrong.</h3>
                    <p>{error}</p>
                    <button onClick={() => fetchProjects(0, true)} className="mt-4 text-sm font-bold text-action-blue dark:text-vibrant-magenta hover:underline">Try again</button>
                </div>
            ) : projects.length > 0 ? (
                renderProjectsGrid()
            ) : (
                renderEmptyState()
            )}
        </>
    );

    const renderProjectDetail = () => {
        if (!selectedProject) return null;
        return (
            <div>
                 <button onClick={() => setView('projects')} className="flex items-center gap-2 text-sm font-bold text-action-blue dark:text-vibrant-magenta mb-6 hover:underline">
                    <Icon path="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" className="w-4 h-4" />
                    Back to All Projects
                </button>
                <div className="bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 p-8 rounded-lg border border-raisin-black/10 dark:border-eggshell-white/10 text-start">
                    <div className="flex justify-between items-start">
                        <h2 className="text-3xl font-bold font-serif text-raisin-black dark:text-eggshell-white">{selectedProject.title}</h2>
                        <span className={`text-sm font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${getStatusChipClass(selectedProject.status)}`}>{selectedProject.status}</span>
                    </div>
                    <p className="text-action-blue dark:text-vibrant-magenta font-semibold mt-1">{selectedProject.project_type} &rarr; {selectedProject.sub_service}</p>
                    
                    <div className="mt-6 pt-6 border-t border-raisin-black/10 dark:border-eggshell-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <h3 className="text-lg font-bold text-raisin-black dark:text-eggshell-white mb-4">Project Details</h3>
                           <div className="space-y-3 text-sm">
                               <p><strong className="text-raisin-black/60 dark:text-eggshell-white/60 w-32 inline-block">Style:</strong> <span className="text-raisin-black dark:text-eggshell-white">{selectedProject.style}</span></p>
                               <p><strong className="text-raisin-black/60 dark:text-eggshell-white/60 w-32 inline-block">Location:</strong> <span className="text-raisin-black dark:text-eggshell-white">{selectedProject.location}</span></p>
                               <p><strong className="text-raisin-black/60 dark:text-eggshell-white/60 w-32 inline-block">Start Date:</strong> <span className="text-raisin-black dark:text-eggshell-white">{selectedProject.start_date}</span></p>
                               <p className="text-raisin-black/80 dark:text-eggshell-white/80 whitespace-pre-wrap pt-2">{selectedProject.description}</p>
                           </div>
                        </div>
                        {selectedProject.timeline && (
                            <div>
                                <h3 className="text-lg font-bold text-raisin-black dark:text-eggshell-white mb-4">Project Timeline</h3>
                                <div className="space-y-4">
                                    {selectedProject.timeline.milestones.map((milestone, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-5 h-5 rounded-full flex-shrink-0 ${milestone.status === 'completed' ? 'bg-action-blue dark:bg-vibrant-magenta' : 'border-2 border-raisin-black/50 dark:border-eggshell-white/50'}`}></div>
                                                {index < selectedProject.timeline.milestones.length - 1 && (
                                                    <div className="w-0.5 flex-grow bg-raisin-black/30 dark:bg-eggshell-white/30"></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className={`font-bold ${milestone.status === 'completed' ? 'text-raisin-black dark:text-eggshell-white' : 'text-raisin-black/70 dark:text-eggshell-white/70'}`}>{milestone.name}</p>
                                                <p className="text-xs text-raisin-black/50 dark:text-eggshell-white/50">{new Date(milestone.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                     <div className="mt-8 pt-6 border-t border-raisin-black/10 dark:border-eggshell-white/10 flex justify-end">
                        <button onClick={openEditModal} className="bg-raisin-black/10 dark:bg-eggshell-white/10 text-raisin-black dark:text-eggshell-white font-bold py-2 px-6 rounded-full hover:bg-raisin-black/20 dark:hover:bg-eggshell-white/20 transition">
                            Edit Project Details
                        </button>
                    </div>

                </div>
            </div>
        );
    };

    const renderAccountView = () => (
         <div className="bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 p-8 rounded-lg border border-raisin-black/10 dark:border-eggshell-white/10 text-start">
            <h2 className="text-2xl font-bold font-serif text-raisin-black dark:text-eggshell-white mb-6">Account Information</h2>
            <div className="space-y-4">
                <div><strong className="text-raisin-black/60 dark:text-eggshell-white/60 w-32 inline-block">Client Name:</strong> <span className="text-raisin-black dark:text-eggshell-white">{user.name}</span></div>
                <div><strong className="text-raisin-black/60 dark:text-eggshell-white/60 w-32 inline-block">Email:</strong> <span className="text-raisin-black dark:text-eggshell-white">{user.email}</span></div>
                <div><strong className="text-raisin-black/60 dark:text-eggshell-white/60 w-32 inline-block">Phone:</strong> <span className="text-raisin-black dark:text-eggshell-white">{user.phone}</span></div>
                <div><strong className="text-raisin-black/60 dark:text-eggshell-white/60 w-32 inline-block">Company:</strong> <span className="text-raisin-black dark:text-eggshell-white">{user.company}</span></div>
            </div>
            <div className="mt-6 pt-6 border-t border-raisin-black/10 dark:border-eggshell-white/10 flex justify-end">
                <button disabled className="bg-raisin-black/10 dark:bg-eggshell-white/10 text-raisin-black dark:text-eggshell-white font-bold py-2 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">Edit Information</button>
            </div>
        </div>
    );
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-action-blue dark:border-vibrant-magenta border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }

        switch (view) {
            case 'projects': return renderProjectsView();
            case 'account': return renderAccountView();
            case 'billing': return <BillingPage />;
            case 'branding': return <BrandingPage />;
            case 'projectDetail': return renderProjectDetail();
            case 'feedbackStudio': 
                if (!selectedProject) return null;
                return <FeedbackStudio project={selectedProject} onBack={() => setView('projects')} />;
            default: return null;
        }
    };
    
    const userInitials = (user.name.split(' ').map(n => n[0]).join('') || '?').substring(0, 2).toUpperCase();

    return (
        <>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 p-6 rounded-lg border border-raisin-black/10 dark:border-eggshell-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black rounded-full flex items-center justify-center font-bold text-lg">{userInitials}</div>
                            <div>
                                <p className="font-bold text-raisin-black dark:text-eggshell-white text-start">{user.name}</p>
                                <p className="text-xs text-raisin-black/60 dark:text-eggshell-white/60 text-start">{user.company}</p>
                            </div>
                        </div>
                        <nav className="space-y-2">
                            <button onClick={() => setView('projects')} className={`w-full flex items-center gap-3 p-3 rounded-md text-start transition-colors ${view === 'projects' || view === 'projectDetail' || view === 'feedbackStudio' ? 'bg-action-blue/10 text-action-blue dark:bg-vibrant-magenta/10 dark:text-vibrant-magenta' : 'text-raisin-black/80 dark:text-eggshell-white/80 hover:bg-raisin-black/5 dark:hover:bg-eggshell-white/5'}`}>
                                <Icon path="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5-4.5V6.75A2.25 2.25 0 015.25 4.5h9.5A2.25 2.25 0 0117.25 6.75v3" />
                                <span className="font-semibold">Your Projects</span>
                            </button>
                             <button onClick={() => setView('billing')} className={`w-full flex items-center gap-3 p-3 rounded-md text-start transition-colors ${view === 'billing' ? 'bg-action-blue/10 text-action-blue dark:bg-vibrant-magenta/10 dark:text-vibrant-magenta' : 'text-raisin-black/80 dark:text-eggshell-white/80 hover:bg-raisin-black/5 dark:hover:bg-eggshell-white/5'}`}>
                                <Icon path="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3.75-3.75M17.25 19.5l-3.75-3.75m0 0l3.75 3.75m-3.75-3.75l3.75-3.75" />
                                <span className="font-semibold">Billing</span>
                            </button>
                             <button onClick={() => setView('branding')} className={`w-full flex items-center gap-3 p-3 rounded-md text-start transition-colors ${view === 'branding' ? 'bg-action-blue/10 text-action-blue dark:bg-vibrant-magenta/10 dark:text-vibrant-magenta' : 'text-raisin-black/80 dark:text-eggshell-white/80 hover:bg-raisin-black/5 dark:hover:bg-eggshell-white/5'}`}>
                                <Icon path="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.385m5.043.025a15.994 15.994 0 001.622-3.385m3.388 1.62a15.994 15.994 0 00-1.622-3.385m-5.043-.025a15.998 15.998 0 01-3.388-1.62m5.043.025a15.998 15.998 0 00-3.388 1.62m-1.622 3.385a15.994 15.994 0 01-1.622 3.385m3.388 1.62a15.994 15.994 0 01-1.622 3.385" />
                                <span className="font-semibold">Branding</span>
                            </button>
                            <button onClick={() => setView('account')} className={`w-full flex items-center gap-3 p-3 rounded-md text-start transition-colors ${view === 'account' ? 'bg-action-blue/10 text-action-blue dark:bg-vibrant-magenta/10 dark:text-vibrant-magenta' : 'text-raisin-black/80 dark:text-eggshell-white/80 hover:bg-raisin-black/5 dark:hover:bg-eggshell-white/5'}`}>
                                <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                <span className="font-semibold">Account</span>
                            </button>
                            <div className="pt-2 border-t border-raisin-black/10 dark:border-eggshell-white/10">
                                <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-md text-start transition-colors text-raisin-black/80 dark:text-eggshell-white/80 hover:bg-raisin-black/5 dark:hover:bg-eggshell-white/5">
                                    <Icon path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-3l3-3m0 0l-3-3m3 3H9" />
                                    <span className="font-semibold">Log Out</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                </aside>

                <main className="flex-1">
                    {renderContent()}
                </main>
            </div>
            {isNewProjectModalOpen && <NewProjectModal onClose={() => setIsNewProjectModalOpen(false)} onSubmit={handleAddNewProject} />}
            {isEditModalOpen && selectedProject && <EditProjectModal project={selectedProject} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveChanges} />}
        </>
    );
};