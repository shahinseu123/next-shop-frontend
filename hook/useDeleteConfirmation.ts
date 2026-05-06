// hooks/useDeleteConfirmation.ts
import { useState } from "react";

export interface DeleteState {
  isOpen: boolean;
  id?: number;
  name?: string;
}

export const useDeleteConfirmation = () => {
  const [deleteState, setDeleteState] = useState<DeleteState>({
    isOpen: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const openDeleteModal = (id: number, name?: string) => {
    setDeleteState({ isOpen: true, id, name });
  };

  const closeDeleteModal = () => {
    setDeleteState({ isOpen: false });
  };

  const handleDelete = async (deleteFn: (id: number) => Promise<void>) => {
    if (!deleteState.id) return;

    setIsLoading(true);
    try {
      await deleteFn(deleteState.id);
      closeDeleteModal();
      // Optionally trigger refresh
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteState,
    isLoading,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  };
};