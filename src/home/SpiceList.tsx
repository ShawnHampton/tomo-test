import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchSpices } from '../api/spices';
import { Header } from '../components/Header';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

interface Props {
  searchString: string;
}

export const SpiceList = ({ searchString }: Props) => {
  const { isPending, data, isError } = useQuery({
    queryKey: ['spices'],
    queryFn: fetchSpices,
  });

  const filteredSpices = useMemo(() => {
    if (!data) return [];
    return data.filter((spice) =>
      spice.name.toLowerCase().includes(searchString.toLowerCase()),
    );
  }, [data, searchString]);
  if (isPending) {
    return <LoadingState fullHeight={true} />;
  }

  if (isError) {
    return <ErrorState message="Error loading spices. Please try again later." fullHeight={true} />;
  }

  return (
    <div className="flex flex-col gap-1 p-4 w-full h-full overflow-hidden">
      <Header header="Spices">
        {`${filteredSpices.length} / ${data.length}`}
      </Header>
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto py-2">
        {filteredSpices.length === 0
          ? 'No spices matching the search criteria'
          : filteredSpices.map((spice) => (
              <Link key={spice.id} to={`/spices/${spice.id}`}>
                <div className="py-1 hover:bg-gray-800 hover:text-white transition-colors">
                  {spice.name}
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};
