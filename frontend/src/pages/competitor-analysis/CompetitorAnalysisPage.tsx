import React, { useEffect, useRef, useState } from 'react';
import styles from './CompetitorAnalysisPage.module.css';
import FeatureHeader from '../../components/feature/feature-header/FeatureHeader';
import FeatureSidebar, {
    FeatureItem,
} from '../../components/feature/feature-sidebar/FeatureSidebar';
import {
    MAX_COMPETITOR_AMOUNT,
    MAX_CRITERIA_AMOUNT,
    SCREEN_MIN_BOUNDARY_L,
} from '../../utils/constants';
import { useScreenSize } from '../../hooks/useScreenSize';
import CompetitorTable from './competitor-table/CompetitorTable';
import ButtonPrimaryOutlineLg from '../../components/buttons/ButtonPrimaryOutlineLg';
import { getMockedCompetitorAnalysisData } from './getMockedCompetitorAnalysisData';
import { v4 } from 'uuid';
import {
    CompetitorAnalysisResponseDto,
    CompetitorResponseDto,
    CriteriaResponseDto,
} from './types';
import { UUID } from '../../engine/types/Uuid';
import { cloneDeep, isEqual } from 'lodash';
import ButtonPrimaryOutline from '../../components/buttons/ButtonPrimaryOutline';
import { generateCompetitorAnalysisJPG } from './generateCompetitorAnalysisJPG';
import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import {
    createNewCompetitorAnalysis,
    deleteCompetitorAnalysis,
    findAllCompetitorAnalysisByProjectSK,
    findOneCompetitorAnalysis,
    saveCompetitorAnalysis,
    uploadCompetitorAnalysisThumbnail,
} from '../../services/competitorAnalysis';
import Spinner from '../../components/spinner/Spinner';
import FallbackImage from '../../assets/images/competitor-analysis-vector.png';
import { saveImage } from '../../utils/image';
import { Project } from '../../types/project';
import { findOneProject } from '../../services/project';
import ButtonPrimaryDisabled from '../../components/buttons/ButtonPrimaryDisabled';
const initialData = getMockedCompetitorAnalysisData();
const initialCriterias = initialData[0].criterias;

