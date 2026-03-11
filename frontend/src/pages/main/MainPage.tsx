import React, { JSX, useState } from 'react';
import styles from './MainPage.module.css';
import sampleStyles from './sample-item/SampleItem.module.css';
import { useScreenSize } from '../../hooks/useScreenSize';
import { SCREEN_MIN_BOUNDARY_L } from '../../utils/constants';
import UserPersonaImage from '../../assets/images/ux-persona-vector.png';
import EmpathyMapImage from '../../assets/images/emapthy-map-vector.png';
import CompetitorAnalysisImage from '../../assets/images/competitor-analysis-vector.png';
import TickDownIcon from '../../assets/icons/tick-down.svg';
import UserPersonaSampleImage from '../../assets/images/ux-persona-main-page.png';
import EmpathyMapSampleImage from '../../assets/images/empathy-map-main-page.png';
import CompetitorAnalysisSampleImage from '../../assets/images/competitor-analysis-main-page.png';
import SitemapBlurredSampleImage from '../../assets/images/sitemap-blured.png';
import UserFlowBlurredSampleImage from '../../assets/images/user-flow-blured.png';
import CJMBlurredSampleImage from '../../assets/images/cjm-blured.png';
import ButtonGradientXlg from '../../components/buttons/ButtonGradientXlg';
import SampleItem from './sample-item/SampleItem';
import SampleItemDisabled from './sample-item/SampleItemDisabled';
import SignUpModal from '../../components/header/sign-up-modal/SignUpModal';
import { useAppSelector } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';
import {
    createNewProject,
    findOneProject,
    getAllProjects,
} from '../../services/project';
import ChooseProjectModal from './choose-project-modal/ChooseProjectModal';
import { createNewCompetitorAnalysis } from '../../services/competitorAnalysis';
import { createNewEmpathyMap } from '../../services/empathyMaps';
import { createNewUxPersona } from '../../services/uxPersonas';

