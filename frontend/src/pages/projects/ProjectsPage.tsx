import React, { useEffect, useState } from 'react';
import styles from './ProjectsPage.module.css';
import { useScreenSize } from '../../hooks/useScreenSize';
import {
    MAX_PROJECT_AMOUNT,
    SCREEN_MIN_BOUNDARY_L,
} from '../../utils/constants';
import SearchFieldSecondary from '../../components/inputs/SearchFieldSecondary';
import ButtonPrimary from '../../components/buttons/ButtonPrimary';
import { NavLink, useNavigate } from 'react-router-dom';
import ProjectsItem from './projects-item/ProjectsItem';
import {
    createNewProject,
    deleteProject as deleteProjectAPI,
    getAllProjects,
} from '../../services/project';
import { Project } from '../../types/project';
import Spinner from '../../components/spinner/Spinner';
import ButtonPrimaryDisabled from '../../components/buttons/ButtonPrimaryDisabled';

const ProjectsPage = () => {
    const screenSize = useScreenSize();

    const navigate = useNavigate();

    const [projects, setProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [areProjectsLoading, setAreProjectsLoading] = useState(true);

    useEffect(() => {
        (async function () {
            const fetchedProjects = await getAllProjects();
            setProjects(fetchedProjects);
            setAreProjectsLoading(false);
        })();
    }, []);

    async function handleCreateBlankProject(): Promise<void> {
        try {
            const newProjectSK = await createNewProject();
            const url = `/project/${newProjectSK}`;
            navigate(encodeURI(url));
        } catch (e) {
            navigate('/');
            location.reload();
        }
    }

    const shownProjects = projects
        .sort((pr1, pr2) => pr2.UPDATED_AT - pr1.UPDATED_AT)
        .filter((pr) =>
            pr.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((pr) => {
            return (
                <ProjectsItem
                    key={pr.SK}
                    PK={pr.PK}
                    SK={pr.SK}
                    name={pr.name}
                    lastChange={new Date(pr.UPDATED_AT)}
                    description={pr.description}
                    empathyMapImageUrl={pr.empathyMapThumbnailPath}
                    uxPersonaImageUrl={pr.uxPersonaThumbnailPath}
                    competitorAnalysisImageUrl={
                        pr.competitorAnalysisThumbnailPath
                    }
                    handleDelete={deleteProject}
                />
            );
        });

    async function deleteProject(PK: string, SK: string) {
        setProjects([...projects.filter((p) => p.SK !== SK)]);
        await deleteProjectAPI(PK, SK);
    }

    const layoutL: React.JSX.Element = (
        <>
            <div className={styles['heading']}>
                <div className='container'>
                    <div className='row'>
                        <div className='col-l-12'>
                            <div className={styles['heading_content']}>
                                <h3 className={'color-dark-900 heading3'}>
                                    Your projects
                                </h3>
                                <div className={styles['search_and_create']}>
                                    <SearchFieldSecondary
                                        className={styles['search']}
                                        placeholder={'Search...'}
                                        value={searchQuery}
                                        onChange={(
                                            e: React.FormEvent<HTMLInputElement>
                                        ) =>
                                            setSearchQuery(
                                                e.currentTarget.value
                                            )
                                        }
                                    />
                                    {projects.length < MAX_PROJECT_AMOUNT ? (
                                        <ButtonPrimary
                                            onClick={handleCreateBlankProject}>
                                            Create new project
                                        </ButtonPrimary>
                                    ) : (
                                        <ButtonPrimaryDisabled
                                            title={
                                                'Maximum projects amount exceeded'
                                            }>
                                            Create new project
                                        </ButtonPrimaryDisabled>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['column_names']}>
                <div className='container'>
                    <div className='row'>
                        <div className='offset-l-2 col-l-1'>
                            <small className={'text-normal color-gray-700'}>
                                Name
                            </small>
                        </div>
                        <div className='offset-l-6 col-l-2'>
                            <small className={'text-normal color-gray-700'}>
                                Last change
                            </small>
                        </div>
                    </div>
                </div>
            </div>
            {!areProjectsLoading ? (
                <div className={styles['projects']}>{shownProjects}</div>
            ) : (
                <Spinner className={styles['spinner']} />
            )}
        </>
    );

    const layoutS: React.JSX.Element = (
        <>
            <div className={styles['heading']}>
                <div className='container'>
                    <div className='row'>
                        <div className='col-s-4'>
                            <div className={styles['heading_content']}>
                                <h3 className={'color-dark-900 heading4'}>
                                    Your projects
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-s-4'>
                            <div className={styles['search_and_create']}>
                                <SearchFieldSecondary
                                    className={styles['search']}
                                    placeholder={'Search...'}
                                    value={searchQuery}
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>
                                    ) => setSearchQuery(e.currentTarget.value)}
                                />
                                {projects.length < MAX_PROJECT_AMOUNT ? (
                                    <ButtonPrimary
                                        onClick={handleCreateBlankProject}>
                                        Create new project
                                    </ButtonPrimary>
                                ) : (
                                    <ButtonPrimaryDisabled
                                        title={
                                            'Maximum projects amount exceeded'
                                        }>
                                        Create new project
                                    </ButtonPrimaryDisabled>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {!areProjectsLoading ? (
                <div className={styles['projects']}>{shownProjects}</div>
            ) : (
                <>
                    <Spinner className={styles['spinner']} />
                </>
            )}
        </>
    );

    return screenSize.width >= SCREEN_MIN_BOUNDARY_L ? layoutL : layoutS;
};

export default ProjectsPage;
