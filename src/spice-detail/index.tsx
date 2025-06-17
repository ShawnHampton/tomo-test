import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Spice } from '../types';
import { Header } from '../components/Header';
import { HeatIcon } from '../components/HeatIcon';

const SpiceDetail = () => {
  const { id } = useParams();
  const [spice, setSpice] = useState<Spice>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpice() {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/spices/${id}`);
        const spice = await response.json();
        setSpice(spice);
      } catch (error) {
        console.error('Error fetching spice:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpice();
  }, [id]);

  return (
    <div className="flex flex-col h-full">
      <Header header="Spice Details" />
      
      <div className="p-6 flex-1 bg-gray-50">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Spice List
        </Link>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
          </div>
        ) : spice ? (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-amber-800 mb-4">{spice.name}</h1>
            
            <div className="space-y-4">
              <div className="flex border-b pb-2">
                <span className="font-medium text-gray-700 w-1/3">Color:</span>
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full mr-2" style={{ backgroundColor: spice.color }}></div>
                  <span>{spice.color}</span>
                </div>
              </div>
              
              <div className="flex border-b pb-2">
                <span className="font-medium text-gray-700 w-1/3">Price:</span>
                <span className="text-green-700">${spice.price}</span>
              </div>
              
              <div className="flex">
                <span className="font-medium text-gray-700 w-1/3">Heat Level:</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <HeatIcon key={i} active={i < spice.heat} />
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
    </div>
  );
};

export default SpiceDetail;
