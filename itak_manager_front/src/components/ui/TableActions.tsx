import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  compact?: boolean;
}

const TableActions = ({
  onView,
  onEdit,
  onDelete,
  viewLabel = "Voir",
  editLabel = "Modifier",
  deleteLabel = "Supprimer",
  compact = false,
}: TableActionsProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (compact) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 py-1 min-w-[140px] z-20 animate-in fade-in slide-in-from-top-2 duration-150">
            {onView && (
              <button
                onClick={() => {
                  onView();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {viewLabel}
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                {editLabel}
              </button>
            )}
            {onDelete && (
              <>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleteLabel}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {onView && (
        <button
          onClick={onView}
          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
          title={viewLabel}
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
          title={editLabel}
        >
          <Edit className="w-4 h-4" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
          title={deleteLabel}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default TableActions;
