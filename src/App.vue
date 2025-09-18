<template>
  <div class="min-h-screen bg-black grid-background">
    <div class="grid grid-cols-12 min-h-screen">
      <!-- Sidebar - Takes 3 columns on desktop, full width on mobile -->
      <div class="col-span-12 md:col-span-3" :class="showTemplate ? 'hidden md:block' : 'block'">
        <Sidebar 
          class="w-full md:fixed md:w-[350px] h-full" 
          @updateFormData="handleFormUpdate"
          @generated="handleGenerated"
        />
      </div>
      
      <!-- Output Section - Takes 9 columns on desktop, full width on mobile -->
      <div class="col-span-12 md:col-span-9 p-4 md:p-8 bg-black max-w-[400px] md:max-w-full overflow-x-auto" :class="showTemplate ? 'block' : 'hidden md:block'">
         <div class="w-full max-w-lg md:max-w-none mx-auto mt-20 md:mt-0">
           <TemplateSvg 
             :userName="templateData.userName"
             :imageUrl="templateData.imageUrl"
             @editTemplate="handleEdit"
           />
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue';
import TemplateSvg from './components/templateSvg.vue';

// Template data that will be passed to TemplateSvg
const templateData = ref({
  userName: '',
  imageUrl: ''
})
const showTemplate = ref(true);

// Handle form updates from Sidebar
const handleFormUpdate = (data: { userName: string; imageUrl: string }) => {
  templateData.value = { ...data }
}

// Handle when user clicks generate (will show template on mobile)
const handleGenerated = () => {
  if (templateData.value.userName && templateData.value.imageUrl) {
    showTemplate.value = true;
  }
}

// Handle edit button click (will show form on mobile)
const handleEdit = () => {
  showTemplate.value = false;
}
</script>

<style scoped>
.grid-background {
  background-image: 
    radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0);
  background-size: 20px 20px;
  background-position: 0 0;
}
</style>