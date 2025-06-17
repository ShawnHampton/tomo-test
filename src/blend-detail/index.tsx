import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Blend, Spice } from '../types';
import { Header } from '../components/Header';
import { BackArrowIcon } from '../components/BackArrowIcon';

const BlendDetail = () => {
  const { id } = useParams();
  const [blend, setBlend] = useState<Blend>();
  const [spices, setSpices] = useState<Spice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlend() {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/blends/${id}`);
        const blend = await response.json();
        setBlend(blend);
        
        // Fetch related spices
        if (blend.spices && blend.spices.length > 0) {
          const spicePromises = blend.spices.map((spiceId: number) => 
            fetch(`/api/v1/spices/${spiceId}`).then(res => res.json())
          );
          const spiceData = await Promise.all(spicePromises);
          setSpices(spiceData);
        }
      } catch (error) {
        console.error('Error fetching blend:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlend();
  }, [id]);

  return (
    <div className="flex flex-col h-full">
      <Header header="Blend Details" />
      
      <div className="p-6 flex-1 bg-gray-50">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center mb-6">
          <BackArrowIcon />
          Back to Blend List
        </Link>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
          </div>
        ) : blend ? (
          <div className={`bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto`}>
            <h1 className="text-2xl font-bold mb-4 text-amber-800">{blend.name}</h1>
            
            {blend?.description && (
              <div className="mb-6">
                <p className="text-gray-700 italic">{blend.description}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="pb-2">
                <h2 className="font-medium text-amber-700 mb-2">Spices in this blend:</h2>
                {spices.length > 0 ? (
                  <ul className="space-y-2">
                    {spices.map(spice => (
                      <li key={spice.id} className="flex items-center">
                        <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: spice.color }}></div>
                        <Link 
                          to={`/spices/${spice.id}`} 
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {spice.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No spices found in this blend.</p>
                )}
              </div>
              
              {blend?.blends && blend.blends.length > 0 && (
                <div>
                  <h2 className="font-medium text-amber-700 mb-2">Other blends used:</h2>
                  <div className="flex flex-wrap gap-2">
                    {blend.blends.map((blendId: number) => (
                      <Link 
                        key={blendId}
                        to={`/blends/${blendId}`}
                        className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm hover:bg-amber-200"
                      >
                        Blend #{blendId}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700">
            Blend not found
          </div>
        )}
      </div>
    </div>
  );
};

export default BlendDetail;
