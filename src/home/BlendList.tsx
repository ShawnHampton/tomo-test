import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Blend } from '../types';
import { Header } from '../components/Header';

interface Props {
  searchString: string;
}

export const BlendList = ({ searchString }: Props) => {
  const [blends, setBlends] = useState<Blend[]>([]);

  useEffect(() => {
    async function fetchBlends() {
      const blendsResponse = await fetch('/api/v1/blends');
      const blends = await blendsResponse.json();
      setBlends(blends);
    }

    fetchBlends();
  }, []);

  const filteredBlends = useMemo(() => {
    return blends.filter((blend) =>
      blend.name.toLowerCase().includes(searchString.toLowerCase()),
    );
  }, [blends, searchString]);

  return (
    <div className="flex flex-col gap-1 p-4 w-full h-full overflow-hidden">
      <Header header="Blends">
        {`${filteredBlends.length} / ${blends.length}`}
      </Header>

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto py-2">
        {filteredBlends.length === 0
          ? 'No blends matching the search criteria'
          : filteredBlends.map((blend) => (
              <div key={blend.id} className="py-1 hover:bg-gray-800 hover:text-white transition-colors">
                <Link to={`/blends/${blend.id}`}>{blend.name}</Link>
              </div>
            ))}
      </div>
    </div>
  );
};
