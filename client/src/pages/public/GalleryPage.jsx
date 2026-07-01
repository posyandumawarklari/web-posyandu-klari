import { useState } from 'react';
import { usePublicGallery } from '../../hooks/usePublicData';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import { getImageUrl, formatDate } from '../../utils/format';
import { Image as ImageIcon } from 'lucide-react';

export default function GalleryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePublicGallery({ page, limit: 12 });
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Galeri Kegiatan
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Dokumentasi momen-momen penting dari setiap kegiatan yang telah kami selenggarakan.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        ) : !data?.data || data.data.length === 0 ? (
          <EmptyState 
            icon={ImageIcon} 
            title="Galeri kosong" 
            description="Belum ada foto kegiatan yang diunggah saat ini." 
          />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {data.data.map((img) => (
                <div 
                  key={img.id} 
                  className="aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative group cursor-pointer shadow-sm border border-slate-200 dark:border-slate-700"
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={getImageUrl(img.imageUrl)} 
                    alt={img.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5">
                    <p className="text-white font-semibold text-sm sm:text-base line-clamp-2 leading-tight mb-1">
                      {img.title}
                    </p>
                    <p className="text-slate-300 text-xs">
                      {formatDate(img.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data?.meta?.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination 
                  currentPage={data.meta.page}
                  totalPages={data.meta.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      <Modal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)}
        title={selectedImage?.title || 'Detail Foto'}
        maxWidth="max-w-4xl"
      >
        {selectedImage && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex justify-center">
              <img 
                src={getImageUrl(selectedImage.imageUrl)} 
                alt={selectedImage.title}
                className="max-h-[60vh] object-contain" 
              />
            </div>
            <div className="text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Diunggah pada {formatDate(selectedImage.createdAt)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
