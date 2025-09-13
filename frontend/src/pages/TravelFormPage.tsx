import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { travelService, CreateTravelData } from '../services/travelService';

const TravelFormPage: React.FC = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 0,
    participants: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      loadTravel(id);
    }
  }, [isEdit, id]);

  const loadTravel = async (travelId: string) => {
    try {
      const travel = await travelService.getTravel(travelId);
      setFormData({
        title: travel.title,
        description: travel.description || '',
        destination: travel.destination,
        startDate: travel.startDate.split('T')[0],
        endDate: travel.endDate.split('T')[0],
        budget: travel.budget,
        participants: travel.participants,
      });
    } catch (err: any) {
      setError('旅行データの読み込みに失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData: CreateTravelData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      if (isEdit && id) {
        await travelService.updateTravel(id, submitData);
      } else {
        await travelService.createTravel(submitData);
      }

      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <div className="container">
      <div className="form-card">
        <h1>{isEdit ? '旅行を編集' : '新しい旅行を作成'}</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="travel-form">
          <div className="form-group">
            <label htmlFor="title">旅行のタイトル *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange('title')}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">説明</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange('description')}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="destination">目的地 *</label>
              <input
                type="text"
                id="destination"
                value={formData.destination}
                onChange={handleChange('destination')}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="participants">参加者数 *</label>
              <input
                type="number"
                id="participants"
                value={formData.participants}
                onChange={handleChange('participants')}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">開始日 *</label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={handleChange('startDate')}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">終了日 *</label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={handleChange('endDate')}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="budget">予算（円） *</label>
            <input
              type="number"
              id="budget"
              value={formData.budget}
              onChange={handleChange('budget')}
              min="0"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '保存中...' : (isEdit ? '更新' : '作成')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelFormPage;
