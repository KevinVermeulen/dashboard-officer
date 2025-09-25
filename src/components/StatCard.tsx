import React from 'react';
import { StatCard as StatCardType } from '../types/intercom';

interface StatCardProps {
  stat: StatCardType;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
        </div>
        <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
          <span className="text-white text-xl">{stat.icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
