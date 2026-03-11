import React from 'react';
import styles from './ProjectSlider.module.css';
import ButtonPrimary from '../../../components/buttons/ButtonPrimary';
import Slider from 'react-slick';
import { useScreenSize } from '../../../hooks/useScreenSize';
import { SCREEN_MIN_BOUNDARY_L } from '../../../utils/constants';
import ButtonPrimaryDisabled from '../../../components/buttons/ButtonPrimaryDisabled';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../../components/spinner/Spinner';
import PersonaPlaceholderImage from '../../../assets/images/ux-persona-vector.png';
import EmpathyMapPlaceholderImage from '../../../assets/images/emapthy-map-vector.png';
import CompetitorAnalysisPlaceholderImage from '../../../assets/images/competitor-analysis-vector.png';

export enum ProjectSliderSize {
    SMALL,
    BIG,
}

interface IProps {
    heading: React.ReactNode;
    size: ProjectSliderSize;
    items: {
        PK: string;
        SK: string;
        thumbnailPath?: string;
        name: string;
        UPDATED_AT: number;
    }[];
    handleCreateClick: any;
    isCreating: boolean;
    isLoading: boolean;
    urlFeatureName: string;
}

const ProjectSlider = ({
    heading,
    size,
    items,
    handleCreateClick,
    isLoading,
    isCreating,
    urlFeatureName,
}: IProps) => {
    const screenSize = useScreenSize();
    const navigate = useNavigate();

    let slidesToShow = size === ProjectSliderSize.SMALL ? 6 : 3;
    if (screenSize.width < SCREEN_MIN_BOUNDARY_L) {
        slidesToShow = Math.floor(slidesToShow / 2);
    }
    const fakeSlidesAmount = slidesToShow - items.length;

    const fakeSlides: React.JSX.Element[] = [];

    for (let i = 0; i < fakeSlidesAmount; i++) {
        fakeSlides.push(
            <div key={i}>
                {/*<div style={{ backgroundColor: 'olive', height: 300 }}></div>*/}
            </div>
        );
    }

    function trimText(text: string): string {
        if (
            text.length > 40 &&
            size === ProjectSliderSize.SMALL &&
            screenSize.width >= SCREEN_MIN_BOUNDARY_L
        ) {
            return text.substring(0, 40) + '...';
        } else if (
            text.length > 80 &&
            size === ProjectSliderSize.BIG &&
            screenSize.width >= SCREEN_MIN_BOUNDARY_L
        ) {
            return text.substring(0, 80) + '...';
        } else if (
            text.length > 20 &&
            size === ProjectSliderSize.SMALL &&
            screenSize.width < SCREEN_MIN_BOUNDARY_L
        ) {
            return text.substring(0, 20) + '...';
        } else if (
            text.length > 80 &&
            size === ProjectSliderSize.BIG &&
            screenSize.width < SCREEN_MIN_BOUNDARY_L
        ) {
            return text.substring(0, 80) + '...';
        }

        return text;
    }

    function handleItemClick(item: {
        PK: string;
        SK: string;
        thumbnailPath?: string;
        name: string;
    }) {
        const urlPK = item.PK.replace('#', '_');
        const urlSK = item.SK.replace('#', '_');
        navigate(`/${urlFeatureName}/${urlPK}/${urlSK}`);
    }

    function getImageThumbnailUrl(item: any): string {
        return item.thumbnailPath
            ? item.thumbnailPath
            : urlFeatureName === 'uxpersonas'
              ? PersonaPlaceholderImage
              : urlFeatureName === 'competitoranalysis'
                ? CompetitorAnalysisPlaceholderImage
                : EmpathyMapPlaceholderImage;
    }

    const layoutL = (
        <>
            <div className={'row'}>
                <div className={'col-l-12'}>
                    <div className={styles['heading']}>{heading}</div>
                </div>
            </div>

            <div className={styles['slider']}>
                {!isLoading ? (
                    <div className={styles['slider_wrapper']}>
                        {items.length > 0 ? (
                            items
                                .sort((i1, i2) => i2.UPDATED_AT - i1.UPDATED_AT)
                                .map((i) => (
                                    <div
                                        className={
                                            styles['slider_image_wrapper']
                                        }
                                        key={i.SK}
                                        onClick={() => handleItemClick(i)}>
                                        <div
                                            className={`${
                                                styles['slider_image']
                                            } ${
                                                size === ProjectSliderSize.BIG
                                                    ? styles['big']
                                                    : ''
                                            }`}>
                                            {i.thumbnailPath ? (
                                                <img
                                                    src={getImageThumbnailUrl(
                                                        i
                                                    )}
                                                />
                                            ) : (
                                                <img
                                                    src={getImageThumbnailUrl(
                                                        i
                                                    )}
                                                    className={
                                                        styles['image_gray']
                                                    }
                                                />
                                            )}
                                            <div className={styles['text']}>
                                                <p
                                                    className={
                                                        'text-bigger-bold color-white'
                                                    }>
                                                    {trimText(i.name)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <h2
                                className={`${styles['not_found_items']} color-gray-700 text-big`}>
                                Items were not found
                            </h2>
                        )}
                    </div>
                ) : (
                    <Spinner className={styles['spinner']} />
                )}
                <div className={styles['create_new_button']}>
                    {!isCreating ? (
                        <ButtonPrimary onClick={handleCreateClick}>
                            Create New
                        </ButtonPrimary>
                    ) : (
                        <ButtonPrimaryDisabled>
                            Creating...
                        </ButtonPrimaryDisabled>
                    )}
                </div>
            </div>
        </>
    );

    const layoutS = (
        <>
            <div className={'row'}>
                <div className={'col-s-4'}>
                    <div className={styles['heading']}>{heading}</div>
                </div>
            </div>

            <div className={styles['slider']}>
                {!isLoading ? (
                    <div className={styles['slider_wrapper']}>
                        <Slider
                            speed={500}
                            slidesToShow={slidesToShow}
                            slidesToScroll={slidesToShow}
                            infinite={false}
                            initialSlide={0}
                            arrows={false}
                            dots={true}>
                            {items.length > 0 ? (
                                items
                                    .sort(
                                        (i1, i2) =>
                                            i2.UPDATED_AT - i1.UPDATED_AT
                                    )
                                    .map((i) => (
                                        <div
                                            className={
                                                styles['slider_image_wrapper']
                                            }
                                            key={i.SK}
                                            onClick={() => handleItemClick(i)}>
                                            <div
                                                className={`${
                                                    styles['slider_image']
                                                } ${
                                                    size ===
                                                    ProjectSliderSize.BIG
                                                        ? styles['big']
                                                        : ''
                                                }`}>
                                                {i.thumbnailPath ? (
                                                    <img
                                                        src={getImageThumbnailUrl(
                                                            i
                                                        )}
                                                    />
                                                ) : (
                                                    <img
                                                        src={getImageThumbnailUrl(
                                                            i
                                                        )}
                                                        className={
                                                            styles['image_gray']
                                                        }
                                                    />
                                                )}
                                                <div className={styles['text']}>
                                                    <p
                                                        className={
                                                            'text-normal color-dark-900'
                                                        }>
                                                        {trimText(i.name)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <h2
                                    className={`${styles['not_found_items']} color-gray-700 text-big`}>
                                    Items were not found
                                </h2>
                            )}
                            {fakeSlides}
                        </Slider>
                    </div>
                ) : (
                    <Spinner className={styles['spinner']} />
                )}
                <div className={styles['create_new_button']}>
                    <ButtonPrimary onClick={handleCreateClick}>
                        Create New
                    </ButtonPrimary>
                </div>
            </div>
        </>
    );

    return screenSize.width >= SCREEN_MIN_BOUNDARY_L ? layoutL : layoutS;
};

export default ProjectSlider;
