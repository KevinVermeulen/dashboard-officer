import React from 'react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, onLogout }) => {
  const menuItems = [
    { id: 'general', label: 'Général' },
    { id: 'efficiency', label: 'Efficacité' },
    { id: 'quality', label: 'Qualité - Satisfaction' },
    { id: 'ai', label: 'AI' },
    // Autres sections à ajouter plus tard
  ];

  return (
    <div className="w-64 bg-navy h-screen flex flex-col shadow-lg">
      {/* Logo/Header */}
      <div className="p-6 border-b border-navy-light">
        <div className="flex items-center space-x-3">
          <img 
            src="/vertuoza.png" 
            alt="Vertuoza Logo" 
            className="w-10 h-10 rounded-xl shadow-md object-contain"
          />
          <h1 className="text-white text-xl font-bold">Vertuo-Officer</h1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-3">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-medium ${
                  activeSection === item.id
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-md hover:transform hover:scale-102'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
                <span>{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-navy-light">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-200 font-medium border border-red-600 hover:border-red-700 hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
