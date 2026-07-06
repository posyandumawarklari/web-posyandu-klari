import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminArticles } from '../../hooks/useAdminData';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Plus, Edit2, Trash2, FileText, Calendar, Tag } from 'lucide-react';
import { formatDate } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

export default function ArticlesPage() {
  const { user, isAdmin } = useAuth();
  const basePath = isAdmin ? '/admin' : '/dashboard';
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    deleteArticle,
    isDeleting,
  } = useAdminArticles({ page, limit: 10 });

  const handleDelete = (slug) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      deleteArticle(slug);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED': return <Badge variant="success">Dipublikasi</Badge>;
      case 'DRAFT': return <Badge variant="warning">Draft</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const columns = [
    { 
      header: 'Judul Artikel', 
      accessor: (row) => (
        <div className="max-w-md py-1">
          <div className="font-bold text-content dark:text-white line-clamp-1 group-hover:text-primary-800 dark:group-hover:text-primary-400 transition-colors text-base">{row.title}</div>
          <div className="text-sm font-medium text-content-muted dark:text-gray-400 mt-1 line-clamp-1">{row.excerpt}</div>
        </div>
      ) 
    },
    { 
      header: 'Kategori', 
      accessor: (row) => row.category?.name ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-100 dark:bg-gray-800 text-content dark:text-gray-300 font-bold text-xs rounded-lg border border-surface-200 dark:border-gray-700">
          <Tag className="w-3 h-3 text-primary-600" />
          {row.category.name}
        </span>
      ) : <span className="text-content-muted">-</span>
    },
    { header: 'Status', accessor: (row) => getStatusBadge(row.status) },
    { 
      header: 'Tanggal', 
      accessor: (row) => (
        <div className="text-sm font-medium">
          <div className="flex items-center gap-2 text-content dark:text-gray-300"><Calendar className="w-3.5 h-3.5 text-content-muted" /> Buat: {formatDate(row.createdAt)}</div>
          {row.publishDate && <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mt-1.5"><Calendar className="w-3.5 h-3.5 opacity-70" /> Rilis: {formatDate(row.publishDate)}</div>}
        </div>
      ) 
    },
    {
      header: 'Aksi',
      className: 'w-24 text-right',
      accessor: (row) => {
        const canEdit = isAdmin || user?.id === row.author?.id;
        
        if (!canEdit) return <span className="text-content-muted text-sm pr-2">-</span>;

        return (
          <div className="flex items-center justify-end gap-2">
            <Link 
              to={`${basePath}/artikel/${row.slug}/edit`}
              className="p-2 text-content-muted hover:text-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 rounded-xl transition-all"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => handleDelete(row.slug)}
              disabled={isDeleting}
              className="p-2 text-content-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-xl transition-all disabled:opacity-50"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-content dark:text-white tracking-tight">Kelola Artikel</h1>
          <p className="text-base font-medium text-content-muted dark:text-gray-400 mt-2">Tulis dan publikasikan informasi edukasi kesehatan.</p>
        </div>
        <Link to={`${basePath}/artikel/tambah`}>
          <Button leftIcon={<Plus className="w-5 h-5" />} className="px-6 py-2.5 rounded-xl shadow-sm hover:shadow-soft-xl transition-all font-bold">
            Tulis Artikel Baru
          </Button>
        </Link>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-xl border border-surface-200 dark:border-gray-700 overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.data}
          isLoading={isLoading}
          pagination={{
            currentPage: data?.meta?.page || 1,
            totalPages: data?.meta?.totalPages || 1,
            onPageChange: setPage,
          }}
          emptyState={{
            icon: FileText,
            title: 'Tidak ada artikel',
            description: 'Belum ada artikel yang ditulis.',
            action: (
              <Link to={`${basePath}/artikel/tambah`}>
                <Button leftIcon={<Plus className="w-4 h-4" />} variant="outline" className="rounded-xl border-surface-300 dark:border-gray-600">
                  Tulis Artikel Pertama
                </Button>
              </Link>
            )
          }}
        />
      </div>
    </div>
  );
}
