'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Package, 
  Download, 
  ExternalLink,
  FileText,
  Check,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  DollarSign,
  Lock,
  Image as ImageIcon,
  Youtube
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import { toast } from 'sonner'

interface ModSubmission {
  _id: string
  name: string
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
  downloadUrl: string
  fileSize?: string
  requirements: string[]
  dependencies: string[]
  conflicts: string[]
  status: 'pending' | 'approved' | 'rejected' | 'published'
  submittedBy: {
    _id: string
    username: string
    email: string
    gamerTag?: string
    joinedAt: string
  }
  submittedAt: string
  reviewedBy?: {
    _id: string
    username: string
  }
  reviewedAt?: string
  reviewNotes?: string
  rejectionReason?: string
  publishedModId?: {
    _id: string
    slug: string
    name: string
  }
}

export default function SubmissionDetails() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading } = useAuth()
  const [submission, setSubmission] = useState<ModSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve')
  const [reviewNotes, setReviewNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchSubmission = useCallback(async () => {
    try {
      const response = await api.get(`/submissions/${params.id}`)
      if (response.data.status === 'success') {
        setSubmission(response.data.data.submission)
      }
    } catch (error) {
      console.error('Failed to fetch submission:', error)
      toast.error('Failed to load submission details')
      router.push('/admin/submissions')
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      toast.error('Access denied. Admin privileges required.')
      router.push('/')
      return
    }

    if (user && user.role === 'admin' && params.id) {
      fetchSubmission()
    }
  }, [user, isLoading, router, params.id, fetchSubmission])

  const handleReviewSubmission = (action: 'approve' | 'reject') => {
    setReviewAction(action)
    setShowReviewModal(true)
    setReviewNotes('')
    setRejectionReason('')
  }

  const submitReview = async () => {
    if (!submission) return
    
    if (reviewAction === 'reject' && !rejectionReason.trim()) {
      toast.error('Rejection reason is required')
      return
    }

    setSubmitting(true)
    try {
      const reviewData = {
        action: reviewAction,
        reviewNotes: reviewNotes.trim() || undefined,
        rejectionReason: reviewAction === 'reject' ? rejectionReason.trim() : undefined
      }

      const response = await api.patch(`/submissions/admin/${submission._id}/review`, reviewData)
      
      if (response.data.status === 'success') {
        toast.success(`Submission ${reviewAction}d successfully!`)
        setShowReviewModal(false)
        fetchSubmission() // Refresh the submission
      }
    } catch (error: any) {
      console.error('Failed to review submission:', error)
      toast.error(error.response?.data?.message || 'Failed to review submission')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Clock },
      approved: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle },
      published: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Package }
    }

    const badge = badges[status as keyof typeof badges] || badges.pending
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="h-4 w-4" />
        <span className="capitalize">{status}</span>
      </span>
    )
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
      </div>
    )
  }

  if (!user || user.role !== 'admin' || !submission) {
    return null
  }

  return (
    <div className="min-h-screen bg-gaming-dark">
      {/* Header */}
      <div className="bg-gaming-darker border-b border-gaming-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/submissions" className="text-neon-blue hover:text-neon-purple transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <FileText className="h-8 w-8 text-neon-blue" />
              <div>
                <h1 className="text-xl font-bold text-white">{submission.name}</h1>
                <p className="text-sm text-muted-foreground">Submission Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {getStatusBadge(submission.status)}
              {submission.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReviewSubmission('approve')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReviewSubmission('reject')}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="gaming-card p-6 rounded-xl"
            >
              <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Mod Name</label>
                  <p className="text-white font-medium">{submission.name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Version</label>
                  <p className="text-white font-medium">{submission.version}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Game Compatibility</label>
                  <p className="text-white font-medium">{submission.game}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Category</label>
                  <p className="text-white font-medium">{submission.category}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Type</label>
                  <div className="flex items-center space-x-2">
                    {submission.type === 'free' && (
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">Free</span>
                    )}
                    {submission.type === 'paid' && (
                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span>${submission.price}</span>
                      </span>
                    )}
                    {submission.type === 'unlock' && (
                      <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-sm flex items-center space-x-1">
                        <Lock className="h-3 w-3" />
                        <span>Unlock Code</span>
                      </span>
                    )}
                  </div>
                </div>
                {submission.fileSize && (
                  <div>
                    <label className="text-sm text-muted-foreground">File Size</label>
                    <p className="text-white font-medium">{submission.fileSize}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Descriptions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="gaming-card p-6 rounded-xl"
            >
              <h2 className="text-xl font-bold text-white mb-4">Description</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Short Description</label>
                  <p className="text-white">{submission.shortDescription}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Full Description</label>
                  <div className="text-white whitespace-pre-wrap bg-gaming-darker p-4 rounded-lg">
                    {submission.description}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="gaming-card p-6 rounded-xl"
            >
              <h2 className="text-xl font-bold text-white mb-4">Media</h2>
              
              {/* Thumbnail */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground block mb-2">Thumbnail</label>
                <div className="w-48 h-32 bg-gaming-darker rounded-lg overflow-hidden">
                  {submission.thumbnail ? (
                    <img
                      src={submission.thumbnail}
                      alt={submission.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                        ;(e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center hidden">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Screenshots */}
              {submission.screenshots && submission.screenshots.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm text-muted-foreground block mb-2">
                    Screenshots ({submission.screenshots.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {submission.screenshots.map((screenshot, index) => (
                      <div key={index} className="aspect-video bg-gaming-darker rounded-lg overflow-hidden">
                        <img
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                            ;(e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                        <div className="w-full h-full flex items-center justify-center hidden">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {submission.videoUrl && (
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Preview Video</label>
                  <a
                    href={submission.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-neon-blue hover:text-neon-purple transition-colors"
                  >
                    <Youtube className="h-4 w-4" />
                    <span>View on YouTube</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </motion.div>

            {/* Additional Info */}
            {(submission.tags.length > 0 || submission.requirements.length > 0 || submission.dependencies.length > 0 || submission.conflicts.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="gaming-card p-6 rounded-xl"
              >
                <h2 className="text-xl font-bold text-white mb-4">Additional Information</h2>
                
                <div className="space-y-4">
                  {submission.tags.length > 0 && (
                    <div>
                      <label className="text-sm text-muted-foreground block mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {submission.tags.map((tag, index) => (
                          <span key={index} className="bg-neon-blue/20 text-neon-blue px-2 py-1 rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {submission.requirements.length > 0 && (
                    <div>
                      <label className="text-sm text-muted-foreground block mb-2">Requirements</label>
                      <ul className="text-white space-y-1">
                        {submission.requirements.map((req, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-neon-blue rounded-full"></div>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {submission.dependencies.length > 0 && (
                    <div>
                      <label className="text-sm text-muted-foreground block mb-2">Dependencies</label>
                      <ul className="text-white space-y-1">
                        {submission.dependencies.map((dep, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-neon-green rounded-full"></div>
                            <span>{dep}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {submission.conflicts.length > 0 && (
                    <div>
                      <label className="text-sm text-muted-foreground block mb-2">Conflicts</label>
                      <ul className="text-white space-y-1">
                        {submission.conflicts.map((conflict, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                            <span>{conflict}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submitter Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="gaming-card p-6 rounded-xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Submitter Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-neon-blue" />
                  <div>
                    <p className="text-white font-medium">{submission.submittedBy.username}</p>
                    <p className="text-xs text-muted-foreground">{submission.submittedBy.email}</p>
                  </div>
                </div>
                
                {submission.submittedBy.gamerTag && (
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-neon-purple" />
                    <div>
                      <p className="text-white font-medium">{submission.submittedBy.gamerTag}</p>
                      <p className="text-xs text-muted-foreground">Gamer Tag</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-neon-green" />
                  <div>
                    <p className="text-white font-medium">
                      {new Date(submission.submittedBy.joinedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Member since</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Download Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="gaming-card p-6 rounded-xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Download Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Download URL</label>
                  <a
                    href={submission.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-neon-blue hover:text-neon-purple transition-colors text-sm break-all"
                  >
                    <Download className="h-4 w-4 flex-shrink-0" />
                    <span>Download File</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </div>
                
                {submission.unlockCode && (
                  <div>
                    <label className="text-sm text-muted-foreground">Unlock Code</label>
                    <p className="text-white font-mono bg-gaming-darker p-2 rounded text-sm">
                      {submission.unlockCode}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Submission Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="gaming-card p-6 rounded-xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {submission.reviewedBy && submission.reviewedAt && (
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      submission.status === 'approved' || submission.status === 'published'
                        ? 'bg-green-500/20'
                        : 'bg-red-500/20'
                    }`}>
                      {submission.status === 'approved' || submission.status === 'published' ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {submission.status === 'approved' || submission.status === 'published' ? 'Approved' : 'Rejected'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {submission.reviewedBy.username} on {new Date(submission.reviewedAt).toLocaleString()}
                      </p>
                      {submission.reviewNotes && (
                        <p className="text-xs text-muted-foreground italic mt-1">
                          "{submission.reviewNotes}"
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {submission.publishedModId && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Published</p>
                      <Link
                        href={`/mods/${submission.publishedModId.slug}`}
                        className="text-xs text-neon-blue hover:text-neon-purple transition-colors"
                      >
                        View Published Mod
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Rejection Reason */}
            {submission.status === 'rejected' && submission.rejectionReason && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="gaming-card p-6 rounded-xl border-red-500/30"
              >
                <h3 className="text-lg font-bold text-red-400 mb-4">Rejection Reason</h3>
                <div className="bg-red-500/10 p-4 rounded-lg">
                  <p className="text-white">{submission.rejectionReason}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gaming-dark border border-gaming-border rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Submission
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Mod: {submission.name}</p>
              <p className="text-sm text-muted-foreground">
                By: {submission.submittedBy.username}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Review Notes (Optional)
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add any notes about this review..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white focus:outline-none focus:border-neon-blue resize-none"
                />
              </div>

              {reviewAction === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why this submission is being rejected..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white focus:outline-none focus:border-neon-blue resize-none"
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white hover:border-neon-blue transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={submitting || (reviewAction === 'reject' && !rejectionReason.trim())}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  reviewAction === 'approve'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {submitting ? 'Processing...' : `${reviewAction === 'approve' ? 'Approve' : 'Reject'} Submission`}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
