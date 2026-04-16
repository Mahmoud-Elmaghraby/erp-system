import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import arEG from 'antd/locale/ar_EG';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/app.router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ConfigProvider locale={arEG} direction="rtl">
            <AppRouter />
          </ConfigProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}