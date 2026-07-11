import toast from 'react-hot-toast';

export const handleApiError = (error, defaultMessage = 'Terjadi kesalahan') => {
  // If we don't have an error response (network error, timeout, etc)
  if (!error.response) {
    toast.error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    return;
  }

  const { status, data } = error.response;
  
  // If the server provided a specific message, use it
  if (data && data.message && typeof data.message === 'string') {
    // 500 status code usually shouldn't show exact error message unless mapped in backend
    // But we fixed the backend to return friendly 500 messages, so it's safe to use data.message.
    toast.error(data.message);
    return;
  }

  // Fallbacks based on status code if server didn't provide a message
  switch (status) {
    case 400:
      toast.error('Data yang dikirim tidak valid.');
      break;
    case 401:
      toast.error('Sesi Anda telah berakhir, silakan login kembali.');
      break;
    case 403:
      toast.error('Anda tidak memiliki akses untuk melakukan tindakan ini.');
      break;
    case 404:
      toast.error('Data tidak ditemukan.');
      break;
    case 409:
      toast.error('Terjadi konflik data (Data mungkin sudah ada).');
      break;
    case 413:
      toast.error('Ukuran file terlalu besar.');
      break;
    case 422:
      toast.error('Mohon lengkapi data yang diperlukan dengan benar.');
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      toast.error('Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.');
      break;
    default:
      toast.error(defaultMessage);
  }
};