const CompetitorAnalysisPage = () => {
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<any>(null);
    const screenSize = useScreenSize();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    const [competitorAnalysis, setCompetitorAnalysis] =
        useState<CompetitorAnalysisResponseDto>();
    const [data, setData] = useState<CompetitorResponseDto[]>([]);
    const [savedData, setSavedData] = useState<CompetitorResponseDto[]>([]);
    const [criterias, setCriterias] = useState<CriteriaResponseDto[]>([]);

    const params = useParams();
    const user = useAppSelector((state) => state.userReducer.user);

    const [featureHeading, setFeatureHeading] = useState('');
    const [items, setItems] = useState<FeatureItem[]>([]);

    const [project, setProject] = useState<Project>();

    const isDataSaved = isEqual(data, savedData);

    useEffect(() => {
        if (!isLoading) {
            setContentHeight(contentRef.current.getBoundingClientRect().height);
        }
    }, [data, isLoading]);

    useEffect(() => {
        if (!user) {
            setData(initialData);
            setCriterias(initialCriterias);
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

            const competitorAnalysisResponse = await findOneCompetitorAnalysis(
                PK,
                SK
            );

            setCompetitorAnalysis(competitorAnalysisResponse);
            setFeatureHeading(competitorAnalysisResponse.name);

            if (competitorAnalysisResponse.competitors.length === 0) {
                setData([]);
                setSavedData([]);
                setCriterias([]);
            } else {
                setData(competitorAnalysisResponse.competitors);
                setSavedData(competitorAnalysisResponse.competitors);
                setCriterias(
                    competitorAnalysisResponse.competitors[0].criterias
                );
            }

            const allItems = await findAllCompetitorAnalysisByProjectSK(PK);
            setItems(allItems);

            const project = await findOneProject(
                user.PK,
                competitorAnalysisResponse.projectSK
            );
            setProject(project);

            setIsLoading(false);
        })();
    }, [params.PK, params.SK, user]);

    function handleAddNewCriteria() {
        const newCriteria: CriteriaResponseDto = {
            id: v4() as UUID,
            type: 'string',
            name: `Criteria ${String(criterias.length + 1)}`,
        };

        setCriterias((prev) => {
            const res: CriteriaResponseDto[] = [];

            prev.forEach((crit) => {
                const cr = cloneDeep(crit);
                res.push(cr);
            });

            res.push(newCriteria);

            return res;
        });

        setData((prev) => {
            const res: CompetitorResponseDto[] = [];

            prev.forEach((comp) => {
                const newComp = cloneDeep(comp);

                const newCompetitorCriteria = cloneDeep(newCriteria);
                newCompetitorCriteria.value = {
                    id: v4() as UUID,
                    value: '',
                };

                newComp.criterias.push(newCompetitorCriteria);

                res.push(newComp);
            });

            return res;
        });
    }

    function handleAddNewCompetitor() {
        const newCriterias = cloneDeep(criterias);

        newCriterias.forEach((cr) => {
            cr.value = {
                id: v4() as UUID,
                value: cr.type === 'string' ? '' : false,
            };
        });

        const newComp: CompetitorResponseDto = {
            id: v4() as UUID,
            name: `Competitor ${data.length + 1}`,
            criterias: newCriterias,
        };

        setData((prev) => {
            const res: CompetitorResponseDto[] = [];

            prev.forEach((comp) => {
                const newComp = cloneDeep(comp);
                res.push(newComp);
            });

            res.push(newComp);

            return res;
        });
    }

    async function handleSave() {
        const newCompetitorAnal: CompetitorAnalysisResponseDto = {
            projectSK: competitorAnalysis!.projectSK,
            competitorAnalysisSK: competitorAnalysis!.competitorAnalysisSK,
            name: featureHeading,
            competitors: data,
        };

        await saveCompetitorAnalysis(newCompetitorAnal);

        const img = await generateCompetitorAnalysisJPG(0.5);

        await uploadCompetitorAnalysisThumbnail(
            newCompetitorAnal.projectSK,
            newCompetitorAnal.competitorAnalysisSK,
            img!
        );

        // await Promise.all([p1, p2]);

        setSavedData(data);

        const allItems = await findAllCompetitorAnalysisByProjectSK(
            competitorAnalysis!.projectSK
        );
        setItems(allItems);
    }

    async function handleExport() {
        const img = await generateCompetitorAnalysisJPG(1);
        saveImage('competitor_analysis_export.jpg', img!);
    }

    function handleProjectNameClick() {
        if (competitorAnalysis) {
            navigate(`/project/${competitorAnalysis.projectSK}`);
        }
    }

    async function handleCreateNewFeature() {
        if (competitorAnalysis) {
            const newFeature = await createNewCompetitorAnalysis(
                competitorAnalysis.projectSK
            );

            console.log(newFeature);

            const PK = newFeature.PK.replace('#', '_');
            const SK = newFeature.SK.replace('#', '_');
            navigate(`/competitoranalysis/${PK}/${SK}`);
        }
    }

    async function handleDelete(): Promise<void> {
        if (competitorAnalysis) {
            navigate(`/project/${competitorAnalysis.projectSK}`);

            await deleteCompetitorAnalysis(
                competitorAnalysis.projectSK,
                competitorAnalysis.competitorAnalysisSK
            );
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
                        urlFeatureName={'competitoranalysis'}
                        handleCreateNewFeature={handleCreateNewFeature}
                    />
                    <div className='col-l-10'>
                        <FeatureHeader
                            projectName={project?.name ?? '...'}
                            projectType={'Competitor Analysis'}
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
                            className={styles['content']}>
                            {isLoading ? (
                                <Spinner className={styles['spinner']} />
                            ) : data.length > 0 ? (
                                <div
                                    className={
                                        styles['table_and_new_column_button']
                                    }>
                                    <CompetitorTable
                                        data={data}
                                        setData={setData}
                                        criterias={criterias}
                                        setCriterias={setCriterias}
                                    />
                                    {data[0].criterias.length <
                                    MAX_CRITERIA_AMOUNT ? (
                                        <ButtonPrimaryOutlineLg
                                            onClick={handleAddNewCriteria}>
                                            +
                                        </ButtonPrimaryOutlineLg>
                                    ) : (
                                        <ButtonPrimaryDisabled>
                                            +
                                        </ButtonPrimaryDisabled>
                                    )}
                                </div>
                            ) : (
                                <h2 className={'color-gray-600 heading2'}>
                                    No data.
                                </h2>
                            )}
                            {!isLoading && (
                                <div className={styles['new_row_button']}>
                                    {data.length < MAX_COMPETITOR_AMOUNT ? (
                                        <ButtonPrimaryOutlineLg
                                            onClick={handleAddNewCompetitor}>
                                            +
                                        </ButtonPrimaryOutlineLg>
                                    ) : (
                                        <ButtonPrimaryDisabled>
                                            +
                                        </ButtonPrimaryDisabled>
                                    )}
                                </div>
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
                    projectType={'Competitor Analysis'}
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
                            className={styles['content']}>
                            {isLoading ? (
                                <Spinner className={styles['spinner']} />
                            ) : data.length > 0 ? (
                                <div
                                    className={
                                        styles['table_and_new_column_button']
                                    }>
                                    <CompetitorTable
                                        data={data}
                                        setData={setData}
                                        criterias={criterias}
                                        setCriterias={setCriterias}
                                    />
                                    {data[0].criterias.length <
                                    MAX_CRITERIA_AMOUNT ? (
                                        <ButtonPrimaryOutlineLg
                                            onClick={handleAddNewCriteria}>
                                            +
                                        </ButtonPrimaryOutlineLg>
                                    ) : (
                                        <ButtonPrimaryDisabled>
                                            +
                                        </ButtonPrimaryDisabled>
                                    )}
                                </div>
                            ) : (
                                <h2 className={'color-gray-600 heading2'}>
                                    No data.
                                </h2>
                            )}
                            {!isLoading && (
                                <div className={styles['new_row_button']}>
                                    {data.length < MAX_COMPETITOR_AMOUNT ? (
                                        <ButtonPrimaryOutlineLg
                                            onClick={handleAddNewCompetitor}>
                                            +
                                        </ButtonPrimaryOutlineLg>
                                    ) : (
                                        <ButtonPrimaryDisabled>
                                            +
                                        </ButtonPrimaryDisabled>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <FeatureSidebar
                    items={items}
                    contentHeight={contentHeight}
                    fallbackImage={FallbackImage}
                    urlFeatureName={'competitoranalysis'}
                    handleCreateNewFeature={handleCreateNewFeature}
                />
            </div>
        </>
    );

    return screenSize.width >= SCREEN_MIN_BOUNDARY_L ? layoutL : layoutS;
};

export default CompetitorAnalysisPage;
