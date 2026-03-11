import React from 'react';
import ButtonPrimary from '../../components/buttons/ButtonPrimary';
import ButtonPrimaryLg from '../../components/buttons/ButtonPrimaryLg';
import ButtonPrimaryLgDisabled from '../../components/buttons/ButtonPrimaryLgDisabled';
import ButtonPrimaryOutline from '../../components/buttons/ButtonPrimaryOutline';
import ButtonPrimaryDisabled from '../../components/buttons/ButtonPrimaryDisabled';
import ButtonSecondary from '../../components/buttons/ButtonSecondary';
import ButtonSecondaryOutline from '../../components/buttons/ButtonSecondaryOutline';
import ButtonSecondaryOutlineDisabled from '../../components/buttons/ButtonSecondaryOutlineDisabled';
import ButtonOutlineDanger from '../../components/buttons/ButtonOutlineDanger';
import ButtonOutlineDangerLg from '../../components/buttons/ButtonOutlineDangerLg';
import ButtonGradientXlg from '../../components/buttons/ButtonGradientXlg';
import TextFieldSecondary from '../../components/inputs/TextFieldSecondary';
import TextFieldSecondarySm from '../../components/inputs/TextFieldSecondarySm';
import TextFieldSecondaryDisabled from '../../components/inputs/TextFieldSecondaryDisabled';
import SearchFieldSecondary from '../../components/inputs/SearchFieldSecondary';
import TextAreaSecondary from '../../components/inputs/TextAreaSecondary';
import TextFieldDanger from '../../components/inputs/TextFieldDanger';
import Dropdown from '../../components/inputs/Dropdown';
import ExternalLink from '../../components/external-link/ExternalLink';

const styles = {
    colorBlock: {
        width: 150,
        height: 150,
    },
};

