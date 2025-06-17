import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlends } from '../api/blends';
import { Header } from '../components/Header';

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
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center">
        Error loading blends. Please try again later.
      </div>
    );
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
              <div
                key={blend.id}
                className="py-1 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <Link to={`/blends/${blend.id}`}>{blend.name}</Link>
              </div>
            ))}
      </div>
    </div>
  );
};
