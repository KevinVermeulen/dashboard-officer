import React from 'react';
import StatCard from './StatCard';
import { mockIntercomData, getStatCards } from '../data/mockData';
import { IntercomMetrics } from '../types/intercom';

interface DashboardProps {
  activeSection: string;
}

const Dashboard: React.FC<DashboardProps> = ({ activeSection }) => {
  const data: IntercomMetrics = mockIntercomData;
  const statCards = getStatCards(data);

  if (activeSection !== 'general') {
    return (
      <div className="flex-1 p-8">
        <div className="text-center text-gray-500 mt-20">
          <h2 className="text-2xl font-semibold mb-4">Section en développement</h2>
          <p>Cette section sera disponible prochainement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Général</h1>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-6 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tickets par Agent */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets par Agent (Aujourd'hui)</h3>
          <div className="space-y-3">
            {data.ticketsByAgent.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{agent.agentName}</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {agent.ticketsToday}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Charge de travail par Agent */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Charge de Travail (Tickets Actifs)</h3>
          <div className="space-y-3">
            {data.workloadByAgent.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{agent.agentName}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  agent.activeTickets > 10 
                    ? 'bg-red-100 text-red-800' 
                    : agent.activeTickets > 5 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {agent.activeTickets}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Volume par Pack */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume par Pack</h3>
          <div className="space-y-3">
            {data.ticketsByPack.map((pack, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{pack.packName}</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {pack.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Volume Horaire */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume par Heure</h3>
          <div className="space-y-2">
            {data.hourlyVolume.map((hour, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{hour.hour}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(hour.count / 25) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-6">{hour.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
