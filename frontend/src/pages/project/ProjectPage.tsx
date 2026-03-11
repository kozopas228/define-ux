import React, { useEffect, useState } from 'react';
import styles from './ProjectPage.module.css';
import { SCREEN_MIN_BOUNDARY_L } from '../../utils/constants';
import { useScreenSize } from '../../hooks/useScreenSize';
import ProjectNameInput from './project-name-input/ProjectNameInput';
import ProjectDescriptionInput from './project-description-input/ProjectDescriptionInput';
import ButtonPrimary from '../../components/buttons/ButtonPrimary';
import AlertSuccess from '../../components/alerts/AlertSuccess';
import ProjectSlider, {
    ProjectSliderSize,
} from './project-slider/ProjectSlider';
import UxPersonaIcon from '../../assets/icons/ux-persona.svg';
import EmpathyMapIcon from '../../assets/icons/empathy-map.svg';
import CompetitorAnalysisIcon from '../../assets/icons/competitor-analysis.svg';
import { validateDescription, validateName } from '../../utils/validations';
import AlertDanger from '../../components/alerts/AlertDanger';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { findOneProject, saveProject } from '../../services/project';
import { useAppSelector } from '../../store/hooks';
import {
    createNewCompetitorAnalysis,
    findAllCompetitorAnalysisByProjectSK,
} from '../../services/competitorAnalysis';
import {
    createNewEmpathyMap,
    findAllEmpathyMapsByProjectSK,
} from '../../services/empathyMaps';
import {
    createNewUxPersona,
    findAllUxPersonasByProjectSK,
} from '../../services/uxPersonas';
import { UxPersona } from '../../types/uxPersona';
import { CompetitorAnalysis } from '../../types/competitorAnalysis';
import { EmpathyMap } from '../../types/empathyMap';

