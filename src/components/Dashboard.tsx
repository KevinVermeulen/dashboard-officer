import React, { useState } from 'react';
import StatCard from './StatCard';
import { mockIntercomData, getStatCards } from '../data/mockData';
import { IntercomMetrics } from '../types/intercom';
import { useIntercomData } from '../services/intercomService';

interface DashboardProps {
  activeSection: string;
}

const Dashboard: React.FC<DashboardProps> = ({ activeSection }) => {
  // Get yesterday's date as default
  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  // Filter states
  const [startDate, setStartDate] = useState(getYesterday());
  const [endDate, setEndDate] = useState(getYesterday());
  const [selectedAgent, setSelectedAgent] = useState('');
  
  // Use the hook to get real data with filters
  const { data, loading, refetch } = useIntercomData({
    startDate,
    endDate,
    selectedAgent
  });

  // Fallback to mock data if no real data
  const displayData: IntercomMetrics = data || mockIntercomData;
  const statCards = getStatCards(displayData);

  // Get unique agents from data (filter out 'X' values)
  const agents = Array.from(new Set([
    ...displayData.ticketsByAgent.map(agent => agent.agentName),
    ...displayData.workloadByAgent.map(agent => agent.agentName)
  ])).filter(agent => agent !== 'X');

  const handleSubmit = async () => {
    console.log('Filters applied:', { startDate, endDate, selectedAgent });
    await refetch({ startDate, endDate, selectedAgent });
  };

  if (activeSection === 'ai') {
    return (
      <div className="flex-1 p-8 bg-gray-50 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI - Automatisation & Self-Service</h1>
        </div>

        {/* Filters - Same as other sections */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8 mx-2">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors text-sm font-medium"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors text-sm font-medium"
              />
            </div>
            <div className="flex flex-col">
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors min-w-[220px] text-sm font-medium"
              >
                <option value="">Tous les agents</option>
                {agents.map((agent, index) => (
                  <option key={index} value={agent}>
                    {agent}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-semibold"
            >
              Appliquer
            </button>
          </div>
        </div>

        {/* AI Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
          {/* FIN AI Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance FIN AI</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <span className="block text-sm text-gray-600">Résolution FIN AI seul</span>
                  <span className="text-2xl font-bold text-green-600">{displayData.ai.finAIOnlyResolution}%</span>
                </div>
                <div className="text-4xl">🤖</div>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <span className="block text-sm text-gray-600">FIN AI + Humain</span>
                  <span className="text-2xl font-bold text-blue-600">{displayData.ai.finAIHumanResolution}%</span>
                </div>
                <div className="text-4xl">🤝</div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Taux d'automatisation total</div>
                <div className="text-lg font-semibold text-purple-600">
                  {(displayData.ai.finAIOnlyResolution + displayData.ai.finAIHumanResolution).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Documentation Issues */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Problèmes de Documentation</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <span className="block text-sm text-gray-600">Tickets mal documentés</span>
                  <span className="text-2xl font-bold text-red-600">{displayData.ai.poorlyDocumentedTickets}</span>
                </div>
                <div className="text-4xl">📋</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Impact sur l'efficacité</div>
                <div className="text-sm text-yellow-800">
                  Ces tickets nécessitent une intervention humaine supplémentaire
                </div>
              </div>
            </div>
          </div>

          {/* Documentation Suggestions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggestions d'Amélioration Documentation</h3>
            <div className="space-y-3">
              {displayData.ai.documentationSuggestions.map((suggestion, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">{suggestion.topic}</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                        {suggestion.frequency} occurrences
                      </span>
                    </div>
                    <div className="text-2xl">💡</div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {suggestion.suggestedImprovement}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="text-xl">📈</div>
                <span className="font-medium text-blue-900">Impact Potentiel</span>
              </div>
              <p className="text-sm text-blue-800">
                L'amélioration de ces {displayData.ai.documentationSuggestions.length} sections pourrait réduire 
                de {displayData.ai.documentationSuggestions.reduce((sum, s) => sum + s.frequency, 0)} tickets 
                le nombre de demandes mal documentées par le bot.
              </p>
            </div>
          </div>

          {/* AI Efficiency Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques d'Efficacité AI</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-sm text-gray-600">Résolution Automatique</div>
                <div className="text-xl font-bold text-green-600">{displayData.ai.finAIOnlyResolution}%</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-3xl mb-2">🤖</div>
                <div className="text-sm text-gray-600">Assistance AI</div>
                <div className="text-xl font-bold text-blue-600">{displayData.ai.finAIHumanResolution}%</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-sm text-gray-600">Gain de Temps</div>
                <div className="text-xl font-bold text-purple-600">
                  {Math.round((displayData.ai.finAIOnlyResolution + displayData.ai.finAIHumanResolution) * 0.7)}%
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <div className="text-3xl mb-2">📚</div>
                <div className="text-sm text-gray-600">À Améliorer</div>
                <div className="text-xl font-bold text-orange-600">{displayData.ai.poorlyDocumentedTickets}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'quality') {
    return (
      <div className="flex-1 p-8 bg-gray-50 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Qualité - Satisfaction</h1>
        </div>

        {/* Filters - Same as other sections */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8 mx-2">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors text-sm font-medium"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors text-sm font-medium"
              />
            </div>
            <div className="flex flex-col">
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors min-w-[220px] text-sm font-medium"
              >
                <option value="">Tous les agents</option>
                {agents.map((agent, index) => (
                  <option key={index} value={agent}>
                    {agent}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-semibold"
            >
              Appliquer
            </button>
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
          {/* CSAT Global & Par Agent */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">CSAT (Customer Satisfaction)</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">Global</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {displayData.quality.csat.global}%
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">Par Agent</h4>
                {displayData.quality.csat.byAgent.map((agent, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{agent.agentName}</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${
                      agent.csat >= 90 ? 'bg-green-100 text-green-800' :
                      agent.csat >= 85 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {agent.csat}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">Par Pack</h4>
                {displayData.quality.csat.byPack.map((pack, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{pack.packName}</span>
                    <span className="text-sm font-medium text-gray-900">{pack.csat}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NPS & Distribution Feedback */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">NPS & Distribution Feedback</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">Net Promoter Score</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {displayData.quality.nps}
                </span>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-600">Distribution des Feedbacks</h4>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Positif</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    {displayData.quality.feedbackDistribution.positive}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Neutre</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
                    {displayData.quality.feedbackDistribution.neutral}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                  <span className="text-sm text-gray-700">Négatif</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    {displayData.quality.feedbackDistribution.negative}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CSAT par Canal & Résolution Day 1 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance par Canal</h3>
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-600">CSAT par Canal</h4>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-700">Via Appel</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {displayData.quality.csatByChannel.viaCall}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-700">Via Écrit</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {displayData.quality.csatByChannel.viaWritten}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-gray-700">Résolution Day 1</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {displayData.quality.day1ResolutionRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Taux de Réouverture & Métriques Avancées */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques Avancées</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium text-gray-700">Taux Réouverture Global</span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {displayData.quality.reopenRate.global}%
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">Réouverture par Agent</h4>
                {displayData.quality.reopenRate.byAgent.map((agent, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{agent.agentName}</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${
                      agent.reopenRate <= 7 ? 'bg-green-100 text-green-800' :
                      agent.reopenRate <= 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {agent.reopenRate}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                <span className="font-medium text-gray-700">Sans Aller-Retour</span>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {displayData.quality.noBackAndForthRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Comparaison Équipe vs Individuel */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparaison Équipe vs Individuel</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <span className="block text-sm text-gray-600">Moyenne Équipe</span>
                  <span className="text-2xl font-bold text-blue-600">{displayData.quality.teamVsIndividualComparison.teamAverage}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <span className="block text-sm text-gray-600">Top Performer</span>
                  <span className="text-lg font-semibold text-green-600">{displayData.quality.teamVsIndividualComparison.topPerformer}</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                <div>
                  <span className="block text-sm text-gray-600">Score Top Performer</span>
                  <span className="text-2xl font-bold text-yellow-600">{displayData.quality.teamVsIndividualComparison.topPerformerScore}%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Écart avec la moyenne</div>
              <div className="text-lg font-semibold text-green-600">
                +{(displayData.quality.teamVsIndividualComparison.topPerformerScore - displayData.quality.teamVsIndividualComparison.teamAverage).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'efficiency') {
    return (
      <div className="flex-1 p-8 bg-gray-50 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Efficacité</h1>
        </div>

        {/* Filters - Same as General */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8 mx-2">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors text-sm font-medium"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors text-sm font-medium"
              />
            </div>
            <div className="flex flex-col">
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors min-w-[220px] text-sm font-medium"
              >
                <option value="">Tous les agents</option>
                {agents.map((agent, index) => (
                  <option key={index} value={agent}>
                    {agent}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-semibold"
            >
              Appliquer
            </button>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
          {/* Temps de première réponse */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Temps de Première Réponse</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">Global</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {displayData.efficiency.firstResponseTime.global} min
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">Par Pack</h4>
                {displayData.efficiency.firstResponseTime.byPack.map((pack, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{pack.packName}</span>
                    <span className="text-sm font-medium text-gray-900">{pack.responseTime} min</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">Par Agent</h4>
                {displayData.efficiency.firstResponseTime.byAgent.map((agent, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{agent.agentName}</span>
                    <span className="text-sm font-medium text-gray-900">{agent.responseTime} min</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Temps de résolution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Temps de Résolution</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">Global</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {displayData.efficiency.resolutionTime.global}h
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-gray-700">Médian</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {displayData.efficiency.resolutionTime.median}h
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">Par Pack</h4>
                {displayData.efficiency.resolutionTime.byPack.map((pack, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{pack.packName}</span>
                    <span className="text-sm font-medium text-gray-900">{pack.resolutionTime}h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Métriques diverses */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques Diverses</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium text-gray-700">Temps en "Ouvert" (9h-17h)</span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {displayData.efficiency.openTimeBusinessHours}h
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-gray-700">Taux Auto-close</span>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {displayData.efficiency.autoCloseRate}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                <span className="font-medium text-gray-700">Échanges avant résolution</span>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {displayData.efficiency.averageExchangesBeforeResolution}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium text-gray-700">Échanges avant appel</span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {displayData.efficiency.averageExchangesBeforeCall}
                </span>
              </div>
            </div>
          </div>

          {/* Comparaison résolution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparaison Temps de Résolution</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">Via Appel</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {displayData.efficiency.resolutionTimeComparison.viaCall}h
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">Via Écrit</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {displayData.efficiency.resolutionTimeComparison.viaWritten}h
                </span>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Gain de temps via appel</div>
                <div className="text-lg font-semibold text-green-600">
                  -{((displayData.efficiency.resolutionTimeComparison.viaWritten - displayData.efficiency.resolutionTimeComparison.viaCall) / displayData.efficiency.resolutionTimeComparison.viaWritten * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8 mx-2">
        <div className="flex items-center gap-6">
          {/* Start Date */}
          <div className="flex flex-col">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors text-sm font-medium"
            />
          </div>
          
          {/* End Date */}
          <div className="flex flex-col">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors text-sm font-medium"
            />
          </div>
          
          {/* Agent Dropdown */}
          <div className="flex flex-col">
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors min-w-[220px] text-sm font-medium"
            >
              <option value="">Tous les agents</option>
              {agents.map((agent, index) => (
                <option key={index} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </div>
          
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Chargement...' : 'Appliquer'}
          </button>
        </div>
      </div>


      {/* Stats Cards Grid */}
      <div className="flex flex-wrap gap-6 mb-12 px-2 space-x-2">
        {statCards.map((stat, index) => (
          <div key={index} className="flex-1 min-w-0" style={{ minWidth: '150px', maxWidth: 'calc(16.666% - 12px)' }}>
            <StatCard stat={stat} />
          </div>
        ))}
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2" style={{ marginTop: '4rem', paddingTop: '2rem' }}>
        {/* Tickets par Agent */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets par Agent (Aujourd'hui)</h3>
          <div className="space-y-3">
            {displayData.ticketsByAgent.map((agent, index) => (
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
            {displayData.workloadByAgent.map((agent, index) => (
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
            {displayData.ticketsByPack.map((pack, index) => (
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
            {displayData.hourlyVolume.map((hour, index) => (
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

        {/* Volume Post-Onboarding */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume 30j Post-Onboarding</h3>
          <div className="space-y-3">
            {displayData.postOnboardingVolume.map((period, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{period.period}</span>
                <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {period.ticketCount}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total sur 30 jours</div>
            <div className="text-lg font-semibold text-blue-600">
              {displayData.postOnboardingVolume.reduce((sum, period) => sum + period.ticketCount, 0)} tickets
            </div>
          </div>
        </div>

        {/* Repeat Customers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Repeat Customers (Top 10)</h3>
          <div className="space-y-3">
            {displayData.repeatCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <span className="font-medium text-gray-700 block">{customer.customerName}</span>
                  <span className="text-xs text-gray-500">Dernier ticket: {new Date(customer.lastTicketDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  customer.ticketCount >= 40 ? 'bg-red-100 text-red-800' :
                  customer.ticketCount >= 25 ? 'bg-orange-100 text-orange-800' :
                  customer.ticketCount >= 15 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {customer.ticketCount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
