import React, { useState } from 'react';
import { Travel } from '../types';

interface SearchFilterProps {
  travels: Travel[];
  onFilteredTravels: (filteredTravels: Travel[]) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ travels, onFilteredTravels }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const handleFilter = () => {
    let filtered = [...travels];

    // 検索フィルタ
    if (searchTerm) {
      filtered = filtered.filter(travel =>
        travel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        travel.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        travel.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // ステータスフィルタ
    if (statusFilter !== 'all') {
      filtered = filtered.filter(travel => travel.status === statusFilter);
    }

    // ソート
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'destination':
        filtered.sort((a, b) => a.destination.localeCompare(b.destination));
        break;
      case 'startDate':
        filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      case 'budget':
        filtered.sort((a, b) => b.budget - a.budget);
        break;
    }

    onFilteredTravels(filtered);
  };

  React.useEffect(() => {
    handleFilter();
  }, [searchTerm, statusFilter, sortBy, travels]);

  return (
    <div className="search-filter">
      <div className="search-row">
        <div className="search-input">
          <input
            type="text"
            placeholder="旅行を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">すべてのステータス</option>
            <option value="planning">計画中</option>
            <option value="confirmed">確定</option>
            <option value="completed">完了</option>
            <option value="cancelled">キャンセル</option>
          </select>
        </div>
        <div className="sort-group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">新しい順</option>
            <option value="oldest">古い順</option>
            <option value="title">タイトル順</option>
            <option value="destination">目的地順</option>
            <option value="startDate">開始日順</option>
            <option value="budget">予算順</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
