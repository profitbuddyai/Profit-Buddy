import { KEEPA_EPOCH_START_MINUTES } from "../Enums/Enums";

export const timeAgo = (inputDate) => {
  const date = new Date(inputDate);
  const now = new Date();
  const diffMs = now - date;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

export const keepaTimeToUnixTime = (keepaMinutes) => {
  const MILLISECONDS_IN_ONE_MINUTE = 60000;
  const abc = (KEEPA_EPOCH_START_MINUTES + keepaMinutes) * MILLISECONDS_IN_ONE_MINUTE;
  return new Date(abc);
};


