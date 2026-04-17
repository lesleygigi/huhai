import { Story } from "inkjs";

export type StoryChoice = {
  index: number;
  text: string;
};

export type StorySnapshot = {
  lines: string[];
  choices: StoryChoice[];
  tags: string[];
  variables: Record<string, unknown>;
};

export type StoryRuntime = {
  getSnapshot: () => StorySnapshot;
  choose: (index: number) => StorySnapshot;
  jumpTo: (path: string) => StorySnapshot;
  restart: () => StorySnapshot;
  toJson: () => string;
  loadJson: (stateJson: string) => StorySnapshot;
};

const storyJsonPath = "/story/main.json";

const trackedVariables = [
  "cruelty",
  "prestige",
  "fear",
  "zhao_gao",
  "clan_support",
  "ziying",
  "zhang_han",
  "meng_yi",
  "fusu",
  "strategy",
  "zhao_gao_evidence",
  "flags",
  "chapter_name",
  "scene_name",
] as const;

export async function loadStory(): Promise<StoryRuntime> {
  const response = await fetch(storyJsonPath);

  if (!response.ok) {
    throw new Error(`Failed to load ${storyJsonPath}: ${response.status}`);
  }

  return createStoryRuntime(await response.text());
}

export function createStoryRuntime(storyJson: Record<string, unknown> | string): StoryRuntime {
  const story =
    typeof storyJson === "string"
      ? new Story(stripByteOrderMark(storyJson))
      : new Story(storyJson);
  let snapshot = continueToChoice(story);

  return {
    getSnapshot: () => snapshot,
    choose: (index: number) => {
      story.ChooseChoiceIndex(index);
      snapshot = continueToChoice(story);
      return snapshot;
    },
    jumpTo: (path: string) => {
      story.ChoosePathString(path);
      snapshot = continueToChoice(story);
      return snapshot;
    },
    restart: () => {
      story.ResetState();
      snapshot = continueToChoice(story);
      return snapshot;
    },
    toJson: () => story.state.ToJson(),
    loadJson: (stateJson: string) => {
      story.state.LoadJson(stateJson);
      snapshot = continueToChoice(story);
      return snapshot;
    },
  };
}

function stripByteOrderMark(text: string): string {
  return text.replace(/^\uFEFF/, "");
}

function continueToChoice(story: Story): StorySnapshot {
  const lines: string[] = [];
  const tags: string[] = [];

  while (story.canContinue) {
    const line = story.Continue();

    if (line?.trim()) {
      lines.push(line.trim());
    }

    if (story.currentTags) {
      tags.push(...story.currentTags);
    }
  }

  return {
    lines,
    choices: story.currentChoices.map((choice, index) => ({
      index,
      text: choice.text,
    })),
    tags,
    variables: getVariables(story),
  };
}

function getVariables(story: Story): Record<string, unknown> {
  return Object.fromEntries(
    trackedVariables.map((name) => [name, story.variablesState.$(name)])
  );
}
