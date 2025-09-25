import React from 'react';
import { StatCard as StatCardType } from '../types/intercom';

interface StatCardProps {
  stat: StatCardType;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 min-w-0">
      <div className="text-center">
        <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
      </div>
    </div>
  );
};

export default StatCard;
