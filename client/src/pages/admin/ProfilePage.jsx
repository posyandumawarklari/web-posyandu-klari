import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { Save, User, Mail, Phone, Lock, Upload, KeyRound } from 'lucide-react';
import { formatDate } from '../../utils/format';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  // Form for Profile Info
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile },
    watch: watchProfile
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });

  const avatarFile = watchProfile('avatar');
  useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const file = avatarFile[0];
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setAvatarPreview(user?.avatar || '');
    }
  }, [avatarFile, user?.avatar]);

  // Form for Change Password
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword
  } = useForm();

  // Mutation: Update Profile
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (data) => {
      // Prepare data
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
      };
      if (data.avatar && data.avatar.length > 0) {
        payload.avatar = data.avatar[0];
      }
      return authService.updateProfile(payload).then(res => res.data.data);
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      toast.success('Profil berhasil diperbarui.');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil.');
    }
  });

  // Mutation: Change Password
  const { mutate: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: (data) => authService.changePassword(data).then(res => res.data),
    onSuccess: () => {
      toast.success('Password berhasil diubah.');
      resetPassword();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal mengubah password.');
    }
  });

  const onSubmitProfile = (data) => {
    updateProfile(data);
  };

  const onSubmitPassword = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok.');
      return;
    }
    changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-heading font-bold text-content dark:text-white tracking-tight">Pengaturan Profil</h1>
        <p className="text-base font-medium text-content-muted dark:text-gray-400 mt-2">
          Kelola informasi profil dan pengaturan keamanan akun Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Information Card */}
        <Card className="border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
          <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-6">
            <CardTitle className="text-xl font-heading font-bold text-content dark:text-white flex items-center gap-3">
              <div className="p-2 bg-primary-50 dark:bg-gray-700 rounded-lg shrink-0">
                <User className="w-5 h-5 text-primary-800 dark:text-primary-400" />
              </div>
              Informasi Profil
            </CardTitle>
            <CardDescription className="text-sm font-medium text-content-muted dark:text-gray-400 mt-1 pl-12">
              Perbarui informasi pribadi dan foto profil Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-8">
              
              {/* Avatar Upload */}
              <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                <div className="w-32 h-32 rounded-3xl bg-surface-100 dark:bg-gray-700 overflow-hidden flex-shrink-0 border-4 border-white dark:border-gray-800 shadow-soft-xl relative group">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-content-muted/50 dark:text-gray-500">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center pointer-events-none">
                     <Upload className="w-6 h-6 text-white mb-1" />
                     <span className="text-white text-xs font-bold">Ubah</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3 text-center sm:text-left pt-2">
                  <label className="block text-sm font-bold text-content dark:text-gray-300">
                    Foto Profil
                  </label>
                  <div className="flex items-center justify-center sm:justify-start">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-surface-200 rounded-xl text-sm font-bold text-content hover:bg-surface-50 hover:border-primary-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:border-primary-400 transition-all shadow-sm hover:shadow">
                      <Upload className="w-4 h-4 text-primary-800 dark:text-primary-400" />
                      <span>Pilih Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...registerProfile('avatar')}
                      />
                    </label>
                  </div>
                  <p className="text-xs font-medium text-content-muted dark:text-gray-400">
                    Disarankan: JPG, PNG, atau GIF. Maks 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nama Lengkap"
                  icon={User}
                  placeholder="Masukkan nama lengkap"
                  error={errorsProfile.name?.message}
                  {...registerProfile('name', { required: 'Nama wajib diisi' })}
                />
                <Input
                  label="Email"
                  type="email"
                  icon={Mail}
                  placeholder="Masukkan email"
                  error={errorsProfile.email?.message}
                  {...registerProfile('email', { 
                    required: 'Email wajib diisi',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Format email tidak valid'
                    }
                  })}
                />
                <Input
                  label="Nomor Telepon"
                  icon={Phone}
                  placeholder="Contoh: 081234567890"
                  error={errorsProfile.phone?.message}
                  {...registerProfile('phone')}
                />
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-content dark:text-gray-300">
                    Role Akun
                  </label>
                  <div className="px-5 py-3 bg-surface-50 dark:bg-gray-700/50 rounded-xl border border-surface-200 dark:border-gray-700 text-content-muted dark:text-gray-400 font-semibold flex items-center h-[46px]">
                    {user?.role === 'ADMIN' ? 'Administrator' : 'Kader Posyandu'}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-surface-100 dark:border-gray-700">
                <div className="text-sm font-medium text-content-muted dark:text-gray-400">
                  Anggota sejak {formatDate(user?.createdAt)}
                </div>
                <Button type="submit" isLoading={isUpdatingProfile} icon={Save} className="w-full sm:w-auto px-8 py-2.5 rounded-xl">
                  Simpan Profil
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
          <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-6">
            <CardTitle className="text-xl font-heading font-bold text-content dark:text-white flex items-center gap-3">
              <div className="p-2 bg-primary-50 dark:bg-gray-700 rounded-lg shrink-0">
                <KeyRound className="w-5 h-5 text-primary-800 dark:text-primary-400" />
              </div>
              Ubah Password
            </CardTitle>
            <CardDescription className="text-sm font-medium text-content-muted dark:text-gray-400 mt-1 pl-12">
              Perbarui password secara berkala untuk menjaga keamanan akun Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-8">
              <div className="space-y-6 max-w-lg">
                <Input
                  label="Password Lama"
                  type="password"
                  icon={Lock}
                  placeholder="Masukkan password saat ini"
                  error={errorsPassword.currentPassword?.message}
                  {...registerPassword('currentPassword', { required: 'Password lama wajib diisi' })}
                />
                <Input
                  label="Password Baru"
                  type="password"
                  icon={Lock}
                  placeholder="Masukkan password baru"
                  error={errorsPassword.newPassword?.message}
                  {...registerPassword('newPassword', { 
                    required: 'Password baru wajib diisi',
                    minLength: {
                      value: 6,
                      message: 'Password minimal 6 karakter'
                    }
                  })}
                />
                <Input
                  label="Konfirmasi Password Baru"
                  type="password"
                  icon={Lock}
                  placeholder="Ulangi password baru"
                  error={errorsPassword.confirmPassword?.message}
                  {...registerPassword('confirmPassword', { required: 'Konfirmasi password wajib diisi' })}
                />
              </div>

              <div className="flex justify-end pt-6 border-t border-surface-100 dark:border-gray-700">
                <Button type="submit" isLoading={isChangingPassword} icon={Save} className="w-full sm:w-auto px-8 py-2.5 rounded-xl">
                  Ubah Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
