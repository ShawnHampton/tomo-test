import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '../components/PageContainer';
import { BackArrowIcon } from '../components/icons/BackArrowIcon';
import { fetchSpices } from '../api/spices';
import { Spice } from '../types';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import { createBlend } from '../api/blends';

const CreateBlend = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSpiceIds, setSelectedSpiceIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch available spices
  const { 
    data: spices = [],
    isLoading,
    isError 
  } = useQuery({
    queryKey: ['spices'],
    queryFn: fetchSpices
  });
  
  // Create blend mutation
  const { mutate: submitBlend, isPending: isSubmitting } = useMutation({
    mutationFn: createBlend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blends'] });
      navigate('/'); // Redirect to home page after successful creation
    }
  });
  
  // Filter spices based on search term
  const filteredSpices = spices.filter(spice => 
    spice.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Add a spice to the selected list
  const addSpice = (spiceId: number) => {
    if (!selectedSpiceIds.includes(spiceId)) {
      setSelectedSpiceIds([...selectedSpiceIds, spiceId]);
    }
  };
  
  // Remove a spice from the selected list
  const removeSpice = (spiceId: number) => {
    setSelectedSpiceIds(selectedSpiceIds.filter(id => id !== spiceId));
  };
  
  // Get details of selected spices
  const selectedSpices = spices.filter(spice => 
    selectedSpiceIds.includes(spice.id)
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    submitBlend({
      name,
      description,
      spices: selectedSpiceIds,
      blends: [] // No sub-blends in this initial version
    });
  };
  
  return (
    <PageContainer 
      title="Create New Blend" 
      isLoading={isLoading} 
      isError={isError}
      errorMessage="Failed to load spices. Please try again later."
    >
      <div className="p-6 flex-1 bg-gray-50">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center mb-6">
          <BackArrowIcon />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Create New Blend</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Blend Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Add Spices
              </label>
              
              {/* Search for spices */}
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search spices..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Clear search"
                  >
                    <XCircleIcon />
                  </button>
                )}
              </div>
              
              {/* Available spices */}
              <div className="border border-gray-300 rounded-md p-2 mb-4 max-h-48 overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Available Spices</h3>
                {filteredSpices.length === 0 ? (
                  <p className="text-sm text-gray-500">No spices found</p>
                ) : (
                  <ul className="space-y-1">
                    {filteredSpices.map(spice => (
                      <li 
                        key={spice.id} 
                        className="flex justify-between items-center py-1 px-2 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => addSpice(spice.id)}
                      >
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2" 
                            style={{ backgroundColor: spice.color }}
                          />
                          <span>{spice.name}</span>
                          <span className="ml-2 text-xs text-gray-500">{spice.price}</span>
                        </div>
                        <button 
                          type="button" 
                          className="text-blue-600 text-xs hover:text-blue-800 font-medium"
                        >
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Selected spices */}
              <div className="border border-gray-300 rounded-md p-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Spices ({selectedSpices.length})</h3>
                {selectedSpices.length === 0 ? (
                  <p className="text-sm text-gray-500">No spices selected</p>
                ) : (
                  <ul className="space-y-1">
                    {selectedSpices.map(spice => (
                      <li 
                        key={spice.id} 
                        className="flex justify-between items-center py-1 px-2 bg-blue-50 rounded"
                      >
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2" 
                            style={{ backgroundColor: spice.color }}
                          />
                          <span>{spice.name}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeSpice(spice.id)}
                          className="text-red-600 text-xs hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={name.trim() === '' || selectedSpices.length === 0 || isSubmitting}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Blend'}
            </button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

export default CreateBlend;
