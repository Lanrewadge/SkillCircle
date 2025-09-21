'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Globe,
  MapPin,
  Book,
  Users,
  Calendar,
  Flag,
  Landmark,
  Mountain,
  Waves,
  Plane,
  Camera,
  Star,
  Clock,
  Award,
  TrendingUp,
  ChevronRight,
  Video,
  Phone,
  FileText,
  Download,
  Share,
  Bookmark,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Heart,
  Music,
  Utensils,
  Building,
  TreePine,
  Sun,
  Cloud,
  Thermometer
} from 'lucide-react';

const geographySubcategories = [
  {
    id: 'world-geography',
    name: 'World Geography',
    icon: <Globe className="w-6 h-6" />,
    description: 'Explore countries, capitals, and physical features of the world',
    skillCount: 195,
    color: 'bg-blue-500',
    trending: true,
    skills: ['Countries & Capitals', 'Physical Geography', 'Political Maps', 'Climate Zones', 'Time Zones']
  },
  {
    id: 'cultural-geography',
    name: 'Cultural Geography',
    icon: <Users className="w-6 h-6" />,
    description: 'Study human cultures, languages, and traditions worldwide',
    skillCount: 180,
    color: 'bg-purple-500',
    trending: true,
    skills: ['World Cultures', 'Languages', 'Religions', 'Traditions', 'Demographics']
  },
  {
    id: 'physical-geography',
    name: 'Physical Geography',
    icon: <Mountain className="w-6 h-6" />,
    description: 'Understand landforms, climate, and natural phenomena',
    skillCount: 160,
    color: 'bg-green-500',
    trending: false,
    skills: ['Landforms', 'Climate', 'Ecosystems', 'Natural Disasters', 'Weather Patterns']
  },
  {
    id: 'historical-geography',
    name: 'Historical Geography',
    icon: <Landmark className="w-6 h-6" />,
    description: 'Explore how geography has shaped history and civilizations',
    skillCount: 140,
    color: 'bg-orange-500',
    trending: false,
    skills: ['Ancient Civilizations', 'Historical Maps', 'Empire Evolution', 'Trade Routes', 'Migration Patterns']
  },
  {
    id: 'economic-geography',
    name: 'Economic Geography',
    icon: <Building className="w-6 h-6" />,
    description: 'Study global economics, trade, and resource distribution',
    skillCount: 120,
    color: 'bg-indigo-500',
    trending: true,
    skills: ['Global Trade', 'Natural Resources', 'Economic Systems', 'Urban Development', 'Agriculture']
  },
  {
    id: 'environmental-geography',
    name: 'Environmental Geography',
    icon: <TreePine className="w-6 h-6" />,
    description: 'Examine human-environment interactions and sustainability',
    skillCount: 110,
    color: 'bg-emerald-500',
    trending: true,
    skills: ['Climate Change', 'Conservation', 'Sustainability', 'Pollution', 'Renewable Energy']
  }
];

