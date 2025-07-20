import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Screen, AssetId, ButterflyState, type Assets, type GenerationStatus, type GenerationStatuses } from './types';
import { ASSET_PROMPTS, GAME_PHASES } from './constants';
import { generateImage } from './services/geminiService';
import { ButterflyIcon, CheckCircleIcon, ExclamationCircleIcon, SparklesIcon } from './components/icons';

const Spinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const AssetCard = ({ assetId, name, prompt, imageUrl, status, onGenerate }: { assetId: AssetId, name:string, prompt: string, imageUrl: string | undefined, status: GenerationStatus, onGenerate: () => void }) => {
    return (
        <div className="bg-slate-700/50 rounded-lg p-4 flex flex-col gap-3 transition-all duration-300 ring-2 ring-transparent hover:ring-pink-500/50">
            <div className="flex justify-between items-start gap-3">
                <h3 className="font-bold text-lg text-pink-300">{name}</h3>
                {status === 'DONE' && <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />}
                {status === 'GENERATING' && <Spinner />}
                {status === 'ERROR' && <ExclamationCircleIcon className="w-6 h-6 text-red-400 flex-shrink-0" />}
            </div>
            <p className="text-sm text-slate-400 flex-grow italic">"{prompt}"</p>
            <div className="w-full aspect-square bg-slate-800 rounded-md flex items-center justify-center overflow-hidden">
                {imageUrl ? <img src={imageUrl} alt={name} className="w-full h-full object-cover" /> : <ButterflyIcon className="w-16 h-16 text-slate-600" />}
            </div>
            <button
                onClick={onGenerate}
                disabled={status === 'GENERATING' || status === 'DONE'}
                className="w-full mt-2 bg-pink-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-pink-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
                {status === 'DONE' ? 'Gerado' : 'Gerar'}
                {status !== 'DONE' && <SparklesIcon className="w-5 h-5" />}
            </button>
        </div>
    );
};

