import React from "react";
import moment from "moment";

export interface UserListItemProps {
  userId: string;
  displayName: string;
  unreadCount: number;
  timestamp: Date;
  previewText: string;
  avatarUrl: string;
  isActive?: boolean;
}

const UserListItem = (props: UserListItemProps) => {
  const {
    displayName,
    unreadCount,
    timestamp,
    previewText,
    avatarUrl,
    isActive,
  } = props;
  return (
    <div>
      <div className="flex gap-4 w-full p-4 hover:cursor-pointer border-b-1 border-b-gray-200 hover:bg-gray-100 select-none">
        <div className="w-14 relative">
          <img
            src={avatarUrl}
            alt=""
            className="min-w-14 h-14 object-cover rounded-full"
          />
          {isActive && (
            <span className="w-4 h-4 border-2 border-white rounded-full absolute bottom-0 right-0 bg-green-500"></span>
          )}
        </div>
        <div className="w-full truncate">
          <div className="font-medium mb-1 overflow-hidden text-ellipsis">
            {displayName}
          </div>
          <div className="text-sm text-gray-600 overflow-hidden text-ellipsis">
            {previewText}
          </div>
        </div>
        <div className="w-32">
          <div className="text-xs text-gray-600 mb-2">
            {moment(timestamp).format("ddd, h:m A")}
          </div>
          <div className="flex flex-col justify-end items-end">
            {unreadCount > 0 && (
              <span className="text-xs bg-yellow-500 rounded-2xl px-2 py-0.5 text-white">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
