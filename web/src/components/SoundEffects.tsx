'use client'

import { useEffect, useRef } from 'react'

// Sound URLs (using Web Audio API compatible sounds)
const soundEffects = {
  hover: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmggBjuZ3/DBciUFLYPJ8diJNggZ',
  click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmggBjuZ3/DBciUFLYPJ8diJNggZ',
  success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmggBjuZ3/DBciUFLYPJ8diJNggZ'
}

class AudioManager {
  private audioContext: AudioContext | null = null
  private gainNode: GainNode | null = null
  private enabled: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.init()
    }
  }

  private async init() {
    try {
      // Create audio context on first user interaction
      document.addEventListener('click', this.initAudioContext.bind(this), { once: true })
      document.addEventListener('keydown', this.initAudioContext.bind(this), { once: true })
    } catch (error) {
      console.log('Audio not supported:', error)
    }
  }

  private async initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.gainNode = this.audioContext.createGain()
      this.gainNode.connect(this.audioContext.destination)
      this.gainNode.gain.value = 0.1 // Low volume
      this.enabled = true
    } catch (error) {
      console.log('Could not initialize audio:', error)
    }
  }

  async playSound(type: keyof typeof soundEffects) {
    if (!this.enabled || !this.audioContext || !this.gainNode) return

    try {
      // Create oscillator for simple sound effects
      const oscillator = this.audioContext.createOscillator()
      const envelope = this.audioContext.createGain()

      oscillator.connect(envelope)
      envelope.connect(this.gainNode)

      // Different frequencies for different sounds
      const frequencies = {
        hover: 800,
        click: 1000,
        success: 1200
      }

      oscillator.frequency.setValueAtTime(frequencies[type], this.audioContext.currentTime)
      oscillator.type = 'sine'

      // Sound envelope
      envelope.gain.setValueAtTime(0, this.audioContext.currentTime)
      envelope.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01)
      envelope.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.2)
    } catch (error) {
      console.log('Could not play sound:', error)
    }
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  toggle() {
    this.enabled = !this.enabled
  }
}

// Global audio manager instance
let audioManager: AudioManager | null = null

export default function SoundEffects() {
  const audioManagerRef = useRef<AudioManager | null>(null)

  useEffect(() => {
    // Initialize audio manager
    if (!audioManagerRef.current) {
      audioManagerRef.current = new AudioManager()
      audioManager = audioManagerRef.current
    }

    // Add event listeners for interactive elements
    const addSoundToElements = () => {
      // Hover sounds
      const hoverElements = document.querySelectorAll('button, a, [data-magnetic], .group')
      hoverElements.forEach(el => {
        const handleMouseEnter = () => audioManager?.playSound('hover')
        el.addEventListener('mouseenter', handleMouseEnter)

        // Store reference for cleanup
        ;(el as any).__soundCleanup = () => {
          el.removeEventListener('mouseenter', handleMouseEnter)
        }
      })

      // Click sounds
      const clickElements = document.querySelectorAll('button, a, [data-magnetic]')
      clickElements.forEach(el => {
        const handleClick = () => audioManager?.playSound('click')
        el.addEventListener('click', handleClick)

        // Store reference for cleanup
        ;(el as any).__clickSoundCleanup = () => {
          el.removeEventListener('click', handleClick)
        }
      })
    }

    // Initial setup
    addSoundToElements()

    // Re-run when DOM changes (for dynamically added elements)
    const observer = new MutationObserver(() => {
      addSoundToElements()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Cleanup
    return () => {
      observer.disconnect()

      // Clean up existing event listeners
      document.querySelectorAll('[data-sound]').forEach(el => {
        if ((el as any).__soundCleanup) {
          ;(el as any).__soundCleanup()
        }
        if ((el as any).__clickSoundCleanup) {
          ;(el as any).__clickSoundCleanup()
        }
      })
    }
  }, [])

  return null // This component doesn't render anything
}

// Export the audio manager for direct use
export { audioManager }