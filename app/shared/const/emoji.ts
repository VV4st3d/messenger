import type { getTypeOfArrayElements, valueOf } from '../types';

export const stickers = [
  '😀',
  '😂',
  //  '😍,
  '🥰',
  '😎',
  //  '🤓',
  '🥳',
  '🔥',
  '💪',
  '👀',
  //  '❤️,
  //  '💔,
  '💯',
  //  '✨,
  //  '🌟,
  //  '🚀,
  '🎉',
  //  '🍕,
  //  '🍔,
  //  '🍦,
] as const;

export const emojiMap: Record<
  getTypeOfArrayElements<typeof stickers>,
  string
> = {
  '😀': 'Smiley',
  '😂': 'ROFL',
  //   { emoji: '😍', lottieName: '' },
  '🥰': 'Heart_face',
  '😎': 'Cool_emoji',
  //   { emoji: '🤓', lottieName: '' },
  '🥳': 'Party',
  '🔥': 'Fire',
  '💪': 'Muscle',
  '👀': 'Eyes',
  //   { emoji: '❤️', lottieName: '' },
  //   { emoji: '💔', lottieName: '' },
  '💯': '100_Emoji',
  //   { emoji: '✨', lottieName: '' },
  //   { emoji: '🌟', lottieName: '' },
  //   { emoji: '🚀', lottieName: '' },
  '🎉': 'Confetti',
  //   { emoji: '🍕', lottieName: '' },
  //   { emoji: '🍔', lottieName: '' },
  //   { emoji: '🍦', lottieName: '' },
} as const;

export const mapStickerToLottieName = <T extends keyof typeof emojiMap>(
  emoji: T,
): valueOf<typeof emojiMap> => {
  return emojiMap[emoji];
};
