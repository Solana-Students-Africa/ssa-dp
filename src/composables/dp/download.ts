import { ref } from "vue"
import html2canvas from 'html2canvas'

export const useDownloadTemplateCreated = () => {
    const DownloadOutput = async (elementId: string = 'outputSection') => {
        const element = document.getElementById(elementId)
        console.log('DownloadOutput called', element)
        if (!element) {
            console.error('Element not found:', elementId)
            return
        }

        try {
            console.log('Generating screenshot with html2canvas...')
            
            const canvas = await html2canvas(element, {
                backgroundColor: '#000000',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                foreignObjectRendering: false,
                logging: true,
                width: 570,
                height: 600,
                onclone: async (_clonedDoc, clonedElement) => {
                    // Fix the container sizing
                    clonedElement.style.width = '570px'
                    clonedElement.style.height = '600px'
                    clonedElement.style.transform = 'none'
                    
                    // Ensure all text elements are properly styled and visible
                    const textElements = clonedElement.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div')
                    textElements.forEach((textEl: Element) => {
                        const htmlEl = textEl as HTMLElement
                        if (htmlEl.textContent && htmlEl.textContent.trim()) {
                            htmlEl.style.color = 'white'
                            htmlEl.style.fontSize = '2.25rem'
                            htmlEl.style.fontWeight = '600'
                            htmlEl.style.textTransform = 'uppercase'
                            htmlEl.style.fontStyle = 'italic'
                            htmlEl.style.fontFamily = 'Gellix, system-ui, sans-serif'
                            htmlEl.style.zIndex = '9999'
                            htmlEl.style.display = 'block'
                            htmlEl.style.visibility = 'visible'
                            htmlEl.style.opacity = '1'
                            htmlEl.style.position = 'absolute'
                        }
                    })
                    
                    // Ensure all images have crossOrigin set
                    const images = clonedElement.querySelectorAll('img')
                    images.forEach((img: HTMLImageElement) => {
                        img.crossOrigin = 'anonymous'
                        img.style.imageRendering = 'high-quality'
                    })
                    
                    // Handle SVG images by converting them to regular img elements
                    const svgImages = clonedElement.querySelectorAll('image[href], image[xlink\\:href]')
                    for (const svgImg of svgImages) {
                        const href = svgImg.getAttribute('href') || svgImg.getAttribute('xlink:href')
                        if (href) {
                            try {
                                // Create a regular img element
                                const img = document.createElement('img')
                                img.src = href
                                img.style.width = '200px'
                                img.style.height = '200px'
                                img.style.objectFit = 'cover'
                                img.style.position = 'absolute'
                                img.style.top = '300px'
                                img.style.left = '400px'
                                img.crossOrigin = 'anonymous'
                                
                                // Replace the SVG image with regular img
                                svgImg.parentNode?.appendChild(img)
                                svgImg.remove()
                            } catch (error) {
                                console.warn('Could not process image:', href, error)
                            }
                        }
                    }
                }
            })

            // Download the image
            const link = document.createElement('a')
            link.download = 'dp-generator-output.png'
            link.href = canvas.toDataURL('image/png', 0.9)
            link.click()
            link.remove()
            
            console.log('Screenshot generated successfully!')
            
        } catch (error) {
            console.error('html2canvas failed:', error)
        }
    }

    return {
        DownloadOutput
    }
}