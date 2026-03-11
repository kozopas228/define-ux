import React, { useEffect, useRef, useState } from 'react';
import styles from './EmpathyMapPage.module.css';
import { useScreenSize } from '../../hooks/useScreenSize';
import FeatureSidebar, {
    FeatureItem,
} from '../../components/feature/feature-sidebar/FeatureSidebar';
import FeatureHeader from '../../components/feature/feature-header/FeatureHeader';
import { SCREEN_MIN_BOUNDARY_L } from '../../utils/constants';
import PainsGains from './pains-gains/PainsGains';
import { generateEmapthyMapJPG } from './generateEmpathyMapJPG';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { Project } from '../../types/project';
import { cloneDeep, isEqual } from 'lodash';
import { EmpathyMap } from '../../types/empathyMap';
import { findOneProject } from '../../services/project';
import {
    createNewEmpathyMap,
    deleteEmpathyMap,
    findAllEmpathyMapsByProjectSK,
    findOneEmpathyMap,
    saveEmpathyMap,
    uploadEmpathyMapThumbnail,
} from '../../services/empathyMaps';
import { EmpathyMapDto } from './types';
import { saveImage } from '../../utils/image';
import FallbackImage from '../../assets/images/emapthy-map-vector.png';
import EmpathyMapComponent from './empathy-map/EmpathyMap';
import Spinner from '../../components/spinner/Spinner';
import { getMockedEmpathyMap } from './getMockedEmpathyMap';
import { UxPersona } from '../../types/uxPersona';
import {
    findAllUxPersonasByProjectSK,
    findOneUxPersona,
    getUxPersonaPhoto,
} from '../../services/uxPersonas';

const mockedEmpathyMap = getMockedEmpathyMap();

