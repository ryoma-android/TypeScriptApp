import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Travel, Activity, Accommodation } from '../types';
import { travelService } from '../services/travelService';

const TravelDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [travel, setTravel] = useState<Travel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showAccommodationForm, setShowAccommodationForm] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({});
  const [newAccommodation, setNewAccommodation] = useState<Partial<Accommodation>>({});

  useEffect(() => {
    if (id) {
      loadTravel(id);
    }
  }, [id]);

  const loadTravel = async (travelId: string) => {
    try {
      const data = await travelService.getTravel(travelId);
      setTravel(data);
    } catch (err: any) {
      setError('旅行データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('この旅行を削除しますか？')) {
      try {
        await travelService.deleteTravel(id);
        navigate('/');
      } catch (err: any) {
        setError('削除に失敗しました');
      }
    }
  };

  const handleAddActivity = async () => {
    if (!id || !newActivity.name || !newActivity.date || !newActivity.location || !newActivity.cost || !newActivity.category) return;

    try {
      await travelService.addActivity(id, newActivity as Omit<Activity, '_id'>);
      setNewActivity({});
      setShowActivityForm(false);
      loadTravel(id);
    } catch (err: any) {
      setError('アクティビティの追加に失敗しました');
    }
  };

  const handleAddAccommodation = async () => {
    if (!id || !newAccommodation.name || !newAccommodation.type || !newAccommodation.address || !newAccommodation.checkIn || !newAccommodation.checkOut || !newAccommodation.cost) return;

    try {
      await travelService.addAccommodation(id, newAccommodation as Omit<Accommodation, '_id'>);
      setNewAccommodation({});
      setShowAccommodationForm(false);
      loadTravel(id);
    } catch (err: any) {
      setError('宿泊施設の追加に失敗しました');
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

  if (!travel) {
    return (
      <div className="container">
        <div className="error-message">旅行が見つかりません</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="travel-header">
        <div className="travel-title">
          <h1>{travel.title}</h1>
          <div className="travel-meta">
            <span className={`status ${getStatusClass(travel.status)}`}>
              {getStatusLabel(travel.status)}
            </span>
            <span className="destination">{travel.destination}</span>
            <span className="dates">
              {formatDate(travel.startDate)} - {formatDate(travel.endDate)}
            </span>
          </div>
        </div>
        <div className="travel-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/travels/${id}/edit`)}
          >
            編集
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
          >
            削除
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          概要
        </button>
        <button
          className={`tab ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          アクティビティ
        </button>
        <button
          className={`tab ${activeTab === 'accommodations' ? 'active' : ''}`}
          onClick={() => setActiveTab('accommodations')}
        >
          宿泊施設
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="tab-content">
          <div className="info-grid">
            <div className="info-card">
              <h3>基本情報</h3>
              <p>{travel.description || '説明はありません'}</p>
              <p><strong>予算:</strong> ¥{travel.budget.toLocaleString()}</p>
              <p><strong>参加者:</strong> {travel.participants}人</p>
            </div>
            <div className="info-card">
              <h3>費用の内訳</h3>
              <p>アクティビティ: ¥{travel.activities.reduce((sum, activity) => sum + activity.cost, 0).toLocaleString()}</p>
              <p>宿泊施設: ¥{travel.accommodations.reduce((sum, acc) => sum + acc.cost, 0).toLocaleString()}</p>
              <p><strong>合計: ¥{(travel.activities.reduce((sum, activity) => sum + activity.cost, 0) + travel.accommodations.reduce((sum, acc) => sum + acc.cost, 0)).toLocaleString()}</strong></p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="tab-content">
          <div className="section-header">
            <h3>アクティビティ</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShowActivityForm(true)}
            >
              追加
            </button>
          </div>
          
          {travel.activities.length === 0 ? (
            <p className="empty-message">アクティビティがありません</p>
          ) : (
            <div className="list">
              {travel.activities.map((activity, index) => (
                <div key={index} className="list-item">
                  <div className="list-item-content">
                    <h4>{activity.name}</h4>
                    <p>{formatDate(activity.date)} - {activity.location} - ¥{activity.cost.toLocaleString()}</p>
                    {activity.description && <p>{activity.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {showActivityForm && (
            <div className="modal">
              <div className="modal-content">
                <h3>アクティビティを追加</h3>
                <div className="form-group">
                  <label>名前 *</label>
                  <input
                    type="text"
                    value={newActivity.name || ''}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>説明</label>
                  <textarea
                    value={newActivity.description || ''}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="form-group">
                  <label>場所 *</label>
                  <input
                    type="text"
                    value={newActivity.location || ''}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>費用 *</label>
                  <input
                    type="number"
                    value={newActivity.cost || ''}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, cost: Number(e.target.value) }))}
                  />
                </div>
                <div className="form-group">
                  <label>カテゴリ *</label>
                  <select
                    value={newActivity.category || ''}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, category: e.target.value as any }))}
                  >
                    <option value="">選択してください</option>
                    <option value="sightseeing">観光</option>
                    <option value="food">食事</option>
                    <option value="shopping">ショッピング</option>
                    <option value="entertainment">エンターテイメント</option>
                    <option value="transport">交通</option>
                    <option value="other">その他</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>日付 *</label>
                  <input
                    type="date"
                    value={newActivity.date || ''}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="form-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowActivityForm(false)}
                  >
                    キャンセル
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleAddActivity}
                  >
                    追加
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'accommodations' && (
        <div className="tab-content">
          <div className="section-header">
            <h3>宿泊施設</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShowAccommodationForm(true)}
            >
              追加
            </button>
          </div>
          
          {travel.accommodations.length === 0 ? (
            <p className="empty-message">宿泊施設がありません</p>
          ) : (
            <div className="list">
              {travel.accommodations.map((accommodation, index) => (
                <div key={index} className="list-item">
                  <div className="list-item-content">
                    <h4>{accommodation.name}</h4>
                    <p>{accommodation.type} - {accommodation.address}</p>
                    <p>{formatDate(accommodation.checkIn)} 〜 {formatDate(accommodation.checkOut)} - ¥{accommodation.cost.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showAccommodationForm && (
            <div className="modal">
              <div className="modal-content">
                <h3>宿泊施設を追加</h3>
                <div className="form-group">
                  <label>名前 *</label>
                  <input
                    type="text"
                    value={newAccommodation.name || ''}
                    onChange={(e) => setNewAccommodation(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>タイプ *</label>
                  <select
                    value={newAccommodation.type || ''}
                    onChange={(e) => setNewAccommodation(prev => ({ ...prev, type: e.target.value as any }))}
                  >
                    <option value="">選択してください</option>
                    <option value="hotel">ホテル</option>
                    <option value="ryokan">旅館</option>
                    <option value="guesthouse">ゲストハウス</option>
                    <option value="apartment">アパート</option>
                    <option value="other">その他</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>住所 *</label>
                  <input
                    type="text"
                    value={newAccommodation.address || ''}
                    onChange={(e) => setNewAccommodation(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>チェックイン *</label>
                  <input
                    type="date"
                    value={newAccommodation.checkIn || ''}
                    onChange={(e) => setNewAccommodation(prev => ({ ...prev, checkIn: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>チェックアウト *</label>
                  <input
                    type="date"
                    value={newAccommodation.checkOut || ''}
                    onChange={(e) => setNewAccommodation(prev => ({ ...prev, checkOut: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>費用 *</label>
                  <input
                    type="number"
                    value={newAccommodation.cost || ''}
                    onChange={(e) => setNewAccommodation(prev => ({ ...prev, cost: Number(e.target.value) }))}
                  />
                </div>
                <div className="form-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAccommodationForm(false)}
                  >
                    キャンセル
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleAddAccommodation}
                  >
                    追加
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TravelDetailPage;
