import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './PersonaPhoto.module.css';
import PersonaIcon from '../../../assets/icons/user.svg';
import ChangePhotoModal from './change-photo-modal/ChangePhotoModal';
import { UxPersonaDto } from '../types';
import PersonaDefaultThumbnail from '../../../assets/images/ux-persona-vector.png';
import { createBlobImageUrlFromS3SignedImage } from '../../../utils/image';

interface IProps {
    uxPersona: UxPersonaDto;
    setUxPersona: Dispatch<SetStateAction<UxPersonaDto>>;
    photoUrl?: string;
    newPhotoUrl?: string;
    setNewPhotoUrl: Dispatch<SetStateAction<string | undefined>>;
}

const PersonaPhoto = ({
    uxPersona,
    setUxPersona,
    photoUrl,
    newPhotoUrl,
    setNewPhotoUrl,
}: IProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [image, setImage] = useState<string>();

    function handleClick() {
        setIsModalOpen(true);
    }

    // Converting image to Blob is necessary because if you use the photo URL directly, it will
    // throw a CORS error, regardless of how CORS is configured
    useEffect(() => {
        (async function () {
            if (!newPhotoUrl && !photoUrl) {
                return;
            }

            const imgUrl = await createBlobImageUrlFromS3SignedImage(
                (newPhotoUrl ?? photoUrl)!
            );
            setImage(imgUrl);
        })();
    }, [newPhotoUrl, photoUrl]);

    return (
        <>
            <div
                className={styles['persona_photo']}
                onClick={handleClick}>
                {image ? (
                    <>
                        <img
                            id={'persona_export_photo_shown'}
                            src={image}
                            // crossOrigin={'anonymous'}
                        />
                    </>
                ) : (
                    <>
                        <PersonaIcon />
                        <span
                            className={`${styles['choose_photo']} text-bigger-bold color-gray-800`}>
                            Choose photo
                        </span>
                    </>
                )}
            </div>
            <ChangePhotoModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                setNewPhotoUrl={setNewPhotoUrl}
            />
        </>
    );
};

export default PersonaPhoto;
