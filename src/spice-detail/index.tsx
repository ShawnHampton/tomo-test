import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HeatIcon } from '../components/icons/HeatIcon';
import { BackArrowIcon } from '../components/icons/BackArrowIcon';
import { fetchSpiceById } from '../api/spices';
import tinycolor from 'tinycolor2';
import clsx from "clsx";
import { PageContainer } from '../components/PageContainer';

const SpiceDetail = () => {
  const { id } = useParams();
  
  const { data: spice, isLoading: isPending, isError } = useQuery({
    queryKey: ['spices', id],
    queryFn: () => fetchSpiceById(Number(id)),
    enabled: !!id, // Only run query if id is available
  });
  
  const color = useMemo(() => {
    return tinycolor(spice?.color || '#000000');
  }, [spice?.color]);

  return (
    <PageContainer 
      title="Spice Details" 
      isLoading={isPending} 
      isError={isError}
      errorMessage="Error loading spice. Please try again later."
    >
      <div className="p-6 flex-1 bg-gray-50">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center mb-6">
          <BackArrowIcon />
          Back to Spice List
        </Link>
        
        {spice ? (
          <div className={clsx("bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto", {"text-gray-800": color.isLight(), "text-gray-200": color.isDark()})} style={{backgroundColor: `#${spice.color}` }}>
            <h1 className="text-2xl font-bold mb-4" title={`#${spice.color}`}>{spice.name}</h1>
            
            <div className="space-y-4"> 
              <div className="flex pb-2">
                <span className="font-medium w-1/3">Price:</span>
                <span className="text-green-700 font-bold tracking-widest bg-white w-full px-1">${spice.price}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-1/3">Heat Level:</span>
                <div className="flex items-center bg-white w-full px-1">
                  {[...Array(spice.heat)].map((_, i) => (
                    <HeatIcon key={i} active={true} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700">
            Spice not found
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default SpiceDetail;
