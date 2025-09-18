

export const DownloadCanvasAsImage = (canvas: HTMLCanvasElement, name: string) => {
    const downloadLink = document.createElement('a')
    downloadLink.setAttribute('download', `${name}.png`)
    
    // Use higher quality JPEG or PNG
    const dataURL = canvas.toDataURL('image/png', 1.0) // Maximum quality
    
    downloadLink.setAttribute('href', dataURL)
    downloadLink.click()
    
    // Clean up
    downloadLink.remove()
}