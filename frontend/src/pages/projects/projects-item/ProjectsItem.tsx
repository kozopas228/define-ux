import React, { useState } from 'react';
import styles from './ProjectsItem.module.css';
import {
    SCREEN_MIN_BOUNDARY_L,
    SCREEN_MIN_BOUNDARY_XL,
    SCREEN_MIN_BOUNDARY_XXL,
} from '../../../utils/constants';
import { useScreenSize } from '../../../hooks/useScreenSize';
import ProjectsImage from './project-image/ProjectsImage';
import PencilIcon from '../../../assets/icons/pencil.svg';
import BucketIcon from '../../../assets/icons/pomoyka.svg';
import ChangeProjectModal from './change-project-modal/ChangeProjectModal';
import DeleteProjectModal from './delete-project-modal/DeleteProjectModal';
import { useNavigate } from 'react-router-dom';

interface IProps {
    empathyMapImageUrl?: string;
    uxPersonaImageUrl?: string;
    competitorAnalysisImageUrl?: string;
    name: string;
    description?: string;
    lastChange: Date;
    handleDelete: any;
    PK: string;
    SK: string;
}

const ProjectsItem = ({
    empathyMapImageUrl,
    uxPersonaImageUrl,
    competitorAnalysisImageUrl,
    name,
    description,
    lastChange,
    handleDelete,
    PK,
    SK,
}: IProps) => {
    const screenSize = useScreenSize();

    const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectName, setProjectName] = useState(name);
    const [projectDescription, setProjectDescription] = useState(description);

    const navigate = useNavigate();

    let cutDescription: string | undefined = projectDescription;

    if (
        screenSize.width >= SCREEN_MIN_BOUNDARY_XXL &&
        projectDescription &&
        projectDescription?.length > 270
    ) {
        cutDescription = projectDescription?.substring(0, 270) + '...';
    } else if (
        screenSize.width >= SCREEN_MIN_BOUNDARY_XL &&
        projectDescription &&
        projectDescription?.length > 230
    ) {
        cutDescription = projectDescription?.substring(0, 230) + '...';
    } else if (
        screenSize.width >= SCREEN_MIN_BOUNDARY_L &&
        projectDescription &&
        projectDescription?.length > 190
    ) {
        cutDescription = projectDescription?.substring(0, 190) + '...';
    } else if (projectDescription && projectDescription?.length > 270) {
        cutDescription = projectDescription?.substring(0, 270) + '...';
    }

    function handleChangeClick(e: React.MouseEvent) {
        e.stopPropagation();
        setIsChangeModalOpen(true);
    }

    function handleDeleteClick(e: React.MouseEvent) {
        e.stopPropagation();
        setIsDeleteModalOpen(true);
    }

    function handleProjectClick() {
        navigate(`/project/${SK}`);
    }

    const layoutL = (
        <div className='container'>
            <div
                className={`row  ${styles['projects_item']}`}
                onClick={handleProjectClick}>
                <div className='col-l-2'>
                    <ProjectsImage
                        name={name}
                        competitorAnalysisImageUrl={competitorAnalysisImageUrl}
                        uxPersonaImageUrl={uxPersonaImageUrl}
                        empathyMapImageUrl={empathyMapImageUrl}
                    />
                </div>
                <div
                    className={`col-l-7 ${styles['projects_name_description']}`}>
                    <h5 className={'text-bigger-bold color-dark-900'}>
                        {projectName}
                    </h5>
                    {projectDescription && (
                        <p className={'text-normal color-dark-800'}>
                            {cutDescription}
                        </p>
                    )}
                </div>
                <div className={`col-l-2 ${styles['projects_date']}`}>
                    <span className={'text-big-bold color-dark-900'}>
                        {lastChange.toLocaleDateString('en-us', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                </div>
                <div className={`col-l-1 ${styles['projects_icons']}`}>
                    <PencilIcon
                        className={styles['pencil_icon']}
                        onClick={handleChangeClick}
                    />
                    <BucketIcon
                        className={styles['bucket_icon']}
                        onClick={handleDeleteClick}
                    />
                </div>
            </div>
        </div>
    );

    const layoutS: React.JSX.Element = (
        <div className='container'>
            <div
                className={`row`}
                onClick={handleProjectClick}>
                <div className='col-s-4'>
                    <div className={`${styles['projects_item']}`}>
                        <ProjectsImage
                            name={name}
                            competitorAnalysisImageUrl={
                                competitorAnalysisImageUrl
                            }
                            uxPersonaImageUrl={uxPersonaImageUrl}
                            empathyMapImageUrl={empathyMapImageUrl}
                        />
                        <div
                            className={`${styles['projects_name_description']}`}>
                            <h5 className={'text-bigger-bold color-dark-900'}>
                                {projectName}
                            </h5>
                            {projectDescription && (
                                <p className={'text-normal color-dark-800'}>
                                    {cutDescription}
                                </p>
                            )}
                        </div>
                        <div className={`${styles['projects_date']}`}>
                            <span className={'text-big-bold color-dark-900'}>
                                {lastChange.toLocaleDateString('en-us', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                        <div className={`${styles['projects_icons']}`}>
                            <PencilIcon
                                className={styles['pencil_icon']}
                                onClick={handleChangeClick}
                            />
                            <BucketIcon
                                className={styles['bucket_icon']}
                                onClick={handleDeleteClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return screenSize.width >= SCREEN_MIN_BOUNDARY_L ? (
        <>
            {layoutL}
            <ChangeProjectModal
                isOpen={isChangeModalOpen}
                setIsOpen={setIsChangeModalOpen}
                name={projectName}
                description={projectDescription}
                setName={setProjectName}
                setDescription={setProjectDescription}
                SK={SK}
            />
            <DeleteProjectModal
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                name={projectName}
                PK={PK}
                SK={SK}
                handleDelete={handleDelete}
            />
        </>
    ) : (
        <>
            {layoutS}
            <ChangeProjectModal
                isOpen={isChangeModalOpen}
                setIsOpen={setIsChangeModalOpen}
                name={name}
                description={description}
                setName={setProjectName}
                setDescription={setProjectDescription}
                SK={SK}
            />
            <DeleteProjectModal
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                name={projectName}
                PK={PK}
                SK={SK}
                handleDelete={handleDelete}
            />
        </>
    );
};

export default ProjectsItem;
