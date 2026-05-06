// components/admin/common/DeleteConfirmationModal.tsx
"use client";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
    isLoading?: boolean;
}

export const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    itemName = "this item",
    isLoading = false,
}: DeleteConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="flex flex-col items-center text-center">
                    {/* Warning Icon */}
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Delete Confirmation
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500 mb-6">
                        Are you sure you want to delete <span className="font-medium text-gray-700">{itemName}</span>? 
                        This action cannot be undone and all associated data will be permanently removed.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};