'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Zap, Crown } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  recommended?: boolean
  stripePriceId: string
  icon: React.ReactNode
}

interface SubscriptionPlansProps {
  onSelectPlan: (plan: SubscriptionPlan) => void
  currentPlan?: string | null
}

const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    interval: 'month',
    stripePriceId: '',
    icon: <Star className="w-6 h-6" />,
    features: [
      'Browse all skills',
      'Contact up to 3 teachers per month',
      'Basic profile',
      'Community access'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For active learners and teachers',
    price: 9.99,
    interval: 'month',
    stripePriceId: 'price_pro_monthly',
    recommended: true,
    icon: <Zap className="w-6 h-6" />,
    features: [
      'Everything in Free',
      'Unlimited teacher contacts',
      'Priority booking',
      'Video calling',
      'Advanced search filters',
      'Skill progress tracking',
      'Premium support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For serious skill entrepreneurs',
    price: 19.99,
    interval: 'month',
    stripePriceId: 'price_premium_monthly',
    icon: <Crown className="w-6 h-6" />,
    features: [
      'Everything in Pro',
      'Create unlimited skill listings',
      'Advanced analytics',
      'Custom branding',
      'Priority customer support',
      'API access',
      'White-label options'
    ]
  }
]

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  onSelectPlan,
  currentPlan
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan.id === 'free') {
      toast.success('You are now on the Free plan!')
      return
    }

    setSelectedPlan(plan.id)
    onSelectPlan(plan)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Unlock the full potential of SkillCircle with our premium features
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative transition-all duration-200 hover:shadow-lg ${
              plan.recommended ? 'border-blue-500 ring-2 ring-blue-200' : ''
            } ${
              currentPlan === plan.id ? 'bg-blue-50 dark:bg-blue-950' : ''
            }`}
          >
            {plan.recommended && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Recommended
              </Badge>
            )}

            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                {plan.icon}
              </div>
              <div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold">
                  ${plan.price}
                  {plan.price > 0 && (
                    <span className="text-sm font-normal text-gray-500">
                      /{plan.interval}
                    </span>
                  )}
                </div>
                {plan.price === 0 && (
                  <p className="text-sm text-gray-500">Forever</p>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plan)}
                disabled={currentPlan === plan.id}
                className={`w-full ${
                  plan.recommended
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                    : ''
                }`}
                variant={currentPlan === plan.id ? 'outline' : 'default'}
              >
                {currentPlan === plan.id
                  ? 'Current Plan'
                  : plan.price === 0
                  ? 'Get Started Free'
                  : 'Upgrade Now'
                }
              </Button>

              {currentPlan === plan.id && (
                <p className="text-center text-sm text-green-600 dark:text-green-400">
                  ✓ Active subscription
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 space-y-2">
        <p>All plans include a 7-day free trial. Cancel anytime.</p>
        <p>
          Have questions?{' '}
          <a href="#" className="text-blue-500 hover:underline">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  )
}