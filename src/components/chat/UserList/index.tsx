import React, { useMemo } from "react";
import UserListItem, { UserListItemProps } from "./UserListItem";

interface UserListProps {
  users: UserListItemProps[];
}

const UserList = (props: UserListProps) => {
  const { users } = props;

  const renderedUserList = useMemo(() => {
    return users.map((chat) => <UserListItem key={chat.userId} {...chat} />);
  }, [users]);

  return (
    <div>
      <div className="h-[calc(100vh-57px)] overflow-scroll">
        {renderedUserList}
      </div>
    </div>
  );
};

export default UserList;
