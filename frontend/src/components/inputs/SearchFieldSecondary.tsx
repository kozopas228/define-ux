import React from 'react';
import './inputs.css';
import SearchIcon from '../../assets/icons/search.svg';
import { ICON_VIEW_BOX } from '../../utils/constants';

interface IProps {
    className?: any;
    style?: any;
    onChange?: any;
    onSubmit?: any;
    placeholder?: string;
    value?: string;
}

const SearchFieldSecondary = ({
    className,
    style,
    onChange,
    onSubmit,
    placeholder,
    value,
}: IProps) => {
    return (
        <div
            className={`input search-field-secondary ${className ?? ''}`}
            style={style}>
            <SearchIcon
                className={'search-field-secondary-icon'}
                viewBox={ICON_VIEW_BOX}
            />

            <input
                className={`text-normal`}
                onChange={onChange}
                onSubmit={onSubmit}
                placeholder={placeholder ?? ''}
                value={value}
            />
        </div>
    );
};

export default SearchFieldSecondary;
