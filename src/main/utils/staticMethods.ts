export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getFormattedTime(time: number): string {
  let totalSeconds = (time / 1000);
  const days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  let uptime = `${seconds}s`;

  if (days >= 1) {
    uptime = `${days}d, ${hours}h, ${minutes}m`;
  } else if (hours >= 1) {
    uptime = `${hours}h, ${minutes}m, ${seconds}s`;
  } else if (minutes >= 1) {
    uptime = `${minutes}m, ${seconds}s`;
  }

  return uptime;
}
