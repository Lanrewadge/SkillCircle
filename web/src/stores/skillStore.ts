import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Skill {
  id: string
  name: string
  description: string
  category: {
    id: string
    name: string
    icon: string
  }
  tags: string[]
  _count: {
    userSkills: number
  }
}

interface SkillCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  skills: Skill[]
  _count: {
    skills: number
  }
}

interface Teacher {
  id: string
  username: string
  name: string
  avatar?: string
  bio?: string
  verified: boolean
  rating: number
  reviewCount: number
  city?: string
  country?: string
  userSkills: {
    id: string
    role: string
    level: string
    hourlyRate?: number
    skill: {
      name: string
      category: {
        name: string
      }
    }
  }[]
}

interface SkillState {
  categories: SkillCategory[]
  skills: Skill[]
  teachers: Teacher[]
  loading: boolean
  searchResults: {
    skills: Skill[]
    teachers: Teacher[]
  }

  // Actions
  fetchCategories: () => Promise<void>
  fetchSkills: (categoryId?: string) => Promise<void>
  searchSkills: (query: string) => Promise<void>
  searchTeachers: (filters: TeacherFilters) => Promise<void>
}

interface TeacherFilters {
  search?: string
  skills?: string[]
  city?: string
  isTeacher?: boolean
  page?: number
  limit?: number
}

export const useSkillStore = create<SkillState>((set, get) => ({
  categories: [],
  skills: [],
  teachers: [],
  loading: false,
  searchResults: {
    skills: [],
    teachers: []
  },

  fetchCategories: async () => {
    set({ loading: true })
    try {
      const response = await axios.get('/skills/categories')
      set({ categories: response.data.data, loading: false })
    } catch (error: any) {
      toast.error('Failed to load categories')
      set({ loading: false })
    }
  },

  fetchSkills: async (categoryId?: string) => {
    set({ loading: true })
    try {
      const url = categoryId
        ? `/skills/categories/${categoryId}/skills`
        : '/skills'

      const response = await axios.get(url)
      set({ skills: response.data.data, loading: false })
    } catch (error: any) {
      toast.error('Failed to load skills')
      set({ loading: false })
    }
  },

  searchSkills: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: { skills: [], teachers: [] } })
      return
    }

    set({ loading: true })
    try {
      // Search both skills and teachers
      const [skillsResponse, teachersResponse] = await Promise.all([
        axios.get(`/skills?search=${encodeURIComponent(query)}`),
        axios.get(`/users?search=${encodeURIComponent(query)}&isTeacher=true`)
      ])

      set({
        searchResults: {
          skills: skillsResponse.data.data,
          teachers: teachersResponse.data.data.users
        },
        loading: false
      })
    } catch (error: any) {
      toast.error('Search failed')
      set({ loading: false })
    }
  },

  searchTeachers: async (filters: TeacherFilters) => {
    set({ loading: true })
    try {
      const params = new URLSearchParams()

      if (filters.search) params.append('search', filters.search)
      if (filters.skills?.length) params.append('skills', filters.skills.join(','))
      if (filters.city) params.append('city', filters.city)
      if (filters.isTeacher !== undefined) params.append('isTeacher', filters.isTeacher.toString())
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())

      const response = await axios.get(`/users?${params.toString()}`)
      set({ teachers: response.data.data.users, loading: false })
    } catch (error: any) {
      toast.error('Failed to load teachers')
      set({ loading: false })
    }
  }
}))