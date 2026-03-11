import React from 'react';
import './inputs.css';
import SearchIcon from '../../assets/icons/search.svg';
import { ICON_VIEW_BOX } from '../../utils/constants';
import TickDown from '../../assets/icons/tick-down.svg';

interface IProps {
    className?: any;
    style?: any;
    onChange?: any;
    onSubmit?: any;
    placeholder?: string;
    heading: string;
    options: string[];
    selectedKey?: string;
}

const Dropdown = ({
    className,
    style,
    onChange,
    onSubmit,
    placeholder,
    heading,
    options,
    selectedKey,
}: IProps) => {
    return (
        <div className={'input dropdown'}>
            <select onChange={onChange}>
                <option selected={true}>{heading}</option>
                {options.map((o) => (
                    <option
                        key={o}
                        selected={o.toLowerCase() === selectedKey}>
                        {o}
                    </option>
                ))}
            </select>
            <TickDown
                className={'dropdown_icon'}
                viewBox={ICON_VIEW_BOX}
            />
        </div>
    );
};

export default Dropdown;
