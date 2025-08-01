export const playSound = (name: string) => {
  const audio = new Audio(`/assets/dragonTower/${name}.mp3`);
  audio.volume = 0.6;
  audio.play();
};