import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './EmpathyCenterBall.module.css';
import ChoosePersonaModal from '../choose-persona-modal/ChoosePersonaModal';
import { UxPersona } from '../../../../types/uxPersona';
import PersonaDefaultThumbnail from '../../../../assets/images/ux-persona-vector.png';
import { createBlobImageUrlFromS3SignedImage } from '../../../../utils/image';
import { useAppSelector } from '../../../../store/hooks';

interface IProps {
    personas: UxPersona[];
    chosenPersona: UxPersona | undefined;
    setChosenPersona: Dispatch<SetStateAction<UxPersona | undefined>>;
}

const EmpathyCenterBall = ({
    personas,
    setChosenPersona,
    chosenPersona,
}: IProps) => {
    const [isChoosePhotoModalOpen, setIsChoosePhotoModalOpen] = useState(false);

    const [image, setImage] = useState<string>();

    const user = useAppSelector((state) => state.userReducer.user);

    // Converting image to Blob is necessary because if you use the photo URL directly, it will
    // throw a CORS error, regardless of how CORS is configured
    useEffect(() => {
        (async function () {
            if (!chosenPersona) {
                return;
            }

            if (!chosenPersona.thumbnailPath) {
                setImage(PersonaDefaultThumbnail);
                return;
            }
            const imgUrl = await createBlobImageUrlFromS3SignedImage(
                chosenPersona.thumbnailPath
            );
            setImage(imgUrl);
        })();
    }, [chosenPersona]);

    return (
        <>
            <div
                className={styles['center_ball']}
                onClick={() => setIsChoosePhotoModalOpen(true)}>
                {chosenPersona || (image && !user) ? (
                    <img src={image} />
                ) : (
                    <p className={`text-bigger-bold color-dark-900`}>
                        Choose Persona
                    </p>
                )}
            </div>
            <ChoosePersonaModal
                isOpen={isChoosePhotoModalOpen}
                setIsOpen={setIsChoosePhotoModalOpen}
                personas={personas}
                chosenPersona={chosenPersona}
                setChosenPersona={setChosenPersona}
                setImage={setImage}
            />
        </>
    );
};

export default EmpathyCenterBall;
