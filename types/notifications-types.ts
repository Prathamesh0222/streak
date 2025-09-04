export function getNotificationImage(type: string) {
  switch (type) {
    case "XP_GAINED":
      return {
        src: "/xp_gif.gif",
        alt: "XP",
      };
    case "LEVEL_UP":
      return {
        src: "/level_up.gif",
        alt: "Level Up",
      };
    case "ALL_HABITS_COMPLETED":
      return {
        src: "/all_done_gif.gif",
        alt: "All Done",
      };
    default:
      return null;
  }
}
