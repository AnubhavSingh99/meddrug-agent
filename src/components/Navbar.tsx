import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  setSidebarOpen: (isOpen: boolean) => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ setSidebarOpen, sidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mock search results based on query
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      // Simulate API call for search results
      const mockResults = [
        { id: 1, type: 'molecule', name: 'Aspirin', path: '/molecule-analysis' },
        { id: 2, type: 'molecule', name: 'Ibuprofen', path: '/molecule-analysis' },
        { id: 3, type: 'protein', name: 'EGFR', path: '/knowledge-base' },
        { id: 4, type: 'disease', name: 'Alzheimer\'s', path: '/graph-discovery' },
        { id: 5, type: 'dataset', name: 'KIBA Dataset', path: '/settings' }
      ].filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Mock notifications
  useEffect(() => {
    setNotifications([
      { 
        id: 1, 
        title: 'Molecular Docking Complete', 
        message: 'Your docking simulation for EGFR inhibitor has completed.',
        time: '10 minutes ago',
        read: false,
        type: 'success'
      },
      { 
        id: 2, 
        title: 'New Dataset Available', 
        message: 'ChEMBL 2023 dataset is now available for integration.',
        time: '2 hours ago',
        read: false,
        type: 'info'
      },
      { 
        id: 3, 
        title: 'Analysis Failed', 
        message: 'ADMET prediction failed due to invalid SMILES string.',
        time: '1 day ago',
        read: false,
        type: 'error'
      },
      { 
        id: 4, 
        title: 'Weekly Report', 
        message: 'Your weekly activity report is ready to view.',
        time: '3 days ago',
        read: true,
        type: 'info'
      }
    ]);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  const handleResultClick = (path: string) => {
    setShowSearchResults(false);
    setSearchQuery('');
    navigate(path);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark all as read when opening
      setUnreadCount(0);
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📌';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button 
          className="sidebar-toggle" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          ☰
        </button>
        <Link to="/" className="logo">
          <h1>MedGraph Agent</h1>
        </Link>
      </div>
      <div className="navbar-center">
        <div className="search-container" ref={searchRef}>
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search compounds, proteins, or diseases..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">🔍</button>
          </form>
          
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(result => (
                <div 
                  key={result.id} 
                  className="search-result-item"
                  onClick={() => handleResultClick(result.path)}
                >
                  <div className="result-icon">
                    {result.type === 'molecule' ? '🧪' : 
                     result.type === 'protein' ? '🧬' : 
                     result.type === 'disease' ? '🏥' : '📊'}
                  </div>
                  <div className="result-details">
                    <div className="result-name">{result.name}</div>
                    <div className="result-type">{result.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="navbar-right">
        <button className="nav-button help-button">
          <span className="button-icon">❓</span>
          <span className="button-text">Help</span>
        </button>
        
        <div className="notification-container" ref={notificationRef}>
          <button 
            className="nav-button notification-button"
            onClick={toggleNotifications}
          >
            <span className="button-icon">🔔</span>
            <span className="button-text">Notifications</span>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                <button className="mark-all-read">Mark all as read</button>
              </div>
              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    >
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{notification.time}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="user-profile">
          <img src="/user-avatar.png" alt="User" className="avatar" />
          <span className="username">Researcher</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 