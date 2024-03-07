import GearsSpinner from '@/components/Loaders/GearsSpinner';

export default function Loading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <GearsSpinner />
    </div>
  );
}
