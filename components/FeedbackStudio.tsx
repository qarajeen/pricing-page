import React, { useState, useEffect, useRef } from 'react';
import type { Project, FeedbackComment } from '../types';
import { supabaseClient as supabase } from '../services/supabaseClient';

interface FeedbackStudioProps {
  project: Project;
  onBack: () => void;
}

const Icon: React.FC<{ path: string; className?: string }> = ({ path, className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

export const FeedbackStudio: React.FC<FeedbackStudioProps> = ({ project, onBack }) => {
    const [comments, setComments] = useState<FeedbackComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Refs for media interaction
    const videoRef = useRef<HTMLVideoElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const [imageClickPos, setImageClickPos] = useState<{x: number, y: number} | null>(null);

    const fetchComments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: dbError } = await supabase
                .from('feedback_comments')
                .select('*')
                .eq('project_id', project.id)
                .order('created_at', { ascending: true });
            if (dbError) throw dbError;
            setComments(data as FeedbackComment[]);
        } catch (err: any) {
            setError(err.message || "Failed to fetch comments.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [project.id]);

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;
        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("You must be logged in to comment.");

            let commentData: Partial<FeedbackComment> = {
                project_id: project.id,
                user_id: user.id,
                comment_text: newComment,
                type: project.media_type,
                version: 1, // Basic versioning
            };

            if (project.media_type === 'video' && videoRef.current) {
                commentData.timestamp = videoRef.current.currentTime;
            } else if (project.media_type === 'image' && imageClickPos) {
                commentData.position_x = imageClickPos.x;
                commentData.position_y = imageClickPos.y;
            }

            const { data: insertedComment, error: dbError } = await supabase
                .from('feedback_comments')
                .insert(commentData)
                .select()
                .single();

            if (dbError) throw dbError;
            
            if (insertedComment) {
                 setComments(prev => [...prev, insertedComment as FeedbackComment]);
            }
            setNewComment('');
            setImageClickPos(null); // Reset pin
        } catch (err: any) {
            setError(err.message || "Failed to submit comment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current) return;
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100; // in percentage
        const y = ((e.clientY - rect.top) / rect.height) * 100; // in percentage
        setImageClickPos({ x, y });
    };

    const handleJumpToTime = (time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            videoRef.current.play();
        }
    };
    
    const formatTimestamp = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const renderMediaViewer = () => {
        if (!project.media_url) {
            return <div className="bg-raisin-black flex items-center justify-center text-eggshell-white/50">No media uploaded for review.</div>;
        }
        if (project.media_type === 'video') {
            return <video ref={videoRef} src={project.media_url} controls className="w-full h-full object-contain" />;
        }
        if (project.media_type === 'image') {
            return (
                <div ref={imageContainerRef} className="w-full h-full relative cursor-crosshair" onClick={handleImageClick}>
                    <img src={project.media_url} alt="Review media" className="w-full h-full object-contain" />
                    {/* Display existing comment pins */}
                    {comments.filter(c => c.type === 'image').map((comment, index) => (
                        <div key={comment.id} style={{ left: `${comment.position_x}%`, top: `${comment.position_y}%` }} 
                            className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-action-blue/80 dark:bg-vibrant-magenta/80 text-white dark:text-raisin-black rounded-full flex items-center justify-center font-bold text-xs shadow-lg">
                            {index + 1}
                        </div>
                    ))}
                    {/* Display new comment pin */}
                    {imageClickPos && (
                        <div style={{ left: `${imageClickPos.x}%`, top: `${imageClickPos.y}%` }} 
                            className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-action-blue dark:bg-vibrant-magenta rounded-full flex items-center justify-center font-bold shadow-lg ring-2 ring-white animate-pulse">
                            <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5 text-white dark:text-raisin-black" />
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };
    
    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-action-blue dark:text-vibrant-magenta mb-6 hover:underline">
                <Icon path="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" className="w-4 h-4" />
                Back to All Projects
            </button>
            <div className="bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 p-6 rounded-lg border border-raisin-black/10 dark:border-eggshell-white/10">
                <h2 className="text-3xl font-bold font-serif text-raisin-black dark:text-eggshell-white mb-1">{project.title}</h2>
                <p className="text-raisin-black/70 dark:text-eggshell-white/70 mb-6">Feedback Studio (Version 1)</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
                    <div className="lg:col-span-2 bg-raisin-black rounded-lg overflow-hidden h-full">
                        {renderMediaViewer()}
                    </div>
                    <div className="lg:col-span-1 flex flex-col bg-eggshell-white/30 dark:bg-deep-ocean-surface/50 p-4 rounded-lg h-full">
                        <h3 className="font-bold text-lg text-raisin-black dark:text-eggshell-white mb-4">Comments</h3>
                        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                            {isLoading && <p className="text-raisin-black/50 dark:text-eggshell-white/50">Loading comments...</p>}
                            {error && !isLoading && <p className="text-red-400">{error}</p>}
                            {!isLoading && comments.length === 0 && <p className="text-raisin-black/50 dark:text-eggshell-white/50 text-sm">No comments yet. Be the first to leave feedback!</p>}
                            {comments.map((comment, index) => (
                                <div key={comment.id} className="text-sm p-3 bg-eggshell-white/50 dark:bg-eggshell-white/5 rounded-md">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-raisin-black dark:text-eggshell-white">
                                            {comment.type === 'image' ? `Pin #${index+1}` : ''}
                                        </span>
                                        {comment.type === 'video' && comment.timestamp != null && (
                                            <button onClick={() => handleJumpToTime(comment.timestamp!)} className="font-mono text-xs bg-action-blue/20 text-action-blue dark:bg-vibrant-magenta/20 dark:text-vibrant-magenta px-2 py-0.5 rounded hover:bg-action-blue/40 dark:hover:bg-vibrant-magenta/40 transition">
                                                {formatTimestamp(comment.timestamp)}
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-raisin-black/80 dark:text-eggshell-white/80">{comment.comment_text}</p>
                                    <p className="text-xs text-raisin-black/40 dark:text-eggshell-white/40 mt-2 text-right">{new Date(comment.created_at!).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-raisin-black/10 dark:border-eggshell-white/10">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={project.media_type === 'image' ? "Click on the image to add a comment..." : "Pause the video to add a comment..."}
                                className="w-full bg-eggshell-white dark:bg-deep-ocean-surface p-3 rounded-md border-2 border-raisin-black/20 dark:border-eggshell-white/20 text-raisin-black dark:text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta text-sm"
                                rows={3}
                            />
                            <button
                                onClick={handleSubmitComment}
                                disabled={isSubmitting || !newComment.trim()}
                                className="w-full mt-2 bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold py-2 rounded-full hover:bg-opacity-90 transition disabled:bg-action-blue/50 dark:disabled:bg-vibrant-magenta/50 disabled:cursor-wait button-inset-shadow"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Comment'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};