import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import MyListings from './pages/MyListings.jsx';
import Profile from './pages/Profile.jsx';
import LoadingMessage from './components/LoadingMessage.jsx';
import { getUsers } from './api/api.js';

export default function App() {
  const [view, setView] = useState('home');
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await getUsers();
        setUsers(res.data);
        if (res.data.length > 0) setCurrentUserId(res.data[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setUsersLoading(false);
      }
    }
    loadUsers();
  }, []);

  const bump = () => setRefreshKey((k) => k + 1);

  if (usersLoading) {
    return (
      <div className="app-shell">
        <LoadingMessage label="Loading Loop…" />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar view={view} onNavigate={setView} users={users} currentUserId={currentUserId} onUserChange={setCurrentUserId} />

      {view === 'home' && <Home currentUserId={currentUserId} refreshKey={refreshKey} onSwapProposed={bump} />}
      {view === 'mine' && <MyListings currentUserId={currentUserId} refreshKey={refreshKey} onChanged={bump} />}
      {view === 'profile' && <Profile currentUserId={currentUserId} refreshKey={refreshKey} />}
    </div>
  );
}