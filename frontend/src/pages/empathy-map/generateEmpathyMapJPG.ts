import html2canvas from 'html2canvas';

export async function generateEmapthyMapJPG(
    quality: number,
    personaThumbnailSrc: string | undefined
) {
    const domElement = document.getElementById('empathy_map_export_jpg');
    if (!domElement) {
        return;
    }

    domElement
        .querySelectorAll('.empathy_map_textarea_export_jpg')
        .forEach((el: HTMLTextAreaElement) => {
            el.style.display = 'none';
        });

    domElement
        .querySelectorAll('.empathy_map_textarea_export_hidden_jpg')
        .forEach((el: HTMLTextAreaElement) => {
            el.style.display = 'block';
        });

    const canvas = await html2canvas(domElement, {
        useCORS: true,
        allowTaint: false,
    });

    const img = canvas.toDataURL('image/jpeg', quality);

    // const img = await domToJpeg(domElement);

    domElement
        .querySelectorAll('.empathy_map_textarea_export_jpg')
        .forEach((el: HTMLTextAreaElement) => {
            el.style.display = 'block';
        });

    domElement
        .querySelectorAll('.empathy_map_textarea_export_hidden_jpg')
        .forEach((el: HTMLTextAreaElement) => {
            el.style.display = 'none';
        });

    return img;
}
