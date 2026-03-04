const notificationMessages = {
  LIKE: ({ userName }) => `${userName} liked your photo.`,

  COMMENT: ({ userName }) => `${userName} commented on your photo.`,

  REPLY: ({ userName }) => `${userName} replied to your comment.`,

  REACTION: ({ userName }) => `${userName} reacted on your photo.`,

  // Shared Album Related Notifications

  SHARED_ALBUM_NAME_UPDATED: ({ userName, albumName }) =>
    `${userName} renamed the shared album "${albumName}".`,

  SHARED_ALBUM_DESC_UPDATED: ({ userName, albumName }) =>
    `${userName} updated the description of the shared album "${albumName}".`,

  SHARED_ALBUM_NAME_DESC_UPDATED: ({ userName, albumName }) =>
    `${userName} updated the name and description of the shared album "${albumName}".`,

  SHARED_ALBUM_UPDATED: ({ userName, albumName }) =>
    `${userName} updated the shared album "${albumName}".`,

  SHARED_ALBUM_CREATED: ({ userName, albumName }) =>
    `${userName} created a new shared album "${albumName}".`,

  SHARED_ALBUM_UPDATED: ({ userName, albumName }) =>
    `${userName} updated the shared album "${albumName}".`,

  SHARED_ALBUM_DELETED: ({ userName, albumName }) =>
    `${userName} deleted the shared album "${albumName}". You no longer have access to this shared album.`,

  SHARED_ALBUM_USER_ADDED: ({ userName, albumName, addedUserName }) =>
    `${userName} added ${addedUserName} to the shared album "${albumName}".`,

  SHARED_ALBUM_USER_REMOVED: ({ userName, albumName, removedUserName }) =>
    `${userName} removed ${removedUserName} from the shared album "${albumName}".`,

  SHARED_ALBUM_CIRCLE_ASSIGNED: ({ userName, albumName, circleName }) =>
    `${userName} assigned the circle "${circleName}" to the shared album "${albumName}".`,

  SHARED_ALBUM_CIRCLE_REMOVED: ({ userName, albumName, circleName }) =>
    `${userName} removed the circle "${circleName}" from the shared album "${albumName}".`,

  SHARED_ALBUM_MEDIA_ADDED: ({ userName, albumName, mediaCount }) =>
    `${userName} added ${mediaCount} media item${
      mediaCount > 1 ? "s" : ""
    } to the shared album "${albumName}".`,

  SHARED_ALBUM_MEDIA_DELETED: ({ userName, albumName, mediaCount }) =>
    `${userName} deleted ${mediaCount} media item${
      mediaCount > 1 ? "s" : ""
    } from the shared album "${albumName}".`,

  SHARED_ALBUM_USER_EXITED: ({ userName, albumName }) =>
    `${userName} left the shared album "${albumName}".`,
};

export const getNotificationMessage = (type, params = {}) =>
  notificationMessages[type]?.(params) || "Unknown notification type.";
