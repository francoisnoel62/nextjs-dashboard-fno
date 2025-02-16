import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/src/presentation/components/shared/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      {/*<GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />*/}
      <p className="md:text-[40px] text-2xl">Den Zali</p>
    </div>
  );
}
