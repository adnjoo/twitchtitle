import React from 'react';

export default function BlogPage() {
  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <div className='mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-lg'>
        <h1 className='mb-6 text-center text-4xl font-bold text-gray-800'>
          Blog
        </h1>
        <p className='text-center text-lg leading-relaxed text-gray-600'>
          Welcome to our blog! Here you'll find the latest updates, stories, and
          articles. Stay informed and inspired with our curated content.
        </p>
        <div className='mt-10 text-center'>
          <button className='rounded-full bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'>
            Explore Articles
          </button>
        </div>
      </div>
    </div>
  );
}
