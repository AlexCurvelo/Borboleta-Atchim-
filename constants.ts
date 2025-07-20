import { AssetId, type AssetPrompt, type FlowerData } from './types';

export const ASSET_PROMPTS: AssetPrompt[] = [
  {
    id: AssetId.ButterflyHappy,
    name: 'Borboleta Feliz',
    prompt: 'A cute butterfly smiling, looking curious. Children\'s cartoon style, colorful, with soft outlines and clear facial expressions. Transparent background.',
  },
  {
    id: AssetId.ButterflySneezing,
    name: 'Borboleta Espirrando',
    prompt: 'The same cute butterfly with eyes closed, cheeks puffed up, mid-sneeze. Children\'s cartoon style. Transparent background.',
  },
  {
    id: AssetId.ButterflySad,
    name: 'Borboleta Triste',
    prompt: 'The same cute butterfly with a sad, droopy expression. Children\'s cartoon style. Transparent background.',
  },
  {
    id: AssetId.ButterflySurprised,
    name: 'Borboleta Surpresa',
    prompt: 'The same cute butterfly with wide, surprised eyes. Children\'s cartoon style. Transparent background.',
  },
  {
    id: AssetId.TulipArrogant,
    name: 'Tulipa Arrogante',
    prompt: 'A red tulip with a superior, arrogant expression on its face. Children\'s cartoon style. Transparent background.',
  },
  {
    id: AssetId.TulipFurious,
    name: 'Tulipa Furiosa',
    prompt: 'The same red tulip, now looking drenched and with an angry expression. Children\'s cartoon style. Transparent background.',
  },
  {
    id: AssetId.CallaLilyElegant,
    name: 'Copo-de-leite Elegante',
    prompt: 'A white Calla Lily with a noble and elegant expression. Children\'s cartoon style. Transparent background.',
  },
  {
    id: AssetId.CallaLilyIndignant,
    name: 'Copo-de-leite Indignado',
    prompt: 'The same white Calla Lily, now splattered with water and with a shocked, indignant expression. Children\'s cartoon style. Transparent background.',
  },
  {
    id: AssetId.RoseSad,
    name: 'Rosa Triste',
    prompt: 'A red rose with slightly droopy, withered petals and a melancholic expression. Children\'s cartoon style. Transparent background.',
  },
  {
    id: AssetId.RoseHappy,
    name: 'Rosa Feliz',
    prompt: 'The same red rose, now vibrant, with perky petals and a radiant smile. Children\'s cartoon style. Transparent background.',
  },
  {
    id: AssetId.GardenBackground,
    name: 'Jardim Colorido',
    prompt: 'A vibrant garden with many colorful flowers blurred in the background. Children\'s storybook illustration style.',
  },
  {
    id: AssetId.WhiteGardenBackground,
    name: 'Jardim Branco',
    prompt: 'A corner of a garden with predominantly white and pastel-colored flowers. Children\'s storybook illustration style.',
  },
  {
    id: AssetId.DryFieldBackground,
    name: 'Campo Seco',
    prompt: 'A more open field with short, somewhat dry-looking grass. Children\'s storybook illustration style.',
  },
  {
    id: AssetId.DialogueBox,
    name: 'Caixa de Diálogo',
    prompt: 'A simple, cloud-like dialogue box. Clean design suitable for a children\'s game UI. Transparent background.',
  },
  {
    id: AssetId.SneezeParticle,
    name: 'Partícula de Espirro',
    prompt: 'A single, small, shiny droplet of water for a sneeze animation effect. Simple and clean. Transparent background.',
  },
];

export const GAME_PHASES: FlowerData[] = [
  {
    id: 'tulip',
    phase: 1,
    position: { x: 600, y: 400 },
    initialAsset: AssetId.TulipArrogant,
    reactionAsset: AssetId.TulipFurious,
    backgroundAsset: AssetId.GardenBackground,
    initialDialogue: "Hmpf. Cuidado por onde voa, coisinha.",
    reactionDialogue: "Atchim! Você me molhou toda! Que falta de educação!",
  },
  {
    id: 'calla_lily',
    phase: 2,
    position: { x: 200, y: 350 },
    initialAsset: AssetId.CallaLilyElegant,
    reactionAsset: AssetId.CallaLilyIndignant,
    backgroundAsset: AssetId.WhiteGardenBackground,
    initialDialogue: "Nossa, tenha cuidado com minhas pétalas imaculadas.",
    reactionDialogue: "Oh, que indignidade! Estou simplesmente encharcado!",
  },
  {
    id: 'rose',
    phase: 3,
    position: { x: 400, y: 450 },
    initialAsset: AssetId.RoseSad,
    reactionAsset: AssetId.RoseHappy,
    backgroundAsset: AssetId.DryFieldBackground,
    initialDialogue: "Oh... olá. Está tão seco e empoeirado aqui...",
    reactionDialogue: "Oh, obrigada! Seu espirro foi como uma chuva suave! Sinto-me tão revigorada!",
  },
];