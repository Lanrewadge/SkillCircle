import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, TrendingUp, Award, Target, Clock } from 'lucide-react';

interface ProgressData {
  id: string;
  label: string;
  value: number;
  maxValue: number;
  color: string;
  unit?: string;
}

interface AnimatedProgressProps {
  title: string;
  description: string;
  progressData: ProgressData[];
  animationDuration?: number;
  showControls?: boolean;
  visualType?: 'circular' | 'linear' | 'radial' | 'wave' | 'particle';
}

const CircularProgress: React.FC<{ data: ProgressData; animated: boolean; size?: number }> = ({
  data,
  animated,
  size = 120
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedValue / data.maxValue) * 100;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (animated) {
      let start = 0;
      const increment = data.value / 60; // 60 frames for smooth animation
      const timer = setInterval(() => {
        start += increment;
        if (start >= data.value) {
          start = data.value;
          clearInterval(timer);
        }
        setAnimatedValue(start);
      }, 16); // ~60fps

      return () => clearInterval(timer);
    } else {
      setAnimatedValue(data.value);
    }
  }, [animated, data.value]);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={data.color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        >
          {animated && (
            <animate
              attributeName="stroke-dashoffset"
              values={`${circumference};${strokeDashoffset}`}
              dur="2s"
              fill="freeze"
            />
          )}
        </circle>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold" style={{ color: data.color }}>
          {Math.round(animatedValue)}
        </div>
        <div className="text-xs text-gray-500">{data.unit || '%'}</div>
      </div>
    </div>
  );
};

