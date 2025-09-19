'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'

interface StripeContextType {
  stripe: Stripe | null
  isLoading: boolean
}

const StripeContext = createContext<StripeContextType | undefined>(undefined)

export const useStripe = () => {
  const context = useContext(StripeContext)
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider')
  }
  return context
}

interface StripeProviderProps {
  children: React.ReactNode
  publishableKey?: string
}

export const StripeProvider: React.FC<StripeProviderProps> = ({
  children,
  publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_test_key_here'
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(publishableKey)
        setStripe(stripeInstance)
      } catch (error) {
        console.error('Failed to initialize Stripe:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeStripe()
  }, [publishableKey])

  return (
    <StripeContext.Provider value={{ stripe, isLoading }}>
      {children}
    </StripeContext.Provider>
  )
}