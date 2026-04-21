import React from "react";
import { LucideCamera, LucideUser, LucideLoader2 } from "lucide-react";

const ProfileAvatarEditor = ({ 
    userAvatar, 
    isEditing, 
    isUploading, 
    onAvatarClick, 
    fileInputRef 
}) => {
    return (
        <div className="relative group mx-auto md:mx-0">
            {userAvatar ? (
                <img
                    src={userAvatar}
                    alt="Profile"
                    className={`w-36 h-36 rounded-full object-cover ring-4 ring-slate-50 dark:ring-slate-800 transition-all group-hover:ring-primary/20 ${isEditing ? "cursor-pointer hover:opacity-80" : ""}`}
                    onClick={onAvatarClick}
                />
            ) : (
                <div 
                    className={`w-36 h-36 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center ring-4 ring-slate-50 dark:ring-slate-800 transition-all group-hover:ring-primary/20 border border-slate-200 dark:border-slate-700 ${isEditing ? "cursor-pointer hover:opacity-80" : ""}`}
                    onClick={onAvatarClick}
                >
                    {isUploading ? (
                        <LucideLoader2 size={40} className="text-primary animate-spin" />
                    ) : (
                        <LucideUser size={56} className="text-slate-400" />
                    )}
                </div>
            )}
            {isEditing && (
                <button 
                    onClick={onAvatarClick}
                    disabled={isUploading}
                    className="absolute bottom-1 right-1 bg-primary text-white p-2.5 rounded-full shadow-xl border-2 border-white dark:border-slate-900 hover:scale-110 transition-transform animate-in zoom-in"
                >
                    {isUploading ? <LucideLoader2 size={18} className="animate-spin" /> : <LucideCamera size={18} />}
                </button>
            )}
        </div>
    );
};

export default ProfileAvatarEditor;
