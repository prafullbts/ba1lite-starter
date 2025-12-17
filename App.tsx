import React, { useState } from 'react';
import { MessageSquare, Radio, Image as ImageIcon, BarChart2 } from 'lucide-react';
import ChatView from './components/ChatView';
import LiveView from './components/LiveView';
import ImageView from './components/ImageView';
import StatsView from './components/StatsView';
import { AppTab } from './types';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.CHAT);

  const renderContent = () => {
    switch (currentTab) {
      case AppTab.CHAT: return <ChatView />;
      case AppTab.LIVE: return <LiveView />;
      case AppTab.IMAGE: return <ImageView />;
      case AppTab.STATS: return <StatsView />;
      default: return <ChatView />;
    }
  };

  const NavItem = ({ tab, icon: Icon, label }: { tab: AppTab; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        currentTab === tab 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
            B1
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            ba1Lite<span className="font-light text-gray-500">-starter</span>
          </h1>
        </div>

        <nav className="flex items-center gap-1">
          <NavItem tab={AppTab.CHAT} icon={MessageSquare} label="Chat" />
          <NavItem tab={AppTab.LIVE} icon={Radio} label="Live" />
          <NavItem tab={AppTab.IMAGE} icon={ImageIcon} label="Create" />
          <NavItem tab={AppTab.STATS} icon={BarChart2} label="Stats" />
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
