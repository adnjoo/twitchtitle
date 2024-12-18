export const PreviousTitles = ({
  setStreamTitle,
  previousTitles,
  setPreviousTitles,
  setUpdateMessage,
  supabase,
  id,
  setError,
}) => {
  // Function to delete a title
  const deleteTitle = async (titleToDelete: string) => {
    setUpdateMessage(''); // Clear previous messages
    const { error } = await supabase
      .from('stream_titles')
      .delete()
      .match({ user_id: id, title: titleToDelete });

    if (error) {
      console.error('Error deleting title:', error);
      setError('Failed to delete title');
    } else {
      setPreviousTitles((prev) =>
        prev.filter((title) => title !== titleToDelete)
      );
      setUpdateMessage('Title successfully deleted!');
    }
  };

  return (
    <div className='mt-6'>
      <h2 className='mb-2 text-xl font-semibold'>Previous Titles</h2>
      <ul className='list-inside list-disc rounded-lg border bg-white p-4'>
        {previousTitles.length > 0 ? (
          previousTitles.map((title, index) => (
            <li key={index} className='mb-2 flex items-center justify-between'>
              <span
                className='cursor-pointer text-blue-600 hover:underline'
                onClick={() => setStreamTitle(title)}
              >
                {title}
              </span>
              <button
                onClick={() => deleteTitle(title)}
                className='ml-4 rounded bg-red-500 p-1 text-white hover:bg-red-600'
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No previous titles found.</p>
        )}
      </ul>
    </div>
  );
};
