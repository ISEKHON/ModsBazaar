'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Star, Heart, Share2, Flag, Play, Unlock, Shield, MessageSquare, FileText, Tag, Calendar, Copy, ExternalLink, User, ThumbsUp, ThumbsDown, Edit3, Edit, Trash2, Settings, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'

interface ModData {
  _id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  type: 'free' | 'paid' | 'unlock'
  price?: number
  unlockCode?: string
  version: string
  game: 'FS22' | 'FS25' | 'Both'
  category: string
  tags: string[]
  thumbnail: string
  screenshots: string[]
  videoUrl?: string
  files: Array<{
    name: string
    size: string
    downloadUrl: string
  }>
  author: {
    name: string
    id: {
      _id: string
      username: string
    }
  }
  downloads: number
  views: number
  rating: number
  ratingCount: number
  reviews: any[]
  publishedAt: string
  updatedAt: string
  canDownload?: boolean
  isActive?: boolean
}

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

export default function ModDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { user, isAuthenticated } = useAuth()
  
  const [mod, setMod] = useState<ModData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const [isLiked, setIsLiked] = useState(false)
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(false)
  const [downloadCount, setDownloadCount] = useState(0)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [enteredCode, setEnteredCode] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUnpublishModal, setShowUnpublishModal] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])
  const [userReview, setUserReview] = useState<any>(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    version: '',
    game: 'FS22' as 'FS22' | 'FS25' | 'Both',
    category: '',
    tags: [] as string[],
    type: 'free' as 'free' | 'paid' | 'unlock',
    price: 0,
    unlockCode: ''
  })
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false)

  // Check if user is logged in
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('auth_token')

  // Check if user can edit this mod (owner or admin)
  const canEditMod = isAuthenticated && mod && (
    (user?.role === 'admin') || 
    (mod.author.id?._id === user?._id)
  )

  // Check if user is admin
  const isAdmin = isAuthenticated && user?.role === 'admin'

  const loadReviews = useCallback(async (slug: string) => {
    try {
      setReviewsLoading(true)
      
      // Load all reviews - always available to everyone
      const reviewsResponse = await api.get(`/mods/${slug}/reviews`)
      if (reviewsResponse.data.status === 'success') {
        setReviews(reviewsResponse.data.data.reviews || [])
      }
      
      // Check if user has already reviewed - only if logged in
      if (isLoggedIn) {
        const userReviewResponse = await api.get(`/mods/${slug}/reviews/my-review`)
        if (userReviewResponse.data.status === 'success' && userReviewResponse.data.data.review) {
          setUserReview(userReviewResponse.data.data.review)
          setUserRating(userReviewResponse.data.data.review.rating)
          setReviewText(userReviewResponse.data.data.review.comment || '')
        }
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setReviewsLoading(false)
    }
  }, [isLoggedIn])

  useEffect(() => {
    const checkIfFavorited = async (slug: string) => {
      if (!isLoggedIn) return
      
      try {
        setIsCheckingFavorite(true)
        const response = await api.get(`/mods/${slug}/favorite`)
        if (response.data.status === 'success') {
          setIsLiked(response.data.data.isFavorited)
        }
      } catch (error) {
        console.error('Failed to check favorite status:', error)
      } finally {
        setIsCheckingFavorite(false)
      }
    }

    const fetchMod = async () => {
      if (!slug) return
      
      try {
        setLoading(true)
        setError(null)
        
        console.log('Fetching mod with slug:', slug)
        const response = await api.get(`/mods/${slug}`)
        
        if (response.data.status === 'success') {
          const modData = response.data.data.mod
          setMod(modData)
          setDownloadCount(modData.downloads)
          
          // Set unlock status based on canDownload for unlock mods
          if (modData.type === 'unlock' && modData.canDownload) {
            setIsUnlocked(true)
          }
          
          console.log('Mod loaded successfully:', modData.name)
          
          // Load reviews for everyone
          loadReviews(slug)
          
          // Check if mod is favorited (only if logged in)
          if (isLoggedIn) {
            checkIfFavorited(slug)
          }
        } else {
          setError('Mod not found')
        }
      } catch (error: any) {
        console.error('Failed to fetch mod:', error)
        if (error.response?.status === 404) {
          setError('Mod not found')
        } else {
          setError('Failed to load mod. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchMod()
  }, [slug, isLoggedIn, loadReviews])

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to add favorites')
      return
    }

    if (!mod) return

    try {
      const response = await api.post(`/mods/${mod.slug}/favorite`)
      if (response.data.status === 'success') {
        setIsLiked(response.data.data.isFavorited)
        toast.success(response.data.message)
      }
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error)
      if (error.response?.status === 401) {
        toast.error('Please login to add favorites')
      } else {
        toast.error('Failed to update favorites')
      }
    }
  }

  const handleDownload = async () => {
    if (!mod) return
    
    try {
      const response = await api.post(`/mods/${mod.slug}/download`)
      
      if (response.data.status === 'success') {
        // Update download count in state
        setDownloadCount(response.data.data.downloads)
        
        // Show success message
        toast.success(`${mod.name} download started!`)
        
        // If there's a download URL, trigger download
        if (response.data.data.downloadUrl && response.data.data.downloadUrl !== '#') {
          window.open(response.data.data.downloadUrl, '_blank')
        }
      }
    } catch (error: any) {
      console.error('Failed to download mod:', error)
      if (error.response?.status === 403) {
        toast.error('You need to purchase or unlock this mod first')
      } else {
        toast.error('Download failed. Please try again.')
      }
    }
  }

  const handleUnlockCode = async () => {
    if (!mod || !enteredCode.trim()) return

    try {
      const response = await api.post('/payment/unlock', {
        modId: mod._id,
        unlockCode: enteredCode.trim()
      })

      if (response.data.status === 'success') {
        setIsUnlocked(true)
        setShowUnlockModal(false)
        setEnteredCode('')
        setCodeError('')
        toast.success(response.data.message)
      }
    } catch (error: any) {
      console.error('Failed to unlock mod:', error)
      const errorMessage = error.response?.data?.message || 'Failed to unlock mod'
      setCodeError(errorMessage)
      
      if (errorMessage === 'Invalid unlock code') {
        toast.error('Invalid unlock code. Please try again.')
      } else {
        toast.error(errorMessage)
      }
    }
  }

  const handlePurchase = () => {
    // Open Discord or contact page
    window.open('https://discord.gg/GcaakuhbVk', '_blank')
    setShowPurchaseModal(false)
    toast.info('Please contact our admin team for purchase assistance')
  }

  const handleShare = async () => {
    const shareData = {
      title: mod?.name || 'Check out this mod!',
      text: mod?.shortDescription || 'Amazing mod from ModsBazaar',
      url: window.location.href
    }

    // Try native sharing API first (mobile devices)
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
        toast.success('Shared successfully!')
        return
      } catch (error) {
        // User cancelled or error occurred, fall back to modal
        console.log('Native sharing cancelled or failed')
      }
    }

    // Fall back to custom share modal
    setShowShareModal(true)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
      setShowShareModal(false)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('Link copied to clipboard!')
      setShowShareModal(false)
    }
  }

  const handleSocialShare = (platform: string) => {
    if (!mod) return

    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out ${mod.name} - ${mod.shortDescription}`)
    const title = encodeURIComponent(mod.name)
    
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=ModsBazaar,FarmingSimulator,${mod.game}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`
        break
      case 'discord':
        // For Discord, we'll copy a formatted message
        const discordMessage = `🎮 **${mod.name}** 🎮\n\n${mod.shortDescription}\n\n🔗 ${window.location.href}\n\n#ModsBazaar #${mod.game} #${mod.category.replace(/\s+/g, '')}`
        try {
          navigator.clipboard.writeText(discordMessage)
          toast.success('Discord message copied to clipboard!')
        } catch (error) {
          toast.error('Failed to copy Discord message')
        }
        setShowShareModal(false)
        return
      case 'reddit':
        shareUrl = `https://www.reddit.com/submit?url=${url}&title=${title}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
        break
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      default:
        return
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
      setShowShareModal(false)
      toast.success(`Sharing on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`)
    }
  }

  const handleReviewSubmit = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to leave a review')
      return
    }

    if (!mod || userRating === 0) {
      toast.error('Please select a rating')
      return
    }

    try {
      setSubmittingReview(true)
      
      const reviewData = {
        rating: userRating,
        comment: reviewText.trim()
      }

      let response
      if (userReview) {
        // Update existing review
        response = await api.patch(`/mods/${mod.slug}/reviews/${userReview._id}`, reviewData)
      } else {
        // Create new review
        response = await api.post(`/mods/${mod.slug}/reviews`, reviewData)
      }

      if (response.data.status === 'success') {
        toast.success(userReview ? 'Review updated successfully!' : 'Review submitted successfully!')
        setShowReviewModal(false)
        
        // Refresh reviews and mod data
        loadReviews(mod.slug)
        
        // Update mod rating in state
        const updatedMod = { ...mod }
        updatedMod.rating = response.data.data.newAverageRating || mod.rating
        updatedMod.ratingCount = response.data.data.newRatingCount || mod.ratingCount
        setMod(updatedMod)
        
        // Clear form
        if (!userReview) {
          setUserRating(0)
          setReviewText('')
        }
      }
    } catch (error: any) {
      console.error('Failed to submit review:', error)
      if (error.response?.status === 401) {
        toast.error('Please login to leave a review')
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Invalid review data')
      } else {
        toast.error('Failed to submit review. Please try again.')
      }
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleDeleteReview = async () => {
    if (!userReview || !mod) return

    try {
      const response = await api.delete(`/mods/${mod.slug}/reviews/${userReview._id}`)
      
      if (response.data.status === 'success') {
        toast.success('Review deleted successfully!')
        setUserReview(null)
        setUserRating(0)
        setReviewText('')
        setShowReviewModal(false)
        
        // Refresh reviews and mod data
        loadReviews(mod.slug)
        
        // Update mod rating in state
        const updatedMod = { ...mod }
        updatedMod.rating = response.data.data.newAverageRating || 0
        updatedMod.ratingCount = response.data.data.newRatingCount || 0
        setMod(updatedMod)
      }
    } catch (error: any) {
      console.error('Failed to delete review:', error)
      toast.error('Failed to delete review. Please try again.')
    }
  }

  const handleVoteReview = async (reviewId: string, voteType: 'up' | 'down') => {
    if (!isLoggedIn) {
      toast.error('Please login to vote on reviews')
      return
    }

    try {
      const response = await api.post(`/reviews/${reviewId}/vote`, { voteType })
      
      if (response.data.status === 'success') {
        // Update the review in state
        setReviews(reviews.map(review => 
          review._id === reviewId 
            ? { ...review, ...response.data.data.review }
            : review
        ))
        
        toast.success('Vote recorded!')
      }
    } catch (error: any) {
      console.error('Failed to vote on review:', error)
      if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Vote failed')
      } else {
        toast.error('Failed to vote. Please try again.')
      }
    }
  }

  // Handle mod deletion
  const handleDeleteMod = async () => {
    try {
      const response = await api.delete(`/mods/${mod?._id}`)
      if (response.data.status === 'success') {
        toast.success('Mod deleted successfully')
        window.location.href = '/mods' // Redirect to mods page
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete mod')
    }
  }

  // Handle mod unpublishing (admin only)
  const handleUnpublishMod = async () => {
    try {
      const response = await api.patch(`/mods/${mod?._id}/unpublish`)
      if (response.data.status === 'success') {
        toast.success('Mod unpublished successfully')
        setMod({ ...mod!, isActive: false })
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to unpublish mod')
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  // Edit mod functionality
  const handleEditMod = () => {
    if (!mod) return;
    
    // Pre-populate the edit form with current mod data
    setEditForm({
      name: mod.name,
      description: mod.description,
      shortDescription: mod.shortDescription,
      version: mod.version,
      game: mod.game,
      category: mod.category,
      tags: mod.tags || [],
      type: mod.type,
      price: mod.price || 0,
      unlockCode: mod.unlockCode || ''
    });
    
    setShowEditModal(true);
  }

  const handleSubmitEdit = async () => {
    if (!mod) return;

    try {
      setIsSubmittingEdit(true);
      
      const response = await api.patch(`/mods/${mod._id}`, editForm);
      
      if (response.data.status === 'success') {
        toast.success('Mod updated successfully');
        setShowEditModal(false);
        
        // Refresh mod data
        window.location.reload(); // Simple refresh for now
      }
      
    } catch (error: any) {
      console.error('Error updating mod:', error);
      toast.error(error.response?.data?.message || 'Failed to update mod');
    } finally {
      setIsSubmittingEdit(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-16">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading mod details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !mod) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-16">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gaming-card rounded-full mx-auto mb-4 flex items-center justify-center">
                <Flag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Mod Not Found</h3>
              <p className="text-muted-foreground mb-6">{error || 'The requested mod could not be found.'}</p>
              <Link href="/mods">
                <button className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-semibold hover-glow transition-all duration-300">
                  Browse All Mods
                </button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Back Button */}
        <section className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/mods" className="inline-flex items-center space-x-2 text-neon-blue hover:text-neon-purple transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Mods</span>
            </Link>
          </div>
        </section>

        {/* Mod Header */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Media Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                {/* Main Media Display */}
                <div className="gaming-card rounded-xl overflow-hidden group">
                  <div className="relative overflow-hidden">
                    {/* YouTube Video or Image Display */}
                    {activeImageIndex === 0 && mod.videoUrl ? (
                      <div className="relative w-full h-96">
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(mod.videoUrl)}?autoplay=0&rel=0&modestbranding=1`}
                          title={`${mod.name} Preview Video`}
                          className="w-full h-full"
                          frameBorder="0"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-96 overflow-hidden">
                        <img
                          src={mod.videoUrl ? (mod.screenshots[activeImageIndex - 1] || mod.thumbnail) : (mod.screenshots[activeImageIndex] || mod.thumbnail)}
                          alt={mod.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = mod.thumbnail
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        mod.game === 'FS25' 
                          ? 'bg-gradient-to-r from-neon-green to-neon-blue text-white' 
                          : mod.game === 'FS22'
                          ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                          : 'bg-gradient-to-r from-neon-orange to-yellow-400 text-white'
                      }`}>
                        {mod.game}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gaming-dark/80 backdrop-blur-sm rounded-full text-sm text-white">
                        {mod.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Thumbnail Navigation */}
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {/* Video Thumbnail (if video exists) */}
                  {mod.videoUrl && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveImageIndex(0)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 relative ${
                        activeImageIndex === 0 
                          ? 'border-neon-blue shadow-lg shadow-neon-blue/30' 
                          : 'border-gaming-border hover:border-neon-purple'
                      }`}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${getYouTubeVideoId(mod.videoUrl)}/mqdefault.jpg`}
                        alt="Video Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                          <Play className="h-3 w-3 text-white fill-current ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-1 left-1">
                        <span className="px-1.5 py-0.5 bg-red-600 text-white text-xs rounded font-semibold">
                          VIDEO
                        </span>
                      </div>
                    </motion.button>
                  )}
                  
                  {/* Image Thumbnails */}
                  {mod.screenshots.map((image, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveImageIndex(mod.videoUrl ? index + 1 : index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        activeImageIndex === (mod.videoUrl ? index + 1 : index)
                          ? 'border-neon-blue shadow-lg shadow-neon-blue/30' 
                          : 'border-gaming-border hover:border-neon-purple'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${mod.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = mod.thumbnail
                        }}
                      />
                      <div className="absolute top-1 right-1">
                        <span className="w-5 h-5 bg-gaming-dark/80 backdrop-blur-sm rounded-full text-white text-xs flex items-center justify-center font-semibold">
                          {index + 1}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Mod Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-4xl font-gaming font-bold mb-4">
                    <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                      {mod.name}
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    {mod.shortDescription}
                  </p>
                </div>

                {/* Author & Stats */}
                <div className="gaming-card p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-neon-blue rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {(mod.author.name || mod.author.id?.username || 'Unknown').substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{mod.author.name || mod.author.id?.username || 'Unknown Author'}</p>
                        <p className="text-sm text-muted-foreground">Mod Creator</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-bold">{mod.rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">({mod.ratingCount || 0})</span>
                      </div>
                      {isLoggedIn && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowReviewModal(true)}
                          className="mt-2 text-xs text-neon-blue hover:text-neon-purple transition-colors"
                        >
                          {userReview ? 'Edit Review' : 'Write Review'}
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Edit/Admin Controls */}
                  {canEditMod && (
                    <div className="flex items-center justify-center space-x-3 mb-6 p-4 bg-gaming-border/20 rounded-lg border border-gaming-border">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEditMod}
                        className="flex items-center space-x-2 px-4 py-2 bg-neon-blue/20 border border-neon-blue/30 rounded-lg text-neon-blue hover:bg-neon-blue/30 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Mod</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Mod</span>
                      </motion.button>
                      
                      {isAdmin && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowUnpublishModal(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 hover:bg-orange-500/30 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Unpublish</span>
                        </motion.button>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-blue">{downloadCount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-green">{mod.views.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Views</div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Released:</span>
                      <span>{new Date(mod.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>{new Date(mod.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Version:</span>
                      <span>{mod.version}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Access Type:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        mod.type === 'free' 
                          ? 'bg-gradient-to-r from-neon-green to-emerald-400 text-white' 
                          : mod.type === 'paid'
                          ? 'bg-gradient-to-r from-neon-orange to-yellow-400 text-white'
                          : 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                      }`}>
                        {mod.type === 'free' ? 'FREE' : mod.type === 'paid' ? `$${mod.price}` : 'UNLOCK CODE'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mod Type Info Card */}
                {mod.type !== 'free' && (
                  <div className={`gaming-card p-4 rounded-xl border-2 ${
                    mod.type === 'paid' 
                      ? 'border-neon-orange/50 bg-gradient-to-br from-neon-orange/5 to-transparent' 
                      : 'border-neon-purple/50 bg-gradient-to-br from-neon-purple/5 to-transparent'
                  }`}>
                    {mod.type === 'paid' ? (
                      <div className="text-center">
                        <h4 className="font-bold text-neon-orange mb-2 flex items-center justify-center gap-2">
                          <Download className="h-5 w-5" />
                          Premium Mod
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          This is a premium mod with advanced features and enhanced quality.
                        </p>
                        <p className="text-lg font-bold text-neon-orange">${mod.price}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <h4 className="font-bold text-neon-purple mb-2 flex items-center justify-center gap-2">
                          <Unlock className="h-5 w-5" />
                          Code Required
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Enter the unlock code to access this exclusive mod.
                        </p>
                        <p className="text-xs text-muted-foreground">Contact us for the unlock code</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {mod.type === 'free' || mod.canDownload ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownload}
                      className="flex-1 py-4 bg-gradient-to-r from-neon-green to-emerald-400 rounded-lg text-white font-bold text-lg hover-glow transition-all duration-300 flex items-center justify-center space-x-3"
                    >
                      <Download className="h-6 w-6" />
                      <span>Download {mod.type === 'free' ? 'Free' : ''}</span>
                    </motion.button>
                  ) : mod.type === 'paid' ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowPurchaseModal(true)}
                      className="flex-1 py-4 bg-gradient-to-r from-neon-orange to-yellow-400 rounded-lg text-white font-bold text-lg hover-glow transition-all duration-300 flex items-center justify-center space-x-3"
                    >
                      <Download className="h-6 w-6" />
                      <span>Buy for ${mod.price}</span>
                    </motion.button>
                  ) : (
                    // Show download button if already unlocked, otherwise show unlock button
                    isUnlocked ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownload}
                        className="flex-1 py-4 bg-gradient-to-r from-neon-green to-emerald-400 rounded-lg text-white font-bold text-lg hover-glow transition-all duration-300 flex items-center justify-center space-x-3"
                      >
                        <Download className="h-6 w-6" />
                        <span>Download Unlocked</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowUnlockModal(true)}
                        className="flex-1 py-4 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg text-white font-bold text-lg hover-glow transition-all duration-300 flex items-center justify-center space-x-3"
                      >
                        <Unlock className="h-6 w-6" />
                        <span>Enter Code</span>
                      </motion.button>
                    )
                  )}
                  
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleToggleFavorite}
                      disabled={isCheckingFavorite}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        isLiked 
                          ? 'border-red-500 text-red-500 bg-red-500/10' 
                          : 'border-gaming-border hover:border-neon-blue'
                      } ${isCheckingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="p-4 rounded-lg border-2 border-gaming-border hover:border-neon-blue transition-all duration-300"
                    >
                      <Share2 className="h-6 w-6" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 rounded-lg border-2 border-gaming-border hover:border-red-500 transition-all duration-300"
                    >
                      <Flag className="h-6 w-6" />
                    </motion.button>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {mod.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gaming-card border border-gaming-border rounded-full text-sm hover:border-neon-blue transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Detailed Information Tabs */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="gaming-card rounded-xl overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-gaming-border">
                {[
                  { id: 'description', label: 'Description', icon: FileText },
                  { id: 'reviews', label: `Reviews (${reviews.length})`, icon: MessageSquare },
                  { id: 'requirements', label: 'Requirements', icon: Tag }
                ].map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors ${
                        activeTab === tab.id
                          ? 'text-neon-blue border-b-2 border-neon-blue'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'description' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                        {mod.description}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Write Review Button */}
                    {isLoggedIn && (
                      <div className="text-center">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowReviewModal(true)}
                          className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-semibold hover-glow transition-all duration-300 flex items-center space-x-2 mx-auto"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>{userReview ? 'Edit Your Review' : 'Write a Review'}</span>
                        </motion.button>
                      </div>
                    )}

                    {/* Reviews Loading */}
                    {reviewsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-blue mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading reviews...</p>
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                        <p className="text-muted-foreground">
                          Be the first to review this mod!
                        </p>
                      </div>
                    ) : (
                      /* Reviews List */
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review._id} className="gaming-card p-6 rounded-lg border border-gaming-border">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-neon-purple to-neon-blue rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">
                                    {review.user?.username?.substring(0, 2).toUpperCase() || 'U'}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold">{review.user?.username || 'Anonymous'}</h4>
                                  <div className="flex items-center space-x-2">
                                    <div className="flex items-center">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-4 w-4 ${
                                            star <= review.rating
                                              ? 'text-yellow-400 fill-current'
                                              : 'text-gray-600'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {formatTimeAgo(review.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Review Actions */}
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleVoteReview(review._id, 'up')}
                                  className={`p-2 rounded-lg transition-colors ${
                                    review.userVote === 'up'
                                      ? 'bg-green-500/20 text-green-400'
                                      : 'hover:bg-gaming-darker'
                                  }`}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                  <span className="ml-1 text-xs">{review.upvotes || 0}</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleVoteReview(review._id, 'down')}
                                  className={`p-2 rounded-lg transition-colors ${
                                    review.userVote === 'down'
                                      ? 'bg-red-500/20 text-red-400'
                                      : 'hover:bg-gaming-darker'
                                  }`}
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                  <span className="ml-1 text-xs">{review.downvotes || 0}</span>
                                </motion.button>
                              </div>
                            </div>
                            
                            {review.comment && (
                              <p className="text-muted-foreground leading-relaxed">
                                {review.comment}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'requirements' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Game Version</h4>
                      <p className="text-muted-foreground">{mod.game}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Version</h4>
                      <p className="text-muted-foreground">{mod.version}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Category</h4>
                      <p className="text-muted-foreground">{mod.category}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Unlock Code Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="gaming-card p-8 rounded-xl max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full mx-auto mb-4 flex items-center justify-center">
                <Unlock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Enter Unlock Code</h3>
              <p className="text-muted-foreground">
                Enter the unlock code for "{mod.name}"
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={enteredCode}
                  onChange={(e) => {
                    setEnteredCode(e.target.value.toUpperCase())
                    setCodeError('')
                  }}
                  placeholder="Enter unlock code..."
                  className="w-full px-4 py-3 bg-gaming-darker border border-gaming-border rounded-lg text-center text-lg font-mono tracking-widest focus:outline-none focus:border-neon-purple transition-colors uppercase"
                  maxLength={20}
                />
                {codeError && (
                  <p className="text-red-400 text-sm mt-2 text-center">{codeError}</p>
                )}
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowUnlockModal(false)
                    setEnteredCode('')
                    setCodeError('')
                  }}
                  className="flex-1 py-3 bg-gaming-border rounded-lg text-white font-semibold hover:bg-gaming-border/80 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUnlockCode}
                  disabled={!enteredCode.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg text-white font-semibold hover-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Unlock
                </motion.button>
              </div>

              <div className="text-center pt-4 border-t border-gaming-border">
                <p className="text-xs text-muted-foreground mb-2">
                  Don't have an unlock code?
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('https://discord.gg/GcaakuhbVk', '_blank')}
                  className="text-neon-blue hover:text-neon-purple transition-colors text-sm font-semibold"
                >
                  Contact us for access
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="gaming-card p-8 rounded-xl max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-orange to-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Safe Purchase</h3>
              <p className="text-muted-foreground mb-4">
                Contact our admin team for secure payment
              </p>
              
              <div className="bg-gradient-to-r from-neon-orange/10 to-yellow-400/10 border border-neon-orange/30 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-left">{mod.name}</h4>
                    <p className="text-sm text-muted-foreground text-left">Premium mod</p>
                  </div>
                  <p className="text-2xl font-bold text-neon-orange">${mod.price}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 py-3 bg-gaming-border rounded-lg text-white font-semibold hover:bg-gaming-border/80 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePurchase}
                className="flex-1 py-3 bg-gradient-to-r from-neon-orange to-yellow-400 rounded-lg text-white font-semibold hover-glow transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Contact Admin</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="gaming-card p-8 rounded-xl max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {userReview ? 'Edit Review' : 'Write a Review'}
              </h3>
              <p className="text-muted-foreground">
                Share your experience with "{mod?.name}"
              </p>
            </div>

            <div className="space-y-6">
              {/* Star Rating */}
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-3">Your Rating</h4>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setUserRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoveredRating || userRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-600 hover:text-yellow-300'
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {userRating === 0 && 'Select a rating'}
                  {userRating === 1 && 'Poor'}
                  {userRating === 2 && 'Fair'}
                  {userRating === 3 && 'Good'}
                  {userRating === 4 && 'Very Good'}
                  {userRating === 5 && 'Excellent'}
                </p>
              </div>

              {/* Review Text */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Your Review (Optional)</h4>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell others about your experience with this mod..."
                  className="w-full px-4 py-3 bg-gaming-darker border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  {reviewText.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowReviewModal(false)
                    setHoveredRating(0)
                    if (!userReview) {
                      setUserRating(0)
                      setReviewText('')
                    }
                  }}
                  className="flex-1 py-3 bg-gaming-border rounded-lg text-white font-semibold hover:bg-gaming-border/80 transition-colors"
                >
                  Cancel
                </motion.button>
                
                {userReview && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteReview}
                    className="px-4 py-3 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReviewSubmit}
                  disabled={userRating === 0 || submittingReview}
                  className="flex-1 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-semibold hover-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {submittingReview ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>{userReview ? 'Update Review' : 'Submit Review'}</span>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="gaming-card p-8 rounded-xl max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Share This Mod</h3>
              <p className="text-muted-foreground">
                Share "{mod?.name}" with your friends
              </p>
            </div>

            <div className="space-y-4">
              {/* Copy Link */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyLink}
                className="w-full p-4 bg-gaming-darker border border-gaming-border rounded-lg hover:border-neon-blue transition-all duration-300 flex items-center space-x-3"
              >
                <Copy className="h-5 w-5 text-neon-blue" />
                <span className="flex-1 text-left">Copy Link</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </motion.button>

              {/* Social Media Grid */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialShare('twitter')}
                  className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white font-semibold hover-glow transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span>Twitter</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialShare('facebook')}
                  className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white font-semibold hover-glow transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialShare('discord')}
                  className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg text-white font-semibold hover-glow transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z"/>
                  </svg>
                  <span>Discord</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialShare('reddit')}
                  className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white font-semibold hover-glow transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                  <span>Reddit</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialShare('whatsapp')}
                  className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white font-semibold hover-glow transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span>WhatsApp</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialShare('telegram')}
                  className="p-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg text-white font-semibold hover-glow transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span>Telegram</span>
                </motion.button>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowShareModal(false)}
                className="w-full py-3 bg-gaming-border rounded-lg text-white font-semibold hover:bg-gaming-border/80 transition-colors mt-4"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gaming-card border border-gaming-border rounded-lg max-w-md w-full p-6"
          >
            <div className="text-center">
              <Trash2 className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Delete Mod</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete "{mod?.name}"? This action cannot be undone and will permanently remove the mod from the platform.
              </p>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gaming-border rounded-lg hover:bg-gaming-border/80 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleDeleteMod();
                    setShowDeleteModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Unpublish Confirmation Modal */}
      {showUnpublishModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gaming-card border border-gaming-border rounded-lg max-w-md w-full p-6"
          >
            <div className="text-center">
              <Settings className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Unpublish Mod</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to unpublish "{mod?.name}"? This will hide the mod from public view but preserve the data.
              </p>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUnpublishModal(false)}
                  className="flex-1 px-4 py-2 bg-gaming-border rounded-lg hover:bg-gaming-border/80 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleUnpublishMod();
                    setShowUnpublishModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white transition-colors"
                >
                  Unpublish
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Mod Modal */}
      {showEditModal && mod && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gaming-card border border-gaming-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Edit Mod</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gaming-border rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-neon-blue">Basic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Mod Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                      placeholder="Enter mod name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Short Description</label>
                    <input
                      type="text"
                      value={editForm.shortDescription}
                      onChange={(e) => setEditForm({...editForm, shortDescription: e.target.value})}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                      placeholder="Brief description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Version</label>
                    <input
                      type="text"
                      value={editForm.version}
                      onChange={(e) => setEditForm({...editForm, version: e.target.value})}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                      placeholder="e.g., 1.0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Game</label>
                    <select
                      value={editForm.game}
                      onChange={(e) => setEditForm({...editForm, game: e.target.value as 'FS22' | 'FS25' | 'Both'})}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                    >
                      <option value="FS22">Farming Simulator 22</option>
                      <option value="FS25">Farming Simulator 25</option>
                      <option value="Both">Both Games</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                    >
                      <option value="">Select Category</option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Implements">Implements</option>
                      <option value="Maps">Maps</option>
                      <option value="Buildings">Buildings</option>
                      <option value="Animals">Animals</option>
                      <option value="Scripts">Scripts</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-neon-blue">Additional Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={editForm.type}
                      onChange={(e) => setEditForm({...editForm, type: e.target.value as 'free' | 'paid' | 'unlock'})}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                      <option value="unlock">Unlock Code</option>
                    </select>
                  </div>

                  {editForm.type === 'paid' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Price ($)</label>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}

                  {editForm.type === 'unlock' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Unlock Code</label>
                      <input
                        type="text"
                        value={editForm.unlockCode}
                        onChange={(e) => setEditForm({...editForm, unlockCode: e.target.value})}
                        className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                        placeholder="Enter unlock code"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={editForm.tags.join(', ')}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      })}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                      placeholder="e.g., tractor, farming, vehicle"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Full Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                  rows={6}
                  placeholder="Detailed description of your mod..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 bg-gaming-border hover:bg-gaming-border/80 rounded-lg transition-colors"
                  disabled={isSubmittingEdit}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitEdit}
                  className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 rounded-lg text-white font-medium transition-all duration-300"
                  disabled={isSubmittingEdit}
                >
                  {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Unlock Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-gaming-card rounded-xl p-6 w-full max-w-md border border-gaming-border"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full mx-auto mb-4 flex items-center justify-center">
                <Unlock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Unlock Mod</h3>
              <p className="text-muted-foreground">
                Enter the unlock code to access <span className="text-neon-purple font-semibold">{mod?.name}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Unlock Code</label>
                <input
                  type="text"
                  value={enteredCode}
                  onChange={(e) => {
                    setEnteredCode(e.target.value)
                    setCodeError('')
                  }}
                  className="w-full px-4 py-3 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors text-center text-lg tracking-wider"
                  placeholder="Enter unlock code"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleUnlockCode()
                    }
                  }}
                />
                {codeError && (
                  <p className="text-red-400 text-sm mt-2">{codeError}</p>
                )}
              </div>

              <div className="bg-gaming-darker rounded-lg p-4">
                <h4 className="font-semibold text-neon-purple mb-2">How to get unlock codes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Contact the mod creator directly</li>
                  <li>• Check mod description for instructions</li>
                  <li>• Follow the creator on social media</li>
                  <li>• Join our Discord community</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowUnlockModal(false)
                    setEnteredCode('')
                    setCodeError('')
                  }}
                  className="flex-1 py-3 bg-gaming-border hover:bg-gaming-border/80 rounded-lg text-white font-semibold transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUnlockCode}
                  disabled={!enteredCode.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg text-white font-semibold hover-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Unlock
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  )
}
