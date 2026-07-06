import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-[2rem] shadow-soft-xl border border-surface-200 dark:border-gray-700 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 dark:bg-red-900/10 rounded-bl-[4rem] -z-0"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <AlertTriangle className="w-10 h-10" />
              </div>
              
              <h1 className="text-2xl font-heading font-bold text-content dark:text-white mb-2">Terjadi Kesalahan</h1>
              <p className="text-sm font-medium text-content-muted dark:text-gray-400 mb-8">
                Maaf, aplikasi mengalami masalah yang tidak terduga. Silakan muat ulang halaman atau kembali ke beranda.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-primary-800 hover:bg-primary-900 text-white font-bold rounded-xl transition-all shadow-sm"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Muat Ulang Halaman
                </button>
                
                <Link
                  to="/"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-surface-100 hover:bg-surface-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-content dark:text-white font-bold rounded-xl transition-all"
                  onClick={() => this.setState({ hasError: false })}
                >
                  <Home className="w-5 h-5" />
                  Kembali ke Beranda
                </Link>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-8 text-left bg-surface-100 dark:bg-gray-900 p-4 rounded-xl overflow-auto text-xs font-mono text-content-muted dark:text-gray-400">
                  <p className="font-bold text-red-500 mb-2">{this.state.error.toString()}</p>
                  <pre>{this.state.errorInfo?.componentStack}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