const sampleCountries = [
  {
    id: 'usa',
    name: 'United States',
    capital: 'Washington, D.C.',
    continent: 'North America',
    population: '331 million',
    area: '9.8 million km²',
    languages: ['English'],
    currency: 'US Dollar',
    government: 'Federal Republic',
    coordinates: { x: 25, y: 32 },
    flag: '🇺🇸',
    history: 'Founded in 1776, the United States emerged from 13 British colonies and became a global superpower through industrialization, westward expansion, and two world wars.',
    culture: 'Known for cultural diversity, Hollywood entertainment, jazz music, and technological innovation.',
    geography: 'Diverse landscape including mountains, plains, deserts, and coastlines on both Atlantic and Pacific oceans.',
    economy: 'World\'s largest economy, driven by technology, finance, agriculture, and manufacturing.',
    landmarks: ['Statue of Liberty', 'Grand Canyon', 'Mount Rushmore', 'Golden Gate Bridge'],
    climate: 'Varies from tropical in Hawaii and Florida to arctic in Alaska',
    timeZones: ['EST', 'CST', 'MST', 'PST', 'AKST', 'HST']
  },
  {
    id: 'canada',
    name: 'Canada',
    capital: 'Ottawa',
    continent: 'North America',
    population: '38 million',
    area: '9.98 million km²',
    languages: ['English', 'French'],
    currency: 'Canadian Dollar',
    government: 'Federal Parliamentary Democracy',
    coordinates: { x: 22, y: 28 },
    flag: '🇨🇦',
    history: 'Indigenous peoples for thousands of years, French and British colonization, Confederation in 1867, peaceful independence evolution.',
    culture: 'Multicultural society known for politeness, hockey, maple syrup, and natural beauty.',
    geography: 'Second-largest country by area, vast wilderness, mountains, prairies, and Arctic regions.',
    economy: 'Resource-rich economy with strong natural resources, technology, and services sectors.',
    landmarks: ['Niagara Falls', 'CN Tower', 'Banff National Park', 'Parliament Hill'],
    climate: 'Varies from arctic in north to temperate in south',
    timeZones: ['NST', 'AST', 'EST', 'CST', 'MST', 'PST']
  },
  {
    id: 'brazil',
    name: 'Brazil',
    capital: 'Brasília',
    continent: 'South America',
    population: '215 million',
    area: '8.5 million km²',
    languages: ['Portuguese'],
    currency: 'Brazilian Real',
    government: 'Federal Republic',
    coordinates: { x: 28, y: 68 },
    flag: '🇧🇷',
    history: 'Colonized by Portugal in 1500, gained independence in 1822, and became a republic in 1889. Largest country in South America.',
    culture: 'Vibrant culture known for Carnival, samba, football, capoeira, and diverse ethnic heritage.',
    geography: 'Home to Amazon rainforest, Atlantic coastline, Pantanal wetlands, and diverse ecosystems.',
    economy: 'Largest economy in Latin America, rich in natural resources, agriculture, and emerging industries.',
    landmarks: ['Christ the Redeemer', 'Amazon Rainforest', 'Iguazu Falls', 'Sugarloaf Mountain'],
    climate: 'Mostly tropical with temperate zones in the south',
    timeZones: ['BRT', 'AMT', 'ACT']
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    capital: 'London',
    continent: 'Europe',
    population: '67 million',
    area: '243,610 km²',
    languages: ['English'],
    currency: 'British Pound',
    government: 'Constitutional Monarchy',
    coordinates: { x: 45, y: 25 },
    flag: '🇬🇧',
    history: 'Island nation with rich history spanning Roman occupation, medieval kingdoms, colonial empire, industrial revolution, and modern democracy.',
    culture: 'Known for literature, theater, music, Royal family, tea culture, and historical traditions.',
    geography: 'Island archipelago with varied landscapes, coastlines, highlands, and rolling countryside.',
    economy: 'Major financial center, services-based economy, technology, and creative industries.',
    landmarks: ['Big Ben', 'Stonehenge', 'Tower Bridge', 'Edinburgh Castle'],
    climate: 'Temperate maritime climate with mild temperatures and frequent rainfall',
    timeZones: ['GMT', 'BST']
  },
  {
    id: 'france',
    name: 'France',
    capital: 'Paris',
    continent: 'Europe',
    population: '68 million',
    area: '643,801 km²',
    languages: ['French'],
    currency: 'Euro',
    government: 'Semi-Presidential Republic',
    coordinates: { x: 48, y: 28 },
    flag: '🇫🇷',
    history: 'One of Europe\'s oldest nations, France played a central role in European history through the Roman Empire, medieval kingdoms, revolution, and two world wars.',
    culture: 'Renowned for art, cuisine, fashion, literature, and philosophy. Home to the Renaissance and Enlightenment movements.',
    geography: 'Diverse terrain including the Alps, Mediterranean coast, Atlantic coastline, and fertile plains.',
    economy: 'Major European economy known for luxury goods, aerospace, agriculture, and tourism.',
    landmarks: ['Eiffel Tower', 'Louvre Museum', 'Palace of Versailles', 'Mont Blanc'],
    climate: 'Temperate climate with mild winters and warm summers',
    timeZones: ['CET']
  },
  {
    id: 'germany',
    name: 'Germany',
    capital: 'Berlin',
    continent: 'Europe',
    population: '83 million',
    area: '357,022 km²',
    languages: ['German'],
    currency: 'Euro',
    government: 'Federal Republic',
    coordinates: { x: 50, y: 26 },
    flag: '🇩🇪',
    history: 'Central European nation with complex history including Holy Roman Empire, Prussia, two world wars, division and reunification.',
    culture: 'Known for philosophy, music, science, engineering, beer culture, and Christmas markets.',
    geography: 'Central European location with varied landscapes from Baltic coast to Alpine regions.',
    economy: 'Europe\'s largest economy, industrial powerhouse known for automotive, engineering, and manufacturing.',
    landmarks: ['Brandenburg Gate', 'Neuschwanstein Castle', 'Cologne Cathedral', 'Berlin Wall'],
    climate: 'Temperate continental climate with moderate precipitation',
    timeZones: ['CET']
  },
  {
    id: 'russia',
    name: 'Russia',
    capital: 'Moscow',
    continent: 'Europe/Asia',
    population: '146 million',
    area: '17.1 million km²',
    languages: ['Russian'],
    currency: 'Russian Ruble',
    government: 'Federal Republic',
    coordinates: { x: 68, y: 22 },
    flag: '🇷🇺',
    history: 'Largest country in the world, spanning from medieval Rus\' to Russian Empire, Soviet Union, and modern Russian Federation.',
    culture: 'Rich cultural heritage in literature, ballet, classical music, and visual arts.',
    geography: 'Vast territory spanning 11 time zones, from Arctic tundra to temperate forests and mountains.',
    economy: 'Resource-rich economy based on oil, gas, minerals, and heavy industry.',
    landmarks: ['Red Square', 'Trans-Siberian Railway', 'Hermitage Museum', 'Lake Baikal'],
    climate: 'Varies from Arctic to temperate continental',
    timeZones: ['Multiple zones spanning UTC+2 to UTC+12']
  },
  {
    id: 'china',
    name: 'China',
    capital: 'Beijing',
    continent: 'Asia',
    population: '1.4 billion',
    area: '9.6 million km²',
    languages: ['Mandarin Chinese'],
    currency: 'Chinese Yuan',
    government: 'Communist Republic',
    coordinates: { x: 72, y: 35 },
    flag: '🇨🇳',
    history: 'One of world\'s oldest continuous civilizations with over 4,000 years of recorded history, modern economic powerhouse.',
    culture: 'Ancient culture with Confucian values, traditional arts, cuisine, and rapid modernization.',
    geography: 'Diverse landscape including mountains, deserts, rivers, and extensive coastline.',
    economy: 'World\'s second-largest economy, manufacturing hub, and growing technology sector.',
    landmarks: ['Great Wall', 'Forbidden City', 'Terracotta Army', 'Yangtze River'],
    climate: 'Diverse climates from tropical to subarctic',
    timeZones: ['CST']
  },
  {
    id: 'india',
    name: 'India',
    capital: 'New Delhi',
    continent: 'Asia',
    population: '1.4 billion',
    area: '3.3 million km²',
    languages: ['Hindi', 'English'],
    currency: 'Indian Rupee',
    government: 'Federal Republic',
    coordinates: { x: 65, y: 42 },
    flag: '🇮🇳',
    history: 'Ancient civilization with rich cultural heritage, British colonial period, independence in 1947, rapid modern development.',
    culture: 'Diverse culture with multiple religions, languages, traditions, cuisine, and Bollywood cinema.',
    geography: 'Subcontinent with Himalayas, plains, plateaus, and extensive coastlines.',
    economy: 'Fast-growing economy with strong services, technology, and manufacturing sectors.',
    landmarks: ['Taj Mahal', 'Red Fort', 'Gateway of India', 'Golden Temple'],
    climate: 'Varies from tropical to alpine',
    timeZones: ['IST']
  },
  {
    id: 'japan',
    name: 'Japan',
    capital: 'Tokyo',
    continent: 'Asia',
    population: '125 million',
    area: '377,975 km²',
    languages: ['Japanese'],
    currency: 'Japanese Yen',
    government: 'Constitutional Monarchy',
    coordinates: { x: 82, y: 38 },
    flag: '🇯🇵',
    history: 'Ancient island nation with rich samurai heritage, experienced rapid modernization during Meiji Restoration, and became a major economic power after WWII.',
    culture: 'Unique blend of ancient traditions and modern innovation, known for anime, martial arts, tea ceremony, and technological advancement.',
    geography: 'Archipelago of 6,852 islands with mountainous terrain, active volcanoes, and frequent earthquakes.',
    economy: 'Third-largest economy globally, leader in automotive, electronics, robotics, and manufacturing.',
    landmarks: ['Mount Fuji', 'Tokyo Skytree', 'Golden Pavilion', 'Hiroshima Peace Memorial'],
    climate: 'Humid subtropical and humid continental climates with distinct seasons',
    timeZones: ['JST']
  },
  {
    id: 'egypt',
    name: 'Egypt',
    capital: 'Cairo',
    continent: 'Africa',
    population: '104 million',
    area: '1 million km²',
    languages: ['Arabic'],
    currency: 'Egyptian Pound',
    government: 'Republic',
    coordinates: { x: 52, y: 48 },
    flag: '🇪🇬',
    history: 'One of world\'s oldest civilizations, home to ancient pharaohs, pyramids, and the Nile River civilization spanning over 5,000 years.',
    culture: 'Rich cultural heritage blending ancient Egyptian, Islamic, and modern influences. Known for art, literature, and film.',
    geography: 'Mostly desert with the life-giving Nile River running through it, connecting to the Mediterranean Sea.',
    economy: 'Based on agriculture, tourism, natural gas, and the Suez Canal revenue.',
    landmarks: ['Pyramids of Giza', 'Sphinx', 'Valley of the Kings', 'Abu Simbel'],
    climate: 'Hot desert climate with minimal rainfall',
    timeZones: ['EET']
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    capital: 'Cape Town',
    continent: 'Africa',
    population: '60 million',
    area: '1.2 million km²',
    languages: ['English', 'Afrikaans', 'Zulu'],
    currency: 'South African Rand',
    government: 'Republic',
    coordinates: { x: 52, y: 75 },
    flag: '🇿🇦',
    history: 'Complex history including indigenous peoples, Dutch and British colonization, apartheid system, and democratic transition in 1994.',
    culture: 'Rainbow nation with diverse cultures, languages, and traditions from African, European, and Asian heritage.',
    geography: 'Southern tip of Africa with varied landscapes including mountains, plateaus, and coastlines.',
    economy: 'Most developed African economy based on mining, agriculture, and services.',
    landmarks: ['Table Mountain', 'Kruger National Park', 'Robben Island', 'Cape of Good Hope'],
    climate: 'Temperate with regional variations',
    timeZones: ['SAST']
  },
  {
    id: 'australia',
    name: 'Australia',
    capital: 'Canberra',
    continent: 'Oceania',
    population: '26 million',
    area: '7.7 million km²',
    languages: ['English'],
    currency: 'Australian Dollar',
    government: 'Federal Parliamentary Democracy',
    coordinates: { x: 82, y: 78 },
    flag: '🇦🇺',
    history: 'Indigenous Aboriginal culture for 65,000 years, British colonization from 1788, federation in 1901, modern multicultural nation.',
    culture: 'Laid-back lifestyle, outdoor activities, unique wildlife, Aboriginal art, and sporting culture.',
    geography: 'Island continent with diverse landscapes: deserts, rainforests, mountains, and extensive coastlines.',
    economy: 'Developed economy based on mining, agriculture, tourism, and services.',
    landmarks: ['Sydney Opera House', 'Uluru', 'Great Barrier Reef', 'Twelve Apostles'],
    climate: 'Ranges from tropical in north to temperate in south',
    timeZones: ['AWST', 'ACST', 'AEST']
  },
  {
    id: 'mexico',
    name: 'Mexico',
    capital: 'Mexico City',
    continent: 'North America',
    population: '128 million',
    area: '1.96 million km²',
    languages: ['Spanish'],
    currency: 'Mexican Peso',
    government: 'Federal Republic',
    coordinates: { x: 20, y: 42 },
    flag: '🇲🇽',
    history: 'Ancient Mesoamerican civilizations including Maya and Aztec, Spanish colonization from 1519, independence in 1821, modern democratic nation.',
    culture: 'Rich indigenous and Spanish colonial heritage, known for vibrant arts, cuisine, music, and Day of the Dead celebrations.',
    geography: 'Diverse terrain from deserts in north to tropical rainforests in south, with mountain ranges and extensive coastlines.',
    economy: 'Emerging market economy with strong manufacturing, agriculture, and growing services sector.',
    landmarks: ['Chichen Itza', 'Teotihuacan', 'Frida Kahlo Museum', 'Cancun'],
    climate: 'Varies from arid in north to tropical in south',
    timeZones: ['CST', 'MST', 'PST']
  },
  {
    id: 'italy',
    name: 'Italy',
    capital: 'Rome',
    continent: 'Europe',
    population: '60 million',
    area: '301,340 km²',
    languages: ['Italian'],
    currency: 'Euro',
    government: 'Republic',
    coordinates: { x: 49, y: 32 },
    flag: '🇮🇹',
    history: 'Heart of Roman Empire, Renaissance birthplace, unified as modern nation in 1861, major role in European history and culture.',
    culture: 'Renowned for art, architecture, cuisine, fashion, and contributions to science and literature.',
    geography: 'Peninsula extending into Mediterranean Sea with Alps in north and beautiful coastlines.',
    economy: 'Advanced economy known for luxury goods, automotive, fashion, and tourism.',
    landmarks: ['Colosseum', 'Leaning Tower of Pisa', 'Vatican City', 'Venice Canals'],
    climate: 'Mediterranean climate with mild winters and warm summers',
    timeZones: ['CET']
  },
  {
    id: 'spain',
    name: 'Spain',
    capital: 'Madrid',
    continent: 'Europe',
    population: '47 million',
    area: '505,992 km²',
    languages: ['Spanish'],
    currency: 'Euro',
    government: 'Constitutional Monarchy',
    coordinates: { x: 44, y: 32 },
    flag: '🇪🇸',
    history: 'Ancient Iberian peoples, Roman rule, Islamic conquest, Reconquista, global empire, modern democracy since 1978.',
    culture: 'Rich cultural heritage with flamenco, bullfighting, siesta tradition, and regional diversity.',
    geography: 'Iberian Peninsula with Pyrenees mountains, central plateau, and Mediterranean and Atlantic coasts.',
    economy: 'Advanced economy with strong tourism, manufacturing, and renewable energy sectors.',
    landmarks: ['Sagrada Familia', 'Alhambra', 'Park Güell', 'Santiago de Compostela'],
    climate: 'Mediterranean and continental climates with regional variations',
    timeZones: ['CET']
  },
  {
    id: 'turkey',
    name: 'Turkey',
    capital: 'Ankara',
    continent: 'Europe/Asia',
    population: '84 million',
    area: '783,562 km²',
    languages: ['Turkish'],
    currency: 'Turkish Lira',
    government: 'Republic',
    coordinates: { x: 58, y: 35 },
    flag: '🇹🇷',
    history: 'Strategic location between Europe and Asia, Byzantine Empire, Ottoman Empire, modern republic founded by Atatürk in 1923.',
    culture: 'Unique blend of European and Asian influences, rich Ottoman heritage, and modern secular society.',
    geography: 'Transcontinental country with Anatolian plateau, coastal regions, and the Bosphorus strait.',
    economy: 'Emerging market with strong industry, agriculture, and growing services sector.',
    landmarks: ['Hagia Sophia', 'Cappadocia', 'Pamukkale', 'Troy'],
    climate: 'Mediterranean, continental, and oceanic climates',
    timeZones: ['TRT']
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    capital: 'Abuja',
    continent: 'Africa',
    population: '218 million',
    area: '923,768 km²',
    languages: ['English', 'Hausa', 'Yoruba', 'Igbo'],
    currency: 'Nigerian Naira',
    government: 'Federal Republic',
    coordinates: { x: 48, y: 52 },
    flag: '🇳🇬',
    history: 'Diverse ancient kingdoms, British colonization, independence in 1960, largest African economy and population.',
    culture: 'Incredibly diverse with over 250 ethnic groups, known for Nollywood films, music, and vibrant traditions.',
    geography: 'West African nation with coastal lowlands, central plateau, and northern savanna regions.',
    economy: 'Largest African economy based on oil, agriculture, and growing tech sector.',
    landmarks: ['Zuma Rock', 'Olumo Rock', 'Yankari National Park', 'Lagos'],
    climate: 'Tropical climate with wet and dry seasons',
    timeZones: ['WAT']
  }
];

