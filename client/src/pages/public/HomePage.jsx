import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Activity, Users, MapPin, Mail, Phone, Info } from 'lucide-react';
import { useHomePage } from '../../hooks/usePublicData';
import Skeleton from '../../components/ui/Skeleton';
import { formatDate, getImageUrl } from '../../utils/format';
import posyandubg from '../../assets/posyandu.jpg';
import React, { useState, useEffect } from 'react';
import HeroSection from '../../components/public/HeroSection';
import ProgramKami from '../../components/public/ProgramKami';
import ArtikelTerbaru from '../../components/public/ArtikelTerbaru';
import GaleriPreview from '../../components/public/GaleriPreview';

export default function HomePage() {
  const { data, isLoading } = useHomePage();

  // ── Skeleton Loader Responsif (Meniru struktur UI asli) ──
  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col min-h-screen bg-surface-50 dark:bg-gray-900 overflow-hidden">
        
        {/* Skeleton Hero Section (Lebih tinggi di HP, standar di Desktop) */}
        <Skeleton className="h-[100vh] lg:h-[800px] w-full rounded-none" />

        {/* Skeleton Wrapper untuk Konten Bawah */}
        <div className="w-full space-y-16 lg:space-y-24 py-16 lg:py-24">
          
          {/* 1. Skeleton Program Layanan */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-5 flex flex-col space-y-6">
              <Skeleton className="h-12 w-3/4 md:w-1/2 lg:w-3/4 rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <div className="space-y-4 pt-4 border-t border-surface-200 dark:border-gray-800">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            </div>
            {/* Kartu Program hanya dirender saat ukuran layar besar (lg) */}
            <div className="hidden lg:block lg:col-span-7">
              <Skeleton className="h-[500px] w-full rounded-[2rem]" />
            </div>
          </div>

          {/* 2. Skeleton Artikel Terbaru */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 lg:space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4 w-full max-w-lg">
                <Skeleton className="h-12 w-2/3 md:w-1/2 rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
              <Skeleton className="hidden md:block h-12 w-40 rounded-full shrink-0" />
            </div>
            
            {/* Simulasi Card Horizontal di HP, Grid 3 Kolom di Desktop */}
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <Skeleton 
                  key={i} 
                  // Lebar tetap di HP (mirip efek snap), adaptif di tablet/desktop
                  className={`h-[400px] lg:h-[460px] rounded-[2rem] shrink-0 w-[85vw] sm:w-[350px] md:w-auto ${i === 3 ? 'hidden lg:block' : ''}`} 
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  const { settings, programs, schedules, latestArticles, galleryPreview } = data || {};

  return (
    // Penambahan overflow-x-hidden sangat penting disini
    // untuk mencegah layout pecah ke kanan akibat animasi transisi atau horizontal scroll
    <div className="flex flex-col min-h-screen bg-surface-50 dark:bg-gray-900 transition-colors overflow-x-hidden">

      <HeroSection settings={settings} schedules={schedules} />

      <ProgramKami programs={programs} />

      <ArtikelTerbaru latestArticles={latestArticles} />

      <GaleriPreview galleryPreview={galleryPreview} />

    </div>
  );
}