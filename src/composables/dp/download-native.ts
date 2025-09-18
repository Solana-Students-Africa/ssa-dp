import { ref } from "vue"

export const useNativeDownload = () => {
    const outputSection = ref<HTMLElement | null>(null)
    
    const DownloadOutput = async () => {
        if (!outputSection.value) return

        try {
            // Use modern Canvas approach - no permissions needed
            await directCanvasCapture()
        } catch (error) {
            console.error('Canvas capture failed:', error)
            await fallbackToSVG()
        }
    }

    const directCanvasCapture = async () => {
        if (!outputSection.value) return

        const element = outputSection.value
        const rect = element.getBoundingClientRect()
        
        // Create canvas with exact element dimensions
        const canvas = document.createElement('canvas')
        canvas.width = 800
        canvas.height = 600
        
        const ctx = canvas.getContext('2d')!
        
        // Fill background
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, 800, 600)
        
        // Create a more reliable element capture using getComputedStyle
        const computedStyle = window.getComputedStyle(element)
        
        // Draw background
        if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            ctx.fillStyle = computedStyle.backgroundColor
            ctx.fillRect(0, 0, 800, 600)
        }
        
        // Use HTML2Canvas-like approach but simpler
        await renderElementToCanvas(element, ctx, 0, 0)
        
        // Download
        const link = document.createElement('a')
        link.download = 'dp-generator-output.png'
        link.href = canvas.toDataURL('image/png', 1.0)
        link.click()
        link.remove()
    }

    const renderElementToCanvas = async (element: HTMLElement, ctx: CanvasRenderingContext2D, x: number, y: number) => {
        const computedStyle = window.getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        
        // Draw text content
        const textContent = element.textContent?.trim()
        if (textContent && element.children.length === 0) {
            ctx.fillStyle = computedStyle.color || '#ffffff'
            ctx.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`
            ctx.textAlign = 'left'
            ctx.fillText(textContent, x + 10, y + 30)
        }
        
        // Handle images
        const images = element.querySelectorAll('img')
        for (const img of images) {
            try {
                const imgRect = img.getBoundingClientRect()
                const elementRect = element.getBoundingClientRect()
                
                // Calculate relative position
                const relativeX = imgRect.left - elementRect.left
                const relativeY = imgRect.top - elementRect.top
                
                // Create new image for canvas
                const canvasImg = new Image()
                canvasImg.crossOrigin = 'anonymous'
                
                await new Promise((resolve, reject) => {
                    canvasImg.onload = () => {
                        ctx.drawImage(canvasImg, x + relativeX, y + relativeY, imgRect.width, imgRect.height)
                        resolve(true)
                    }
                    canvasImg.onerror = reject
                    canvasImg.src = img.src
                })
            } catch (error) {
                console.warn('Could not render image:', error)
            }
        }
    }

    const fallbackToSVG = async () => {
        if (!outputSection.value) return

        try {
            // Convert to SVG approach
            const svgString = await convertToSVG(outputSection.value)
            
            const canvas = document.createElement('canvas')
            canvas.width = 800
            canvas.height = 600
            
            const ctx = canvas.getContext('2d')!
            const img = new Image()
            
            img.onload = () => {
                ctx.drawImage(img, 0, 0, 800, 600)
                
                const link = document.createElement('a')
                link.download = 'dp-output.png'
                link.href = canvas.toDataURL('image/png')
                link.click()
                link.remove()
            }
            
            img.src = `data:image/svg+xml;base64,${btoa(svgString)}`
            
        } catch (error) {
            console.error('SVG fallback failed:', error)
        }
    }

    const convertToSVG = async (element: HTMLElement): Promise<string> => {
        const rect = element.getBoundingClientRect()
        const computedStyle = getComputedStyle(element)
        
        return `
            <svg width="${rect.width}" height="${rect.height}" xmlns="http://www.w3.org/2000/svg">
                <foreignObject width="100%" height="100%">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="
                        font-family: ${computedStyle.fontFamily};
                        background: ${computedStyle.backgroundColor};
                        width: ${rect.width}px;
                        height: ${rect.height}px;
                    ">
                        ${element.innerHTML}
                    </div>
                </foreignObject>
            </svg>
        `
    }

    return {
        outputSection,
        DownloadOutput
    }
}
