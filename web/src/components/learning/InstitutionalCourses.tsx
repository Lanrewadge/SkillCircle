import React, { useState, useEffect } from 'react';
import { Search, Book, Clock, Award, ChevronRight, BookOpen, Users, Star } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  creditHours: number;
  prerequisites: string[];
  careerPaths: string[];
  roadmap: any;
}

interface EncyclopediaEntry {
  overview: string;
  learningObjectives: string[];
  keyTopics: Record<string, {
    definition: string;
    concepts: string[];
    practicalApplications: string[];
    assessmentMethods: string[];
  }>;
  prerequisites?: string[];
  recommendedResources?: string[];
}

const InstitutionalCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedEncyclopedia, setSelectedEncyclopedia] = useState<EncyclopediaEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<'courses' | 'roadmap' | 'encyclopedia'>('courses');

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, searchTerm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/learning/courses?${params}`);
      const data = await response.json();

      if (data.success) {
        setCourses(data.data.courses);
        setCategories(data.data.categories);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId: string) => {
    try {
      const response = await fetch(`/api/learning/courses/${courseId}`);
      const data = await response.json();

      if (data.success) {
        setSelectedCourse(data.data);
        setView('roadmap');
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const fetchEncyclopediaEntry = async (courseId: string, topicId: string) => {
    try {
      const response = await fetch(`/api/learning/courses/${courseId}/encyclopedia/${topicId}`);
      const data = await response.json();

      if (data.success) {
        setSelectedEncyclopedia(data.data);
        setView('encyclopedia');
      }
    } catch (error) {
      console.error('Error fetching encyclopedia entry:', error);
    }
  };

  const renderCourseList = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => fetchCourseDetails(course.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {course.category}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    {course.creditHours} credits
                  </div>
                </div>

                {course.prerequisites.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Prerequisites: {course.prerequisites.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRoadmap = () => {
    if (!selectedCourse) return null;

    return (
      <div className="space-y-6">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedCourse.title}
              </h1>
              <p className="text-gray-600 mb-4">{selectedCourse.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {selectedCourse.duration}
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  {selectedCourse.creditHours} credits
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {selectedCourse.category}
                </div>
              </div>
            </div>

            <button
              onClick={() => setView('courses')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Back to Courses
            </button>
          </div>

          {/* Career Paths */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Career Paths</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCourse.careerPaths.map((path, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  {path}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Roadmap</h2>

          <div className="space-y-8">
            {Object.entries(selectedCourse.roadmap).map(([yearKey, yearData]: [string, any]) => (
              <div key={yearKey} className="border-l-4 border-blue-200 pl-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Year {yearData.year}: {yearData.title}
                  </h3>
                </div>

                <div className="space-y-6">
                  {yearData.courses.map((semester: any, semesterIndex: number) => (
                    <div key={semesterIndex} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Semester {semester.semester}
                      </h4>

                      <div className="grid gap-4">
                        {semester.courses.map((course: any, courseIndex: number) => (
                          <div
                            key={courseIndex}
                            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                            onClick={() => fetchEncyclopediaEntry(selectedCourse.id, course.code)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    {course.code}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    course.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                    course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {course.difficulty}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {course.credits} credits
                                  </span>
                                </div>

                                <h5 className="font-medium text-gray-900 mb-2">
                                  {course.title}
                                </h5>

                                <div className="flex flex-wrap gap-1 mb-2">
                                  {course.topics.map((topic: string, topicIndex: number) => (
                                    <span
                                      key={topicIndex}
                                      className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <BookOpen className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderEncyclopedia = () => {
    if (!selectedEncyclopedia) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {selectedEncyclopedia.courseCode}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedEncyclopedia.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  selectedEncyclopedia.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedEncyclopedia.difficulty}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedEncyclopedia.courseTitle}
              </h1>

              <p className="text-gray-600 mb-4">
                {selectedEncyclopedia.overview}
              </p>
            </div>

            <button
              onClick={() => setView('roadmap')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Back to Roadmap
            </button>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Objectives</h2>
          <ul className="space-y-2">
            {selectedEncyclopedia.learningObjectives.map((objective, index) => (
              <li key={index} className="flex items-start">
                <Star className="w-4 h-4 text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Topics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Topics</h2>

          <div className="space-y-6">
            {Object.entries(selectedEncyclopedia.keyTopics).map(([topicName, topicData]) => (
              <div key={topicName} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {topicName}
                </h3>

                <p className="text-gray-700 mb-4">
                  {topicData.definition}
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Core Concepts</h4>
                    <ul className="space-y-1">
                      {topicData.concepts.map((concept, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                          {concept}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Practical Applications</h4>
                    <ul className="space-y-1">
                      {topicData.practicalApplications.map((application, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                          {application}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-2">Assessment Methods</h4>
                  <div className="flex flex-wrap gap-2">
                    {topicData.assessmentMethods.map((method, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prerequisites and Resources */}
        {(selectedEncyclopedia.prerequisites || selectedEncyclopedia.recommendedResources) && (
          <div className="grid md:grid-cols-2 gap-6">
            {selectedEncyclopedia.prerequisites && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prerequisites</h3>
                <ul className="space-y-2">
                  {selectedEncyclopedia.prerequisites.map((prereq, index) => (
                    <li key={index} className="text-gray-700 flex items-center">
                      <Book className="w-4 h-4 text-blue-500 mr-2" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedEncyclopedia.recommendedResources && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Resources</h3>
                <ul className="space-y-2">
                  {selectedEncyclopedia.recommendedResources.map((resource, index) => (
                    <li key={index} className="text-gray-700 flex items-center">
                      <BookOpen className="w-4 h-4 text-green-500 mr-2" />
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {view === 'courses' && renderCourseList()}
        {view === 'roadmap' && renderRoadmap()}
        {view === 'encyclopedia' && renderEncyclopedia()}
      </div>
    </div>
  );
};

export default InstitutionalCourses;