import { Link } from '@/i18n/navigation';
import NextImage from '../common/nextImage';
import { getAsset } from '@/utils/general';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2 mb-5">
      <NextImage
        src={getAsset('/assets/logo-light-new.svg')}
        alt="Logo"
        width={120}
        height={38}
        className={'w-[75px] md:w-[136px]'}
        priority
      />
    </Link>
  );
};
export default Logo;
