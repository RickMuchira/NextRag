// src/components/documents/document-upload.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { FileText, Upload, X, Tag as TagIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

// Mocked user ID - In a real app, you'd get this from an auth context/provider
const CURRENT_USER_ID = "user_1234567890"

interface DocumentUploadProps {
  onUploadComplete?: () => void
}

export default function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [courses, setCourses] = useState<Array<{ id: string, name: string }>>([])
  const [units, setUnits] = useState<Array<{ id: string, name: string }>>([])
  const [semesters, setSemesters] = useState<Array<{ id: string, name: string }>>([])
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    courseId: "",
    unitId: "",
    semesterId: "",
    tags: [] as string[],
    tagInput: ""
  })
  
  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses')
        if (res.ok) {
          const data = await res.json()
          setCourses(data)
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }
    
    fetchCourses()
  }, [])
  
  // Fetch units and semesters when course changes
  useEffect(() => {
    if (!formData.courseId) {
      setUnits([])
      setSemesters([])
      return
    }
    
    const fetchCourseDetails = async () => {
      try {
        // Fetch units
        const unitsRes = await fetch(`/api/courses/${formData.courseId}/units`)
        if (unitsRes.ok) {
          const unitsData = await unitsRes.json()
          setUnits(unitsData)
        }
        
        // Fetch semesters
        const semestersRes = await fetch(`/api/courses/${formData.courseId}/semesters`)
        if (semestersRes.ok) {
          const semestersData = await semestersRes.json()
          setSemesters(semestersData)
        }
      } catch (error) {
        console.error('Error fetching course details:', error)
      }
    }
    
    fetchCourseDetails()
  }, [formData.courseId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create preview if it's an image
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setPreview(null)
      }
      
      // Pre-fill title from filename
      setFormData(prev => ({
        ...prev,
        title: selectedFile.name.split('.')[0].replace(/_/g, ' ').replace(/-/g, ' ')
      }))
      
      setShowForm(true)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setShowForm(false)
    setUploadComplete(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = () => {
    if (!file) return <FileText className="w-12 h-12 text-gray-400" />

    switch (file.type) {
      case "application/pdf":
        return <FileText className="w-12 h-12 text-red-500" />
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <FileText className="w-12 h-12 text-blue-500" />
      case "application/vnd.ms-powerpoint":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return <FileText className="w-12 h-12 text-orange-500" />
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return <FileText className="w-12 h-12 text-green-500" />
      default:
        if (file.type.startsWith("image/")) {
          return preview ? (
            <img src={preview} alt="Preview" className="w-20 h-20 object-contain rounded" />
          ) : (
            <FileText className="w-12 h-12 text-purple-500" />
          )
        }
        return <FileText className="w-12 h-12 text-gray-400" />
    }
  }
  
  const addTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, formData.tagInput.trim()],
        tagInput: ""
      }))
    }
  }
  
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }
  
  const handleUpload = async () => {
    if (!file) return
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      // First, upload the file
      const formData = new FormData()
      formData.append('file', file)
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15
          return newProgress >= 90 ? 90 : newProgress
        })
      }, 300)
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      clearInterval(progressInterval)
      
      if (!uploadResponse.ok) {
        throw new Error('File upload failed')
      }
      
      setUploadProgress(95)
      
      const fileData = await uploadResponse.json()
      
      // Then create the document with metadata
      const documentData = {
        ...formData,
        fileName: fileData.fileName,
        fileSize: fileData.fileSize,
        fileType: fileData.fileType,
        blobUrl: fileData.blobUrl,
        uploaderId: CURRENT_USER_ID
      }
      
      const docResponse = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(documentData)
      })
      
      if (!docResponse.ok) {
        throw new Error('Document creation failed')
      }
      
      setUploadProgress(100)
      setUploadComplete(true)
      
      toast({
        title: 'Upload successful',
        description: 'Your document has been uploaded and metadata saved.',
      })
      
      // After a short delay, reset the form
      setTimeout(() => {
        if (onUploadComplete) {
          onUploadComplete()
        }
      }, 1500)
      
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your document. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="bg-black/30 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Upload className="w-5 h-5 mr-2 text-purple-500" />
          Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!file ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
              disabled={isUploading}
            />
            
            <Upload className="w-12 h-12 text-purple-500/60 mx-auto mb-4" />
            <p className="text-gray-300 mb-1">Drag and drop your file here or click to browse</p>
            <p className="text-gray-400 text-sm">PDF, Word, PowerPoint, Excel, and images are supported</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center mb-6">
              <div className="mr-4 p-4 bg-black/30 rounded-lg">
                {getFileIcon()}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{file.name}</h3>
                <p className="text-gray-400 text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || "Unknown type"}
                </p>
                
                {isUploading && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Uploading{uploadProgress < 100 ? "..." : " complete!"}</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1 bg-gray-800" />
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
                className="text-gray-400 hover:text-white hover:bg-white/10"
                disabled={isUploading}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {showForm && !uploadComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter document title"
                    className="bg-black/50 border-white/20 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter document description"
                    className="bg-black/50 border-white/20 text-white min-h-[100px]"
                  />
                </div>
                
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-1">
                    Author
                  </label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Enter document author"
                    className="bg-black/50 border-white/20 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-300 mb-1">
                    Course
                  </label>
                  <Select
                    value={formData.courseId}
                    onValueChange={(value) => setFormData({ ...formData, courseId: value, unitId: "", semesterId: "" })}
                  >
                    <SelectTrigger className="bg-black/50 border-white/20 text-white">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/10 text-white">
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.courseId && (
                  <>
                    <div>
                      <label htmlFor="semester" className="block text-sm font-medium text-gray-300 mb-1">
                        Semester (Optional)
                      </label>
                      <Select
                        value={formData.semesterId}
                        onValueChange={(value) => setFormData({ ...formData, semesterId: value })}
                      >
                        <SelectTrigger className="bg-black/50 border-white/20 text-white">
                          <SelectValue placeholder="Select a semester" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/10 text-white">
                          {semesters.map((semester) => (
                            <SelectItem key={semester.id} value={semester.id}>
                              {semester.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="unit" className="block text-sm font-medium text-gray-300 mb-1">
                        Unit (Optional)
                      </label>
                      <Select
                        value={formData.unitId}
                        onValueChange={(value) => setFormData({ ...formData, unitId: value })}
                      >
                        <SelectTrigger className="bg-black/50 border-white/20 text-white">
                          <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/10 text-white">
                          {units.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                    Tags
                  </label>
                  <div className="flex">
                    <Input
                      id="tags"
                      value={formData.tagInput}
                      onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                      placeholder="Add tags (press Enter to add)"
                      className="bg-black/50 border-white/20 text-white flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      variant="outline"
                      className="ml-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <TagIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="bg-purple-950/30 text-purple-300 hover:bg-purple-800/20 border-purple-800/50"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-purple-300 hover:text-purple-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            {!uploadComplete && (
              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={clearFile}
                  className="mr-2 border-white/20 text-white hover:bg-white/5"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || !formData.title}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isUploading ? "Uploading..." : "Upload Document"}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}