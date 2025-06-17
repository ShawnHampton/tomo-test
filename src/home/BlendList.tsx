import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlends } from '../api/blends';
import { Header } from '../components/Header';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

interface Props {
  searchString: string;
}

export const BlendList = ({ searchString }: Props) => {
  const { isPending, data, isError } = useQuery({
    queryKey: ['blends'],
    queryFn: fetchBlends,
  });

  const filteredBlends = useMemo(() => {
    if (!data) return [];
    return data.filter((blend) =>
      blend.name.toLowerCase().includes(searchString.toLowerCase()),
    );
  }, [data, searchString]);
  if (isPending) {
    return <LoadingState fullHeight={true} />;
  }

  if (isError) {
    return <ErrorState message="Error loading blends. Please try again later." fullHeight={true} />;
  }

  return (
    <div className="flex flex-col gap-1 p-4 w-full h-full overflow-hidden">
      <Header header="Blends">
        {`${filteredBlends.length} / ${data.length}`}
      </Header>

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto py-2">
        {filteredBlends.length === 0
          ? 'No blends matching the search criteria'
          : filteredBlends.map((blend) => (
              <Link key={blend.id} to={`/blends/${blend.id}`}>
                <div className="py-1 hover:bg-gray-800 hover:text-white transition-colors">
                  {blend.name}
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};
