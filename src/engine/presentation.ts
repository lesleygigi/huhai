import assets from "../../data/assets.json";
import {
  parseStoryTags,
  type PortraitPosition,
  type StoryTag,
} from "./tags";

export type { PortraitPosition };

export type PortraitState = {
  character: string;
  expression: string;
};

export type PresentationState = {
  background?: string;
  portraits: Record<PortraitPosition, PortraitState | null>;
  music?: string;
  sfxQueue: string[];
  fade?: string;
  shake?: string;
};

export type ResolvedPresentationState = PresentationState & {
  backgroundPath?: string;
  musicPath?: string;
  sfxPaths: string[];
  portraitPaths: Record<PortraitPosition, string | undefined>;
};

export const initialPresentationState: PresentationState = {
  portraits: {
    left: null,
    center: null,
    right: null,
  },
  sfxQueue: [],
};

export function applyStoryTags(
  state: PresentationState,
  rawTags: string[]
): PresentationState {
  const next: PresentationState = {
    ...state,
    portraits: { ...state.portraits },
    sfxQueue: [],
    fade: undefined,
    shake: undefined,
  };

  for (const tag of parseStoryTags(rawTags)) {
    applyStoryTag(next, tag);
  }

  return next;
}

export function resolvePresentationState(
  state: PresentationState
): ResolvedPresentationState {
  return {
    ...state,
    backgroundPath: state.background
      ? assets.backgrounds[state.background as keyof typeof assets.backgrounds]
      : undefined,
    musicPath: state.music
      ? assets.music[state.music as keyof typeof assets.music]
      : undefined,
    sfxPaths: state.sfxQueue
      .map((id) => assets.sfx[id as keyof typeof assets.sfx])
      .filter(Boolean),
    portraitPaths: {
      left: getPortraitPath(state.portraits.left),
      center: getPortraitPath(state.portraits.center),
      right: getPortraitPath(state.portraits.right),
    },
  };
}

function applyStoryTag(state: PresentationState, tag: StoryTag): void {
  switch (tag.type) {
    case "bg":
      state.background = tag.id;
      break;
    case "show":
      if (tag.character) {
        state.portraits[tag.position] = {
          character: tag.character,
          expression: tag.expression,
        };
      }
      break;
    case "hide":
      hidePortrait(state, tag.character);
      break;
    case "music":
      state.music = tag.id;
      break;
    case "sfx":
      state.sfxQueue.push(tag.id);
      break;
    case "fade":
      state.fade = tag.color;
      break;
    case "shake":
      state.shake = tag.intensity;
      break;
    case "unknown":
      break;
  }
}

function hidePortrait(state: PresentationState, character: string): void {
  for (const position of Object.keys(state.portraits) as PortraitPosition[]) {
    if (state.portraits[position]?.character === character) {
      state.portraits[position] = null;
    }
  }
}

function getPortraitPath(portrait: PortraitState | null): string | undefined {
  if (!portrait) {
    return undefined;
  }

  const characterAssets =
    assets.portraits[portrait.character as keyof typeof assets.portraits];

  return characterAssets?.[portrait.expression as keyof typeof characterAssets];
}
