import { useState } from 'react';
import { Header } from '../components/Header';
import { XCircleIcon } from '../components/XCircleIcon';
import { BlendList } from './BlendList';
import { SpiceList } from './SpiceList';

function Home() {
  const [searchString, setSearchString] = useState('');

  return (
    <div className="flex flex-col h-full">
      <Header header="Tomo's Famous Spice Rack">
        <div className="relative">
          <input
            className="px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchString}
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
            placeholder="Search spices and blends..."
          />
          {searchString && (
            <button
              onClick={() => setSearchString('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Clear search"
            >
              <XCircleIcon />
            </button>
          )}
        </div>
      </Header>
      <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
        <SpiceList searchString={searchString} />
        <BlendList searchString={searchString} />
      </div>
    </div>
  );
}

export default Home;
