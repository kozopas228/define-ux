import React from 'react';
import styles from './ProjectsImage.module.css';

interface IProps {
    name: string;
    empathyMapImageUrl?: string;
    uxPersonaImageUrl?: string;
    competitorAnalysisImageUrl?: string;
}

const ProjectsImage = ({
    name,
    empathyMapImageUrl,
    uxPersonaImageUrl,
    competitorAnalysisImageUrl,
}: IProps) => {
    let imageLayout: React.JSX.Element;

    if (empathyMapImageUrl && uxPersonaImageUrl && competitorAnalysisImageUrl) {
        imageLayout = (
            <>
                <img
                    src={empathyMapImageUrl}
                    className={styles['image_50h_50w']}
                />
                <img
                    src={uxPersonaImageUrl}
                    className={styles['image_50h_50w']}
                />
                <img
                    src={competitorAnalysisImageUrl}
                    className={styles['image_50h_100w']}
                />
            </>
        );
    } else if (
        empathyMapImageUrl &&
        uxPersonaImageUrl &&
        !competitorAnalysisImageUrl
    ) {
        imageLayout = (
            <>
                <img
                    src={empathyMapImageUrl}
                    className={styles['image_100h_50w']}
                />
                <img
                    src={uxPersonaImageUrl}
                    className={styles['image_100h_50w']}
                />
            </>
        );
    } else if (
        empathyMapImageUrl &&
        !uxPersonaImageUrl &&
        competitorAnalysisImageUrl
    ) {
        imageLayout = (
            <>
                <img
                    src={empathyMapImageUrl}
                    className={styles['image_50h_100w']}
                />
                <img
                    src={competitorAnalysisImageUrl}
                    className={styles['image_50h_100w']}
                />
            </>
        );
    } else if (
        !empathyMapImageUrl &&
        uxPersonaImageUrl &&
        competitorAnalysisImageUrl
    ) {
        imageLayout = (
            <>
                <img
                    src={uxPersonaImageUrl}
                    className={styles['image_50h_100w']}
                />
                <img
                    src={competitorAnalysisImageUrl}
                    className={styles['image_50h_100w']}
                />
            </>
        );
    } else if (empathyMapImageUrl) {
        imageLayout = (
            <>
                <img
                    src={empathyMapImageUrl}
                    className={styles['image_100h_100w']}
                />
            </>
        );
    } else if (uxPersonaImageUrl) {
        imageLayout = (
            <>
                <img
                    src={uxPersonaImageUrl}
                    className={styles['image_100h_100w']}
                />
            </>
        );
    } else if (competitorAnalysisImageUrl) {
        imageLayout = (
            <>
                <img
                    src={competitorAnalysisImageUrl}
                    className={styles['image_100h_100w']}
                />
            </>
        );
    } else {
        imageLayout = (
            <h1 className={`heading1 color-gray-700 ${styles['name_text']}`}>{name[0]}</h1>
        );
    }

    return <div className={styles['projects_image']}>{imageLayout}</div>;
};

export default ProjectsImage;
