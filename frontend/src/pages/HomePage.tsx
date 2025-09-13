import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Travel } from '../types';
import { travelService } from '../services/travelService';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTravels();
  }, []);

  const loadTravels = async () => {
    try {
      const data = await travelService.getTravels();
      setTravels(data);
    } catch (err: any) {
      setError('旅行データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return '計画中';
      case 'confirmed': return '確定';
      case 'completed': return '完了';
      case 'cancelled': return 'キャンセル';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'planning': return 'status-planning';
      case 'confirmed': return 'status-confirmed';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-content">
          <h1>✈️ 令和トラベル</h1>
          <p>こんにちは、{user?.name}さん</p>
        </div>
        <button className="btn btn-secondary" onClick={logout}>
          ログアウト
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="section">
        <h2>あなたの旅行</h2>
        
        {travels.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✈️</div>
            <h3>まだ旅行がありません</h3>
            <p>新しい旅行を計画してみましょう</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/travels/new')}
            >
              新しい旅行を作成
            </button>
          </div>
        ) : (
          <div className="travels-grid">
            {travels.map((travel) => (
              <div key={travel._id} className="travel-card">
                <div className="travel-header">
                  <h3>{travel.title}</h3>
                  <span className={`status ${getStatusClass(travel.status)}`}>
                    {getStatusLabel(travel.status)}
                  </span>
                </div>
                <div className="travel-info">
                  <p><strong>目的地:</strong> {travel.destination}</p>
                  <p><strong>期間:</strong> {formatDate(travel.startDate)} - {formatDate(travel.endDate)}</p>
                  <p><strong>予算:</strong> ¥{travel.budget.toLocaleString()}</p>
                  <p><strong>参加者:</strong> {travel.participants}人</p>
                </div>
                <div className="travel-actions">
                  <button
                    className="btn btn-small"
                    onClick={() => navigate(`/travels/${travel._id}`)}
                  >
                    詳細を見る
                  </button>
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => navigate(`/travels/${travel._id}/edit`)}
                  >
                    編集
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="fab"
        onClick={() => navigate('/travels/new')}
        title="新しい旅行を追加"
      >
        +
      </button>
    </div>
  );
};

export default HomePage;
