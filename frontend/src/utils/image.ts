export function saveImage(name: string, img: string) {
    const link = document.createElement('a');
    link.download = name;
    link.href = img;
    link.click();
}

export function convertImageToFile(image: string): File {
    const byteString = atob(image.split(',')[1]);
    const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: mimeType });
    return new File([blob], 'thumbnail.jpg', { type: mimeType });
}

export async function convertImagePathToBase64(url: string): Promise<any> {
    try {
        const response = await fetch(url); // Load the image
        const blob = await response.blob(); // Get Blob from response
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); // Return result in base64 format
            reader.onerror = reject;
            reader.readAsDataURL(blob); // Convert Blob to base64
        });
    } catch (error) {
        console.error('Error converting image to base64:', error);
    }
}

export async function createBlobImageUrlFromS3SignedImage(
    s3SignedImagePath: string
) {
    const response = await fetch(s3SignedImagePath, {
        mode: 'cors',
        method: 'GET',
        cache: 'no-cache',
    });

    const blob = await response.blob();
    return URL.createObjectURL(blob);
}
