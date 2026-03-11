import React, { useEffect, useRef, useState } from 'react';
import styles from './FeatureSidebar.module.css';
import {
    MAX_FEATURE_PER_PROJECT_AMOUNT,
    SCREEN_MIN_BOUNDARY_L,
    SCREEN_MIN_BOUNDARY_M,
    SCREEN_MIN_BOUNDARY_XL,
    SCREEN_MIN_BOUNDARY_XXL,
} from '../../../utils/constants';
import { ProjectSliderSize } from '../../../pages/project/project-slider/ProjectSlider';
import { useScreenSize } from '../../../hooks/useScreenSize';
import ButtonSecondaryOutline from '../../buttons/ButtonSecondaryOutline';
import { usePageSize } from '../../../hooks/usePageSize';
import ButtonSecondary from '../../buttons/ButtonSecondary';
import { useAppSelector } from '../../../store/hooks';
import { Competitor } from '../../../types/competitorAnalysis';
import { useNavigate } from 'react-router-dom';
import ButtonSecondaryDisabled from '../../buttons/ButtonSecondaryDisabled';

export interface FeatureItem {
    PK: string;
    SK: string;
    UPDATED_AT: number;
    name: string;
    thumbnailPath?: string;
}

interface IProps {
    items: FeatureItem[];
    contentHeight: number;
    fallbackImage: string;
    urlFeatureName: string;
    handleCreateNewFeature: () => any;
}

const FeatureSidebar = ({
    items,
    contentHeight,
    fallbackImage,
    urlFeatureName,
    handleCreateNewFeature,
}: IProps) => {
    const sidebarRef = useRef<any>(null);
    const screenSize = useScreenSize();
    const user = useAppSelector((state) => state.userReducer.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (screenSize.width >= SCREEN_MIN_BOUNDARY_L) {
            sidebarRef.current!.style.height = contentHeight + 350 + 'px';
        }
    }, [contentHeight, screenSize.width]);

    function handleItemClick(item: FeatureItem) {
        const urlPK = item.PK.replace('#', '_');
        const urlSK = item.SK.replace('#', '_');
        navigate(`/${urlFeatureName}/${urlPK}/${urlSK}`);
    }

    const layoutL = (
        <div className={'col-l-2'}>
            <div
                className={`${styles['feature_sidebar']} color-gray-700`}
                ref={sidebarRef}>
                <div className={styles['content']}>
                    {user ? (
                        items?.length ? (
                            items
                                ?.sort(
                                    (i1, i2) => i2.UPDATED_AT - i1.UPDATED_AT
                                )
                                .map((i) => (
                                    <div
                                        className={`${styles['feature_item']}`}
                                        key={i.SK}
                                        onClick={() => handleItemClick(i)}>
                                        <p
                                            className={
                                                'text-normal color-dark-800'
                                            }>
                                            {trimText(i.name)}
                                        </p>
                                        <img
                                            src={
                                                i.thumbnailPath ?? fallbackImage
                                            }
                                        />
                                    </div>
                                ))
                        ) : (
                            <h4 className={'color-gray-600 text-big-bold'}>
                                Items list is empty
                            </h4>
                        )
                    ) : (
                        <></>
                    )}
                </div>
                {user ? (
                    items.length < MAX_FEATURE_PER_PROJECT_AMOUNT ? (
                        <ButtonSecondary onClick={handleCreateNewFeature}>
                            +
                        </ButtonSecondary>
                    ) : (
                        <ButtonSecondaryDisabled
                            title={'Maximum feature amount exceeded'}>
                            +
                        </ButtonSecondaryDisabled>
                    )
                ) : (
                    <></>
                )}
            </div>
        </div>
    );

    const layoutS = (
        <>
            <div className='row'>
                <div
                    className={`${styles['feature_sidebar']} color-gray-700`}
                    ref={sidebarRef}>
                    {user ? (
                        <div className={styles['content']}>
                            {items?.length ? (
                                items?.map((i) => (
                                    <div
                                        className={`${styles['feature_item']}`}
                                        key={i.SK}
                                        onClick={() => handleItemClick(i)}>
                                        <p
                                            className={
                                                'text-normal color-dark-800'
                                            }>
                                            {trimText(i.name)}
                                        </p>
                                        <img
                                            src={
                                                i.thumbnailPath ?? fallbackImage
                                            }
                                        />
                                    </div>
                                ))
                            ) : (
                                <h4 className={'color-gray-600 text-big-bold'}>
                                    Items list is empty
                                </h4>
                            )}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div className='row'>
                <div className='col-s-4'>
                    {user ? (
                        items.length < MAX_FEATURE_PER_PROJECT_AMOUNT ? (
                            <ButtonSecondary
                                onClick={handleCreateNewFeature}
                                className={styles['plus_button']}>
                                +
                            </ButtonSecondary>
                        ) : (
                            <ButtonSecondaryDisabled
                                title={'Maximum feature amount exceeded'}
                                className={styles['plus_button']}>
                                +
                            </ButtonSecondaryDisabled>
                        )
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    );

    return screenSize.width >= SCREEN_MIN_BOUNDARY_L ? layoutL : layoutS;

    function trimText(text: string): string {
        if (text.length > 20 && screenSize.width >= SCREEN_MIN_BOUNDARY_XXL) {
            return text.substring(0, 20) + '...';
        } else if (
            text.length > 17 &&
            screenSize.width >= SCREEN_MIN_BOUNDARY_XL
        ) {
            return text.substring(0, 17) + '...';
        } else if (
            text.length > 12 &&
            screenSize.width >= SCREEN_MIN_BOUNDARY_L
        ) {
            return text.substring(0, 12) + '...';
        } else if (text.length > 25) {
            return text.substring(0, 25) + '...';
        }

        return text;
    }
};

export default FeatureSidebar;
