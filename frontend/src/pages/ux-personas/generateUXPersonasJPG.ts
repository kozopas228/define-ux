import html2canvas from 'html2canvas';

export async function generateUXPersonasJPG(
    personaName: string,
    quality: number
) {
    const domElement = document.getElementById('ux_persona_export_jpg');
    if (!domElement) {
        return;
    }

    domElement
        .querySelectorAll('.close_button_export_jpeg')
        .forEach((el: HTMLElement) => (el.style.display = 'none'));

    domElement
        .querySelectorAll('.disabled_block_export_jpeg')
        .forEach((el: HTMLElement) => (el.style.display = 'none'));

    domElement
        .querySelectorAll('.disabled_flex_export_jpeg')
        .forEach((el: HTMLElement) => (el.style.display = 'none'));

    domElement
        .querySelectorAll('.skill_motivation_input_export_jpeg')
        .forEach((el: HTMLElement) => (el.style.display = 'none'));

    domElement
        .querySelectorAll('.skill_motivation_slider_export_jpeg')
        .forEach((el: HTMLElement) => (el.style.display = 'block'));

    domElement
        .querySelectorAll('.personality_item_input_export_jpeg')
        .forEach((el: HTMLElement) => (el.style.display = 'none'));

    domElement
        .querySelectorAll('.personality_item_slider_export_jpeg')
        .forEach((el: HTMLElement) => (el.style.display = 'block'));

    const personaNameElement = domElement.querySelector(
        '#ux_persona_name_export_jpg'
    )! as HTMLElement;
    personaNameElement.style.marginTop = '32px';
    personaNameElement.innerHTML = personaName;

    domElement
        .querySelectorAll('.ux_persona_textarea_export_jpg')
        .forEach((el: HTMLTextAreaElement) => {
            el.style.display = 'none';
        });

    domElement
        .querySelectorAll('.ux_persona_textarea_export_hidden_jpg')
        .forEach((el: HTMLTextAreaElement) => {
            el.style.display = 'block';
        });

    domElement
        .querySelectorAll('.add_new_skill_motivation_button_export_jpeg')
        .forEach((el: HTMLInputElement) => {
            el.style.display = 'none';
        });
    // document.getElementById('persona_export_photo_not_shown')!.style.display = 'block';
    // document.getElementById('persona_export_photo_shown')!.style.display = 'none';

    const canvas = await html2canvas(domElement, {
        useCORS: true,
        allowTaint: false,
    });

    const img = canvas.toDataURL('image/jpeg', quality);

    // const link = document.createElement('a');
    // link.download = 'ux_persona_export.jpg';
    // link.href = img;
    // link.click();

    // document.getElementById('persona_export_photo_not_shown')!.style.display = 'none';
    // document.getElementById('persona_export_photo_shown')!.style.display = 'block';

    domElement
        .querySelectorAll('.close_button_export_jpeg')
        .forEach((el: HTMLElement) => (el.style.display = 'flex'));

    domElement
        .querySelectorAll('.disabled_block_export_jpeg')
        .forEach((el: HTMLElement) => (el.style.display = 'block'));

    domElement
        .querySelectorAll('.disabled_flex_export_jpeg')
        .forEach((el: HTMLElement) => (el.style.display = 'flex'));

    domElement
        .querySelectorAll('.skill_motivation_input_export_jpeg')
        .forEach((el: HTMLElement) => (el.style.display = 'flex'));

    domElement
        .querySelectorAll('.skill_motivation_slider_export_jpeg')
        .forEach((el: HTMLElement) => (el.style.display = 'none'));

    domElement
        .querySelectorAll('.personality_item_input_export_jpeg')
        .forEach((el: HTMLElement) => (el.style.display = 'flex'));

    domElement
        .querySelectorAll('.personality_item_slider_export_jpeg')
        .forEach((el: HTMLElement) => (el.style.display = 'none'));

    personaNameElement.style.marginTop = '0';
    personaNameElement.innerHTML = '';

    domElement
        .querySelectorAll('.ux_persona_textarea_export_jpg')
        .forEach((el: HTMLTextAreaElement) => {
            el.style.display = 'block';
        });

    domElement
        .querySelectorAll('.ux_persona_textarea_export_hidden_jpg')
        .forEach((el: HTMLTextAreaElement) => {
            el.style.display = 'none';
        });

    domElement
        .querySelectorAll('.add_new_skill_motivation_button_export_jpeg')
        .forEach((el: HTMLInputElement) => {
            el.style.display = 'block';
        });

    return img;
}
