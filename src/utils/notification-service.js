import { CircleCheck, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export const showToast = (type, message, className) => {

  switch (type) {
    case 'success':
      toast.success(message, {
        icon: <CircleCheck color="#009F2B" />,
        style: {
          backgroundColor: 'color-mix(in srgb, #009F2B, white 95%)',
          border: '1px solid #009F2B',
          maxWidth: 'auto',
          gap: 6,
          borderRadius: 12,
          fontSize: '14px',
          padding: '12px',
          justifyContent: 'center',
        },
        duration: 2000,
      });
      break;
    case 'error':
      toast.error(message, {
        icon: <XCircle className="text-danger w-4 h-4 mr-3" />,
        style: {
          backgroundColor: 'color-mix(in srgb, #f62f30, white 95%)',
          border: '1px solid #f62f30',
          maxWidth: 'auto',
          gap: 2,
          borderRadius: 12,
          fontSize: '14px',
          padding: '12px',
          justifyContent: 'center',
        },
        duration: 2000,
      });
      break;
    case 'info':
      toast.info(message);
      break;
    case 'warning':
      toast.warning(message);
      break;
    default:
      toast(message);
  }
};
