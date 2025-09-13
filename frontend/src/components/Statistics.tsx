import React from 'react';
import { Travel } from '../types';

interface StatisticsProps {
  travels: Travel[];
}

const Statistics: React.FC<StatisticsProps> = ({ travels }) => {
  const totalTravels = travels.length;
  const totalBudget = travels.reduce((sum, travel) => sum + travel.budget, 0);
  const averageBudget = totalTravels > 0 ? totalBudget / totalTravels : 0;
  
  const statusCounts = travels.reduce((counts, travel) => {
    counts[travel.status] = (counts[travel.status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const upcomingTravels = travels.filter(travel => 
    new Date(travel.startDate) > new Date() && travel.status !== 'cancelled'
  ).length;

  const completedTravels = statusCounts.completed || 0;
  const planningTravels = statusCounts.planning || 0;

  const totalActivities = travels.reduce((sum, travel) => sum + travel.activities.length, 0);
  const totalAccommodations = travels.reduce((sum, travel) => sum + travel.accommodations.length, 0);

  return (
    <div className="statistics">
      <h3>統計情報</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalTravels}</div>
          <div className="stat-label">総旅行数</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">¥{totalBudget.toLocaleString()}</div>
          <div className="stat-label">総予算</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">¥{Math.round(averageBudget).toLocaleString()}</div>
          <div className="stat-label">平均予算</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{upcomingTravels}</div>
          <div className="stat-label">今後の旅行</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completedTravels}</div>
          <div className="stat-label">完了済み</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{planningTravels}</div>
          <div className="stat-label">計画中</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalActivities}</div>
          <div className="stat-label">アクティビティ</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalAccommodations}</div>
          <div className="stat-label">宿泊施設</div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
