import React, { useEffect, useState } from 'react';
import Modal from '../../../components/modal/Modal';
import styles from './ChooseProjectModal.module.css';
import { Project } from '../../../types/project';
import { getAllProjects } from '../../../services/project';
import { getAccessToken } from '../../../services/auth';
import ButtonSecondary from '../../../components/buttons/ButtonSecondary';

interface IProps {
    isOpen: boolean;
    setIsOpen: any;
    setChosenProjectSK: any;
    handleCreateBlankProject: any;
}

const ChooseProjectModal = ({
    isOpen,
    setIsOpen,
    setChosenProjectSK,
    handleCreateBlankProject,
}: IProps) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [areProjectsLoading, setAreProjectsLoading] = useState(true);

    useEffect(() => {
        (async function () {
            if (!getAccessToken()) {
                return;
            }

            const projects = await getAllProjects();
            setProjects(projects);
            setAreProjectsLoading(false);
        })();
    }, []);

    function handleProjectClick(projectSK: string) {
        setChosenProjectSK(projectSK);
        setIsOpen(false);
        document.body.classList.remove('_lock');
    }

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            className={styles['choose_project_modal']}>
            <h3 className={'color-gray-700 text-big-bold'}>Choose project</h3>
            {!areProjectsLoading ? (
                projects && projects.length > 0 ? (
                    projects.map((p) => (
                        <div
                            className={`${styles['project']} text-normal`}
                            onClick={() => handleProjectClick(p.SK)}
                            key={p.SK}>
                            {p.name}
                        </div>
                    ))
                ) : (
                    <ButtonSecondary onClick={handleCreateBlankProject} className={styles['create_new_project_button']}>
                        Create new Project
                    </ButtonSecondary>
                )
            ) : (
                <h2 className={'color-gray-800 text-normal'}>Loading...</h2>
            )}
        </Modal>
    );
};

export default ChooseProjectModal;
