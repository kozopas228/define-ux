import React from 'react';
import styles from './SampleItem.module.css';
import {
    SCREEN_MIN_BOUNDARY_L,
    SCREEN_MIN_BOUNDARY_XL,
} from '../../../utils/constants';
import ButtonPrimaryLg from '../../../components/buttons/ButtonPrimaryLg';
import { useScreenSize } from '../../../hooks/useScreenSize';
import UserPersonaSampleImage from '../../../assets/images/ux-persona-main-page.png';
import { NavLink } from 'react-router-dom';

interface IProps {
    className?: string;
    heading: string;
    text: string;
    imageUrl: string;
    imageAlt: string;
    createButtonText: string;
    onClick: any;
}

const SampleItem = ({
    className,
    heading,
    text,
    imageUrl,
    imageAlt,
    createButtonText,
    onClick,
}: IProps) => {
    const screenSize = useScreenSize();

    const layoutL: React.JSX.Element = (
        <section className={`${styles['sample']} ${className}`}>
            <div className='container'>
                <div className='row'>
                    <div className='col-l-4 offset-l-1'>
                        <div className={`${styles['sample_image']} shadow1 `}>
                            <img
                                src={imageUrl}
                                alt={imageAlt}
                            />
                        </div>
                    </div>
                    <div
                        className={
                            screenSize.width >= SCREEN_MIN_BOUNDARY_XL
                                ? 'col-xl-4 offset-xl-1'
                                : 'col-l-5 offset-l-1'
                        }>
                        <div className={styles['sample_content']}>
                            <div className={styles['sample_content_text']}>
                                <h4 className={'color-gray-800 heading4'}>
                                    {heading}
                                </h4>
                                <p className={'text-bigger color-dark-900'}>
                                    {text}
                                </p>
                            </div>
                            <div className={styles['sample_content_button']}>
                                <ButtonPrimaryLg onClick={onClick}>
                                    {createButtonText}
                                </ButtonPrimaryLg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    const layoutS = (
        <section className={`${styles['sample']} ${className}`}>
            <div className='container'>
                <div className='row'>
                    <div className='col-s-4'>
                        <div className={`${styles['sample_image']} shadow1 `}>
                            <img
                                src={imageUrl}
                                alt={imageAlt}
                            />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-s-4'>
                            <div className={styles['sample_content']}>
                                <div className={styles['sample_content_text']}>
                                    <h4
                                        className={
                                            'color-gray-800 text-bigger-bold'
                                        }>
                                        {heading}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-s-4'>
                            <div className={styles['sample_content']}>
                                <div className={styles['sample_content_text']}>
                                    <p className={'text-normal color-dark-900'}>
                                        {text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-s-4'>
                            <div className={styles['sample_content_button']}>
                                <ButtonPrimaryLg onClick={onClick}>
                                    {createButtonText}
                                </ButtonPrimaryLg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    return screenSize.width >= SCREEN_MIN_BOUNDARY_L ? layoutL : layoutS;
};

export default SampleItem;
