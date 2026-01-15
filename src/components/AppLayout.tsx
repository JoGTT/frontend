import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import AppRoutes from '../routes/AppRoutes';
import ToastNotifications from './ToastNotifications';
import { SearchProvider } from '../contexts/SearchContext';

const AppLayout = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <div className="App">
            <AppRoutes />
            <ToastNotifications />
          </div>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
};

export default AppLayout;