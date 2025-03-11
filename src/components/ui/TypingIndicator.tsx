const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 p-2">
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
};

export default TypingIndicator;