const EmpathyMapPage = () => {
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<any>(null);
    const screenSize = useScreenSize();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    const [empathyMap, setEmpathyMap] = useState<EmpathyMap>(mockedEmpathyMap);
    const [savedEmpathyMap, setSavedEmpathyMap] = useState<EmpathyMap>();

    const [personas, setPersonas] = useState<UxPersona[]>([]);
    const [chosenPersona, setChosenPersona] = useState<UxPersona>();
    const [savedChosenPersona, setSavedChosenPersona] = useState<UxPersona>();

    const params = useParams();
    const user = useAppSelector((state) => state.userReducer.user);

    const [featureHeading, setFeatureHeading] = useState('');
    const [items, setItems] = useState<FeatureItem[]>([]);
    const [project, setProject] = useState<Project>();

    const isDataSaved =
        isEqual(empathyMap, savedEmpathyMap) &&
        isEqual(chosenPersona, savedChosenPersona);

    useEffect(() => {
        if (!isLoading) {
            setContentHeight(contentRef.current.getBoundingClientRect().height);
        }
    }, [empathyMap, isLoading]);

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

            const empathyMapResponse = await findOneEmpathyMap(PK, SK);

            setEmpathyMap(empathyMapResponse);
            setFeatureHeading(empathyMapResponse.name);
            setSavedEmpathyMap(empathyMapResponse);

            if (empathyMapResponse.personaSK) {
                const personaDto = await findOneUxPersona(
                    empathyMapResponse.PK,
                    empathyMapResponse.personaSK
                );

                const personaEntity = personaDto as unknown as UxPersona;
                personaEntity.PK = personaDto.projectSK;
                personaEntity.SK = personaDto.uxPersonaSK;
                personaEntity.thumbnailPath = await getUxPersonaPhoto(
                    personaEntity.PK,
                    personaEntity.SK
                );

                setChosenPersona(personaEntity);
                setSavedChosenPersona(personaEntity);
            }

            const allItems = await findAllEmpathyMapsByProjectSK(PK);
            setItems(allItems);

            const project = await findOneProject(
                user.PK,
                empathyMapResponse.PK
            );
            setProject(project);

            const uxPersonas = await findAllUxPersonasByProjectSK(PK);
            setPersonas(uxPersonas);

            setIsLoading(false);
        })();
    }, [params.PK, params.SK, user]);

    async function handleSave() {
        if (!empathyMap) {
            return;
        }

        const newEmpathyMap: EmpathyMapDto = {
            projectSK: empathyMap.PK,
            empathyMapSK: empathyMap.SK,
            name: featureHeading,
            says: empathyMap.says,
            does: empathyMap.does,
            thinks: empathyMap.thinks,
            feels: empathyMap.feels,
            pains: empathyMap.pains,
            gains: empathyMap.gains,
            personaSK: chosenPersona?.SK,
        };

        await saveEmpathyMap(newEmpathyMap);

        const img = await generateEmapthyMapJPG(
            0.5,
            chosenPersona?.thumbnailPath
        );

        await uploadEmpathyMapThumbnail(
            newEmpathyMap.projectSK,
            newEmpathyMap.empathyMapSK,
            img!
        );

        setSavedEmpathyMap(empathyMap);
        setSavedChosenPersona(chosenPersona);

        const allItems = await findAllEmpathyMapsByProjectSK(
            newEmpathyMap!.projectSK
        );
        setItems(allItems);
    }

    async function handleExport() {
        const img = await generateEmapthyMapJPG(
            1,
            chosenPersona?.thumbnailPath
        );
        saveImage('empathy_map_export.jpg', img!);
    }

    function handleProjectNameClick() {
        if (empathyMap) {
            navigate(`/project/${empathyMap.PK}`);
        }
    }

    async function handleCreateNewFeature() {
        if (empathyMap) {
            const newFeature = await createNewEmpathyMap(empathyMap.PK);

            const PK = newFeature.PK.replace('#', '_');
            const SK = newFeature.SK.replace('#', '_');
            navigate(`/empathymap/${PK}/${SK}`);
        }
    }

    async function handleDelete(): Promise<void> {
        if (empathyMap) {
            navigate(`/project/${empathyMap.PK}`);

            await deleteEmpathyMap(empathyMap.PK, empathyMap.SK);
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
                        urlFeatureName={'empathymap'}
                        handleCreateNewFeature={handleCreateNewFeature}
                    />
                    <div className='col-l-10'>
                        <FeatureHeader
                            projectName={project?.name ?? '...'}
                            projectType={'Empathy Map'}
                            featureHeading={featureHeading}
                            setFeatureHeading={setFeatureHeading}
                            handleExport={handleExport}
                            handleSave={handleSave}
                            handleProjectNameClick={handleProjectNameClick}
                            isDataSaved={isDataSaved}
                            handleDelete={handleDelete}
                        />
                        <div
                            ref={contentRef}
                            className={styles['content']}
                            id={'empathy_map_export_jpg'}>
                            {isLoading ? (
                                <Spinner className={styles['spinner']} />
                            ) : (
                                <>
                                    <EmpathyMapComponent
                                        empathyMap={empathyMap}
                                        setEmpathyMap={setEmpathyMap}
                                        personas={personas}
                                        chosenPersona={chosenPersona}
                                        setChosenPersona={setChosenPersona}
                                    />
                                    <PainsGains
                                        empathyMap={empathyMap}
                                        setEmpathyMap={setEmpathyMap}
                                    />
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
                    projectType={'Empathy Map'}
                    featureHeading={featureHeading}
                    setFeatureHeading={setFeatureHeading}
                    handleExport={handleExport}
                    handleSave={handleSave}
                    handleProjectNameClick={handleProjectNameClick}
                    isDataSaved={isDataSaved}
                    handleDelete={handleDelete}
                />
                <div className='row'>
                    <div className='col-s-4'>
                        <div
                            ref={contentRef}
                            className={styles['content']}
                            id={'empathy_map_export_jpg'}>
                            {isLoading ? (
                                <Spinner className={styles['spinner']} />
                            ) : (
                                <>
                                    <EmpathyMapComponent
                                        empathyMap={empathyMap}
                                        setEmpathyMap={setEmpathyMap}
                                        personas={personas}
                                        chosenPersona={chosenPersona}
                                        setChosenPersona={setChosenPersona}
                                    />
                                    <PainsGains
                                        empathyMap={empathyMap}
                                        setEmpathyMap={setEmpathyMap}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <FeatureSidebar
                    items={items}
                    contentHeight={contentHeight}
                    fallbackImage={FallbackImage}
                    urlFeatureName={'empathymap'}
                    handleCreateNewFeature={handleCreateNewFeature}
                />
            </div>
        </>
    );

    return screenSize.width >= SCREEN_MIN_BOUNDARY_L ? layoutL : layoutS;
};

export default EmpathyMapPage;
