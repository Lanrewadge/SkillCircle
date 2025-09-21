import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import VisualLearningHub from '@/components/learning/VisualLearningHub';

const VisualLearningPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Visual Learning Hub - Skill Circle</title>
        <meta
          name="description"
          content="Discover interactive visual learning tools designed for different learning styles. Explore skill visualizations, animated progress tracking, and gamified learning paths."
        />
        <meta
          name="keywords"
          content="visual learning, interactive education, skill visualization, learning styles, animated progress, skill trees, educational technology"
        />
        <meta property="og:title" content="Visual Learning Hub - Skill Circle" />
        <meta
          property="og:description"
          content="Transform your learning experience with interactive visualizations, skill trees, and personalized learning paths designed for visual learners."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/visual-learning" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <VisualLearningHub />
      </div>
    </>
  );
};

export default VisualLearningPage;