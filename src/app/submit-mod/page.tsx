'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  FileText, 
  DollarSign, 
  GamepadIcon,
  ArrowLeft,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Tag
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'

interface SubmissionFormData {
  name: string;
  description: string;
  shortDescription: string;
  type: 'free' | 'paid' | 'unlock';
  price?: number;
  unlockCode?: string;
  version: string;
  game: 'FS22' | 'FS25' | 'Both';
  category: string;
  tags: string[];
  thumbnail: string;
  screenshots: string[];
  videoUrl?: string;
  downloadUrl: string;
  fileSize?: string;
  requirements: string[];
  dependencies: string[];
  conflicts: string[];
}

const categories = [
  'Tractors', 'Harvesters', 'Implements', 'Trailers', 
  'Trucks', 'Maps', 'Buildings', 'Animals', 'Textures', 'Scripts', 'Other'
]

const gameOptions = [
  { value: 'FS22', label: 'Farming Simulator 22' },
  { value: 'FS25', label: 'Farming Simulator 25' },
  { value: 'Both', label: 'Both FS22 & FS25' }
]

export default function SubmitModPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [screenshots, setScreenshots] = useState<string[]>([''])
  const [tags, setTags] = useState<string[]>([''])
  const [requirements, setRequirements] = useState<string[]>([''])
  const [dependencies, setDependencies] = useState<string[]>([''])
  const [conflicts, setConflicts] = useState<string[]>([''])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<SubmissionFormData>({
    defaultValues: {
      type: 'free',
      game: 'FS22',
      category: 'Tractors',
      screenshots: [],
      tags: [],
      requirements: [],
      dependencies: [],
      conflicts: []
    }
  })

  const watchType = watch('type')

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error('Please login to submit a mod')
      router.push('/login')
    }
  }, [user, isLoading, router])

  // Update form values when arrays change
  useEffect(() => {
    setValue('screenshots', screenshots.filter(s => s.trim() !== ''))
  }, [screenshots, setValue])

  useEffect(() => {
    setValue('tags', tags.filter(t => t.trim() !== ''))
  }, [tags, setValue])

  useEffect(() => {
    setValue('requirements', requirements.filter(r => r.trim() !== ''))
  }, [requirements, setValue])

  useEffect(() => {
    setValue('dependencies', dependencies.filter(d => d.trim() !== ''))
  }, [dependencies, setValue])

  useEffect(() => {
    setValue('conflicts', conflicts.filter(c => c.trim() !== ''))
  }, [conflicts, setValue])

  // Clear price and unlock code based on type changes
  useEffect(() => {
    if (watchType === 'free') {
      setValue('price', undefined)
      setValue('unlockCode', undefined)
    } else if (watchType === 'unlock') {
      setValue('price', undefined)
    } else if (watchType === 'paid') {
      setValue('unlockCode', undefined)
    }
  }, [watchType, setValue])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const addArrayItem = (array: string[], setArray: (arr: string[]) => void, maxLength: number) => {
    if (array.length < maxLength) {
      setArray([...array, ''])
    }
  }

  const removeArrayItem = (array: string[], setArray: (arr: string[]) => void, index: number) => {
    if (array.length > 1) {
      setArray(array.filter((_, i) => i !== index))
    }
  }

  const updateArrayItem = (array: string[], setArray: (arr: string[]) => void, index: number, value: string) => {
    const newArray = [...array]
    newArray[index] = value
    setArray(newArray)
  }

  const validateForm = (data: SubmissionFormData): string[] => {
    const errors: string[] = []
    
    if (!data.name || data.name.length < 3) {
      errors.push('Mod name must be at least 3 characters')
    }
    
    if (!data.description || data.description.length < 50) {
      errors.push('Description must be at least 50 characters')
    }
    
    if (!data.shortDescription || data.shortDescription.length < 10) {
      errors.push('Short description must be at least 10 characters')
    }
    
    if (!data.version || !/^\d+\.\d+\.\d+$/.test(data.version)) {
      errors.push('Version must be in format x.y.z (e.g., 1.0.0)')
    }
    
    if (!data.thumbnail || !/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(data.thumbnail)) {
      errors.push('Thumbnail must be a valid image URL')
    }
    
    if (!data.downloadUrl || !/^https?:\/\/.+/.test(data.downloadUrl)) {
      errors.push('Download URL must be a valid URL')
    }
    
    if (data.type === 'paid' && (!data.price || data.price <= 0)) {
      errors.push('Price is required for paid mods')
    }
    
    if (data.type === 'unlock' && !data.unlockCode) {
      errors.push('Unlock code is required for unlock mods')
    }
    
    return errors
  }

  const onSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true)
    
    try {
      // Clean data based on type
      const cleanedData = { ...data }
      if (cleanedData.type === 'free') {
        cleanedData.price = undefined
        cleanedData.unlockCode = undefined
      } else if (cleanedData.type === 'unlock') {
        cleanedData.price = undefined
      } else if (cleanedData.type === 'paid') {
        cleanedData.unlockCode = undefined
      }

      // Basic validation
      const validationErrors = validateForm(cleanedData)
      if (validationErrors.length > 0) {
        validationErrors.forEach(error => toast.error(error))
        return
      }

      const response = await api.post('/submissions', cleanedData)
      
      if (response.data.status === 'success') {
        toast.success('Mod submitted successfully! It will be reviewed by our team.')
        router.push('/profile')
      }
    } catch (error: any) {
      console.error('Submission error:', error)
      
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          toast.error(err.msg || err.message)
        })
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Failed to submit mod. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <button
                onClick={() => router.back()}
                className="inline-flex items-center space-x-2 text-neon-blue hover:text-neon-purple transition-colors mb-6"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              
              <h1 className="text-4xl font-gaming font-bold mb-4">
                <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                  Submit Your Mod
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Fill out the form below to submit your mod for review. Our team will review it within 24-48 hours.
              </p>
            </motion.div>

            {/* Submission Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="gaming-card p-6 rounded-xl mb-8 border border-neon-blue/30"
            >
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="h-6 w-6 text-neon-blue" />
                <h2 className="text-xl font-bold">Submission Guidelines</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-white mb-2">Required:</h3>
                  <ul className="space-y-1">
                    <li>• At least 1 screenshot (thumbnail)</li>
                    <li>• Direct download link to your mod file</li>
                    <li>• Detailed description (50+ characters)</li>
                    <li>• Working mod compatible with selected game</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Optional but Recommended:</h3>
                  <ul className="space-y-1">
                    <li>• Up to 5 additional screenshots</li>
                    <li>• YouTube preview video</li>
                    <li>• Installation requirements</li>
                    <li>• Dependency information</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Submission Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* Basic Information */}
              <div className="gaming-card p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-neon-blue" />
                  <span>Basic Information</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Mod Name *</label>
                    <input
                      {...register('name', { required: true })}
                      className="w-full px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors"
                      placeholder="Enter mod name"
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">Mod name is required</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Version *</label>
                    <input
                      {...register('version', { required: true })}
                      className="w-full px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors"
                      placeholder="e.g., 1.0.0"
                    />
                    {errors.version && <p className="text-red-400 text-sm mt-1">Version is required</p>}
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Short Description *</label>
                  <input
                    {...register('shortDescription', { required: true })}
                    className="w-full px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors"
                    placeholder="Brief description (10-200 characters)"
                  />
                  {errors.shortDescription && <p className="text-red-400 text-sm mt-1">Short description is required</p>}
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Full Description *</label>
                  <textarea
                    {...register('description', { required: true })}
                    rows={6}
                    className="w-full px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors resize-none"
                    placeholder="Detailed description of your mod (50-2000 characters)"
                  />
                  {errors.description && <p className="text-red-400 text-sm mt-1">Description is required</p>}
                </div>
              </div>

              {/* Game & Category */}
              <div className="gaming-card p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                  <GamepadIcon className="h-6 w-6 text-neon-green" />
                  <span>Game & Category</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Game Compatibility *</label>
                    <select
                      {...register('game', { required: true })}
                      className="w-full px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors"
                    >
                      {gameOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.game && <p className="text-red-400 text-sm mt-1">Game compatibility is required</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      {...register('category', { required: true })}
                      className="w-full px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-400 text-sm mt-1">Category is required</p>}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="gaming-card p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                  <DollarSign className="h-6 w-6 text-neon-orange" />
                  <span>Pricing & Access</span>
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type *</label>
                    <select
                      {...register('type', { required: true })}
                      className="w-full px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors"
                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                      <option value="unlock">Unlock Code</option>
                    </select>
                    {errors.type && <p className="text-red-400 text-sm mt-1">Type is required</p>}
                  </div>
                  
                  {watchType === 'paid' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (USD) *</label>
                      <input
                        {...register('price', { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="999.99"
                        className="w-full px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                  
                  {watchType === 'unlock' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Unlock Code *</label>
                      <input
                        {...register('unlockCode')}
                        className="w-full px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors"
                        placeholder="Enter unlock code"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Files & Media */}
              <div className="gaming-card p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                  <Upload className="h-6 w-6 text-neon-purple" />
                  <span>Files & Media</span>
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Download URL *</label>
                    <input
                      {...register('downloadUrl', { required: true })}
                      className="w-full px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors"
                      placeholder="Direct link to your mod file"
                    />
                    {errors.downloadUrl && <p className="text-red-400 text-sm mt-1">Download URL is required</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">File Size (Optional)</label>
                    <input
                      {...register('fileSize')}
                      className="w-full px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors"
                      placeholder="e.g., 45.2 MB"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Thumbnail Image URL *</label>
                    <input
                      {...register('thumbnail', { required: true })}
                      className="w-full px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors"
                      placeholder="Direct link to thumbnail image"
                    />
                    {errors.thumbnail && <p className="text-red-400 text-sm mt-1">Thumbnail image is required</p>}
                  </div>
                  
                  {/* Screenshots */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Screenshots (Up to 5)</label>
                    <div className="space-y-3">
                      {screenshots.map((screenshot, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            value={screenshot}
                            onChange={(e) => updateArrayItem(screenshots, setScreenshots, index, e.target.value)}
                            className="flex-1 px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors"
                            placeholder="Screenshot image URL"
                          />
                          {screenshots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem(screenshots, setScreenshots, index)}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      {screenshots.length < 5 && (
                        <button
                          type="button"
                          onClick={() => addArrayItem(screenshots, setScreenshots, 5)}
                          className="flex items-center space-x-2 text-neon-blue hover:text-neon-purple transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Screenshot</span>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">YouTube Preview Video (Optional)</label>
                    <input
                      {...register('videoUrl')}
                      className="w-full px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors"
                      placeholder="YouTube video URL"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="gaming-card p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                  <Tag className="h-6 w-6 text-neon-pink" />
                  <span>Tags (Up to 10)</span>
                </h3>
                
                <div className="space-y-3">
                  {tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        value={tag}
                        onChange={(e) => updateArrayItem(tags, setTags, index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-gaming-dark border border-white/20 rounded-lg focus:border-neon-blue focus:outline-none transition-colors"
                        placeholder="Enter tag"
                      />
                      {tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(tags, setTags, index)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {tags.length < 10 && (
                    <button
                      type="button"
                      onClick={() => addArrayItem(tags, setTags, 10)}
                      className="flex items-center space-x-2 text-neon-blue hover:text-neon-purple transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Tag</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-3 px-12 py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-bold text-lg hover-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-6 w-6" />
                      <span>Submit Mod for Review</span>
                    </>
                  )}
                </button>
                
                <p className="text-sm text-muted-foreground mt-4">
                  By submitting, you agree that your mod meets our quality standards and you have the rights to distribute it.
                </p>
              </motion.div>
            </motion.form>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
