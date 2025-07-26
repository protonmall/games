export const playSound = (path: string) => {
  const audio = new Audio(path);
  audio.play().catch((e) => {
    console.warn('Audio play failed:', e);
  });
};