const MainPage = () => {
    const screenSize = useScreenSize();
    const navigate = useNavigate();

    const user = useAppSelector((state) => state.userReducer.user);

    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isChosenProjectModalOpen, setIsChosenProjectModalOpen] =
        useState(false);
    const [chosenFeatureLink, setChosenFeatureLink] = useState<string>();
    const [chosenProjectSK, setChosenProjectSK] = useState<string>();

    async function handleCreateBlankProject(): Promise<void> {
        document.body.classList.remove('_lock');

        if (!user) {
            setIsSignUpModalOpen(true);
        } else {
            try {
                const newProjectSK = await createNewProject();
                const url = `/project/${newProjectSK}`;
                navigate(encodeURI(url));
            } catch (e) {
                navigate('/');
                location.reload();
            }
        }
    }

    function handleCreateCompetitorAnalysisClick(): void {
        if (!user) {
            navigate('/competitoranalysis');
        }

        setChosenFeatureLink('/competitoranalysis');
        setIsChosenProjectModalOpen(true);
    }

    function handleCreateEmpathyMapClick(): void {
        if (!user) {
            navigate('/empathymap');
        }

        setChosenFeatureLink('/empathymap');
        setIsChosenProjectModalOpen(true);
    }

    function handleCreateUxPersonaClick(): void {
        if (!user) {
            navigate('/uxpersonas');
        }

        setChosenFeatureLink('/uxpersonas');
        setIsChosenProjectModalOpen(true);
    }

    async function handleChooseProjectSK(projectSK: string) {
        setChosenProjectSK(projectSK);

        if (chosenFeatureLink === '/competitoranalysis') {
            const companal = await createNewCompetitorAnalysis(projectSK);

            const formattedPK = companal.PK.replace('#', '_');
            const formattedSK = companal.SK.replace('#', '_');

            navigate(`${chosenFeatureLink}/${formattedPK}/${formattedSK}`);
        } else if (chosenFeatureLink === '/empathymap') {
            const empmap = await createNewEmpathyMap(projectSK);

            const formattedPK = empmap.PK.replace('#', '_');
            const formattedSK = empmap.SK.replace('#', '_');

            navigate(`${chosenFeatureLink}/${formattedPK}/${formattedSK}`);
        } else if (chosenFeatureLink === '/uxpersonas') {
            const uxpersona = await createNewUxPersona(projectSK);

            const formattedPK = uxpersona.PK.replace('#', '_');
            const formattedSK = uxpersona.SK.replace('#', '_');

            navigate(`${chosenFeatureLink}/${formattedPK}/${formattedSK}`);
        }
    }

    const layoutL: JSX.Element = (
        <>
            <section className={styles['hero']}>
                <div className={`container`}>
                    <div className={`row`}>
                        <div className='col-l-12'>
                            <div className={styles['hero_text']}>
                                <h1 className={'heading1 color-dark-800'}>
                                    Create UX stuff easy and completely free
                                </h1>
                                <small className={'text-big color-gray-800'}>
                                    we provide easy and intuitive way to create
                                    the next UX components:
                                </small>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-l-12'>
                            <div className={styles['hero_icons']}>
                                <div className={styles['hero_icons_item']}>
                                    <img
                                        src={UserPersonaImage}
                                        alt={'user persona icon'}
                                    />
                                    <h4 className={'heading4 color-dark-900'}>
                                        User Personas
                                    </h4>
                                    <TickDownIcon />
                                </div>
                                <div className={styles['hero_icons_item']}>
                                    <img
                                        src={EmpathyMapImage}
                                        alt={'empathy map icon'}
                                    />
                                    <h4 className={'heading4 color-dark-900'}>
                                        Empathy Maps
                                    </h4>
                                    <TickDownIcon />
                                </div>
                                <div className={styles['hero_icons_item']}>
                                    <img
                                        src={CompetitorAnalysisImage}
                                        alt={'competitor analysis icon'}
                                    />
                                    <h4 className={'heading4 color-dark-900'}>
                                        Competitor Analysis
                                    </h4>
                                    <TickDownIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <SampleItem
                heading={'User Personas'}
                text={
                    'Fictional characters created to\n' +
                    'represent different types of users that\n' +
                    'might interact with a product.'
                }
                imageUrl={UserPersonaSampleImage}
                createButtonText={'Create User Persona'}
                className={sampleStyles['sample_ux_persona']}
                onClick={handleCreateUxPersonaClick}
                imageAlt={'user persona sample'}
            />
            <SampleItem
                heading={'Empathy Maps'}
                text={
                    ' A visual tool used to understand and\n' +
                    'empathize with users by mapping out\n' +
                    'their thoughts, feelings, actions, and\n' +
                    'motivations.'
                }
                imageUrl={EmpathyMapSampleImage}
                createButtonText={'Create Empathy Map'}
                className={sampleStyles['sample_empathy_map']}
                onClick={handleCreateEmpathyMapClick}
                imageAlt={'empathy map sample'}
            />
            <SampleItem
                heading={'Competitor Analysis'}
                text={
                    'Focuses on how competitors design their\n' +
                    'interfaces, the features they offer, the\n' +
                    'usability of their products, and the\n' +
                    'overall experience.'
                }
                imageUrl={CompetitorAnalysisSampleImage}
                createButtonText={'Create Competitor Analysis Table'}
                className={sampleStyles['sample_competitor_analysis']}
                onClick={handleCreateCompetitorAnalysisClick}
                imageAlt={'competitor analysis sample'}
            />
            <SampleItemDisabled
                heading={'Sitemaps'}
                text={
                    'Visual representation of the structure\n' +
                    'and hierarchy of a website or\n' +
                    'application from a user-centered\n' +
                    'perspective.'
                }
                imageUrl={SitemapBlurredSampleImage}
                createButtonText={'Create Sitemap'}
                className={sampleStyles['sample_sitemap']}
                imageAlt={'sitemap sample in development'}
            />
            <SampleItemDisabled
                heading={'Customer Journey Maps'}
                text={
                    'End-to-end experience that a customer\n' +
                    'has with a product, service, or brand\n' +
                    'across various touchpoints and\n' +
                    'interactions.'
                }
                imageUrl={CJMBlurredSampleImage}
                createButtonText={'Create CJM'}
                className={sampleStyles['sample_cjm']}
                imageAlt={'CJM sample in development'}
            />
            <SampleItemDisabled
                heading={'User Flow Diagrams'}
                text={
                    'Steps a user takes to accomplish a\n' +
                    'specific task or goal within a digital\n' +
                    'product.'
                }
                imageUrl={UserFlowBlurredSampleImage}
                createButtonText={'Create User Flow'}
                className={sampleStyles['sample_user_flow']}
                imageAlt={'user flow sample in development'}
            />
            <section className={styles['alternative_creation']}>
                <div className='container'>
                    <div className='row'>
                        <div className='col-l-12'>
                            <h2 className={'heading2 color-dark-800'}>
                                Or start from creating project and than decide
                                what you need
                            </h2>
                            <ButtonGradientXlg
                                onClick={handleCreateBlankProject}>
                                Create Blank Project
                            </ButtonGradientXlg>
                        </div>
                    </div>
                </div>
            </section>
            <SignUpModal
                isOpen={isSignUpModalOpen}
                setIsOpen={setIsSignUpModalOpen}
            />
            <ChooseProjectModal
                isOpen={isChosenProjectModalOpen}
                setIsOpen={setIsChosenProjectModalOpen}
                setChosenProjectSK={handleChooseProjectSK}
                handleCreateBlankProject={handleCreateBlankProject}
            />
        </>
    );

    const layoutS: JSX.Element = (
        <>
            <section className={styles['hero']}>
                <div className={`container`}>
                    <div className={`row`}>
                        <div className='col-s-4'>
                            <div className={styles['hero_text']}>
                                <h1 className={'heading3 color-dark-800'}>
                                    Create UX stuff easy and completely free
                                </h1>
                            </div>
                        </div>
                        <div className='col-s-4'>
                            <div className={styles['hero_text']}>
                                <small className={'text-normal color-gray-800'}>
                                    we provide easy and intuitive way to create
                                    the next UX components:
                                </small>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-s-4'>
                            <div className={styles['hero_icons']}>
                                <div className={styles['hero_icons_item']}>
                                    <img
                                        src={UserPersonaImage}
                                        alt={'user persona icon'}
                                    />
                                    <h4
                                        className={
                                            'text-normal color-dark-900'
                                        }>
                                        User Personas
                                    </h4>
                                    <TickDownIcon />
                                </div>
                                <div className={styles['hero_icons_item']}>
                                    <img
                                        src={EmpathyMapImage}
                                        alt={'empathy map icon'}
                                    />
                                    <h4
                                        className={
                                            'text-normal color-dark-900'
                                        }>
                                        Empathy Maps
                                    </h4>
                                    <TickDownIcon />
                                </div>
                                <div className={styles['hero_icons_item']}>
                                    <img
                                        src={CompetitorAnalysisImage}
                                        alt={'competitor analysis icon'}
                                    />
                                    <h4
                                        className={
                                            'text-normal color-dark-900'
                                        }>
                                        Competitor Analysis
                                    </h4>
                                    <TickDownIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <SampleItem
                heading={'User Personas'}
                text={
                    'Fictional characters created to\n' +
                    'represent different types of users that\n' +
                    'might interact with a product.'
                }
                imageUrl={UserPersonaSampleImage}
                createButtonText={'Create User Persona'}
                className={sampleStyles['sample_ux_persona']}
                onClick={handleCreateUxPersonaClick}
                imageAlt={'user persona sample'}
            />
            <SampleItem
                heading={'Empathy Maps'}
                text={
                    ' A visual tool used to understand and\n' +
                    'empathize with users by mapping out\n' +
                    'their thoughts, feelings, actions, and\n' +
                    'motivations.'
                }
                imageUrl={EmpathyMapSampleImage}
                createButtonText={'Create Empathy Map'}
                className={sampleStyles['sample_empathy_map']}
                onClick={handleCreateEmpathyMapClick}
                imageAlt={'empathy map sample'}
            />
            <SampleItem
                heading={'Competitor Analysis'}
                text={
                    'Focuses on how competitors design their\n' +
                    'interfaces, the features they offer, the\n' +
                    'usability of their products, and the\n' +
                    'overall experience.'
                }
                imageUrl={CompetitorAnalysisSampleImage}
                createButtonText={'Create Competitor Analysis Table'}
                className={sampleStyles['sample_competitor_analysis']}
                onClick={handleCreateCompetitorAnalysisClick}
                imageAlt={'competitor analysis sample'}
            />
            <SampleItemDisabled
                heading={'Sitemaps'}
                text={
                    'Visual representation of the structure\n' +
                    'and hierarchy of a website or\n' +
                    'application from a user-centered\n' +
                    'perspective.'
                }
                imageUrl={SitemapBlurredSampleImage}
                createButtonText={'Create Sitemap'}
                className={sampleStyles['sample_sitemap']}
                imageAlt={'sitemap sample in development'}
            />
            <SampleItemDisabled
                heading={'Customer Journey Maps'}
                text={
                    'End-to-end experience that a customer\n' +
                    'has with a product, service, or brand\n' +
                    'across various touchpoints and\n' +
                    'interactions.'
                }
                imageUrl={CJMBlurredSampleImage}
                createButtonText={'Create CJM'}
                className={sampleStyles['sample_cjm']}
                imageAlt={'CJM sample in development'}
            />
            <SampleItemDisabled
                heading={'User Flow Diagrams'}
                text={
                    'Steps a user takes to accomplish a\n' +
                    'specific task or goal within a digital\n' +
                    'product.'
                }
                imageUrl={UserFlowBlurredSampleImage}
                createButtonText={'Create User Flow'}
                className={sampleStyles['sample_user_flow']}
                imageAlt={'user flow sample in development'}
            />

            <section className={styles['alternative_creation']}>
                <div className='container'>
                    <div className='row'>
                        <div className='col-s-4'>
                            <h2 className={'heading4 color-dark-800'}>
                                Or start from creating project and than decide
                                what you need
                            </h2>
                            <ButtonGradientXlg
                                onClick={handleCreateBlankProject}>
                                Create Blank Project
                            </ButtonGradientXlg>
                        </div>
                    </div>
                </div>
            </section>
            <SignUpModal
                isOpen={isSignUpModalOpen}
                setIsOpen={setIsSignUpModalOpen}
            />
            <ChooseProjectModal
                isOpen={isChosenProjectModalOpen}
                setIsOpen={setIsChosenProjectModalOpen}
                setChosenProjectSK={handleChooseProjectSK}
                handleCreateBlankProject={handleCreateBlankProject}
            />
        </>
    );

    return screenSize.width >= SCREEN_MIN_BOUNDARY_L ? layoutL : layoutS;
};

export default MainPage;
