<template>
  <div class="h-screen bg-zinc-900/50 backdrop-blur-sm border-r border-zinc-800 flex flex-col">
    <!-- Logo Section -->

      <div class="flex items-center space-x-1 border-b border-zinc-800">
         <img src="https://www.solanastudentsafrica.com/images/logo.png" alt="SSA Logo" class="max-w-[80px]" />
        <div>
          <p class="text-white text-2xl font-gellix">SSA DP</p>
        </div>
      </div>

    <!-- Form Section -->
    <div class="flex-1 p-4 md:p-8 space-y-8">
      <div>
        <h2 class="font-gellix text-lg font-semibold text-white mb-6">Fill Your Details</h2>
        
        <!-- Name Input -->
        <div class="space-y-2 mb-6">
          <label class="block text-sm font-gellix font-medium text-zinc-300">
            Name
          </label>
          <input 
            :value="formData.userName"
            @input="handleNameInput"
            type="text" 
            placeholder="Enter your name"
            class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200 font-gellix"
            :class="{ 'border-red-500': errors.userName }"
          />
          <p v-if="errors.userName" class="text-red-400 text-xs mt-1 font-gellix">{{ errors.userName }}</p>
        </div>

        <!-- Image Upload -->
        <div class="space-y-2 mb-8">
          <label class="block text-sm font-gellix font-medium text-zinc-300">
            Upload Image
          </label>
          <div class="relative">
            <input 
              ref="fileInput"
              @change="handleImageUpload"
              type="file" 
              accept="image/*"
              class="hidden"
            />
            <button 
              @click="triggerFileInput"
              class="w-full h-32 border-2 border-dashed border-zinc-700 rounded-xl bg-zinc-800/30 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all duration-200 flex flex-col items-center justify-center group"
              :class="{ 'border-red-500': errors.imageUrl }"
            >
              <div v-if="!formData.imageUrl" class="text-center">
                <svg class="w-8 h-8 text-zinc-500 group-hover:text-zinc-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <p class="text-zinc-500 group-hover:text-zinc-400 font-gellix text-sm">
                  Click to upload image
                </p>
                <p class="text-zinc-600 font-gellix text-xs mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
              <div v-else class="relative w-full h-full rounded-lg overflow-hidden">
                <img :src="formData.imageUrl" alt="Preview" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <p class="text-white font-gellix text-sm">Change Image</p>
                </div>
              </div>
            </button>
          </div>
          <p v-if="errors.imageUrl" class="text-red-400 text-xs mt-1 font-gellix">{{ errors.imageUrl }}</p>
        </div>

        <!-- Generate Button -->
        <button 
          @click="generateProfile"
          :disabled="!canGenerate"
          class="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed text-white font-gellix font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
        >
          <span v-if="!isGenerating">Generate Profile Picture</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        </button>
      </div>

      <!-- Preview Section (if image exists) -->
      <div v-if="formData.imageUrl" class="border-t border-zinc-800 pt-6">
        <h3 class="font-gellix text-sm font-medium text-zinc-300 mb-4">Preview</h3>
        <div class="relative">
          <div class="inverted w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-600" 
               :style="{ backgroundImage: `url(${formData.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
          </div>
          <p class="text-center text-zinc-400 font-gellix text-xs mt-2">{{ formData.userName || 'Your Name' }}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-6 border-t border-zinc-800">
      <p class="text-zinc-500 text-xs font-gellix text-center">
        Not registered yet? <a href="https://luma.com/vq3r9q1p" target="_blank" class="text-blue-500 hover:underline">Register</a> 
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from '../composables/useForm'

// Use the form composable
const { 
  formData, 
  errors, 
  updateUserName, 
  updateImageFromFile,
  validateImageFile,
  validateForm,
  getFormData 
} = useForm()

// Define emits to send data to parent
const emit = defineEmits<{
  updateFormData: [data: { userName: string; imageUrl: string }]
  generated: []
}>()

// Refs
const fileInput = ref<HTMLInputElement>()
const isGenerating = ref(false)

// Computed
const canGenerate = computed(() => {
  return formData.userName.trim() && formData.imageUrl && !errors.userName && !errors.imageUrl
})

// Methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Use the composable's validation and upload method
    if (validateImageFile(file)) {
      updateImageFromFile(file)
      // Emit updated data to parent
      emit('updateFormData', getFormData())
    }
  }
}

const handleNameInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  updateUserName(target.value)
  // Emit updated data to parent
  emit('updateFormData', getFormData())
}

const generateProfile = async () => {
  if (!canGenerate.value || !validateForm()) return
  
  isGenerating.value = true
  
  // Simulate generation process
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  emit('updateFormData', getFormData())
  
  // Emit generated event to trigger mobile view change
  emit('generated')
  
  console.log('Generated profile for:', getFormData())
  
  isGenerating.value = false
}
</script>

<style scoped>
.inverted {
  aspect-ratio: 1;
  -webkit-mask: url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpath id='phone-shape' d='M20 15 C15 15 15 15 15 20 L15 65 C15 75 15 85 25 85 L75 85 C85 85 85 75 85 65 L85 35 C85 25 85 25 80 20 C75 15 70 15 65 15 L35 15 C30 15 25 15 20 15 Z'/%3e%3c/defs%3e%3cmask id='phone-mask'%3e%3crect width='100' height='100' fill='black'/%3e%3cuse href='%23phone-shape' fill='white'/%3e%3c/mask%3e%3crect width='100' height='100' mask='url(%23phone-mask)' fill='white'/%3e%3c/svg%3e") center/contain no-repeat;
  mask: url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpath id='phone-shape' d='M20 15 C15 15 15 15 15 20 L15 65 C15 75 15 85 25 85 L75 85 C85 85 85 75 85 65 L85 35 C85 25 85 25 80 20 C75 15 70 15 65 15 L35 15 C30 15 25 15 20 15 Z'/%3e%3c/defs%3e%3cmask id='phone-mask'%3e%3crect width='100' height='100' fill='black'/%3e%3cuse href='%23phone-shape' fill='white'/%3e%3c/mask%3e%3crect width='100' height='100' mask='url(%23phone-mask)' fill='white'/%3e%3c/svg%3e") center/contain no-repeat;
}
</style>