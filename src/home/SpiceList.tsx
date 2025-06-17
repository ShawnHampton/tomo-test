import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Spice } from '../types';

interface Props {
  searchString: string;
}

export const SpiceList = ({ searchString }: Props) => {
  const [spices, setSpices] = useState<Spice[]>([]);

  useEffect(() => {
    async function fetchSpices() {
      const spicesResponse = await fetch('/api/v1/spices');
      const spices = await spicesResponse.json();
      setSpices(spices);
    }
    fetchSpices();
  }, []);

  const filteredSpices = useMemo(() => {
    return spices.filter((spice) =>
      spice.name.toLowerCase().includes(searchString.toLowerCase()),
    );
  }, [spices, searchString]);

  return (
    <div className="flex flex-col gap-1 p-4 w-full h-full overflow-hidden">
      <Header header="Spices">
        {`${filteredSpices.length} / ${spices.length}`}
      </Header>
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto py-2">
        {filteredSpices.length === 0
          ? 'No spices matching the search criteria'
          : filteredSpices.map((spice) => (
              <div key={spice.id} className="py-1 hover:bg-gray-800 hover:text-white transition-colors">
                <Link to={`/spices/${spice.id}`}>{spice.name}</Link>
              </div>
            ))}
      </div>
    </div>
  );
};
