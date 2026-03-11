import html2canvas from 'html2canvas';
import jsPdf from 'jspdf';

export async function generateCompetitorAnalysisJPG(quality: number) {
    const domElement = document.getElementById('competitor_table');
    if (!domElement) {
        return;
    }

    const headerRowNumber = document.getElementById('header_row_number')!;
    const headerCompetitorName = document.getElementById(
        'header_competitor_name'
    )!;
    const headerDeleteButton = document.getElementById('header_delete_button')!;

    const initialHeaderCompetitorNameLeft = headerCompetitorName.style.left;
    const initialCompetitorNameBoxShadow =
        '-4px 0 4px -4px var(--gray-800) inset';

    headerRowNumber.style.position = 'static';
    headerCompetitorName.style.position = 'relative';
    headerCompetitorName.style.left = '0px';
    headerDeleteButton.style.display = 'none';

    domElement
        .querySelectorAll('.row_number_export_jpg')
        .forEach((el: HTMLElement) => {
            el.style.position = 'static';
        });

    domElement
        .querySelectorAll('.competitor_name_export_jpg')
        .forEach((el: HTMLElement) => {
            el.style.position = 'static';
            el.style.boxShadow = 'none';
        });

    domElement
        .querySelectorAll('.remove_row_button_export_jpg')
        .forEach((el: HTMLElement) => {
            el.style.display = 'none';
        });

    const canvas = await html2canvas(domElement);

    const img = canvas.toDataURL('image/jpeg', quality);

    headerRowNumber.style.position = 'sticky';
    headerCompetitorName.style.position = 'sticky';
    headerCompetitorName.style.left = initialHeaderCompetitorNameLeft;
    headerDeleteButton.style.display = 'table-cell';

    domElement
        .querySelectorAll('.row_number_export_jpg')
        .forEach((el: HTMLElement) => {
            el.style.position = 'sticky';
        });

    domElement
        .querySelectorAll('.competitor_name_export_jpg')
        .forEach((el: HTMLElement) => {
            el.style.position = 'sticky';
            el.style.boxShadow = initialCompetitorNameBoxShadow;
        });

    domElement
        .querySelectorAll('.remove_row_button_export_jpg')
        .forEach((el: HTMLElement) => {
            el.style.display = 'table-cell';
        });

    return img;
}
