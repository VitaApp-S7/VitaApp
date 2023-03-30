import * as Notifications from "expo-notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useNotificationUpdater = () => {
  const [notification, setNotification] =
    useState<Notifications.Notification>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (notification === null) return;

    const title = notification.request.content.title;

    if (title.includes("news") || title.includes("News")) {
      queryClient.invalidateQueries(["news"]);
    }
    if (title.includes("event") || title.includes("Event")) {
      queryClient.invalidateQueries(["events"]);
    }
    if (title.includes("request") || title.includes("Request")) {
      queryClient.invalidateQueries(["friends"]);
      if (title.includes("new") || title.includes("New")) {
        queryClient.invalidateQueries(["friendRequests"]);
      }
      if (title.includes("accepted") || title.includes("Accepted")) {
        queryClient.invalidateQueries(["invites"]);
      }
    }
  }, [notification]);

  return {
    notification,
    setNotification,
  };
};

export default useNotificationUpdater