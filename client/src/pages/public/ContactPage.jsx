import React, { useState } from 'react';
import { MapPin, Phone, Mail, User, X, MessageCircle } from 'lucide-react';
import { useSettings, usePublicPosyanduPosts } from '../../hooks/usePublicData';
import Skeleton from '../../components/ui/Skeleton';
import peta from '../../assets/peta.png';

export default function ContactPage() {
  const { data: settings, isLoading: isLoadingSettings } = useSettings();
  const { data: posyanduPosts, isLoading: isLoadingPosyandu } = usePublicPosyanduPosts();
  const [activePin, setActivePin] = useState(null);

  const selectedKader = posyanduPosts?.find((kader) => kader.id === activePin);

  const isLoading = isLoadingSettings || isLoadingPosyandu;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen pt-28 pb-16">
        <Skeleton className="h-10 w-64 mx-auto mb-6 rounded-full" />
        <Skeleton className="h-6 w-11/12 md:w-96 mx-auto mb-16 rounded-full" />
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 mb-16">
          <Skeleton className="aspect-square md:aspect-video w-full lg:flex-1 rounded-3xl" />
          <Skeleton className="h-[400px] w-[380px] xl:w-[420px] 2xl:w-[460px] rounded-3xl hidden lg:block flex-shrink-0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
          <Skeleton className="h-[250px] rounded-3xl" />
          <Skeleton className="h-[250px] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    // FIX 7: Tambahkan padding bawah lebih besar (pb-40, md:pb-20, lg:pb-16)
    <div className="bg-surface-50 dark:bg-gray-900 min-h-screen pt-24 pb-40 md:pt-32 md:pb-20 lg:pb-16 relative overflow-hidden transition-colors duration-300 flex flex-col">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl -z-10"></div>

      {/* SECTION 1: Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12 px-4 sm:px-6 relative z-10">
        <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-content dark:text-white tracking-tight mb-4">
          Hubungi Kami
        </h1>
        <p className="text-base md:text-lg text-content-muted dark:text-gray-400 font-medium leading-relaxed">
          Pilih lokasi posyandu pada peta di bawah ini untuk melihat detail dan menghubungi kader yang bertugas di wilayah Anda.
        </p>
      </div>

      {/* SECTION 2: Map & Contact Card */}
      {/* FIX 4: Container lg:items-stretch diubah menjadi lg:items-start */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center lg:items-start gap-8 z-10 mb-16 md:mb-20">
        
        {/* Container Peta */}
        {/* FIX 6: Map flex-1 min-w-0 */}
        <div className="relative w-full flex-1 min-w-0 bg-white/40 dark:bg-gray-800/20 border border-white/60 dark:border-gray-700/50 shadow-inner rounded-3xl p-4 sm:p-6 flex items-center justify-center overflow-visible">
          
          <div className="relative w-full max-w-2xl lg:max-w-none mx-auto inline-block">
            {/* FIX 6: Map Image max-h-[75vh] object-contain */}
            <img 
              src={peta}
              alt="Peta Wilayah Klari" 
              className="w-full h-auto max-h-[75vh] object-contain block drop-shadow-xl opacity-90 dark:opacity-80"
            />
            {/* Pin Wrapper */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              {!isLoadingPosyandu && posyanduPosts?.map((kader) => (
                <button
                  key={kader.id}
                  className="absolute group z-20 pointer-events-auto focus:outline-none transition-transform duration-300 hover:scale-125 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: kader.mapX, top: kader.mapY }}
                  onClick={() => setActivePin(kader.id)}
                  aria-label={`Lihat info kader ${kader.name}`}
                >
                  {activePin === kader.id ? (
                    <span className="absolute inline-flex h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary-500 opacity-80 animate-ping -left-1 -top-1 sm:-left-1.5 sm:-top-1.5"></span>
                  ) : (
                    <span className="absolute inline-flex h-4 w-4 sm:h-6 sm:w-6 rounded-full bg-primary-500 opacity-50 animate-ping -left-0.5 -top-0.5 group-hover:opacity-100"></span>
                  )}
                  
                  <div className={`relative rounded-full shadow-xl transition-all duration-300 border-2 border-white dark:border-gray-800 ${
                    activePin === kader.id 
                      ? 'w-4 h-4 sm:w-5 sm:h-5 bg-red-500 scale-125' 
                      : 'w-4 h-4 sm:w-5 sm:h-5 bg-primary-600 dark:bg-primary-400 group-hover:bg-blue-500'
                  }`}></div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Container Kartu Kontak */}
        <div
          className="
          w-full
          lg:w-[400px]
          xl:w-[430px]
          2xl:w-[460px]
          lg:flex-shrink-0
          "
        >
          {selectedKader ? (
            <div
              className="
              relative
              
              bg-white/95
              dark:bg-gray-800/95
              
              backdrop-blur-2xl
              
              rounded-3xl
              
              border
              border-white/60
              dark:border-gray-600/40
              
              shadow-[0_20px_60px_rgba(0,0,0,0.18)]
              dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]
              
              p-6
              sm:p-8
              
              overflow-y-auto
              
              max-h-[82vh]
              lg:max-h-none
              
              flex
              flex-col
              "
            >
              
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 pointer-events-none"></div>

              <button 
                onClick={() => setActivePin(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-200 rounded-full transition-all border border-gray-200 dark:border-gray-500/50 z-50 lg:hidden shadow-sm hover:bg-gray-200"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex justify-center mb-8 pt-2 lg:pt-0">
                <div
                  className="
                  inline-flex
                  items-center
                  gap-2
              
                  px-4
                  py-2
              
                  rounded-full
              
                  bg-primary-50
                  dark:bg-primary-900/20
              
                  border
                  border-primary-100
                  dark:border-primary-700/40
              
                  shadow-sm
                  "
                >
                  <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400"/>
                  <span className="text-sm font-bold text-primary-700 dark:text-primary-300">
                    Posyandu {selectedKader.name}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center text-center mb-8 relative z-10 shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/80 dark:bg-gray-700/60 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-4 border border-white dark:border-gray-500/50 shadow-sm">
                  <User className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h4 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 drop-shadow-sm">
                  Ibu {selectedKader.headName}
                </h4>
                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium tracking-wide">Kepala Kader Wilayah</p>
              </div>

              <div className="bg-white dark:bg-gray-900/40 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 mb-6 relative z-10 shrink-0">
                <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-1 font-bold uppercase tracking-wider">Telepon / WhatsApp</p>
                <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                  <div
                    className="
                    w-12
                    h-12

                    rounded-xl

                    bg-primary-50
                    dark:bg-primary-900/20

                    flex
                    items-center
                    justify-center
                    "
                  >
                    <Phone className="w-5 h-5 text-primary-700 dark:text-primary-400" />
                  </div>
                  <span className="text-base sm:text-lg md:text-xl font-bold tracking-wide whitespace-nowrap">{selectedKader.headPhone}</span>
                </div>
              </div>

              <a 
                href={`https://wa.me/${selectedKader.headPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="
                flex
                items-center
                justify-center
                gap-3
              
                w-full
              
                py-4
              
                rounded-2xl
              
                font-bold
              
                text-lg
              
                bg-[#25D366]
                hover:bg-[#20ba59]
              
                text-white
              
                transition-all
              
                active:scale-[0.98]
              
                shadow-lg
                relative z-10 shrink-0
                "
              >
                <MessageCircle className="w-5 h-5" />
                Chat WhatsApp
              </a>
            </div>
          ) : (
            /* Placeholder Card Desktop & Mobile */
            <div
              className="
              flex
              flex-col
              
              justify-center
              items-center
              
              rounded-3xl
              
              border-2
              border-dashed
              border-gray-200
              dark:border-gray-700
              
              bg-white/40
              dark:bg-gray-800/30
              
              backdrop-blur-xl
              
              h-full
              
              p-10
              "
            >
              <div className="p-5 bg-white/30 dark:bg-gray-700/30 rounded-full mb-5">
                <MapPin className="w-10 h-10 text-gray-500 dark:text-gray-400 opacity-70" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Pilih Wilayah</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">Klik salah satu pin pada peta di samping untuk melihat informasi kontak kader posyandu.</p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: Informasi Umum */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full pb-8 relative z-10 mt-auto">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-content dark:text-white mb-3">
            Informasi Umum
          </h2>
          <p className="text-sm md:text-base text-content-muted dark:text-gray-400 font-medium">
            Alamat operasional utama dan surel resmi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl border border-white/60 dark:border-gray-700/40 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-soft-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
            <div className="w-10 h-10 bg-primary-50 dark:bg-gray-700/50 text-primary-700 dark:text-primary-400 rounded-xl flex items-center justify-center mb-4 sm:mb-6 border border-white/40 dark:border-gray-600/30">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-content dark:text-white mb-2">Surel Resmi</h3>
            <p className="text-sm text-content-muted dark:text-gray-400 mb-6 font-medium leading-relaxed">
              Kirimkan surat resmi, kemitraan instansi, atau proposal pengajuan program.
            </p>
            {settings?.email && (
              <a 
                href={`mailto:${settings.email}`} 
                className="mt-auto inline-flex items-center justify-center px-4 py-2.5 bg-surface-100 dark:bg-gray-700 text-content dark:text-gray-200 hover:bg-surface-200 dark:hover:bg-gray-600 font-bold text-sm rounded-xl transition-colors border border-surface-200 dark:border-gray-600/40 break-all"
              >
                {settings.email}
              </a>
            )}
          </div>

          <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl border border-white/60 dark:border-gray-700/40 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-soft-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
            <div className="w-10 h-10 bg-primary-50 dark:bg-gray-700/50 text-primary-700 dark:text-primary-400 rounded-xl flex items-center justify-center mb-4 sm:mb-6 border border-white/40 dark:border-gray-600/30">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-content dark:text-white mb-2">Kunjungi Kami</h3>
            <p className="text-sm text-content-muted dark:text-gray-400 mb-6 font-medium leading-relaxed line-clamp-3">
              {settings?.address || 'Alamat utama kantor kader posyandu wilayah Klari.'}
            </p>
            <a 
              href={`http://maps.google.com/?q=${encodeURIComponent(settings?.address || 'Klari')}`} 
              target="_blank" 
              rel="noreferrer"
              className="mt-auto inline-flex items-center justify-center px-4 py-2.5 bg-surface-100 dark:bg-gray-700 text-content dark:text-gray-200 hover:bg-surface-200 dark:hover:bg-gray-600 font-bold text-sm rounded-xl transition-colors border border-surface-200 dark:border-gray-600/40"
            >
              Lihat di Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}