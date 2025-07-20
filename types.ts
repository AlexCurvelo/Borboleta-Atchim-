
export enum Screen {
  AssetGeneration,
  Game,
  End,
}

export enum ButterflyState {
  Happy,
  Sneezing,
  Sad,
  Surprised,
}

export enum AssetId {
  ButterflyHappy = 'butterfly_happy',
  ButterflySneezing = 'butterfly_sneezing',
  ButterflySad = 'butterfly_sad',
  ButterflySurprised = 'butterfly_surprised',
  TulipArrogant = 'tulip_arrogant',
  TulipFurious = 'tulip_furious',
  CallaLilyElegant = 'copo_de_leite_elegante',
  CallaLilyIndignant = 'copo_de_leite_indignado',
  RoseSad = 'rosa_triste',
  RoseHappy = 'rosa_feliz',
  GardenBackground = 'fundo_jardim_colorido',
  WhiteGardenBackground = 'fundo_jardim_branco',
  DryFieldBackground = 'fundo_campo_seco',
  DialogueBox = 'caixa_dialogo',
  SneezeParticle = 'particula_espirro',
}

export interface AssetPrompt {
  id: AssetId;
  name: string;
  prompt: string;
}

export interface FlowerData {
  id: string;
  phase: number;
  position: { x: number; y: number };
  initialAsset: AssetId;
  reactionAsset: AssetId;
  backgroundAsset: AssetId;
  initialDialogue: string;
  reactionDialogue: string;
}

export type GenerationStatus = 'IDLE' | 'GENERATING' | 'DONE' | 'ERROR';

export type Assets = Partial<Record<AssetId, string>>;

export type GenerationStatuses = Partial<Record<AssetId, GenerationStatus>>;
