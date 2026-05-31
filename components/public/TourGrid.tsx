import { Map } from 'lucide-react';
import TourCard from './TourCard';
import type { Tour } from '@/types';

interface TourGridProps {
  tours: Tour[];
  emptyMessage?: string;
}

export default function TourGrid({ tours, emptyMessage = 'No tours found.' }: TourGridProps) {
  if (tours.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/40 py-16 text-center">
        <Map className="mb-3 h-10 w-10 text-muted-foreground/60" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tours.map((tour) => (
        <TourCard key={tour._id} tour={tour} />
      ))}
    </div>
  );
}
