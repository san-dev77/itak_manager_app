import React from "react";
import { createPortal } from "react-dom";
import { X, Search } from "lucide-react";

interface SimpleModalProps<T = unknown> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: T[];
  onSelect: (item: T) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  renderItem: (item: T) => React.ReactNode;
  placeholder?: string;
  emptyMessage?: string;
}

const SimpleModal = <T,>({
  isOpen,
  onClose,
  title,
  data,
  onSelect,
  searchTerm,
  onSearchChange,
  renderItem,
  placeholder = "Rechercher...",
  emptyMessage = "Aucun élément trouvé",
}: SimpleModalProps<T>) => {
  if (!isOpen) return null;

  const filteredData = data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return createPortal(
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
          ) : (
            <div className="space-y-2">
              {filteredData.map((item, index) => {
                const itemKey = (item as { id?: string }).id || `item-${index}`;
                return (
                  <div
                    key={itemKey}
                    onClick={() => onSelect(item)}
                    className="p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                  >
                    {renderItem(item)}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {filteredData.length} élément{filteredData.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SimpleModal;
