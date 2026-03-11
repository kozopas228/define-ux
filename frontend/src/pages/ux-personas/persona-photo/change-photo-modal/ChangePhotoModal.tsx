import React, { Dispatch, SetStateAction, useRef } from 'react';
import Modal from '../../../../components/modal/Modal';
import styles from './ChangePhotoModal.module.css';
import ButtonPrimary from '../../../../components/buttons/ButtonPrimary';
import UploadIcon from '../../../../assets/icons/upload.svg';

import PersonaPhoto1 from '../../../../assets/images/personas-photos/persona_1.jpg';
import PersonaPhoto2 from '../../../../assets/images/personas-photos/persona_2.jpg';
import PersonaPhoto3 from '../../../../assets/images/personas-photos/persona_3.jpg';
import PersonaPhoto4 from '../../../../assets/images/personas-photos/persona_4.jpg';
import PersonaPhoto5 from '../../../../assets/images/personas-photos/persona_5.jpg';
import PersonaPhoto6 from '../../../../assets/images/personas-photos/persona_6.jpg';
import PersonaPhoto7 from '../../../../assets/images/personas-photos/persona_7.jpg';
import PersonaPhoto8 from '../../../../assets/images/personas-photos/persona_8.jpg';
import PersonaPhoto9 from '../../../../assets/images/personas-photos/persona_9.jpg';
import PersonaPhoto10 from '../../../../assets/images/personas-photos/persona_10.jpg';
import PersonaPhoto11 from '../../../../assets/images/personas-photos/persona_11.jpg';
import PersonaPhoto12 from '../../../../assets/images/personas-photos/persona_12.jpg';
import PersonaPhoto13 from '../../../../assets/images/personas-photos/persona_13.jpg';
import PersonaPhoto14 from '../../../../assets/images/personas-photos/persona_14.jpg';
import PersonaPhoto15 from '../../../../assets/images/personas-photos/persona_15.jpg';
import PersonaPhoto16 from '../../../../assets/images/personas-photos/persona_16.jpg';
import PersonaPhoto17 from '../../../../assets/images/personas-photos/persona_17.jpg';
import PersonaPhoto18 from '../../../../assets/images/personas-photos/persona_18.jpg';
import PersonaPhoto19 from '../../../../assets/images/personas-photos/persona_19.jpg';
import PersonaPhoto20 from '../../../../assets/images/personas-photos/persona_20.jpg';
import PersonaPhoto21 from '../../../../assets/images/personas-photos/persona_21.jpg';
import PersonaPhoto22 from '../../../../assets/images/personas-photos/persona_22.jpg';
import PersonaPhoto23 from '../../../../assets/images/personas-photos/persona_23.jpg';
import PersonaPhoto24 from '../../../../assets/images/personas-photos/persona_24.jpg';
import PersonaPhoto25 from '../../../../assets/images/personas-photos/persona_25.jpg';
import PersonaPhoto26 from '../../../../assets/images/personas-photos/persona_26.jpg';
import PersonaPhoto27 from '../../../../assets/images/personas-photos/persona_27.jpg';
import PersonaPhoto28 from '../../../../assets/images/personas-photos/persona_28.jpg';
import PersonaPhoto29 from '../../../../assets/images/personas-photos/persona_29.jpg';
import PersonaPhoto30 from '../../../../assets/images/personas-photos/persona_30.jpg';
import PersonaPhoto31 from '../../../../assets/images/personas-photos/persona_31.jpg';
import PersonaPhoto32 from '../../../../assets/images/personas-photos/persona_32.jpg';
import { convertImagePathToBase64 } from "../../../../utils/image";

const images = [
    PersonaPhoto1,
    PersonaPhoto2,
    PersonaPhoto3,
    PersonaPhoto4,
    PersonaPhoto5,
    PersonaPhoto6,
    PersonaPhoto7,
    PersonaPhoto8,
    PersonaPhoto9,
    PersonaPhoto10,
    PersonaPhoto11,
    PersonaPhoto12,
    PersonaPhoto13,
    PersonaPhoto14,
    PersonaPhoto15,
    PersonaPhoto16,
    PersonaPhoto17,
    PersonaPhoto18,
    PersonaPhoto19,
    PersonaPhoto20,
    PersonaPhoto21,
    PersonaPhoto22,
    PersonaPhoto23,
    PersonaPhoto24,
    PersonaPhoto25,
    PersonaPhoto26,
    PersonaPhoto27,
    PersonaPhoto28,
    PersonaPhoto29,
    PersonaPhoto30,
    PersonaPhoto31,
    PersonaPhoto32,
];

interface IProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setNewPhotoUrl: Dispatch<SetStateAction<string | undefined>>;
}

const ChangePhotoModal = ({ isOpen, setIsOpen, setNewPhotoUrl }: IProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleSetPhotoUrl(url: string) {
        const base64PhotoUrl = await convertImagePathToBase64(url);

        setNewPhotoUrl(base64PhotoUrl);
        setIsOpen(false);
        document.body.classList.remove('_lock');
    }

    function handleOnPhotoChange() {
        const image = inputRef.current!.files![0];

        if (!image.type.includes('image')) {
            return alert('Only images are allowed!');
        }

        if (image.size > 10_000_000) {
            return alert('Maximum upload size is 10MB!');
        }

        const fileReader = new FileReader();
        fileReader.readAsDataURL(image);

        fileReader.onload = (fileReaderEvent) => {
            const url = fileReaderEvent.target!.result as string;

            setNewPhotoUrl(url);
            setIsOpen(false);
            document.body.classList.remove('_lock');
        };
    }

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            className={styles['modal']}>
            <ButtonPrimary className={styles['upload_button']}>
                <input
                    type='file'
                    accept='image/*'
                    className={styles['file_uploader']}
                    onChange={handleOnPhotoChange}
                    ref={inputRef}
                />
                Upload Image
                <UploadIcon />
            </ButtonPrimary>
            <div className={styles['photos']}>
                {images.map((i) => (
                    <img
                        src={i}
                        key={i}
                        className={styles['persona_photo']}
                        onClick={async () => await handleSetPhotoUrl(i)}
                    />
                ))}
            </div>
        </Modal>
    );
};

export default ChangePhotoModal;
