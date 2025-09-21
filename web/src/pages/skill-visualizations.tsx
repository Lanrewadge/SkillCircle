import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import SkillVisualizationDemo from '@/components/demo/SkillVisualizationDemo';

const SkillVisualizationsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Interactive Skill Visualizations - Skill Circle</title>
        <meta
          name="description"
          content="Explore our interactive SVG-based skill visualizations with animations and category-specific learning diagrams."
        />
        <meta name="keywords" content="skill visualization, interactive learning, SVG animations, educational graphics" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <SkillVisualizationDemo />
      </div>
    </>
  );
};

export default SkillVisualizationsPage;