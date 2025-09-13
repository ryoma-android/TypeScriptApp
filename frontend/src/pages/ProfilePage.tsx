import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notificationService, Notification } from '../services/notificationService';
import { favoriteService, Favorite } from '../services/favoriteService';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [notificationsData, favoritesData] = await Promise.all([
        notificationService.getNotifications(),
        favoriteService.getFavorites()
      ]);
      setNotifications(notificationsData);
      setFavorites(favoritesData);
    } catch (error) {
      console.error('データの読み込みに失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('通知の更新に失敗:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
    } catch (error) {
      console.error('通知の削除に失敗:', error);
    }
  };

  const handleRemoveFavorite = async (travelId: string) => {
    try {
      await favoriteService.removeFavorite(travelId);
      setFavorites(prev => prev.filter(fav => fav.travelId !== travelId));
    } catch (error) {
      console.error('お気に入りの削除に失敗:', error);
    }
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
      <div className="profile-header">
        <h1>プロフィール</h1>
        <button className="btn btn-secondary" onClick={logout}>
          ログアウト
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          プロフィール
        </button>
        <button
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          通知 ({notifications.filter(n => !n.read).length})
        </button>
        <button
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          お気に入り ({favorites.length})
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="tab-content">
          <div className="profile-info">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="profile-details">
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-label">登録日:</span>
                  <span className="stat-value">2024年1月1日</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">総旅行数:</span>
                  <span className="stat-value">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="tab-content">
          <div className="notifications-header">
            <h3>通知</h3>
            <button
              className="btn btn-small"
              onClick={async () => {
                await notificationService.markAllAsRead();
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
              }}
            >
              すべて既読にする
            </button>
          </div>
          
          {notifications.length === 0 ? (
            <p className="empty-message">通知がありません</p>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                >
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-date">
                      {new Date(notification.createdAt).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <div className="notification-actions">
                    {!notification.read && (
                      <button
                        className="btn btn-small"
                        onClick={() => handleMarkAsRead(notification._id)}
                      >
                        既読
                      </button>
                    )}
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDeleteNotification(notification._id)}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="tab-content">
          <h3>お気に入りの旅行</h3>
          
          {favorites.length === 0 ? (
            <p className="empty-message">お気に入りの旅行がありません</p>
          ) : (
            <div className="favorites-list">
              {favorites.map((favorite) => (
                <div key={favorite._id} className="favorite-item">
                  <div className="favorite-content">
                    <h4>旅行 ID: {favorite.travelId}</h4>
                    <p>お気に入り登録日: {new Date(favorite.createdAt).toLocaleDateString('ja-JP')}</p>
                  </div>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleRemoveFavorite(favorite.travelId)}
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
