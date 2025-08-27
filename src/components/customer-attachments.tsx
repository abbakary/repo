"use client"

import { useState, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Upload, 
  X, 
  File, 
  Image, 
  FileText, 
  Eye, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Plus
} from "lucide-react"

interface CustomerAttachmentsProps {
  customerId: number
  customerName: string
  onClose: () => void
}

interface AttachmentFile {
  id: string
  name: string
  size: number
  type: string
  category: string
  uploadProgress: number
  status: "pending" | "uploading" | "completed" | "error"
  url?: string
  uploadedAt?: string
  uploadedBy?: string
}

const attachmentCategories = [
  { value: "id_documents", label: "ID Documents" },
  { value: "vehicle_documents", label: "Vehicle Documents" },
  { value: "service_records", label: "Service Records" },
  { value: "photos", label: "Photos/Images" },
  { value: "invoices", label: "Invoices/Receipts" },
  { value: "insurance", label: "Insurance Documents" },
  { value: "other", label: "Other" },
]

// Mock existing attachments
const mockExistingAttachments: AttachmentFile[] = [
  {
    id: "1",
    name: "national_id.pdf",
    size: 1024000,
    type: "application/pdf",
    category: "id_documents",
    uploadProgress: 100,
    status: "completed",
    url: "/attachments/1",
    uploadedAt: "2024-01-20T10:30:00",
    uploadedBy: "Admin User"
  },
  {
    id: "2", 
    name: "vehicle_registration.jpg",
    size: 2048000,
    type: "image/jpeg",
    category: "vehicle_documents",
    uploadProgress: 100,
    status: "completed",
    url: "/attachments/2",
    uploadedAt: "2024-01-18T14:20:00",
    uploadedBy: "Office Manager"
  }
]

export function CustomerAttachments({ customerId, customerName, onClose }: CustomerAttachmentsProps) {
  const [attachments, setAttachments] = useState<AttachmentFile[]>(mockExistingAttachments)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedCategory, setSelectedCategory] = useState("other")
  const [dragActive, setDragActive] = useState(false)
  const [viewingFile, setViewingFile] = useState<AttachmentFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setSelectedFiles(prev => [...prev, ...files])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...files])
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const simulateUpload = async (file: File): Promise<AttachmentFile> => {
    const fileId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const attachment: AttachmentFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      category: selectedCategory,
      uploadProgress: 0,
      status: "uploading",
    }

    // Add to attachments list
    setAttachments(prev => [...prev, attachment])

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      setAttachments(prev => prev.map(att => 
        att.id === fileId 
          ? { ...att, uploadProgress: progress }
          : att
      ))
    }

    // Mark as completed
    const completedAttachment: AttachmentFile = {
      ...attachment,
      uploadProgress: 100,
      status: "completed",
      url: `/attachments/${fileId}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Current User"
    }

    setAttachments(prev => prev.map(att => 
      att.id === fileId ? completedAttachment : att
    ))

    return completedAttachment
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    try {
      // Upload all selected files
      const uploadPromises = selectedFiles.map(file => simulateUpload(file))
      await Promise.all(uploadPromises)
      
      // Clear selected files
      setSelectedFiles([])
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Upload error:", error)
    }
  }

  const handleDelete = (attachmentId: string) => {
    if (confirm("Are you sure you want to delete this attachment?")) {
      setAttachments(prev => prev.filter(att => att.id !== attachmentId))
    }
  }

  const handleView = (attachment: AttachmentFile) => {
    setViewingFile(attachment)
  }

  const handleDownload = (attachment: AttachmentFile) => {
    if (attachment.url) {
      const link = document.createElement('a')
      link.href = attachment.url
      link.download = attachment.name
      link.click()
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "uploading": return <Clock className="h-4 w-4 text-blue-600" />
      case "error": return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getCategoryLabel = (category: string) => {
    const cat = attachmentCategories.find(c => c.value === category)
    return cat?.label || category
  }

  const getUploadStats = () => {
    const total = attachments.length
    const completed = attachments.filter(a => a.status === "completed").length
    const uploading = attachments.filter(a => a.status === "uploading").length
    const totalSize = attachments.reduce((sum, a) => sum + a.size, 0)
    
    return { total, completed, uploading, totalSize }
  }

  const stats = getUploadStats()

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Customer Attachments - {customerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.uploading}</div>
                <p className="text-sm text-muted-foreground">Uploading</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{formatFileSize(stats.totalSize)}</div>
                <p className="text-sm text-muted-foreground">Total Size</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Files</CardTitle>
                  <CardDescription>Add documents and files for this customer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>File Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {attachmentCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Drag and Drop Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive 
                        ? "border-primary bg-primary/5" 
                        : "border-muted-foreground/25 hover:border-primary/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports: PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB per file)
                    </p>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Select Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      className="hidden"
                    />
                  </div>

                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Files ({selectedFiles.length})</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex items-center gap-2">
                              {getFileIcon(file.type)}
                              <span className="text-sm">{file.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {formatFileSize(file.size)}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSelectedFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={handleUpload} 
                        className="w-full"
                        disabled={selectedFiles.length === 0}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload {selectedFiles.length} File(s)
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Existing Attachments */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Existing Attachments</CardTitle>
                  <CardDescription>Manage uploaded files for this customer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="border rounded-lg p-3 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getFileIcon(attachment.type)}
                            <div>
                              <p className="font-medium text-sm">{attachment.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {getCategoryLabel(attachment.category)}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatFileSize(attachment.size)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(attachment.status)}
                            {attachment.status === "completed" && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => handleView(attachment)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDownload(attachment)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDelete(attachment.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Upload Progress */}
                        {attachment.status === "uploading" && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Uploading...</span>
                              <span>{attachment.uploadProgress}%</span>
                            </div>
                            <Progress value={attachment.uploadProgress} className="h-2" />
                          </div>
                        )}

                        {/* Upload Info */}
                        {attachment.status === "completed" && attachment.uploadedAt && (
                          <div className="text-xs text-muted-foreground">
                            Uploaded on {new Date(attachment.uploadedAt).toLocaleDateString()} by {attachment.uploadedBy}
                          </div>
                        )}
                      </div>
                    ))}

                    {attachments.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No attachments found</p>
                        <p className="text-sm">Upload files to get started</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* File Viewer Modal */}
        {viewingFile && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-lg">{viewingFile.name}</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(viewingFile)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setViewingFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 h-[70vh] overflow-auto">
                {viewingFile.type.startsWith('image/') ? (
                  <img
                    src={viewingFile.url}
                    alt={viewingFile.name}
                    className="max-w-full h-auto mx-auto"
                  />
                ) : viewingFile.type === 'application/pdf' ? (
                  <iframe
                    src={viewingFile.url}
                    className="w-full h-full border-0"
                    title={viewingFile.name}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <File className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-lg font-medium mb-2">{viewingFile.name}</p>
                    <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                    <Button onClick={() => handleDownload(viewingFile)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download to view
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
