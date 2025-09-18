import { ref, reactive } from 'vue'

export interface FormData {
  userName: string
  imageUrl: string
}

export const useForm = () => {
  // Reactive form data
  const formData = reactive<FormData>({
    userName: '',
    imageUrl: ''
  })

  // Loading states
  const isLoading = ref(false)
  const isValidating = ref(false)

  // Validation errors
  const errors = reactive({
    userName: '',
    imageUrl: ''
  })

  // Validation functions
  const validateUserName = (name: string): boolean => {
    errors.userName = ''
    
    if (!name || name.trim().length === 0) {
      errors.userName = 'Username is required'
      return false
    }
    
    if (name.trim().length < 2) {
      errors.userName = 'Username must be at least 2 characters'
      return false
    }
    
    if (name.trim().length > 20) {
      errors.userName = 'Username must be less than 20 characters'
      return false
    }
    
    return true
  }

  const validateImageFile = (file: File | null): boolean => {
    errors.imageUrl = ''
    
    if (!file) {
      errors.imageUrl = 'Please select an image file'
      return false
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      errors.imageUrl = 'Please select a valid image file (JPEG, PNG, GIF, WebP)'
      return false
    }
    
    // Check file size (max 5MB)
    const maxSizeInMB = 5
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      errors.imageUrl = `File size must be less than ${maxSizeInMB}MB`
      return false
    }
    
    return true
  }

  // Update functions
  const updateUserName = (name: string) => {
    formData.userName = name.trim()
    validateUserName(formData.userName)
  }

  const updateImageFromFile = (file: File | null) => {
    if (file && validateImageFile(file)) {
      // Convert file to data URL
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          formData.imageUrl = e.target.result as string
        }
      }
      reader.readAsDataURL(file)
    } else if (!file) {
      formData.imageUrl = ''
    }
  }

  // Validate entire form
  const validateForm = (): boolean => {
    isValidating.value = true
    
    const isUserNameValid = validateUserName(formData.userName)
    // For image validation, we'll check if imageUrl exists (file has been uploaded)
    const isImageValid = formData.imageUrl !== ''
    if (!isImageValid) {
      errors.imageUrl = 'Please select an image file'
    }
    
    isValidating.value = false
    
    return isUserNameValid && isImageValid
  }

  // Reset form
  const resetForm = () => {
    formData.userName = ''
    formData.imageUrl = ''
    errors.userName = ''
    errors.imageUrl = ''
  }

  // Check if form has errors
  const hasErrors = (): boolean => {
    return errors.userName !== '' || errors.imageUrl !== ''
  }

  // Get form data for template
  const getFormData = (): FormData => {
    return {
      userName: formData.userName,
      imageUrl: formData.imageUrl
    }
  }

  return {
    // Data
    formData,
    errors,
    
    // States
    isLoading,
    isValidating,
    
    // Methods
    updateUserName,
    updateImageFromFile,
    validateImageFile,
    validateForm,
    resetForm,
    hasErrors,
    getFormData
  }
}
