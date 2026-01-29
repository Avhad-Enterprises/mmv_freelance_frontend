import toast from 'react-hot-toast';

const notifySuccess = (message: string) =>
  toast.success(message, {
    position: 'top-right',
    duration: 3000,
  });

const notifyError = (message: string) =>
  toast.error(message, {
    position: 'top-right',
    duration: 3000,
  });

export { notifySuccess, notifyError };


