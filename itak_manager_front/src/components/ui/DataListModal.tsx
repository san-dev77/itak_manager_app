import React from "react";
import { X, Search, Filter } from "lucide-react";

interface DataListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: unknown[];
  onSelect: (item: unknown) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  renderItem: (item: unknown) => React.ReactNode;
  placeholder?: string;
  emptyMessage?: string;
}

const DataListModal: React.FC<DataListModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  onSelect,
  searchTerm,
  onSearchChange,
  renderItem,
  emptyMessage = "Aucun élément trouvé",
}) => {
  if (!isOpen) return null;

  const filteredData = data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white flex-shrink-0">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Filter className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
                <p className="text-blue-100 text-sm">
                  Sélectionnez un élément dans la liste
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">{emptyMessage}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map((item, index) => (
                <div
                  key={(item as { id?: string }).id || index}
                  onClick={() => onSelect(item)}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  {renderItem(item)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredData.length} élément
              {filteredData.length !== 1 ? "s" : ""} trouvé
              {filteredData.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataListModal;
