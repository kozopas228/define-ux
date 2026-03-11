import React, {
    ChangeEvent,
    Dispatch,
    JSX,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import Modal from '../../../../components/modal/Modal';
import styles from './ChoosePersonaModal.module.css';
import ButtonPrimary from '../../../../components/buttons/ButtonPrimary';

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

import TextFieldSecondary from '../../../../components/inputs/TextFieldSecondary';
import PersonaIcon from '../../../../assets/icons/user.svg';
import ButtonSecondaryOutline from '../../../../components/buttons/ButtonSecondaryOutline';
import UploadIcon from '../../../../assets/icons/upload.svg';
import { UxPersona } from '../../../../types/uxPersona';
import { convertImagePathToBase64 } from '../../../../utils/image';
import {
    createNewUxPersona,
    findOneUxPersona,
    getUxPersonaPhoto,
    saveUxPersona,
    uploadUxPersonaThumbnail,
} from '../../../../services/uxPersonas';
import { useParams } from 'react-router-dom';
import { UxPersonaDto } from '../../../ux-personas/types';
import ButtonSecondaryDisabled from '../../../../components/buttons/ButtonSecondaryDisabled';
import { useAppSelector } from '../../../../store/hooks';

interface IProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    personas: UxPersona[];
    chosenPersona: UxPersona | undefined;
    setChosenPersona: Dispatch<SetStateAction<UxPersona | undefined>>;
    setImage: Dispatch<SetStateAction<string | undefined>>;
}

enum ModalState {
    initial,
    createNewPersona,
    chooseNewPersonaPhoto,
}

const ChoosePersonaModal = ({
    isOpen,
    setIsOpen,
    personas,
    setChosenPersona,
    chosenPersona,
    setImage,
}: IProps) => {
    const user = useAppSelector((state) => state.userReducer.user);

    const [modalState, setModalState] = useState(ModalState.initial);
    const [newPersonaName, setNewPersonaName] = useState('');
    const [newPersonaPhotoUrl, setNewPersonaPhotoUrl] = useState<
        string | undefined
    >(chosenPersona?.thumbnailPath);

    const params = useParams();

    const [isNewPersonaCreating, setIsNewPersonaCreating] = useState(false);

    function handleChoosePersona(persona: UxPersona) {
        setChosenPersona(persona);

        setIsOpen(false);
        document.body.classList.remove('_lock');
    }

    useEffect(() => {
        if (!isOpen) {
            document.body.classList.remove('_lock');

            // Timeout so that the initial modal doesn't display immediately upon closing
            setTimeout(() => setModalState(ModalState.initial), 300);
            setNewPersonaName('');
            setNewPersonaPhotoUrl(undefined);
        }
    }, [isOpen]);

    const changePhotoInputRef = useRef<HTMLInputElement>(null);

    function handleOnPhotoChange() {
        const image = changePhotoInputRef.current!.files![0];

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

            if (!user) {
                setImage(url);
                setIsOpen(false);
                return;
            }
            setNewPersonaPhotoUrl(url);
        };

        setModalState(ModalState.createNewPersona);
    }

    async function handleSetPhotoUrl(url: string) {
        const base64PhotoUrl = await convertImagePathToBase64(url);

        if (!user) {
            setImage(base64PhotoUrl);
            setIsOpen(false);
            return;
        }

        // console.log(base64PhotoUrl);
        setNewPersonaPhotoUrl(base64PhotoUrl);
        setModalState(ModalState.createNewPersona);
    }

    async function handleCreateClick() {
        if (!params.PK || !newPersonaPhotoUrl) {
            return;
        }

        setIsNewPersonaCreating(true);

        const PK = params.PK.replace('_', '#');

        const uxPersona = await createNewUxPersona(PK);

        const personaDto: UxPersonaDto = uxPersona as unknown as UxPersonaDto;
        personaDto.projectSK = uxPersona.PK;
        personaDto.uxPersonaSK = uxPersona.SK;
        personaDto.name = newPersonaName;
        personaDto.skills = [];
        personaDto.motivations = [];

        await saveUxPersona(personaDto);

        await uploadUxPersonaThumbnail(
            uxPersona.PK,
            uxPersona.SK,
            newPersonaPhotoUrl
        );

        uxPersona.thumbnailPath = await getUxPersonaPhoto(
            uxPersona.PK,
            uxPersona.SK
        );

        setChosenPersona(uxPersona);

        setIsNewPersonaCreating(false);
        setIsOpen(false);
    }

    let layout: JSX.Element;

    if (!user) {
        layout = (
          <div className={styles['choose_photo_modal']}>
              <ButtonPrimary className={styles['upload_button']}>
                  <input
                    type='file'
                    accept='image/*'
                    className={styles['file_uploader']}
                    onChange={handleOnPhotoChange}
                    ref={changePhotoInputRef}
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
                      onClick={async () => {
                          await handleSetPhotoUrl(i);
                      }}
                    />
                  ))}
              </div>
          </div>
        );
    } else if (modalState === ModalState.initial) {
        layout = (
            <div className={styles['modal_initial']}>
                <ButtonPrimary
                    className={styles['create_new_persona_button']}
                    onClick={() => setModalState(ModalState.createNewPersona)}>
                    Create New Persona
                </ButtonPrimary>
                {/*<b className={'text-bigger color-gray-800'}>*/}
                {/*    Choose existing UX Persona*/}
                {/*</b>*/}
                <div className={styles['persona_images']}>
                    {personas
                        .sort((p1, p2) => p2.UPDATED_AT - p1.UPDATED_AT)
                        .map((p) => (
                            <img
                                src={p.thumbnailPath}
                                key={p.SK}
                                onClick={() => handleChoosePersona(p)}
                                title={p.name}
                            />
                        ))}
                </div>
            </div>
        );
    } else if (modalState === ModalState.createNewPersona) {
        layout = (
            <div className={styles['create_new_persona_modal']}>
                <TextFieldSecondary
                    className={styles['create_new_persona_input']}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewPersonaName(e.target.value)
                    }
                    placeholder={'Enter persona name'}
                    value={newPersonaName}
                />
                <div
                    className={styles['create_new_persona_photo']}
                    onClick={() =>
                        setModalState(ModalState.chooseNewPersonaPhoto)
                    }>
                    {newPersonaPhotoUrl ? (
                        <img src={newPersonaPhotoUrl} />
                    ) : (
                        <PersonaIcon />
                    )}
                    <span
                        className={`${styles['choose_photo']} text-big-bold color-gray-800`}>
                        Choose photo
                    </span>
                </div>
                {isNewPersonaCreating ? (
                    <ButtonSecondaryDisabled
                        className={styles['create_new_persona_create_button']}>
                        Creating...
                    </ButtonSecondaryDisabled>
                ) : (
                    <ButtonSecondaryOutline
                        className={styles['create_new_persona_create_button']}
                        onClick={handleCreateClick}>
                        Create
                    </ButtonSecondaryOutline>
                )}
            </div>
        );
    } else if (modalState === ModalState.chooseNewPersonaPhoto) {
        layout = (
            <div className={styles['choose_photo_modal']}>
                <ButtonPrimary className={styles['upload_button']}>
                    <input
                        type='file'
                        accept='image/*'
                        className={styles['file_uploader']}
                        onChange={handleOnPhotoChange}
                        ref={changePhotoInputRef}
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
                            onClick={async () => {
                                await handleSetPhotoUrl(i);
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}>
            {layout!}
        </Modal>
    );
};

export default ChoosePersonaModal;
