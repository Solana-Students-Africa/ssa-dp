<template>
    <section class="text-white w-[70%] h-screen  overflow-hidden relative z-[2] font-gellix p-8" id="outputSection" ref="outputSection">
        <!-- Download Button -->
        <button 
            @click="DownloadOutput"
            class="absolute top-4 right-4 z-20 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>Download</span>
        </button>

        <h1 class="text-5xl font-[600]  tracking-[-3%] relative z-[2]">Solana Student

            <img src="/images/sol-coin.png" alt="Solana coin image" class="inline-block w-10 h-10  top-2 ml-[-20px]" />
            <br>
            Africa Summit 2025
        </h1>
        <p class="text-5xl italic font-itc text-[#FFC350]">Grandfinale</p>
        <div
            class="bg-color w-[750px] h-[600px] blur-[300px] absolute top-0 right-[-400px] rounded-full bottom-0 my-auto z-[1] ">
        </div>
        <div class="flex items-center space-x-8 mt-4 relative z-10">
            <div class="left">
                <img src="/images/user-image.png" alt="User Image" class="w-[300px] h-[400px] object-cover rounded-xl">
            </div>
            <div class="right">
                <h2 class="italic text-5xl font-semibold tracking-[-3%]">ADEMIDE</h2>
                <p class="text-2xl font-thin">WILL BE <br>ATTENDING</p>
            </div>
        </div>
        <div class="mt-5">
            <img src="/images/bottom-gibbit.png" alt="Icon Gibbits"
                class="relative left-[-50px]  top-10 max-w-[700px] scale-[1.2]" />
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useNativeDownload } from '../composables/dp/download-native';

// const outputSection = ref<HTMLElement | null>(null)
// const { DownloadOutput } = useDownloadTemplateCreated()
const { DownloadOutput,outputSection} = useNativeDownload()
onMounted(() => {
    // outputSection.value = document.getElementById('outputSection') as HTMLElement
    // console.log('Output section mounted:', outputSection.value);
});
</script>

<style scoped>
.bg-color {
    background: rgba(176, 32, 236, 1);
    /* Added transparency */

}
</style>