const geographyLearningPaths = {
  beginner: {
    title: 'Geography Fundamentals',
    duration: '3-4 months',
    courses: [
      {
        title: 'World Map Basics',
        topics: ['Continents & Oceans', 'Countries & Capitals', 'Major Cities', 'Basic Navigation'],
        duration: '6 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Physical Geography Introduction',
        topics: ['Landforms', 'Weather & Climate', 'Natural Resources', 'Ecosystems'],
        duration: '8 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Cultural Geography Basics',
        topics: ['World Cultures', 'Languages', 'Religions', 'Traditions'],
        duration: '6 weeks',
        difficulty: 'Beginner'
      }
    ]
  },
  intermediate: {
    title: 'Regional Geography',
    duration: '6-8 months',
    courses: [
      {
        title: 'Continental Studies',
        topics: ['Regional Characteristics', 'Economic Geography', 'Political Systems', 'Historical Development'],
        duration: '10 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Human Geography',
        topics: ['Population Dynamics', 'Migration Patterns', 'Urbanization', 'Globalization'],
        duration: '8 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Environmental Geography',
        topics: ['Climate Change', 'Natural Disasters', 'Conservation', 'Sustainability'],
        duration: '8 weeks',
        difficulty: 'Intermediate'
      }
    ]
  },
  advanced: {
    title: 'Specialized Geography',
    duration: '8-12 months',
    courses: [
      {
        title: 'Geopolitics & International Relations',
        topics: ['Global Politics', 'Trade Relations', 'Conflict Geography', 'Diplomatic History'],
        duration: '12 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Geographic Information Systems',
        topics: ['GIS Technology', 'Mapping Software', 'Spatial Analysis', 'Remote Sensing'],
        duration: '10 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Research Methods in Geography',
        topics: ['Field Research', 'Data Collection', 'Statistical Analysis', 'Academic Writing'],
        duration: '8 weeks',
        difficulty: 'Advanced'
      }
    ]
  }
};

const GeographyPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const mapRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <Globe className="w-4 h-4" /> },
    { id: 'world-map', name: 'Interactive Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'content', name: 'Learning Paths', icon: <Book className="w-4 h-4" /> },
    { id: 'countries', name: 'Country Explorer', icon: <Flag className="w-4 h-4" /> },
    { id: 'virtual-tours', name: 'Virtual Tours', icon: <Camera className="w-4 h-4" /> }
  ];

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleResetMap = () => {
    setMapZoom(1);
    setMapPosition({ x: 0, y: 0 });
  };

  const handleMapMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - mapPosition.x,
      y: e.clientY - mapPosition.y
    });
  }, [mapPosition.x, mapPosition.y]);

  const handleMapMouseMove = useCallback((e) => {
    if (isDragging) {
      setMapPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart.x, dragStart.y]);

  const handleMapMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMapWheel = useCallback((e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setMapZoom(prev => Math.max(0.5, Math.min(3, prev * zoomFactor)));
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMapMouseMove);
      document.addEventListener('mouseup', handleMapMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMapMouseMove);
      document.removeEventListener('mouseup', handleMapMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMapMouseMove);
      document.removeEventListener('mouseup', handleMapMouseUp);
    };
  }, [isDragging, handleMapMouseMove, handleMapMouseUp]);

  const filteredCountries = sampleCountries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.capital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Geography & World Studies</h1>
        <p className="text-xl mb-6">Explore our planet through interactive maps, country studies, and cultural discoveries</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">195</div>
            <div className="text-sm opacity-90">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">7</div>
            <div className="text-sm opacity-90">Continents</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">5</div>
            <div className="text-sm opacity-90">Oceans</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">7000+</div>
            <div className="text-sm opacity-90">Languages</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {geographySubcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border"
          >
            <div className={`${subcategory.color} rounded-lg p-3 w-12 h-12 flex items-center justify-center text-white mb-4`}>
              {subcategory.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{subcategory.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{subcategory.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{subcategory.skillCount} topics</span>
              {subcategory.trending && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Trending</span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {subcategory.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWorldMap = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Interactive World Map</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetMap}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg overflow-hidden h-96 border-2 border-blue-200">
          <div
            ref={mapRef}
            className="absolute inset-0 cursor-move"
            style={{
              transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapZoom})`,
              transformOrigin: 'center center'
            }}
            onMouseDown={handleMapMouseDown}
            onWheel={handleMapWheel}
          >
            {/* Ocean Background */}
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 relative">

              {/* World Map SVG with Continents */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1000 500"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                </defs>

                {/* Continents */}
                <g fill="#22C55E" stroke="#16A34A" strokeWidth="2" filter="url(#shadow)">
                  {/* North America */}
                  <path d="M120,80 L180,60 L240,70 L280,90 L320,110 L350,140 L340,180 L320,220 L280,240 L240,230 L200,210 L160,190 L120,150 Z" />

                  {/* Greenland */}
                  <path d="M300,40 L350,35 L380,50 L375,80 L350,85 L320,75 L305,60 Z" />

                  {/* South America */}
                  <path d="M220,260 L280,250 L310,270 L320,300 L315,350 L300,400 L280,430 L250,440 L220,430 L200,400 L190,350 L195,300 L210,280 Z" />

                  {/* Europe */}
                  <path d="M450,70 L520,60 L580,70 L590,90 L585,120 L570,140 L540,145 L500,140 L470,130 L455,110 L450,90 Z" />

                  {/* Africa */}
                  <path d="M480,150 L540,140 L590,155 L610,180 L620,220 L615,260 L600,300 L580,340 L560,370 L530,385 L500,390 L470,385 L450,370 L440,340 L435,300 L440,260 L450,220 L465,180 Z" />

                  {/* Asia */}
                  <path d="M590,50 L700,40 L800,50 L900,60 L950,80 L980,110 L970,140 L950,170 L920,190 L880,200 L820,210 L760,205 L700,195 L650,185 L620,170 L600,150 L590,120 L585,90 Z" />

                  {/* Australia */}
                  <path d="M750,320 L820,310 L870,325 L890,345 L885,370 L860,385 L820,390 L780,385 L750,370 L740,350 Z" />

                  {/* Antarctica */}
                  <path d="M50,450 L950,450 L950,490 L50,490 Z" />
                </g>

                {/* Islands and smaller landmasses */}
                <g fill="#22C55E" stroke="#16A34A" strokeWidth="1">
                  {/* Madagascar */}
                  <path d="M620,340 L635,335 L640,355 L635,375 L625,380 L615,375 L615,355 Z" />

                  {/* British Isles */}
                  <path d="M440,90 L450,85 L460,95 L455,105 L445,100 Z" />

                  {/* Japan */}
                  <path d="M900,160 L920,155 L925,175 L920,185 L905,180 Z" />

                  {/* New Zealand */}
                  <path d="M920,380 L935,375 L940,395 L935,405 L925,400 Z" />
                </g>
              </svg>

              {/* Country Markers */}
              {sampleCountries.map((country) => (
                <div
                  key={country.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  style={{
                    left: `${country.coordinates.x}%`,
                    top: `${country.coordinates.y}%`
                  }}
                  onClick={() => handleCountryClick(country)}
                >
                  <div className="group relative">
                    <div className="w-8 h-8 bg-red-500 rounded-full border-3 border-white shadow-lg hover:bg-red-600 hover:scale-110 transition-all flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      {country.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>Click on country markers to explore detailed information. Use zoom controls or mouse wheel to zoom, drag to pan.</p>
        </div>
      </div>

      {selectedCountry && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{selectedCountry.flag}</span>
              <div>
                <h3 className="text-2xl font-bold">{selectedCountry.name}</h3>
                <p className="text-gray-600">Capital: {selectedCountry.capital}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCountry(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Basic Information
              </h4>
              <div className="space-y-2 text-sm">
                <div><strong>Population:</strong> {selectedCountry.population}</div>
                <div><strong>Area:</strong> {selectedCountry.area}</div>
                <div><strong>Languages:</strong> {selectedCountry.languages.join(', ')}</div>
                <div><strong>Currency:</strong> {selectedCountry.currency}</div>
                <div><strong>Government:</strong> {selectedCountry.government}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <Landmark className="w-4 h-4 mr-2" />
                Famous Landmarks
              </h4>
              <div className="space-y-1">
                {selectedCountry.landmarks.map((landmark, index) => (
                  <div key={index} className="text-sm flex items-center">
                    <Star className="w-3 h-3 mr-2 text-yellow-500" />
                    {landmark}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <Book className="w-4 h-4 mr-2" />
                History
              </h4>
              <p className="text-sm text-gray-700">{selectedCountry.history}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Culture
              </h4>
              <p className="text-sm text-gray-700">{selectedCountry.culture}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <Mountain className="w-4 h-4 mr-2" />
                Geography
              </h4>
              <p className="text-sm text-gray-700">{selectedCountry.geography}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Economy
              </h4>
              <p className="text-sm text-gray-700">{selectedCountry.economy}</p>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center text-sm">
              <Book className="w-4 h-4 mr-2" />
              Learn More
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center text-sm">
              <Camera className="w-4 h-4 mr-2" />
              Virtual Tour
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center text-sm">
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Geography Learning Paths</h2>
        <div className="flex space-x-4 mb-6">
          {Object.keys(geographyLearningPaths).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedLevel === level
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {geographyLearningPaths[level].title}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-semibold">{geographyLearningPaths[selectedLevel].title}</h3>
            <span className="ml-4 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {geographyLearningPaths[selectedLevel].duration}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {geographyLearningPaths[selectedLevel].courses.map((course, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-lg">{course.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.difficulty}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.duration}
                </div>
                <div className="space-y-1">
                  {course.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center text-sm text-gray-700">
                      <ChevronRight className="w-3 h-3 mr-1 text-gray-400" />
                      {topic}
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                  Start Learning
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCountries = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Country Explorer</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCountries.map((country) => (
            <div
              key={country.id}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCountryClick(country)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-3xl">{country.flag}</span>
                <div>
                  <h3 className="font-semibold text-lg">{country.name}</h3>
                  <p className="text-gray-600 text-sm">{country.capital}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-2" />
                  {country.population}
                </div>
                <div className="flex items-center">
                  <Globe className="w-3 h-3 mr-2" />
                  {country.continent}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-2" />
                  {country.area}
                </div>
              </div>
              <button className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                Explore Country
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVirtualTours = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Virtual Tours & Experiences</h2>
        <p className="text-gray-600 mb-6">Explore the world from your home with immersive virtual experiences</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <Camera className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">360° Landmark Tours</h3>
            <p className="text-sm mb-4 opacity-90">Virtual reality tours of famous landmarks and historical sites</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              Start Tour
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <Mountain className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nature Expeditions</h3>
            <p className="text-sm mb-4 opacity-90">Explore national parks, mountains, and natural wonders</p>
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              Explore Nature
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <Building className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">City Walkthroughs</h3>
            <p className="text-sm mb-4 opacity-90">Virtual walks through world's most famous cities and streets</p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              Walk Cities
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <Utensils className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Cultural Experiences</h3>
            <p className="text-sm mb-4 opacity-90">Learn about local customs, food, and traditions</p>
            <button className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              Experience Culture
            </button>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
            <Video className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Live Geography Sessions</h3>
            <p className="text-sm mb-4 opacity-90">Join live video sessions with geography experts worldwide</p>
            <button className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              Join Session
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
            <Users className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Study Groups</h3>
            <p className="text-sm mb-4 opacity-90">Connect with fellow geography enthusiasts for group learning</p>
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              Join Group
            </button>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Schedule Geography Consultation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Region of Interest</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>Europe</option>
                <option>Asia</option>
                <option>North America</option>
                <option>South America</option>
                <option>Africa</option>
                <option>Oceania</option>
                <option>Global Studies</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>Country Deep Dive</option>
                <option>Cultural Exchange</option>
                <option>Geography Tutoring</option>
                <option>Travel Planning</option>
                <option>Academic Support</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex space-x-4">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Video Call
            </button>
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Audio Conference
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'world-map':
        return renderWorldMap();
      case 'content':
        return renderContent();
      case 'countries':
        return renderCountries();
      case 'virtual-tours':
        return renderVirtualTours();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default GeographyPage;