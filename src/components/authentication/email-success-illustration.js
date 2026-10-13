import { CheckmarkIcon } from '@/icons';
import { useTranslations } from 'next-intl';

const EmailSuccessIllustration = () => {
  const t = useTranslations('common');
  return (
    <div className="w-full max-w-lg">
      <div className="flex flex-col items-center justify-center mb-10">
        <CheckmarkIcon />

        <h1 className="text-2xl font-semibold text-gray-800 mb-3">
          {t("confirmationEmail")}
        </h1>

        <p className="text-gray-600 mb-6">
          {t('Click the link in your email to confirm your account')}
        </p>
      </div>
    </div>
  );
};
export default EmailSuccessIllustration;
