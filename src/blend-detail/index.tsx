import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchBlendById, fetchBlendSpicesRecursive } from '../api/blends';
import { Header } from '../components/Header';
import { BackArrowIcon } from '../components/icons/BackArrowIcon';
import type { Spice } from '../types';

const BlendDetail = () => {
  const { id } = useParams();

  // Fetch blend details
  const {
    data: blend,
    isLoading: isBlendLoading,
    isError: isBlendError,
  } = useQuery({
    queryKey: ['blend', id],
    queryFn: () => fetchBlendById(Number(id)),
    enabled: !!id, // Only run query if id is available
  });

  // Fetch ALL related spices (including from nested blends) only when blend data is available
  const {
    data: allSpices,
    isLoading: isSpicesLoading,
    isError: isSpicesError,
  } = useQuery({
    queryKey: ['blend-all-spices', id],
    queryFn: () => fetchBlendSpicesRecursive(Number(id)),
    enabled: !!id, // Only run when blend ID is available
  });

  const isPending = isBlendLoading || isSpicesLoading;
  const isError = isBlendError || isSpicesError;

  const sortedSpices = useMemo(() => {
    if (!allSpices) return [];
    // Sort spices by name
    return allSpices.sort((a: Spice, b: Spice) => a.name.localeCompare(b.name));
  }, [allSpices]);

  if (isPending) {
    return (
      <div className="flex flex-col h-full">
        <Header header="Blend Details" />
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full">
        <Header header="Blend Details" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500 text-center">
            Error loading blend. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  // Only render the main content when we have data
  return (
    <div className="flex flex-col h-full">
      <Header header="Blend Details" />

      <div className="p-6 flex-1 bg-gray-50">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 flex items-center mb-6"
        >
          <BackArrowIcon />
          Back to Blend List
        </Link>

        {blend ? (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-amber-800">
              {blend.name}
            </h1>

            {blend.description && (
              <div className="mb-6">
                <p className="text-gray-700 italic">{blend.description}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="pb-2">
                <h2 className="font-medium text-amber-700 mb-2">
                  All spices in this blend (including nested blends):
                </h2>
                {sortedSpices && sortedSpices.length > 0 ? (
                  <ul className="space-y-2">
                    {sortedSpices.map((spice: Spice) => (
                      <li key={spice.id} className="flex items-center">
                        <div
                          className="h-4 w-4 rounded-full mr-2"
                          style={{ backgroundColor: spice.color }}
                        ></div>
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
                  <p className="text-gray-500 italic">
                    No spices found in this blend.
                  </p>
                )}
              </div>

              {blend.blends && blend.blends.length > 0 && (
                <div>
                  <h2 className="font-medium text-amber-700 mb-2">
                    Other blends used:
                  </h2>
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
            Blend not found.
          </div>
        )}
      </div>
    </div>
  );
};

export default BlendDetail;
