'use client'

/**
 * DemoOrchestrator - Mode "Watch Me Work"
 * 
 * Composant qui orchestre une démonstration automatique de TRESORIS.
 * Au clic, lance une séquence scénarisée où l'agent :
 * 1. Démarre en mode surveillance
 * 2. Scanne le portfolio automatiquement
 * 3. Détecte un risque (simulé)
 * 4. Lance une analyse complète
 * 5. Génère des recommandations
 * 6. Attend la validation DAF
 * 
 * Objectif : Impressionner en 60 secondes avec ZÉRO action utilisateur
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Play,
    Pause,
    RotateCcw,
    Eye,
    Zap,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Shield,
    Clock,
    Brain
} from 'lucide-react'

interface DemoStep {
    id: string
    delay: number // ms depuis le début
    type: 'narration' | 'action' | 'detection' | 'analysis' | 'recommendation'
    title: string
    description: string
    highlight?: string // élément à mettre en surbrillance
}

interface DemoOrchestratorProps {
    onStartDemo?: () => void
    onStopDemo?: () => void
    onSimulateRisk?: (clientName: string, amount: number, daysOverdue: number) => Promise<void>
    className?: string
}

// Scénario de démonstration (60 secondes)
const DEMO_SCENARIO: DemoStep[] = [
    {
        id: 'start',
        delay: 0,
        type: 'narration',
        title: 'Agent TRESORIS activé',
        description: 'L\'agent démarre en mode surveillance autonome...',
    },
    {
        id: 'monitoring',
        delay: 2000,
        type: 'narration',
        title: 'Surveillance active',
        description: 'Analyse de 85 clients et 234 factures en cours...',
    },
    {
        id: 'scan1',
        delay: 5000,
        type: 'action',
        title: 'Scan portfolio',
        description: 'Vérification des patterns de paiement...',
    },
    {
        id: 'detection1',
        delay: 8000,
        type: 'detection',
        title: 'Signal faible détecté',
        description: 'TechCorp Industries : retard de paiement +12 jours vs moyenne',
    },
    {
        id: 'analysis_start',
        delay: 11000,
        type: 'action',
        title: 'Analyse approfondie',
        description: 'Activation des 6 moteurs d\'analyse...',
    },
    {
        id: 'engine1',
        delay: 13000,
        type: 'analysis',
        title: 'Moteur Patterns',
        description: 'Tendance négative confirmée : +2j/mois depuis 4 mois',
    },
    {
        id: 'engine2',
        delay: 15000,
        type: 'analysis',
        title: 'Moteur Scoring',
        description: 'Rating dégradé : B → C (risque en hausse)',
    },
    {
        id: 'engine3',
        delay: 17000,
        type: 'analysis',
        title: 'Moteur Cash-flow',
        description: 'Impact potentiel : -2.3 semaines de runway',
    },
    {
        id: 'risk_critical',
        delay: 20000,
        type: 'detection',
        title: 'RISQUE CRITIQUE DÉTECTÉ',
        description: 'TechCorp : 68 000€ avec probabilité de défaut 73%',
    },
    {
        id: 'actions',
        delay: 23000,
        type: 'recommendation',
        title: 'Actions générées',
        description: 'P1: Relance urgente • P2: Négocier échéancier • P3: Audit crédit',
    },
    {
        id: 'waiting',
        delay: 26000,
        type: 'narration',
        title: 'Attente validation DAF',
        description: 'L\'agent attend votre décision avant d\'agir...',
    },
    {
        id: 'complete',
        delay: 30000,
        type: 'narration',
        title: 'Démo terminée',
        description: 'Vous avez vu TRESORIS détecter un risque et proposer des actions',
    },
]

export default function DemoOrchestrator({
    onStartDemo,
    onStopDemo,
    onSimulateRisk,
    className = ''
}: DemoOrchestratorProps) {
    const [isRunning, setIsRunning] = useState(false)
    const [currentStep, setCurrentStep] = useState<DemoStep | null>(null)
    const [completedSteps, setCompletedSteps] = useState<string[]>([])
    const [progress, setProgress] = useState(0)
    const timeoutsRef = useRef<NodeJS.Timeout[]>([])
    const startTimeRef = useRef<number>(0)
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // Nettoyage des timeouts
    const clearAllTimeouts = useCallback(() => {
        timeoutsRef.current.forEach(clearTimeout)
        timeoutsRef.current = []
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
            progressIntervalRef.current = null
        }
    }, [])

    // Démarrer la démo
    const startDemo = useCallback(async () => {
        setIsRunning(true)
        setCompletedSteps([])
        setProgress(0)
        startTimeRef.current = Date.now()
        
        // Appeler l'API pour démarrer l'agent
        onStartDemo?.()

        // Barre de progression
        const totalDuration = DEMO_SCENARIO[DEMO_SCENARIO.length - 1].delay + 2000
        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current
            setProgress(Math.min((elapsed / totalDuration) * 100, 100))
        }, 100)

        // Programmer chaque étape
        DEMO_SCENARIO.forEach((step) => {
            const timeout = setTimeout(() => {
                setCurrentStep(step)
                setCompletedSteps(prev => [...prev, step.id])

                // Trigger simulation si c'est l'étape de risque critique
                if (step.id === 'risk_critical' && onSimulateRisk) {
                    onSimulateRisk('TechCorp Industries', 68000, 45)
                }
            }, step.delay)
            timeoutsRef.current.push(timeout)
        })

        // Fin de la démo
        const endTimeout = setTimeout(() => {
            setIsRunning(false)
            clearAllTimeouts()
        }, DEMO_SCENARIO[DEMO_SCENARIO.length - 1].delay + 3000)
        timeoutsRef.current.push(endTimeout)
    }, [onStartDemo, onSimulateRisk, clearAllTimeouts])

    // Arrêter la démo
    const stopDemo = useCallback(() => {
        clearAllTimeouts()
        setIsRunning(false)
        setCurrentStep(null)
        setProgress(0)
        onStopDemo?.()
    }, [clearAllTimeouts, onStopDemo])

    // Reset
    const resetDemo = useCallback(() => {
        stopDemo()
        setCompletedSteps([])
    }, [stopDemo])

    // Cleanup on unmount
    useEffect(() => {
        return () => clearAllTimeouts()
    }, [clearAllTimeouts])

    // Icône selon le type
    const getStepIcon = (type: DemoStep['type']) => {
        switch (type) {
            case 'detection': return <AlertTriangle className="w-5 h-5" />
            case 'analysis': return <Brain className="w-5 h-5" />
            case 'recommendation': return <CheckCircle2 className="w-5 h-5" />
            case 'action': return <Zap className="w-5 h-5" />
            default: return <Eye className="w-5 h-5" />
        }
    }

    // Couleur selon le type
    const getStepColor = (type: DemoStep['type']) => {
        switch (type) {
            case 'detection': return 'bg-amber-500 text-amber-50'
            case 'analysis': return 'bg-blue-500 text-blue-50'
            case 'recommendation': return 'bg-emerald-500 text-emerald-50'
            case 'action': return 'bg-purple-500 text-purple-50'
            default: return 'bg-slate-600 text-slate-50'
        }
    }

    return (
        <div className={`relative ${className}`}>
            {/* Bouton Principal */}
            <div className="flex items-center justify-center gap-4 mb-6">
                {!isRunning ? (
                    <motion.button
                        onClick={startDemo}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
                    >
                        <div className="relative">
                            <Play className="w-6 h-6" />
                            <motion.span
                                className="absolute inset-0 rounded-full bg-white/30"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                        <span>Lancer la démo automatique</span>
                        <Sparkles className="w-5 h-5 text-emerald-200" />
                    </motion.button>
                ) : (
                    <div className="flex items-center gap-3">
                        <motion.button
                            onClick={stopDemo}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all"
                        >
                            <Pause className="w-5 h-5" />
                            Arrêter
                        </motion.button>
                        <motion.button
                            onClick={resetDemo}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-all"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Reset
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Indicateur DEMO EN COURS */}
            {isRunning && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl" />
                    <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 180, 360]
                                    }}
                                    transition={{ 
                                        duration: 2, 
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                                >
                                    <Sparkles className="w-6 h-6 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-white font-bold text-xl flex items-center gap-2">
                                        Watch Me Work
                                        <motion.span
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="inline-block w-3 h-3 bg-white rounded-full"
                                        />
                                    </h3>
                                    <p className="text-emerald-100 text-sm">Agent TRESORIS en démonstration autonome</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-white/90 text-sm mb-1">Progression</div>
                                <div className="text-white font-bold text-2xl">{Math.round(progress)}%</div>
                            </div>
                        </div>
                        <div className="mt-4 h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                className="h-full bg-white rounded-full shadow-lg"
                                style={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Narration en temps réel - VERSION ULTRA VISIBLE */}
            <AnimatePresence mode="wait">
                {currentStep && (
                    <motion.div
                        key={currentStep.id}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                        className="relative mb-6"
                    >
                        {/* Glow effect behind */}
                        <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-30 ${
                            currentStep.type === 'detection' 
                                ? 'bg-amber-400' 
                                : currentStep.type === 'recommendation'
                                ? 'bg-emerald-400'
                                : currentStep.type === 'analysis'
                                ? 'bg-blue-400'
                                : 'bg-purple-400'
                        }`} />
                        
                        {/* Main card */}
                        <motion.div
                            animate={{ 
                                boxShadow: currentStep.type === 'detection' 
                                    ? ['0 10px 40px rgba(245, 158, 11, 0.3)', '0 10px 60px rgba(245, 158, 11, 0.5)', '0 10px 40px rgba(245, 158, 11, 0.3)']
                                    : '0 10px 40px rgba(0, 0, 0, 0.1)'
                            }}
                            transition={{ duration: 1.5, repeat: currentStep.type === 'detection' ? Infinity : 0 }}
                            className={`relative p-8 rounded-3xl border-3 ${
                                currentStep.type === 'detection' 
                                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300' 
                                    : currentStep.type === 'recommendation'
                                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'
                                    : currentStep.type === 'analysis'
                                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
                                    : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300'
                            }`}
                        >
                            <div className="flex items-start gap-5">
                                {/* Icon with animation */}
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                        rotate: currentStep.type === 'action' ? [0, 5, -5, 0] : 0
                                    }}
                                    transition={{ duration: 0.6, repeat: Infinity }}
                                    className={`p-4 rounded-2xl shadow-lg ${getStepColor(currentStep.type)}`}
                                >
                                    {getStepIcon(currentStep.type)}
                                </motion.div>
                                
                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="font-black text-2xl text-slate-900 mb-2 flex items-center gap-3">
                                        {currentStep.title}
                                        <ArrowRight className="w-5 h-5 text-slate-400" />
                                    </h3>
                                    <p className="text-slate-700 text-lg leading-relaxed">
                                        {currentStep.description}
                                    </p>
                                </div>
                                
                                {/* Status badge */}
                                {currentStep.type === 'detection' && (
                                    <motion.div
                                        animate={{ scale: [1, 1.15, 1] }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-base font-black shadow-lg"
                                    >
                                        🔴 LIVE
                                    </motion.div>
                                )}
                                {currentStep.type === 'analysis' && (
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-xl text-base font-bold shadow-lg"
                                    >
                                        <Brain className="w-6 h-6" />
                                    </motion.div>
                                )}
                                {currentStep.type === 'recommendation' && (
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 0.6, repeat: Infinity }}
                                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-base font-bold shadow-lg"
                                    >
                                        ✅ ACTION
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Timeline des étapes complétées */}
            {completedSteps.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 flex flex-wrap gap-2"
                >
                    {DEMO_SCENARIO.filter(s => completedSteps.includes(s.id)).map((step, idx) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * idx }}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStepColor(step.type)}`}
                        >
                            {step.title.split(' ').slice(1, 3).join(' ')}
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Message d'encouragement */}
            {!isRunning && completedSteps.length === 0 && (
                <p className="text-center text-sm text-slate-500 mt-4">
                    Cliquez pour voir l&apos;agent détecter un risque et proposer des actions en 30 secondes
                </p>
            )}
        </div>
    )
}
