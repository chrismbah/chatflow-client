import { Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WelcomeChat = ({
  toggleSidePanel,
  isUserLoading,
}: {
  toggleSidePanel: () => void;
  isUserLoading: boolean;
}) => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <Card className="max-w-lg w-full shadow-md">
        <CardHeader className="flex flex-col items-center">
          <MessageSquare className="h-12 w-12 text-indigo-500 animate-bounce" />
          <CardTitle className="text-3xl font-bold mt-3">
            Welcome to Chat-A-Tive 🎉
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">
            Start a conversation, connect with friends, or meet new people.
            Click the button below to add a user and begin chatting!
          </p>
          <Button
            onClick={toggleSidePanel}
            disabled={isUserLoading}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Users className="mr-2 h-5 w-5" />
            Add users
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default WelcomeChat;
