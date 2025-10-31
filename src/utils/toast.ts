import { toast } from 'react-toastify';

const notifySuccess = (message: string) =>
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true, 
    draggable: true,
    progress: undefined,
  });

const notifyError = (message: string) =>
  toast.error(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export { notifySuccess, notifyError };

