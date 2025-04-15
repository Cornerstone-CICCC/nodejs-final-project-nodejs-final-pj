import React from "react";
import UserListItem, { UserListItemProps } from "./UserListItem";

const chatList: UserListItemProps[] = [
  {
    userId: "testId",
    displayName: "Sarah Parker",
    previewText: "See you tomorrow! 👋",
    unreadCount: 2,
    avatarUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
    timestamp: new Date(),
  },
];

const UserList = () => {
  return (
    <div>
      <div className="h-dvh overflow-scroll">
        {chatList.map((chat) => (
          <UserListItem key={chat.userId} {...chat} />
        ))}
      </div>
    </div>
  );
};

export default UserList;
