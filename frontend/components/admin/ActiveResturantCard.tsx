export const ActiveResturantCard = ({ name, createdAt }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="bg-gray-100 border border-gray-300 p-6 rounded-sm">
      <h1 className="font-semibold text-lg primary-text">{name}</h1>
      <p className="text-gray-600 text-sm">{formatDate(createdAt)}</p>
    </div>
  );
};