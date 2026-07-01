import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminArticles } from '../../hooks/useAdminData';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';
import { formatDate } from '../../utils/format';

export default function ArticlesPage() {
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
        <div className="max-w-md">
          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{row.title}</div>
          <div className="text-xs text-slate-500 mt-1 line-clamp-1">{row.excerpt}</div>
        </div>
      ) 
    },
    { 
      header: 'Kategori', 
      accessor: (row) => row.category?.name ? (
        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-md">
          {row.category.name}
        </span>
      ) : '-'
    },
    { header: 'Status', accessor: (row) => getStatusBadge(row.status) },
    { 
      header: 'Tanggal', 
      accessor: (row) => (
        <div className="text-xs">
          <div className="text-slate-700 dark:text-slate-300 font-medium">Buat: {formatDate(row.createdAt)}</div>
          {row.publishDate && <div className="text-emerald-600 dark:text-emerald-400 mt-0.5">Rilis: {formatDate(row.publishDate)}</div>}
        </div>
      ) 
    },
    {
      header: 'Aksi',
      className: 'w-24 text-right',
      accessor: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link 
            to={`/admin/artikel/${row.slug}/edit`}
            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => handleDelete(row.slug)}
            disabled={isDeleting}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kelola Artikel</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tulis dan publikasikan informasi edukasi kesehatan.</p>
        </div>
        <Link to="/admin/artikel/tambah">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Tulis Artikel
          </Button>
        </Link>
      </div>

      {/* Data Table */}
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
            <Link to="/admin/artikel/tambah">
              <Button leftIcon={<Plus className="w-4 h-4" />} variant="outline">
                Tulis Artikel Pertama
              </Button>
            </Link>
          )
        }}
      />
    </div>
  );
}
