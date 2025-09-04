'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Eye, 
  Check, 
  X, 
  Filter,
  Search,
  Calendar,
  User,
  Package,
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Image as ImageIcon
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
  version: string
  game: 'FS22' | 'FS25' | 'Both'
  category: string
  thumbnail: string
  downloadUrl: string
  status: 'pending' | 'approved' | 'rejected' | 'published'
  submittedBy: {
    _id: string
    username: string
    email: string
    gamerTag?: string
  }
  submittedAt: string
  reviewedBy?: {
    _id: string
    username: string
  }
  reviewedAt?: string
  reviewNotes?: string
  rejectionReason?: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalResults: number
  hasNext: boolean
  hasPrev: boolean
}

export default function AdminSubmissions() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [submissions, setSubmissions] = useState<ModSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<ModSubmission | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve')
  const [reviewNotes, setReviewNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  // Filters and pagination
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      })
      
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const endpoint = statusFilter === 'pending' ? '/submissions/admin/pending' : '/submissions/admin/all'
      const response = await api.get(`${endpoint}?${params.toString()}`)
      
      if (response.data.status === 'success') {
        setSubmissions(response.data.data.submissions)
        setPagination(response.data.data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
      toast.error('Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, currentPage])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      toast.error('Access denied. Admin privileges required.')
      router.push('/')
      return
    }

    if (user && user.role === 'admin') {
      fetchSubmissions()
    }
  }, [user, isLoading, router, fetchSubmissions])

  const handleReviewSubmission = (submission: ModSubmission, action: 'approve' | 'reject') => {
    setSelectedSubmission(submission)
    setReviewAction(action)
    setShowReviewModal(true)
    setReviewNotes('')
    setRejectionReason('')
  }

  const submitReview = async () => {
    if (!selectedSubmission) return
    
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

      const response = await api.patch(`/submissions/admin/${selectedSubmission._id}/review`, reviewData)
      
      if (response.data.status === 'success') {
        toast.success(`Submission ${reviewAction}d successfully!`)
        setShowReviewModal(false)
        setSelectedSubmission(null)
        fetchSubmissions() // Refresh the list
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
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="h-3 w-3" />
        <span className="capitalize">{status}</span>
      </span>
    )
  }

  const filteredSubmissions = submissions.filter(submission =>
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.submittedBy.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gaming-dark">
      {/* Header */}
      <div className="bg-gaming-darker border-b border-gaming-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-neon-blue hover:text-neon-purple transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <FileText className="h-8 w-8 text-neon-blue" />
              <h1 className="text-xl font-bold text-white">Submission Management</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              {pagination?.totalResults || 0} total submissions
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gaming-card p-6 rounded-xl mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="bg-gaming-darker border border-gaming-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-blue"
                >
                  <option value="pending">Pending Review</option>
                  <option value="all">All Submissions</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            
            <div className="relative">
              <Search className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gaming-darker border border-gaming-border rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-neon-blue w-full md:w-80"
              />
            </div>
          </div>
        </motion.div>

        {/* Submissions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission, index) => (
              <motion.div
                key={submission._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="gaming-card p-6 rounded-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4 flex-1">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-gaming-darker rounded-lg overflow-hidden flex-shrink-0">
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
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Submission Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white truncate">{submission.name}</h3>
                        {getStatusBadge(submission.status)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {submission.shortDescription}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{submission.submittedBy.username}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Package className="h-3 w-3" />
                          <span>{submission.game} • {submission.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className={`px-2 py-1 rounded text-xs ${
                            submission.type === 'free' ? 'bg-green-500/20 text-green-400' :
                            submission.type === 'paid' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {submission.type === 'paid' ? `$${submission.price}` : submission.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={`/admin/submissions/${submission._id}`}
                      className="p-2 bg-gaming-darker hover:bg-neon-blue/20 rounded-lg transition-colors group"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4 text-neon-blue group-hover:text-white" />
                    </Link>
                    
                    {submission.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleReviewSubmission(submission, 'approve')}
                          className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors group"
                          title="Approve"
                        >
                          <Check className="h-4 w-4 text-green-400 group-hover:text-white" />
                        </button>
                        
                        <button
                          onClick={() => handleReviewSubmission(submission, 'reject')}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors group"
                          title="Reject"
                        >
                          <X className="h-4 w-4 text-red-400 group-hover:text-white" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Review Info */}
                {submission.reviewedBy && (
                  <div className="mt-4 pt-4 border-t border-gaming-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Reviewed by {submission.reviewedBy.username} on{' '}
                        {submission.reviewedAt && new Date(submission.reviewedAt).toLocaleDateString()}
                      </span>
                      {submission.reviewNotes && (
                        <span className="italic">"{submission.reviewNotes}"</span>
                      )}
                    </div>
                    {submission.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                        <strong>Rejection Reason:</strong> {submission.rejectionReason}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="gaming-card p-12 rounded-xl text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No submissions found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Try adjusting your search terms or filters" 
                  : "No submissions match the current filter"}
              </p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center space-x-2 mt-8"
          >
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-neon-blue transition-colors"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={!pagination.hasNext}
              className="px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-neon-blue transition-colors"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedSubmission && (
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
              <p className="text-sm text-muted-foreground mb-2">Mod: {selectedSubmission.name}</p>
              <p className="text-sm text-muted-foreground">
                By: {selectedSubmission.submittedBy.username}
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
