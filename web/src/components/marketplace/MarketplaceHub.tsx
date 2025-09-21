'use client'

import React, { useState } from 'react'
import {
  ShoppingBag,
  Star,
  Clock,
  Users,
  Award,
  DollarSign,
  Filter,
  Search,
  Heart,
  Share2,
  Play,
  Download,
  BookOpen,
  Video,
  FileText,
  Headphones,
  Code,
  Palette,
  TrendingUp,
  Gift,
  Tag,
  ShoppingCart,
  CreditCard,
  Zap,
  Globe,
  Calendar,
  CheckCircle,
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

interface MarketplaceItem {
  id: string
  title: string
  description: string
  instructor: {
    name: string
    avatar: string
    rating: number
    courses: number
  }
  category: string
  type: 'course' | 'ebook' | 'template' | 'tool' | 'certification'
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  students: number
  duration: number
  thumbnail: string
  tags: string[]
  level: string
  language: string
  lastUpdated: string
  features: string[]
  bestseller: boolean
  onSale: boolean
  discount?: number
}

interface CartItem extends MarketplaceItem {
  quantity: number
}

const mockItems: MarketplaceItem[] = [
  {
    id: '1',
    title: 'Complete Full-Stack Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build 15+ real-world projects.',
    instructor: {
      name: 'John Smith',
      avatar: '/avatars/john.jpg',
      rating: 4.9,
      courses: 12
    },
    category: 'Technology',
    type: 'course',
    price: 89.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviews: 3421,
    students: 15670,
    duration: 52,
    thumbnail: '/courses/fullstack-bootcamp.jpg',
    tags: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    level: 'Beginner',
    language: 'English',
    lastUpdated: '2024-01-15',
    features: [
      '52 hours of video content',
      '15 hands-on projects',
      'Certificate of completion',
      'Lifetime access',
      'Q&A support'
    ],
    bestseller: true,
    onSale: true,
    discount: 55
  },
  {
    id: '2',
    title: 'UI/UX Design Kit - 500+ Components',
    description: 'Professional Figma design system with 500+ components, icons, and templates.',
    instructor: {
      name: 'Sarah Design',
      avatar: '/avatars/sarah-design.jpg',
      rating: 4.7,
      courses: 8
    },
    category: 'Design',
    type: 'template',
    price: 49.99,
    rating: 4.9,
    reviews: 891,
    students: 4560,
    duration: 0,
    thumbnail: '/templates/ui-kit.jpg',
    tags: ['Figma', 'UI Kit', 'Design System', 'Components'],
    level: 'All Levels',
    language: 'Universal',
    lastUpdated: '2024-01-10',
    features: [
      '500+ UI components',
      'Dark & light themes',
      'Figma & Sketch files',
      'Free updates',
      'Commercial license'
    ],
    bestseller: false,
    onSale: false
  },
  {
    id: '3',
    title: 'Digital Marketing Masterclass eBook',
    description: '300-page comprehensive guide to modern digital marketing strategies and tactics.',
    instructor: {
      name: 'Marketing Pro',
      avatar: '/avatars/marketing-pro.jpg',
      rating: 4.6,
      courses: 15
    },
    category: 'Marketing',
    type: 'ebook',
    price: 29.99,
    originalPrice: 59.99,
    rating: 4.5,
    reviews: 567,
    students: 2890,
    duration: 8,
    thumbnail: '/ebooks/marketing-guide.jpg',
    tags: ['SEO', 'Social Media', 'Content Marketing', 'Analytics'],
    level: 'Intermediate',
    language: 'English',
    lastUpdated: '2024-01-08',
    features: [
      '300+ pages',
      'Downloadable PDF',
      'Bonus templates',
      'Case studies',
      'Action checklists'
    ],
    bestseller: false,
    onSale: true,
    discount: 50
  }
]

export const MarketplaceHub = () => {
  const [items, setItems] = useState<MarketplaceItem[]>(mockItems)
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('popularity')
  const [showCart, setShowCart] = useState(false)

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📚' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'marketing', name: 'Marketing', icon: '📈' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'photography', name: 'Photography', icon: '📸' },
    { id: 'music', name: 'Music', icon: '🎵' }
  ]

  const itemTypes = [
    { id: 'all', name: 'All Types', icon: '📦' },
    { id: 'course', name: 'Courses', icon: '🎓' },
    { id: 'ebook', name: 'eBooks', icon: '📚' },
    { id: 'template', name: 'Templates', icon: '📝' },
    { id: 'tool', name: 'Tools', icon: '🛠️' },
    { id: 'certification', name: 'Certifications', icon: '🏆' }
  ]

  const addToCart = (item: MarketplaceItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId)
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ))
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <Video className="w-4 h-4" />
      case 'ebook': return <BookOpen className="w-4 h-4" />
      case 'template': return <FileText className="w-4 h-4" />
      case 'tool': return <Code className="w-4 h-4" />
      case 'certification': return <Award className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const ItemCard = ({ item }: { item: MarketplaceItem }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 relative">
      {item.bestseller && (
        <Badge className="absolute top-2 left-2 bg-orange-500 text-white z-10">
          <Star className="w-3 h-3 mr-1" />
          Bestseller
        </Badge>
      )}
      {item.onSale && (
        <Badge className="absolute top-2 right-2 bg-red-500 text-white z-10">
          -{item.discount}%
        </Badge>
      )}

      <div className="relative aspect-video">
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
          {getTypeIcon(item.type)}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
          <Button
            size="sm"
            variant="secondary"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <Badge variant="outline" className="text-xs">
                {getTypeIcon(item.type)}
                <span className="ml-1 capitalize">{item.type}</span>
              </Badge>
              <Badge variant="outline" className="text-xs">
                {item.level}
              </Badge>
            </div>
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-gray-600 text-xs mt-1 line-clamp-2">
              {item.description}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">
                {item.instructor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-700">{item.instructor.name}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{item.rating}</span>
                <span className="text-gray-400">({item.reviews})</span>
              </div>
              {item.type === 'course' && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.duration}h</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{item.students.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                {item.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ${item.originalPrice}
                  </span>
                )}
                <span className="text-lg font-bold text-green-600">
                  ${item.price}
                </span>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => addToCart(item)}
              className="text-xs"
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const CartSidebar = () => (
    <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform z-50 ${
      showCart ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Shopping Cart ({cart.length})</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
            ×
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                  {getTypeIcon(item.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                  <p className="text-xs text-gray-600">{item.instructor.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold text-green-600">${item.price}</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-6 border-t">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <Button className="w-full" size="lg">
              <CreditCard className="w-4 h-4 mr-2" />
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
            <p className="text-gray-600">Discover premium courses, templates, and learning resources</p>
          </div>
          <Button
            onClick={() => setShowCart(true)}
            className="relative"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart ({cart.length})
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search courses, ebooks, templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {itemTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}+</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🔥 Featured & On Sale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.filter(item => item.onSale || item.bestseller).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* All Items */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">All Items ({items.length})</h2>
            <div className="text-sm text-gray-600">
              Showing {items.length} results
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Items
          </Button>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Cart Overlay */}
      {showCart && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowCart(false)}
        />
      )}
    </div>
  )
}