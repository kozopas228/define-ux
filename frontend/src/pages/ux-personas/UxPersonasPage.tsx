import React, { useEffect, useRef, useState } from 'react';
import styles from './UxPersonasPage.module.css';
import { useScreenSize } from '../../hooks/useScreenSize';
import FeatureSidebar, {
    FeatureItem,
} from '../../components/feature/feature-sidebar/FeatureSidebar';
import FeatureHeader from '../../components/feature/feature-header/FeatureHeader';
import { SCREEN_MIN_BOUNDARY_L } from '../../utils/constants';
import PersonaPhoto from './persona-photo/PersonaPhoto';
import PersonalityDescription from './personality-description/PersonalityDescription';
import Demographics from './demographics/Demographics';
import Personality from './personality/Personality';
import Biography from './biography/Biography';
import GoalsFrustrations from './goals-frustrations/GoalsFrustrations';
import Skills from './skills-motivations/skills/Skills';
import Motivations from './skills-motivations/motivations/Motivations';
import { generateUXPersonasJPG } from './generateUXPersonasJPG';
import { findOneProject } from '../../services/project';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { Project } from '../../types/project';
import { isEqual } from 'lodash';
import {
    createNewUxPersona,
    deleteUxPersona,
    findAllUxPersonasByProjectSK,
    findOneUxPersona,
    getUxPersonaPhoto,
    saveUxPersona,
    uploadUxPersonaThumbnail,
} from '../../services/uxPersonas';
import { UxPersonaDto } from './types';
import FallbackImage from '../../assets/images/ux-persona-vector.png';
import { saveImage } from '../../utils/image';
import { getMockedUxPersona } from './getMockedUxPersona';
import Spinner from '../../components/spinner/Spinner';

