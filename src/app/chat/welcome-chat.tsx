import React from "react";

const WelcomeChat = ({
  isUserLoading,
  toggleSidePanel,
}: {
  isUserLoading: boolean;
  toggleSidePanel: () => void;
}) => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Chat-A-Tive</h1>
      <p className="mb-6">
        Select a chat to start messaging or add a user to begin a new
        conversation.
      </p>
      <button
        disabled={isUserLoading}
        onClick={toggleSidePanel}
        className="px-6 py-2 rounded-lg text-white bg-gradient-to-br from-[#6366f1] to-[#4f46e5] hover:bg-indigo-600 focus:outline-none"
      >
        Add a User
      </button>
    </main>
  );
};

export default WelcomeChat;