const ProjectPage = () => {
    const screenSize = useScreenSize();
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const user = useAppSelector((state) => state.userReducer.user);

    const SK = params.SK + location.hash;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSaveAlertActive, setIsSaveAlertActive] = useState(false);
    const [isErrorSaveAlertActive, setIsErrorSaveAlertActive] = useState(false);
    const [alertDangerMessage, setAlertDangerMessage] = useState('');
    const [nameValidationErrors, setNameValidationErrors] = useState<string[]>(
        []
    );
    const [descriptionValidationErrors, setDescriptionValidationErrors] =
        useState<string[]>([]);

    const [uxPersonas, setUxPersonas] = useState<UxPersona[]>([]);
    const [isUxPersonaCreating, setIsUxPersonaCreating] = useState(false);
    const [areUxPersonasLoading, setAreUxPersonasLoading] = useState(true);

    const [competitorAnalysis, setCompetitorAnalysis] = useState<
        CompetitorAnalysis[]
    >([]);
    const [isCompetitorAnalysisCreating, setIsCompetitorAnalysisCreating] =
        useState(false);
    const [areCompetitorAnalysisLoading, setAreCompetitorAnalysisLoading] =
        useState(true);

    const [empathyMaps, setEmpathyMaps] = useState<EmpathyMap[]>([]);
    const [isEmpathyMapCreating, setIsEmpathyMapCreating] = useState(false);
    const [areEmpathyMapsLoading, setAreEmpathyMapsLoading] = useState(true);

    useEffect(() => {
        (async function () {
            try {
                const project = await findOneProject(user!.PK, SK);
                setName(project.name);
                setDescription(project.description ?? '');

                setAreEmpathyMapsLoading(true);
                const empathyMaps = await findAllEmpathyMapsByProjectSK(SK);
                setEmpathyMaps(empathyMaps);
                setAreEmpathyMapsLoading(false);

                setAreUxPersonasLoading(true);
                const uxPersonas = await findAllUxPersonasByProjectSK(SK);
                setUxPersonas(uxPersonas);
                setAreUxPersonasLoading(false);

                setAreCompetitorAnalysisLoading(true);
                const competitorAnalysis =
                    await findAllCompetitorAnalysisByProjectSK(SK);
                setCompetitorAnalysis(competitorAnalysis);
                setAreCompetitorAnalysisLoading(false);
            } catch (e) {
                setAlertDangerMessage(
                    'Error occurred while retrieving project data'
                );
                setIsErrorSaveAlertActive(true);
            }
        })();
    }, [SK, user]);

    function handleChangeName(e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.value;
        setName(e.currentTarget.value);
        const errors = validateName(value);

        setNameValidationErrors(errors);
    }

    function handleChangeDescription(e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.value;
        setDescription(e.currentTarget.value);
        const errors = validateDescription(value);

        setDescriptionValidationErrors(errors);
    }

    async function handleSaveClick() {
        if (
            nameValidationErrors.length === 0 &&
            descriptionValidationErrors.length === 0
        ) {
            try {
                await saveProject(SK, name, description);
                setIsSaveAlertActive(true);
            } catch (e) {
                setAlertDangerMessage(
                    'Error has occurred while saving project'
                );
                setIsErrorSaveAlertActive(true);
            }
        } else {
            setAlertDangerMessage('Cannot save project');
            setIsErrorSaveAlertActive(true);
        }
    }

    async function handleCreateNewCompetitorAnalysis(): Promise<void> {
        setIsCompetitorAnalysisCreating(true);
        const companal = await createNewCompetitorAnalysis(SK);
        setIsCompetitorAnalysisCreating(false);

        const formattedPK = companal.PK.replace('#', '_');
        const formattedSK = companal.SK.replace('#', '_');

        navigate(`/competitoranalysis/${formattedPK}/${formattedSK}`);
    }

    async function handleCreateNewUxPersona(): Promise<void> {
        setIsUxPersonaCreating(true);
        const uxpersona = await createNewUxPersona(SK);
        setIsUxPersonaCreating(false);

        const formattedPK = uxpersona.PK.replace('#', '_');
        const formattedSK = uxpersona.SK.replace('#', '_');

        navigate(`/uxpersonas/${formattedPK}/${formattedSK}`);
    }

    async function handleCreateNewEmpathyMap(): Promise<void> {
        setIsEmpathyMapCreating(true);
        const empathyMap = await createNewEmpathyMap(SK);
        setIsEmpathyMapCreating(false);

        const formattedPK = empathyMap.PK.replace('#', '_');
        const formattedSK = empathyMap.SK.replace('#', '_');

        navigate(`/empathymap/${formattedPK}/${formattedSK}`);
    }

    const layoutL: React.JSX.Element = (
        <>
            <div className='container'>
                <div className='row'>
                    <div className={`col-l-12 ${styles['input_center']}`}>
                        <ProjectNameInput
                            value={name}
                            onChange={handleChangeName}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className={`col-l-12 ${styles['input_center']}`}>
                        <ProjectDescriptionInput
                            value={description}
                            onChange={handleChangeDescription}
                        />
                    </div>
                </div>
                {(nameValidationErrors.length > 0 ||
                    descriptionValidationErrors.length > 0) && (
                    <div className='row'>
                        <div
                            className={`col-l-12 ${styles['validation_errors']}`}>
                            {nameValidationErrors.map((ve) => (
                                <p
                                    key={ve}
                                    className={'text-normal color-sinopia-600'}>
                                    {ve}
                                </p>
                            ))}
                            {descriptionValidationErrors.map((ve) => (
                                <p
                                    key={ve}
                                    className={'text-normal color-sinopia-600'}>
                                    {ve}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
                <div className='row'>
                    <div className={`col-l-12 ${styles['export_and_save']}`}>
                        <ButtonPrimary onClick={handleSaveClick}>
                            Save
                        </ButtonPrimary>
                    </div>
                </div>
                <section className={styles['sliders']}>
                    <ProjectSlider
                        heading={
                            <>
                                <UxPersonaIcon />
                                <span className={'color-gray-800 text-normal'}>
                                    USER PERSONAS:
                                </span>
                            </>
                        }
                        size={ProjectSliderSize.SMALL}
                        items={uxPersonas}
                        handleCreateClick={handleCreateNewUxPersona}
                        isCreating={isUxPersonaCreating}
                        isLoading={areUxPersonasLoading}
                        urlFeatureName={'uxpersonas'}
                    />
                    <ProjectSlider
                        heading={
                            <>
                                <EmpathyMapIcon />
                                <span className={'color-gray-800 text-normal'}>
                                    EMPATHY MAPS:
                                </span>
                            </>
                        }
                        size={ProjectSliderSize.SMALL}
                        items={empathyMaps}
                        handleCreateClick={handleCreateNewEmpathyMap}
                        isCreating={isEmpathyMapCreating}
                        isLoading={areEmpathyMapsLoading}
                        urlFeatureName={'empathymap'}
                    />
                    <ProjectSlider
                        heading={
                            <>
                                <CompetitorAnalysisIcon />
                                <span className={'color-gray-800 text-normal'}>
                                    COMPETITOR ANALYSIS:
                                </span>
                            </>
                        }
                        size={ProjectSliderSize.BIG}
                        items={competitorAnalysis}
                        handleCreateClick={handleCreateNewCompetitorAnalysis}
                        isCreating={isCompetitorAnalysisCreating}
                        isLoading={areCompetitorAnalysisLoading}
                        urlFeatureName={'competitoranalysis'}
                    />
                </section>
            </div>
            <AlertSuccess
                isActive={isSaveAlertActive}
                setIsActive={setIsSaveAlertActive}>
                Project Saved Successfully
            </AlertSuccess>
            <AlertDanger
                isActive={isErrorSaveAlertActive}
                setIsActive={setIsErrorSaveAlertActive}>
                Cannot Save Project
            </AlertDanger>
        </>
    );

    const layoutS: React.JSX.Element = (
        <>
            <div className='container'>
                <div className='row'>
                    <div className={`col-s-4 ${styles['input_center']}`}>
                        <ProjectNameInput
                            value={name}
                            onChange={handleChangeName}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className={`col-s-4 ${styles['input_center']}`}>
                        <ProjectDescriptionInput
                            value={description}
                            onChange={handleChangeDescription}
                        />
                    </div>
                </div>
                {(nameValidationErrors.length > 0 ||
                    descriptionValidationErrors.length > 0) && (
                    <div className='row'>
                        <div
                            className={`col-l-12 ${styles['validation_errors']}`}>
                            {nameValidationErrors.map((ve) => (
                                <p
                                    key={ve}
                                    className={'text-normal color-sinopia-600'}>
                                    {ve}
                                </p>
                            ))}
                            {descriptionValidationErrors.map((ve) => (
                                <p
                                    key={ve}
                                    className={'text-normal color-sinopia-600'}>
                                    {ve}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
                <div className='row'>
                    <div className={`col-l-12 ${styles['export_and_save']}`}>
                        <ButtonPrimary onClick={handleSaveClick}>
                            Save
                        </ButtonPrimary>
                    </div>
                </div>
                <section className={styles['sliders']}>
                    <ProjectSlider
                        heading={
                            <>
                                <UxPersonaIcon />
                                <span className={'color-gray-800 text-normal'}>
                                    USER PERSONAS:
                                </span>
                            </>
                        }
                        size={ProjectSliderSize.SMALL}
                        items={uxPersonas}
                        handleCreateClick={handleCreateNewUxPersona}
                        isCreating={isUxPersonaCreating}
                        isLoading={areUxPersonasLoading}
                        urlFeatureName={'uxpersonas'}
                    />
                    <ProjectSlider
                        heading={
                            <>
                                <EmpathyMapIcon />
                                <span className={'color-gray-800 text-normal'}>
                                    EMPATHY MAPS:
                                </span>
                            </>
                        }
                        size={ProjectSliderSize.SMALL}
                        items={empathyMaps}
                        handleCreateClick={handleCreateNewEmpathyMap}
                        isCreating={isEmpathyMapCreating}
                        isLoading={areEmpathyMapsLoading}
                        urlFeatureName={'empathymap'}
                    />
                    <ProjectSlider
                        heading={
                            <>
                                <CompetitorAnalysisIcon />
                                <span className={'color-gray-800 text-normal'}>
                                    COMPETITOR ANALYSIS:
                                </span>
                            </>
                        }
                        size={ProjectSliderSize.BIG}
                        items={competitorAnalysis}
                        handleCreateClick={handleCreateNewCompetitorAnalysis}
                        isCreating={isCompetitorAnalysisCreating}
                        isLoading={areCompetitorAnalysisLoading}
                        urlFeatureName={'competitoranalysis'}
                    />
                </section>
            </div>
            <AlertSuccess
                isActive={isSaveAlertActive}
                setIsActive={setIsSaveAlertActive}>
                Project Saved Successfully
            </AlertSuccess>
            <AlertDanger
                isActive={isErrorSaveAlertActive}
                setIsActive={setIsErrorSaveAlertActive}>
                {alertDangerMessage}
            </AlertDanger>
        </>
    );

    return screenSize.width >= SCREEN_MIN_BOUNDARY_L ? layoutL : layoutS;
};

export default ProjectPage;