const mockedUxPersona = getMockedUxPersona();
const UxPersonasPage = () => {
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<any>(null);
    const screenSize = useScreenSize();
    const navigate = useNavigate();
    const params = useParams();

    const user = useAppSelector((state) => state.userReducer.user);

    const [uxPersona, setUxPersona] = useState<UxPersonaDto>(mockedUxPersona);
    const [newPhotoUrl, setNewPhotoUrl] = useState<string>();
    const [photoUrl, setPhotoUrl] = useState<string>();
    const [savedUxPersona, setSavedUxPersona] = useState<UxPersonaDto>();
    const [isLoading, setIsLoading] = useState(true);
    const [featureHeading, setFeatureHeading] = useState('');
    const [items, setItems] = useState<FeatureItem[]>([]);
    const [project, setProject] = useState<Project>();

    const isDataSaved = isEqual(uxPersona, savedUxPersona);

    useEffect(() => {
        if (!isLoading) {
            setContentHeight(contentRef.current.getBoundingClientRect().height);
        }
    }, [uxPersona, isLoading]);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        (async function () {
            if (!params.PK || !params.SK) {
                return;
            }

            setIsLoading(true);

            const PK = params.PK.replace('_', '#');
            const SK = params.SK.replace('_', '#');

            const uxPersonaDto = await findOneUxPersona(PK, SK);
            const uxPersonaPhoto = await getUxPersonaPhoto(PK, SK);

            setUxPersona(uxPersonaDto);
            setPhotoUrl(uxPersonaPhoto);
            setSavedUxPersona(uxPersonaDto);
            setFeatureHeading(uxPersonaDto.name);

            const allItems = await findAllUxPersonasByProjectSK(PK);
            setItems(allItems);

            const project = await findOneProject(
                user.PK,
                uxPersonaDto.projectSK
            );
            setProject(project);

            setIsLoading(false);
        })();
    }, [params.PK, params.SK, user]);

    async function handleSave() {
        if (!uxPersona) {
            return;
        }

        uxPersona.name = featureHeading;

        await saveUxPersona(uxPersona);

        if (newPhotoUrl) {
            await uploadUxPersonaThumbnail(
                uxPersona.projectSK,
                uxPersona.uxPersonaSK,
                newPhotoUrl
            );

            setPhotoUrl(newPhotoUrl);
            setNewPhotoUrl(undefined);
        }

        setSavedUxPersona(uxPersona);

        const allItems = await findAllUxPersonasByProjectSK(
            uxPersona!.projectSK
        );
        setItems(allItems);
    }

    async function handleExport() {
        if (!uxPersona) {
            return;
        }

        const img = await generateUXPersonasJPG(featureHeading, 1);

        saveImage('ux_persona_export.jpg', img!);
    }

    function handleProjectNameClick() {
        if (uxPersona) {
            navigate(`/project/${uxPersona.projectSK}`);
        }
    }

    async function handleCreateNewFeature() {
        if (uxPersona) {
            const newFeature = await createNewUxPersona(uxPersona.projectSK);

            const PK = newFeature.PK.replace('#', '_');
            const SK = newFeature.SK.replace('#', '_');
            navigate(`/uxpersonas/${PK}/${SK}`);
        }
    }

    async function handleDelete(): Promise<void> {
        if (uxPersona) {
            navigate(`/project/${uxPersona.projectSK}`);

            await deleteUxPersona(uxPersona.projectSK, uxPersona.uxPersonaSK);
        }
    }

    const layoutL = (
        <>
            <div className='container'>
                <div className='row'>
                    <FeatureSidebar
                        items={items}
                        contentHeight={contentHeight}
                        fallbackImage={FallbackImage}
                        handleCreateNewFeature={handleCreateNewFeature}
                        urlFeatureName={'uxpersonas'}
                    />
                    <div className='col-l-10'>
                        <FeatureHeader
                            projectName={project?.name ?? '...'}
                            projectType={'UX Persona'}
                            featureHeading={featureHeading}
                            handleExport={handleExport}
                            handleSave={handleSave}
                            handleProjectNameClick={handleProjectNameClick}
                            isDataSaved={isDataSaved}
                            handleDelete={handleDelete}
                            setFeatureHeading={setFeatureHeading}
                        />
                        <div
                            ref={contentRef}
                            className={styles['content']}
                            id={'ux_persona_export_jpg'}>
                            {isLoading ? (
                                <Spinner className={styles['spinner']} />
                            ) : (
                                <>
                                    <div className={styles['persona_col_3']}>
                                        <PersonaPhoto
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                            photoUrl={photoUrl}
                                            newPhotoUrl={newPhotoUrl}
                                            setNewPhotoUrl={setNewPhotoUrl}
                                        />
                                        <h3
                                            id={'ux_persona_name_export_jpg'}
                                            className={
                                                'heading3 color-dark-900'
                                            }></h3>
                                        <PersonalityDescription
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                        />
                                        <Demographics
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                        />
                                        <Personality
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                        />
                                    </div>
                                    <div className={styles['persona_col_4']}>
                                        <Biography
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                        />
                                        <GoalsFrustrations
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                        />
                                    </div>
                                    <div className={styles['persona_col_3']}>
                                        <Skills
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                        />
                                        <Motivations
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const layoutS = (
        <>
            <div className='container'>
                <FeatureHeader
                    projectName={project?.name ?? '...'}
                    projectType={'UX Persona'}
                    featureHeading={featureHeading}
                    handleExport={handleExport}
                    handleSave={handleSave}
                    handleProjectNameClick={handleProjectNameClick}
                    isDataSaved={isDataSaved}
                    handleDelete={handleDelete}
                    setFeatureHeading={setFeatureHeading}
                />
                <div className='row'>
                    <div className='col-s-4'>
                        <div
                            ref={contentRef}
                            className={styles['content']}>
                            <div
                                className={styles['persona_col_m']}
                                id={'ux_persona_export_jpg'}>
                                {isLoading ? (
                                    <Spinner className={styles['spinner']} />
                                ) : (
                                    <>
                                        <PersonaPhoto
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                            photoUrl={photoUrl}
                                            newPhotoUrl={newPhotoUrl}
                                            setNewPhotoUrl={setNewPhotoUrl}
                                        />
                                        <h3
                                            id={'ux_persona_name_export_jpg'}
                                            className={
                                                'heading3 color-dark-900'
                                            }></h3>
                                        <PersonalityDescription
                                            uxPersona={uxPersona!}
                                            setUxPersona={setUxPersona}
                                        />
                                        <Demographics
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                        />
                                        <Personality
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                        />
                                        <Biography
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                        />
                                        <GoalsFrustrations
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                        />
                                        <Skills
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                        />
                                        <Motivations
                                            uxPersona={uxPersona}
                                            setUxPersona={setUxPersona}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <FeatureSidebar
                    items={items}
                    contentHeight={contentHeight}
                    fallbackImage={FallbackImage}
                    handleCreateNewFeature={handleCreateNewFeature}
                    urlFeatureName={'uxpersonas'}
                />
            </div>
        </>
    );

    return screenSize.width >= SCREEN_MIN_BOUNDARY_L ? layoutL : layoutS;
};

export default UxPersonasPage;
