import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useSettings } from '../../hooks/usePublicData';
import Skeleton from '../../components/ui/Skeleton';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';

export default function ContactPage() {
  const { data: settings, isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Skeleton className="h-10 w-64 mb-12" />
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Hubungi Kami
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Ada pertanyaan tentang jadwal, program, atau pendaftaran? Jangan ragu untuk menghubungi kami melalui kontak di bawah ini.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Contact Info */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Informasi Kontak
              </h3>
              
              <ul className="space-y-8">
                {settings?.address && (
                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white mb-1">Alamat Posyandu</p>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{settings.address}</p>
                    </div>
                  </li>
                )}

                {settings?.phone && (
                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white mb-1">Telepon</p>
                      <p className="text-slate-600 dark:text-slate-400">{settings.phone}</p>
                    </div>
                  </li>
                )}

                {settings?.whatsapp && (
                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white mb-1">WhatsApp</p>
                      <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                        +{settings.whatsapp}
                      </a>
                    </div>
                  </li>
                )}

                {settings?.email && (
                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white mb-1">Email</p>
                      <a href={`mailto:${settings.email}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">
                        {settings.email}
                      </a>
                    </div>
                  </li>
                )}
                
              </ul>
            </div>
          </div>

          {/* Contact Form Placeholder */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Kirim Pesan
              </h3>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Fitur kirim pesan akan segera hadir!'); }}>
                <Input label="Nama Lengkap" placeholder="Masukkan nama Anda" required />
                <Input type="email" label="Email" placeholder="Masukkan email Anda" required />
                <Textarea label="Pesan" placeholder="Tulis pesan atau pertanyaan Anda di sini..." required minHeight="150px" />
                <Button type="submit" className="w-full" rightIcon={<Send className="w-4 h-4" />}>
                  Kirim Pesan
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
