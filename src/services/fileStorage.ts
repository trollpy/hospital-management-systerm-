// File storage service for handling document uploads and management

interface FileUploadOptions {
  maxSize?: number
  allowedTypes?: string[]
  onProgress?: (progress: number) => void
}

interface StoredFile {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedAt: string
  metadata?: Record<string, any>
}

/**
 * File storage service for handling document uploads
 */
export class FileStorageService {
  private static instance: FileStorageService
  private baseUrl: string

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_CONVEX_URL || ''
  }

  public static getInstance(): FileStorageService {
    if (!FileStorageService.instance) {
      FileStorageService.instance = new FileStorageService()
    }
    return FileStorageService.instance
  }

  /**
   * Upload a file to Convex storage
   */
  public async uploadFile(
    file: File,
    options: FileUploadOptions = {}
  ): Promise<StoredFile> {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/*', 'application/pdf', 'text/plain'],
      onProgress,
    } = options

    // Validate file size
    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`)
    }

    // Validate file type
    if (!this.isFileTypeAllowed(file.type, allowedTypes)) {
      throw new Error('File type not allowed')
    }

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)

      // Upload to Convex storage
      const response = await fetch(`${this.baseUrl}/uploadFile`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('File upload failed')
      }

      const result = await response.json()

      const storedFile: StoredFile = {
        id: result.storageId,
        name: file.name,
        url: result.url,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      }

      return storedFile
    } catch (error) {
      console.error('File upload error:', error)
      throw new Error('Failed to upload file')
    }
  }

  /**
   * Upload multiple files
   */
  public async uploadFiles(
    files: File[],
    options: FileUploadOptions = {}
  ): Promise<StoredFile[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, options))
    return Promise.all(uploadPromises)
  }

  /**
   * Get file URL
   */
  public getFileUrl(storageId: string): string {
    return `${this.baseUrl}/getFile?storageId=${storageId}`
  }

  /**
   * Delete a file
   */
  public async deleteFile(storageId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/deleteFile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storageId }),
      })

      return response.ok
    } catch (error) {
      console.error('File deletion error:', error)
      return false
    }
  }

  /**
   * Download a file
   */
  public async downloadFile(storageId: string, filename: string): Promise<void> {
    try {
      const url = this.getFileUrl(storageId)
      const response = await fetch(url)
      const blob = await response.blob()

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('File download error:', error)
      throw new Error('Failed to download file')
    }
  }

  /**
   * Check if file type is allowed
   */
  private isFileTypeAllowed(fileType: string, allowedTypes: string[]): boolean {
    return allowedTypes.some(allowedType => {
      if (allowedType.endsWith('/*')) {
        const category = allowedType.split('/')[0]
        return fileType.startsWith(`${category}/`)
      }
      return fileType === allowedType
    })
  }

  /**
   * Get file preview URL (for images and PDFs)
   */
  public getFilePreviewUrl(storageId: string, fileType: string): string {
    if (fileType.startsWith('image/')) {
      return this.getFileUrl(storageId)
    }
    
    if (fileType === 'application/pdf') {
      // For PDFs, we might want to use a PDF viewer
      return this.getFileUrl(storageId)
    }

    // For other file types, return a generic icon
    return this.getFileIconUrl(fileType)
  }

  /**
   * Get appropriate icon for file type
   */
  private getFileIconUrl(fileType: string): string {
    const icons: Record<string, string> = {
      'application/pdf': '/icons/file-pdf.svg',
      'image/*': '/icons/file-image.svg',
      'text/plain': '/icons/file-text.svg',
      'application/msword': '/icons/file-word.svg',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '/icons/file-word.svg',
      'application/vnd.ms-excel': '/icons/file-excel.svg',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '/icons/file-excel.svg',
    }

    for (const [pattern, icon] of Object.entries(icons)) {
      if (pattern.endsWith('/*') && fileType.startsWith(pattern.split('/')[0])) {
        return icon
      }
      if (fileType === pattern) {
        return icon
      }
    }

    return '/icons/file-generic.svg'
  }

  /**
   * Validate file before upload
   */
  public validateFile(file: File, options: FileUploadOptions = {}): string | null {
    const { maxSize = 10 * 1024 * 1024, allowedTypes = ['image/*', 'application/pdf', 'text/plain'] } = options

    if (file.size > maxSize) {
      return `File must be smaller than ${maxSize / 1024 / 1024}MB`
    }

    if (!this.isFileTypeAllowed(file.type, allowedTypes)) {
      return 'File type not allowed'
    }

    return null
  }

  /**
   * Get human-readable file size
   */
  public formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  /**
   * Get file type category
   */
  public getFileCategory(fileType: string): string {
    if (fileType.startsWith('image/')) return 'image'
    if (fileType.startsWith('video/')) return 'video'
    if (fileType.startsWith('audio/')) return 'audio'
    if (fileType === 'application/pdf') return 'pdf'
    if (fileType.startsWith('text/')) return 'text'
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'spreadsheet'
    if (fileType.includes('document') || fileType.includes('word')) return 'document'
    return 'other'
  }
}

// Export singleton instance
export const fileStorageService = FileStorageService.getInstance()

/**
 * React hook for file storage
 */
export function useFileStorage() {
  const uploadFile = async (file: File, options?: FileUploadOptions) => {
    return fileStorageService.uploadFile(file, options)
  }

  const uploadFiles = async (files: File[], options?: FileUploadOptions) => {
    return fileStorageService.uploadFiles(files, options)
  }

  const deleteFile = async (storageId: string) => {
    return fileStorageService.deleteFile(storageId)
  }

  const downloadFile = async (storageId: string, filename: string) => {
    return fileStorageService.downloadFile(storageId, filename)
  }

  const getFileUrl = (storageId: string) => {
    return fileStorageService.getFileUrl(storageId)
  }

  const getFilePreviewUrl = (storageId: string, fileType: string) => {
    return fileStorageService.getFilePreviewUrl(storageId, fileType)
  }

  const validateFile = (file: File, options?: FileUploadOptions) => {
    return fileStorageService.validateFile(file, options)
  }

  const formatFileSize = (bytes: number) => {
    return fileStorageService.formatFileSize(bytes)
  }

  const getFileCategory = (fileType: string) => {
    return fileStorageService.getFileCategory(fileType)
  }

  return {
    uploadFile,
    uploadFiles,
    deleteFile,
    downloadFile,
    getFileUrl,
    getFilePreviewUrl,
    validateFile,
    formatFileSize,
    getFileCategory,
  }
}