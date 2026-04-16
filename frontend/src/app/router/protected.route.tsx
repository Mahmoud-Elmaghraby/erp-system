import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spin } from 'antd';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
}