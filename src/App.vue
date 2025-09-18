<template>
  <div class="min-h-screen bg-black grid-background">
    <div class="grid grid-cols-12 min-h-screen">
      <!-- Sidebar - Takes 5 columns -->
      <div class="col-span-3">
        <Sidebar 
          class="fixed w-[350px]" 
          @updateFormData="handleFormUpdate"
        />
      </div>
      
      <!-- Output Section - Takes 7 columns -->
      <div class="col-span-9 p-8">
         <TemplateSvg 
           :userName="templateData.userName"
           :imageUrl="templateData.imageUrl"
         />
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

// Handle form updates from Sidebar
const handleFormUpdate = (data: { userName: string; imageUrl: string }) => {
  templateData.value = { ...data }
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