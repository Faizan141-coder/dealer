import React from "react";

interface UsernameProps {
  username: string;
}

const Username: React.FC<UsernameProps> = ({ username }) => {
  return (
    <div>
      <h1 className="bg-muted rounded-lg border-b-0 p-2.5 ">
        Welcome: {username}
      </h1>
    </div>
  );
};

export default Username;
