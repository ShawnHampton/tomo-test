import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { BackArrowIcon } from '../components/icons/BackArrowIcon';

const CreateBlend = () => {
  const [name, setName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic functionality - would need to be connected to an API endpoint
    console.log('Creating blend:', { name });
    // TODO: Add actual API call to create a blend
  };

  return (
    <PageContainer 
      title="Create New Blend" 
      isLoading={false} 
      isError={false}
    >
      <div className="p-6 flex-1 bg-gray-50">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center mb-6">
          <BackArrowIcon />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Create New Blend</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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
            
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Blend
            </button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

export default CreateBlend;
