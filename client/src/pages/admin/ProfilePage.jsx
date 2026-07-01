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
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan Profil</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Kelola informasi profil dan pengaturan keamanan akun Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              Informasi Profil
            </CardTitle>
            <CardDescription>
              Perbarui informasi pribadi dan foto profil Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
              
              {/* Avatar Upload */}
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Foto Profil
                  </label>
                  <div className="flex items-center justify-center sm:justify-start">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Pilih Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...registerProfile('avatar')}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
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
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Role Akun
                  </label>
                  <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-medium">
                    {user?.role === 'ADMIN' ? 'Administrator' : 'Kader Posyandu'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Anggota sejak {formatDate(user?.createdAt)}
                </div>
                <Button type="submit" isLoading={isUpdatingProfile} icon={Save}>
                  Simpan Profil
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-600" />
              Ubah Password
            </CardTitle>
            <CardDescription>
              Perbarui password secara berkala untuk menjaga keamanan akun Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
              <div className="space-y-4 max-w-lg">
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

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="submit" isLoading={isChangingPassword} icon={Save}>
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