const AssetGeneratorScreen = ({ onAssetsReady }: { onAssetsReady: (assets: Assets) => void }) => {
    const [assets, setAssets] = useState<Assets>({});
    const [statuses, setStatuses] = useState<GenerationStatuses>(Object.fromEntries(ASSET_PROMPTS.map(p => [p.id, 'IDLE'])));
    
    const handleGenerateAsset = useCallback(async (asset: typeof ASSET_PROMPTS[0]) => {
        setStatuses(prev => ({ ...prev, [asset.id]: 'GENERATING' }));
        try {
            const imageUrl = await generateImage(asset.prompt);
            setAssets(prev => ({ ...prev, [asset.id]: imageUrl }));
            setStatuses(prev => ({ ...prev, [asset.id]: 'DONE' }));
        } catch (error) {
            console.error(`Failed to generate ${asset.name}:`, error);
            setStatuses(prev => ({ ...prev, [asset.id]: 'ERROR' }));
        }
    }, []);

    const allDone = useMemo(() => Object.values(statuses).every(s => s === 'DONE'), [statuses]);

    return (
        <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-pink-300 font-gaegu">O Espirro da Borboleta</h1>
                    <h2 className="text-xl sm:text-2xl mt-2 text-slate-300">Centro de Geração de Recursos</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-slate-400">
                        Boas-vindas! Este jogo usa a API Gemini para criar sua arte. Clique em 'Gerar' em cada card para criar os recursos visuais necessários para jogar.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {ASSET_PROMPTS.map(p => (
                        <AssetCard
                            key={p.id}
                            assetId={p.id}
                            name={p.name}
                            prompt={p.prompt}
                            imageUrl={assets[p.id]}
                            status={statuses[p.id] || 'IDLE'}
                            onGenerate={() => handleGenerateAsset(p)}
                        />
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => onAssetsReady(assets)}
                        disabled={!allDone}
                        className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:scale-100"
                    >
                        {allDone ? "Iniciar Jogo" : "Gere Todos os Recursos para Começar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const GameScreen = ({ assets, onGameEnd }: { assets: Assets, onGameEnd: () => void }) => {
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [butterflyState, setButterflyState] = useState<ButterflyState>(ButterflyState.Happy);
    const [butterflyPosition, setButterflyPosition] = useState({ x: 100, y: 100 });
    const [dialogue, setDialogue] = useState<string | null>(null);
    const [interactionLock, setInteractionLock] = useState(false);
    const [sneezeParticles, setSneezeParticles] = useState<{ id: number, x: number, y: number }[]>([]);

    const currentPhase = GAME_PHASES[phaseIndex];
    const [flowerAsset, setFlowerAsset] = useState(currentPhase.initialAsset);
    
    useEffect(() => {
        setFlowerAsset(currentPhase.initialAsset);
        setDialogue(null);
    }, [currentPhase]);

    useEffect(() => {
        if (interactionLock) return;
        const handleMouseMove = (e: MouseEvent) => {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setButterflyPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        };
        const gameContainer = document.getElementById('game-canvas-container');
        gameContainer?.addEventListener('mousemove', handleMouseMove);
        return () => gameContainer?.removeEventListener('mousemove', handleMouseMove);
    }, [interactionLock]);

    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

    const handleFlowerClick = async () => {
        if (interactionLock) return;
        
        setInteractionLock(true);
        setDialogue(currentPhase.initialDialogue);
        await sleep(2500);

        setButterflyState(ButterflyState.Sneezing);
        await sleep(500);
        
        // Sneeze particle animation
        const newParticles = Array.from({ length: 15 }).map((_, i) => ({ id: Date.now() + i, x: butterflyPosition.x, y: butterflyPosition.y }));
        setSneezeParticles(newParticles);
        setTimeout(() => setSneezeParticles([]), 1000); // Particles fade out

        await sleep(200);

        setFlowerAsset(currentPhase.reactionAsset);
        setDialogue(currentPhase.reactionDialogue);
        await sleep(2500);

        if (phaseIndex < GAME_PHASES.length - 1) {
            setButterflyState(ButterflyState.Sad);
            await sleep(1500);
            setPhaseIndex(prev => prev + 1);
            setButterflyState(ButterflyState.Happy);
        } else {
            setButterflyState(ButterflyState.Happy);
            await sleep(1000);
            onGameEnd();
        }
        
        setInteractionLock(false);
    };

    const butterflyAsset = {
        [ButterflyState.Happy]: assets[AssetId.ButterflyHappy],
        [ButterflyState.Sneezing]: assets[AssetId.ButterflySneezing],
        [ButterflyState.Sad]: assets[AssetId.ButterflySad],
        [ButterflyState.Surprised]: assets[AssetId.ButterflySurprised],
    }[butterflyState];

    const dist = Math.hypot(butterflyPosition.x - currentPhase.position.x, butterflyPosition.y - currentPhase.position.y);
    const isNearFlower = dist < 100;

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-slate-900 font-gaegu">
            <div id="game-canvas-container" className="relative w-[800px] h-[600px] bg-black cursor-none" style={{ backgroundImage: `url(${assets[currentPhase.backgroundAsset]})`, backgroundSize: 'cover' }}>
                {/* Butterfly */}
                {butterflyAsset && <img src={butterflyAsset} alt="Borboleta" className="absolute w-24 h-24 transition-transform duration-300" style={{ left: butterflyPosition.x - 48, top: butterflyPosition.y - 48, transform: interactionLock ? 'scale(1.1)' : 'scale(1)' }} />}

                {/* Flower */}
                <img 
                    src={assets[flowerAsset]} 
                    alt="Flor" 
                    onClick={handleFlowerClick}
                    className="absolute w-32 h-32 transition-all duration-500" 
                    style={{ 
                        left: currentPhase.position.x - 64, 
                        top: currentPhase.position.y - 64,
                        cursor: isNearFlower ? 'pointer' : 'none',
                        transform: isNearFlower ? 'scale(1.1)' : 'scale(1)',
                        filter: isNearFlower ? 'drop-shadow(0 0 10px #fff)' : 'none'
                    }} 
                />

                {/* Sneeze Particles */}
                {sneezeParticles.map(p => (
                    <img key={p.id} src={assets[AssetId.SneezeParticle]} alt="" className="absolute w-4 h-4 transition-all duration-1000 ease-out" style={{
                        left: p.x,
                        top: p.y,
                        transform: `translate(${currentPhase.position.x - p.x}px, ${currentPhase.position.y - p.y}px) scale(0)`,
                        opacity: 0,
                    }}/>
                ))}

                {/* Dialogue Box */}
                {dialogue && (
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[700px] h-36 bg-no-repeat bg-contain bg-center flex items-center justify-center p-8" style={{ backgroundImage: `url(${assets[AssetId.DialogueBox]})` }}>
                        <p className="text-black text-2xl text-center font-bold animate-pulse">{dialogue}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const EndScreen = ({ assets, onRestart }: { assets: Assets, onRestart: () => void }) => {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-cover bg-center gap-8 p-8 font-gaegu" style={{ backgroundImage: `url(${assets[AssetId.DryFieldBackground]})` }}>
            <h1 className="text-6xl font-bold text-white bg-black/50 p-4 rounded-lg">Fim!</h1>
            <p className="text-3xl text-white bg-black/50 p-4 rounded-lg">Um pouco de gentileza faz tudo florescer.</p>
            <div className="flex items-end gap-4">
                <img src={assets[AssetId.ButterflyHappy]} alt="Borboleta Feliz" className="w-48 h-48" />
                <img src={assets[AssetId.RoseHappy]} alt="Rosa Feliz" className="w-56 h-56" />
            </div>
            <button
                onClick={onRestart}
                className="mt-8 bg-pink-500 text-white font-bold py-3 px-8 rounded-lg text-2xl hover:bg-pink-600 transition-colors transform hover:scale-105"
            >
                Jogar Novamente
            </button>
        </div>
    );
}

function App() {
    const [screen, setScreen] = useState<Screen>(Screen.AssetGeneration);
    const [assets, setAssets] = useState<Assets>({});
    
    const handleAssetsReady = (generatedAssets: Assets) => {
        setAssets(generatedAssets);
        setScreen(Screen.Game);
    };

    const handleGameEnd = () => {
        setScreen(Screen.End);
    };

    const handleRestart = () => {
        setScreen(Screen.AssetGeneration);
        setAssets({});
    };

    switch (screen) {
        case Screen.Game:
            return <GameScreen assets={assets} onGameEnd={handleGameEnd} />;
        case Screen.End:
            return <EndScreen assets={assets} onRestart={handleRestart} />;
        case Screen.AssetGeneration:
        default:
            return <AssetGeneratorScreen onAssetsReady={handleAssetsReady} />;
    }
}

export default App;