const TestUiKit = () => {
    return (
        <div style={{ padding: '0 30px' }}>
            <div
                style={{
                    marginBottom: 40,
                    paddingBottom: 20,
                    borderBottom: '1px solid gray',
                }}>
                <h2 style={{ fontSize: 32, marginBottom: 20 }}>Colors</h2>
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--dark-800)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--dark-900)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--blue-300)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--blue-500)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--blue-600)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--blue-700)',
                        }}></div>
                </div>
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--gray-100)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--gray-200)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--gray-300)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--gray-350)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--gray-400)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--gray-500)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--gray-600)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--gray-700)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--gray-800)',
                        }}></div>
                </div>
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--sinopia-100)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--sinopia-300)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--sinopia-600)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--green-100)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--green-500)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--green-600)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            backgroundColor: 'var(--green-800)',
                        }}></div>
                </div>
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            ...styles.colorBlock,
                            background: 'var(--gradient-red-blue)',
                        }}></div>
                    <div
                        style={{
                            ...styles.colorBlock,
                            background: 'var(--gradient-red-blue-transparent)',
                        }}></div>
                    <div
                        style={{
                            width: 100,
                            height: 100,
                            margin: 30,
                            background: 'white',
                        }}
                        className={'shadow1'}></div>
                </div>
            </div>

            <div
                style={{
                    marginBottom: 40,
                    paddingBottom: 20,
                    borderBottom: '1px solid gray',
                }}>
                <h2 style={{ fontSize: 32, marginBottom: 20 }}>Typography</h2>
                <p
                    style={{ marginBottom: 10 }}
                    className={'heading1'}>
                    Heading 1
                </p>
                <p
                    style={{ marginBottom: 10 }}
                    className={'heading2'}>
                    Heading 2
                </p>
                <p
                    style={{ marginBottom: 10 }}
                    className={'heading3'}>
                    Heading 3
                </p>
                <p
                    style={{ marginBottom: 10 }}
                    className={'heading4'}>
                    Heading 4
                </p>
                <p
                    style={{
                        marginBottom: 10,
                    }}
                    className={'text-bigger-bold'}>
                    Text Bigger Bold
                </p>
                <p
                    style={{ marginBottom: 10 }}
                    className={'text-bigger'}>
                    Text Bigger
                </p>
                <p
                    style={{ marginBottom: 10 }}
                    className={'text-big-bold'}>
                    Text Big Bold
                </p>
                <p
                    style={{ marginBottom: 10 }}
                    className={'text-big'}>
                    Text Big
                </p>
                <p
                    style={{
                        marginBottom: 10,
                    }}
                    className={'text-normal-bold'}>
                    Text Normal Bold
                </p>
                <p
                    style={{ marginBottom: 10 }}
                    className={'text-normal'}>
                    Text Normal
                </p>
                <p
                    style={{ marginBottom: 10 }}
                    className={'text-small'}>
                    Text Small
                </p>
            </div>

            <div
                style={{
                    marginBottom: 40,
                    paddingBottom: 20,
                    borderBottom: '1px solid gray',
                }}>
                <h2 style={{ fontSize: 32, marginBottom: 20 }}>Grid</h2>

                <h3 style={{ fontSize: 20, marginBottom: 20 }}>Container</h3>
                <div
                    className={'container'}
                    style={{
                        border: '5px solid #ec7c7c',
                        height: 200,
                        marginBottom: 80,
                    }}></div>

                <h3 style={{ fontSize: 20, marginBottom: 20 }}>XXL</h3>
                <div
                    className='container'
                    style={{ marginBottom: 30 }}>
                    <div
                        className={'row'}
                        style={{ height: 200 }}>
                        <div
                            className={'col-xxl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xxl-1
                        </div>
                        <div
                            className={'col-xxl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xxl-1
                        </div>
                        <div
                            className={'col-xxl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xxl-1
                        </div>
                        <div
                            className={'col-xxl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xxl-1
                        </div>
                        <div
                            className={'col-xxl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xxl-1
                        </div>
                        <div
                            className={'col-xxl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xxl-1
                        </div>
                        <div
                            className={'col-xxl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xxl-1
                        </div>
                        <div
                            className={'col-xxl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xxl-1
                        </div>
                        <div
                            className={'col-xxl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xxl-1
                        </div>
                        <div
                            className={'col-xxl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xxl-1
                        </div>
                        <div
                            className={'col-xxl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xxl-1
                        </div>
                        <div
                            className={'col-xxl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xxl-1
                        </div>
                    </div>
                </div>

                <h3 style={{ fontSize: 20, marginBottom: 20 }}>XL</h3>
                <div
                    className='container'
                    style={{ marginBottom: 30 }}>
                    <div
                        className={'row'}
                        style={{ height: 200 }}>
                        <div
                            className={'col-xl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xl-1
                        </div>
                        <div
                            className={'col-xl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xl-1
                        </div>
                        <div
                            className={'col-xl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xl-1
                        </div>
                        <div
                            className={'col-xl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xl-1
                        </div>
                        <div
                            className={'col-xl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xl-1
                        </div>
                        <div
                            className={'col-xl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xl-1
                        </div>
                        <div
                            className={'col-xl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xl-1
                        </div>
                        <div
                            className={'col-xl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xl-1
                        </div>
                        <div
                            className={'col-xl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xl-1
                        </div>
                        <div
                            className={'col-xl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xl-1
                        </div>
                        <div
                            className={'col-xl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xl-1
                        </div>
                        <div
                            className={'col-xl-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-xl-1
                        </div>
                    </div>
                </div>

                <h3 style={{ fontSize: 20, marginBottom: 20 }}>L</h3>
                <div
                    className='container'
                    style={{ marginBottom: 30 }}>
                    <div
                        className={'row'}
                        style={{ height: 200 }}>
                        <div
                            className={'col-l-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-l-1
                        </div>
                        <div
                            className={'col-l-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-l-1
                        </div>
                        <div
                            className={'col-l-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-l-1
                        </div>
                        <div
                            className={'col-l-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-l-1
                        </div>
                        <div
                            className={'col-l-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-l-1
                        </div>
                        <div
                            className={'col-l-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-l-1
                        </div>
                        <div
                            className={'col-l-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-l-1
                        </div>
                        <div
                            className={'col-l-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-l-1
                        </div>
                        <div
                            className={'col-l-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-l-1
                        </div>
                        <div
                            className={'col-l-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-l-1
                        </div>
                        <div
                            className={'col-l-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-l-1
                        </div>
                        <div
                            className={'col-l-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-l-1
                        </div>
                    </div>
                </div>

                <h3 style={{ fontSize: 20, marginBottom: 20 }}>M</h3>
                <div
                    className='container'
                    style={{ marginBottom: 30 }}>
                    <div
                        className={'row'}
                        style={{ height: 200 }}>
                        <div
                            className={'col-m-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-m-1
                        </div>
                        <div
                            className={'col-m-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-m-1
                        </div>
                        <div
                            className={'col-m-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-m-1
                        </div>
                        <div
                            className={'col-m-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-m-1
                        </div>
                        <div
                            className={'col-m-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-m-1
                        </div>
                        <div
                            className={'col-m-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-m-1
                        </div>
                    </div>
                </div>

                <h3 style={{ fontSize: 20, marginBottom: 20 }}>S</h3>
                <div
                    className='container'
                    style={{ marginBottom: 30 }}>
                    <div
                        className={'row'}
                        style={{ height: 200 }}>
                        <div
                            className={'col-s-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-s-1
                        </div>
                        <div
                            className={'col-s-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-s-1
                        </div>
                        <div
                            className={'col-s-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-s-1
                        </div>
                        <div
                            className={'col-s-1'}
                            style={{ backgroundColor: '#D9D9D9' }}>
                            col-s-1
                        </div>
                    </div>
                </div>
            </div>

            <div
                style={{
                    marginBottom: 40,
                    paddingBottom: 20,
                    borderBottom: '1px solid gray',
                }}>
                <h2 style={{ fontSize: 32, marginBottom: 20 }}>Buttons</h2>
                <div className='container'>
                    <h3 style={{ fontSize: 20, marginBottom: 20 }}>Primary</h3>
                    <div
                        className='row'
                        style={{ marginBottom: 30 }}>
                        <div className='col-l-1'>
                            <ButtonPrimary>Button</ButtonPrimary>
                        </div>
                        <div className='col-l-1'>
                            <ButtonPrimaryLg>Button</ButtonPrimaryLg>
                        </div>
                        <div className='col-l-1'>
                            <ButtonPrimaryDisabled>
                                Button
                            </ButtonPrimaryDisabled>
                        </div>
                        <div className='col-l-1'>
                            <ButtonPrimaryLgDisabled>
                                Button
                            </ButtonPrimaryLgDisabled>
                        </div>
                        <div className='col-l-1'>
                            <ButtonPrimaryOutline>Button</ButtonPrimaryOutline>
                        </div>
                        <div className='col-l-1'>
                            <ButtonPrimaryOutline>Button</ButtonPrimaryOutline>
                        </div>
                    </div>

                    <h3 style={{ fontSize: 20, marginBottom: 20 }}>
                        Secondary
                    </h3>
                    <div
                        className='row'
                        style={{ marginBottom: 30 }}>
                        <div className='col-l-1'>
                            <ButtonSecondary>Button</ButtonSecondary>
                        </div>
                        <div className='col-l-1'>
                            <ButtonSecondaryOutline>
                                Button
                            </ButtonSecondaryOutline>
                        </div>
                        <div className='col-l-1'>
                            <ButtonSecondaryOutlineDisabled>
                                Button
                            </ButtonSecondaryOutlineDisabled>
                        </div>
                    </div>

                    <h3 style={{ fontSize: 20, marginBottom: 20 }}>Danger</h3>
                    <div
                        className='row'
                        style={{ marginBottom: 30 }}>
                        <div className='col-l-1'>
                            <ButtonOutlineDanger>Button</ButtonOutlineDanger>
                        </div>
                        <div className='col-l-1'>
                            <ButtonOutlineDangerLg>
                                Button
                            </ButtonOutlineDangerLg>
                        </div>
                    </div>

                    <h3 style={{ fontSize: 20, marginBottom: 20 }}>Gradient</h3>
                    <div
                        className='row'
                        style={{ marginBottom: 30 }}>
                        <div className='col-l-1'>
                            <ButtonGradientXlg>Button</ButtonGradientXlg>
                        </div>
                    </div>
                </div>
            </div>
            <div
                style={{
                    marginBottom: 40,
                    paddingBottom: 20,
                    borderBottom: '1px solid gray',
                }}>
                <h2 style={{ fontSize: 32, marginBottom: 20 }}>Inputs</h2>
                <div className='container'>
                    <div className='row'>
                        <div className='col-l-1'>
                            <TextFieldSecondary placeholder={'Placeholder'} />
                        </div>
                        <div className='col-l-1'>
                            <TextFieldSecondarySm placeholder={'Placeholder'} />
                        </div>
                        <div className='col-l-1'>
                            <TextFieldSecondaryDisabled
                                placeholder={'Placeholder'}
                            />
                        </div>
                        <div className='col-l-1'>
                            <SearchFieldSecondary placeholder={'Search...'} />
                        </div>
                        <div className='col-l-1'>
                            <TextAreaSecondary placeholder={'Placeholder'} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-l-1'>
                            <TextFieldDanger placeholder={'Placeholder'} />
                        </div>
                        <div className='col-l-3'>
                            <Dropdown
                                heading={'Select smth...'}
                                options={['Test123', 'Test322', 'Test42']}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div
                style={{
                    marginBottom: 40,
                    paddingBottom: 20,
                    borderBottom: '1px solid gray',
                }}>
                <h2 style={{ fontSize: 32, marginBottom: 20 }}>Other</h2>
                <div className='container'>
                    <div className='row'>
                        <ExternalLink>External Link</ExternalLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestUiKit;