const LinearProgress: React.FC<{ data: ProgressData; animated: boolean }> = ({ data, animated }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const progress = (animatedValue / data.maxValue) * 100;

  useEffect(() => {
    if (animated) {
      let start = 0;
      const increment = data.value / 60;
      const timer = setInterval(() => {
        start += increment;
        if (start >= data.value) {
          start = data.value;
          clearInterval(timer);
        }
        setAnimatedValue(start);
      }, 16);

      return () => clearInterval(timer);
    } else {
      setAnimatedValue(data.value);
    }
  }, [animated, data.value]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{data.label}</span>
        <span className="text-sm text-gray-600">
          {Math.round(animatedValue)}{data.unit || '%'}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out relative"
          style={{
            width: `${progress}%`,
            backgroundColor: data.color
          }}
        >
          {animated && (
            <div
              className="absolute inset-0 bg-white opacity-30 rounded-full animate-pulse"
              style={{
                animation: 'shimmer 2s ease-in-out infinite'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const RadialProgress: React.FC<{ data: ProgressData[]; animated: boolean }> = ({ data, animated }) => {
  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg width="256" height="256" className="absolute inset-0">
        <defs>
          <radialGradient id="radialGrad">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.3)" />
          </radialGradient>
        </defs>

        {data.map((item, index) => {
          const radius = 80 + index * 20;
          const circumference = 2 * Math.PI * radius;
          const progress = (item.value / item.maxValue) * 100;
          const strokeDashoffset = circumference - (progress / 100) * circumference;

          return (
            <g key={item.id}>
              <circle
                cx="128"
                cy="128"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r={radius}
                stroke={item.color}
                strokeWidth="4"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300"
                transform="rotate(-90 128 128)"
              >
                {animated && (
                  <animate
                    attributeName="stroke-dashoffset"
                    values={`${circumference};${strokeDashoffset}`}
                    dur={`${2 + index * 0.5}s`}
                    fill="freeze"
                  />
                )}
              </circle>
            </g>
          );
        })}

        <circle
          cx="128"
          cy="128"
          r="60"
          fill="url(#radialGrad)"
          className={animated ? "animate-pulse" : ""}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {Math.round(data.reduce((sum, item) => sum + (item.value / item.maxValue), 0) / data.length * 100)}%
          </div>
          <div className="text-sm text-gray-500">Overall</div>
        </div>
      </div>
    </div>
  );
};

const WaveProgress: React.FC<{ data: ProgressData; animated: boolean }> = ({ data, animated }) => {
  const progress = (data.value / data.maxValue) * 100;
  const waveHeight = (100 - progress) + '%';

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg width="128" height="128" className="absolute inset-0">
        <defs>
          <clipPath id="circleClip">
            <circle cx="64" cy="64" r="58" />
          </clipPath>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={data.color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={data.color} stopOpacity="1" />
          </linearGradient>
        </defs>

        <circle
          cx="64"
          cy="64"
          r="58"
          stroke={data.color}
          strokeWidth="4"
          fill="none"
        />

        <g clipPath="url(#circleClip)">
          <rect
            x="6"
            y={waveHeight}
            width="116"
            height="128"
            fill="url(#waveGrad)"
          >
            {animated && (
              <animate
                attributeName="y"
                values="128;60"
                dur="2s"
                fill="freeze"
              />
            )}
          </rect>

          {animated && (
            <path
              d="M 6,60 Q 32,50 58,60 T 110,60 T 162,60 V 128 H 6 Z"
              fill={data.color}
              opacity="0.6"
            >
              <animate
                attributeName="d"
                values="M 6,80 Q 32,70 58,80 T 110,80 T 162,80 V 128 H 6 Z;
                        M 6,60 Q 32,50 58,60 T 110,60 T 162,60 V 128 H 6 Z;
                        M 6,70 Q 32,60 58,70 T 110,70 T 162,70 V 128 H 6 Z;
                        M 6,60 Q 32,50 58,60 T 110,60 T 162,60 V 128 H 6 Z"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
          )}
        </g>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white mix-blend-difference">
          <div className="text-xl font-bold">
            {Math.round(data.value)}
          </div>
          <div className="text-xs">{data.unit || '%'}</div>
        </div>
      </div>
    </div>
  );
};

const ParticleProgress: React.FC<{ data: ProgressData; animated: boolean }> = ({ data, animated }) => {
  const progress = (data.value / data.maxValue) * 100;
  const particleCount = Math.floor(progress / 5);

  return (
    <div className="relative w-64 h-32">
      <svg width="256" height="128" className="absolute inset-0">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Progress track */}
        <rect x="20" y="60" width="216" height="8" rx="4" fill="#e5e7eb" />
        <rect
          x="20"
          y="60"
          width={(progress / 100) * 216}
          height="8"
          rx="4"
          fill={data.color}
        />

        {/* Particles */}
        {animated && Array.from({ length: particleCount }, (_, i) => (
          <circle
            key={i}
            r="3"
            fill={data.color}
            filter="url(#glow)"
            opacity="0.8"
          >
            <animateMotion
              dur={`${2 + Math.random() * 2}s`}
              repeatCount="indefinite"
              path={`M ${20 + (i * 10)},64 Q ${50 + i * 15},${40 + Math.random() * 20} ${236},64`}
            />
            <animate
              attributeName="opacity"
              values="0;0.8;0"
              dur="1s"
              repeatCount="indefinite"
              begin={`${i * 0.1}s`}
            />
          </circle>
        ))}
      </svg>

      <div className="absolute bottom-0 left-0 right-0 text-center">
        <div className="text-lg font-bold" style={{ color: data.color }}>
          {data.label}: {Math.round(data.value)}{data.unit || '%'}
        </div>
      </div>
    </div>
  );
};

const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  title,
  description,
  progressData,
  animationDuration = 2000,
  showControls = true,
  visualType = 'circular'
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const startAnimation = () => {
    setIsAnimating(true);
    setIsPaused(false);
    setTimeout(() => {
      setIsAnimating(false);
    }, animationDuration);
  };

  const pauseAnimation = () => {
    setIsPaused(true);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setIsPaused(false);
  };

  const renderVisualization = () => {
    switch (visualType) {
      case 'circular':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {progressData.map(data => (
              <div key={data.id} className="text-center space-y-2">
                <CircularProgress data={data} animated={isAnimating && !isPaused} />
                <div className="text-sm font-medium">{data.label}</div>
              </div>
            ))}
          </div>
        );

      case 'linear':
        return (
          <div className="space-y-6">
            {progressData.map(data => (
              <LinearProgress key={data.id} data={data} animated={isAnimating && !isPaused} />
            ))}
          </div>
        );

      case 'radial':
        return (
          <div className="text-center space-y-4">
            <RadialProgress data={progressData} animated={isAnimating && !isPaused} />
            <div className="grid grid-cols-2 gap-4">
              {progressData.map(data => (
                <div key={data.id} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: data.color }}
                  />
                  <span className="text-sm">{data.label}</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(data.value)}{data.unit || '%'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'wave':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {progressData.map(data => (
              <div key={data.id} className="text-center space-y-2">
                <WaveProgress data={data} animated={isAnimating && !isPaused} />
                <div className="text-sm font-medium">{data.label}</div>
              </div>
            ))}
          </div>
        );

      case 'particle':
        return (
          <div className="space-y-8">
            {progressData.map(data => (
              <ParticleProgress key={data.id} data={data} animated={isAnimating && !isPaused} />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="secondary" className="capitalize">
            {visualType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {showControls && (
          <div className="flex items-center gap-2">
            <Button onClick={startAnimation} disabled={isAnimating && !isPaused} size="sm">
              <Play className="w-4 h-4 mr-2" />
              {isAnimating && !isPaused ? 'Playing...' : 'Start Animation'}
            </Button>
            <Button onClick={pauseAnimation} disabled={!isAnimating || isPaused} size="sm" variant="outline">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
            <Button onClick={resetAnimation} size="sm" variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        )}

        {renderVisualization()}
      </CardContent>
    </Card>
  );
};

const AnimatedProgressDemo: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'circular' | 'linear' | 'radial' | 'wave' | 'particle'>('circular');

  const skillProgressData: ProgressData[] = [
    { id: 'react', label: 'React', value: 85, maxValue: 100, color: '#3b82f6', unit: '%' },
    { id: 'node', label: 'Node.js', value: 72, maxValue: 100, color: '#10b981', unit: '%' },
    { id: 'database', label: 'Database', value: 68, maxValue: 100, color: '#f59e0b', unit: '%' },
    { id: 'devops', label: 'DevOps', value: 45, maxValue: 100, color: '#8b5cf6', unit: '%' }
  ];

  const learningMetrics: ProgressData[] = [
    { id: 'hours', label: 'Study Hours', value: 156, maxValue: 200, color: '#ef4444', unit: 'h' },
    { id: 'projects', label: 'Projects', value: 8, maxValue: 10, color: '#06b6d4', unit: '' },
    { id: 'certificates', label: 'Certificates', value: 3, maxValue: 5, color: '#84cc16', unit: '' },
    { id: 'streak', label: 'Day Streak', value: 28, maxValue: 30, color: '#f97316', unit: 'd' }
  ];

  const visualTypes = [
    { value: 'circular', label: 'Circular', icon: '○' },
    { value: 'linear', label: 'Linear', icon: '━' },
    { value: 'radial', label: 'Radial', icon: '◉' },
    { value: 'wave', label: 'Wave', icon: '~' },
    { value: 'particle', label: 'Particle', icon: '✦' }
  ] as const;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Animated Progress Visualizations
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Dynamic and engaging progress indicators with SVG animations and multiple visual styles
        </p>
      </div>

      <div className="flex justify-center gap-2 flex-wrap">
        {visualTypes.map(type => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? "default" : "outline"}
            onClick={() => setSelectedType(type.value)}
            size="sm"
          >
            <span className="mr-2">{type.icon}</span>
            {type.label}
          </Button>
        ))}
      </div>

      <AnimatedProgress
        title="Skill Development Progress"
        description="Track your learning journey across different technologies"
        progressData={skillProgressData}
        visualType={selectedType}
        showControls={true}
      />

      <AnimatedProgress
        title="Learning Metrics"
        description="Monitor your study habits and achievements"
        progressData={learningMetrics}
        visualType={selectedType}
        showControls={true}
      />

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export { AnimatedProgress, AnimatedProgressDemo };
export default AnimatedProgress;