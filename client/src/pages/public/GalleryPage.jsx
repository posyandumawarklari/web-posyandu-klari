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
    // Tambahkan pt-28 md:pt-36 agar aman dari navbar
    <div className="bg-surface-50 dark:bg-gray-900 min-h-screen pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-content dark:text-white tracking-tight mb-6">
            Galeri Kegiatan
          </h1>
          <p className="text-lg text-content-muted dark:text-gray-400 font-medium">
            Dokumentasi momen-momen penting dari setiap kegiatan yang telah kami selenggarakan.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          // Skeleton juga dibuat ala kolase dengan tinggi yang diacak (h-48, h-64, h-80)
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton 
                key={i} 
                className={`w-full rounded-3xl break-inside-avoid mb-4 sm:mb-6 ${
                  i % 3 === 0 ? 'h-64' : i % 2 === 0 ? 'h-80' : 'h-48'
                }`} 
              />
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
            {/* ── MASONRY / COLLAGE LAYOUT ── */}
            {/* Menggunakan columns-2 (HP), columns-3 (Tablet), columns-4 (PC) */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6">
              {data.data.map((img) => (
                <div 
                  key={img.id} 
                  // break-inside-avoid mencegah elemen terpotong ke kolom sebelahnya
                  // mb-4 sm:mb-6 memberi jarak vertikal antar gambar
                  className="break-inside-avoid mb-4 sm:mb-6 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-surface-200 dark:bg-gray-800 relative group cursor-pointer border border-surface-200 dark:border-gray-700 shadow-soft hover:shadow-soft-xl transition-all"
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={getImageUrl(img.imageUrl)} 
                    alt={img.title} 
                    // h-auto memastikan gambar menyesuaikan proporsi aslinya (kolase)
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  
                  {/* Overlay Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 sm:p-6 lg:p-8">
                    <p className="text-white font-heading font-bold text-base sm:text-lg lg:text-xl line-clamp-3 leading-tight mb-1 sm:mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {img.title}
                    </p>
                    <p className="text-gray-300 font-medium text-xs sm:text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {formatDate(img.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data?.meta?.totalPages > 1 && (
              <div className="mt-16 flex justify-center">
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
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden bg-surface-100 dark:bg-gray-900 flex justify-center shadow-inner border border-surface-200 dark:border-gray-800">
              <img 
                src={getImageUrl(selectedImage.imageUrl)} 
                alt={selectedImage.title}
                className="max-h-[70vh] object-contain" 
              />
            </div>
            <div className="text-center">
              <p className="text-content-muted dark:text-gray-400 font-medium text-sm">
                Diunggah pada {formatDate(selectedImage.createdAt)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}