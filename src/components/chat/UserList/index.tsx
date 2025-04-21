import React from "react";
import UserListItem, { UserListItemProps } from "./UserListItem";

interface UserListProps {
  users: UserListItemProps[];
}

const UserList = (props: UserListProps) => {
  const { users } = props;
  return (
    <div>
      <div className="h-[calc(100vh-57px)] overflow-scroll">
        {users.map((chat) => (
          <UserListItem key={chat.userId} {...chat} />
        ))}
      </div>
    </div>
  );
};

export default UserList;
