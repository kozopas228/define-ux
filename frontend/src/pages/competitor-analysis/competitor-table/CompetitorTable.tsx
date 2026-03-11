import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getMockedCompetitorAnalysisData } from '../getMockedCompetitorAnalysisData';
import styles from './CompetitorTable.module.css';
import CriteriaHeader from './criteria-header/CriteriaHeader';
import RowNumber from './row-number/RowNumber';
import CompetitorName from './competitor-name/CompetitorName';
import CriteriaValueComponent from './criteria-value/CriteriaValueComponent';
import RemoveRowButton from './remove-row-button/RemoveRowButton';
import { CompetitorResponseDto, CriteriaResponseDto } from '../types';
import Resizer from './resizer/Resizer';
import {
    COMPETITOR_NAME_CRITERIA_ID,
    DEFAULT_COLUMN_WIDTH_L,
    DEFAULT_COLUMN_WIDTH_S,
    SCREEN_MIN_BOUNDARY_L,
} from '../../../utils/constants';
import { useScreenSize } from '../../../hooks/useScreenSize';
import Spinner from '../../../components/spinner/Spinner';

interface IProps {
    data: CompetitorResponseDto[];
    setData: Dispatch<SetStateAction<CompetitorResponseDto[]>>;
    criterias: CriteriaResponseDto[];
    setCriterias: Dispatch<SetStateAction<CriteriaResponseDto[]>>;
}

const CompetitorTable = ({
    data,
    criterias,
    setData,
    setCriterias,
}: IProps) => {
    const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
        {}
    );

    const screenSize = useScreenSize();

    const DEFAULT_COLUMN_WIDTH =
        screenSize.width >= SCREEN_MIN_BOUNDARY_L
            ? DEFAULT_COLUMN_WIDTH_L
            : DEFAULT_COLUMN_WIDTH_S;

    return (
        <div className={styles['table_container']}>
            <table
                className={styles['table']}
                id={'competitor_table'}>
                <thead>
                    <tr className={styles['header_row']}>
                        <th
                            className={`${styles['header_item']} ${styles['header_row_number']}`}
                            id={'header_row_number'}>
                            <div
                                className={
                                    screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                        ? `text-big-bold color-white`
                                        : `text-normal-bold color-white`
                                }>
                                #
                            </div>
                        </th>
                        <th
                            className={`${styles['header_item']} ${styles['header_competitor_name']}`}
                            id={'header_competitor_name'}
                            style={{
                                minWidth:
                                    columnWidths[COMPETITOR_NAME_CRITERIA_ID] ||
                                    DEFAULT_COLUMN_WIDTH,
                            }}>
                            <div
                                className={
                                    screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                        ? `text-big-bold color-white`
                                        : `text-normal-bold color-white`
                                }>
                                Competitor Name
                            </div>
                            <Resizer
                                criteriaId={COMPETITOR_NAME_CRITERIA_ID}
                                setColumnWidths={setColumnWidths}
                                columnWidths={columnWidths}
                            />
                        </th>
                        {criterias.map((cr) => (
                            <th
                                className={styles['header_item']}
                                key={cr.id}
                                style={{
                                    minWidth:
                                        columnWidths[cr.id] ||
                                        DEFAULT_COLUMN_WIDTH,
                                }}>
                                <CriteriaHeader
                                    criteria={cr}
                                    setData={setData}
                                    setCriterias={setCriterias}
                                />
                                <Resizer
                                    criteriaId={cr.id}
                                    setColumnWidths={setColumnWidths}
                                    columnWidths={columnWidths}
                                />
                            </th>
                        ))}
                        <th
                            className={`${styles['header_item']} ${styles['header_delete_button']}`}
                            id={'header_delete_button'}></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((c, index) => (
                        <tr
                            key={c.id}
                            className={
                                screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                    ? `text-normal color-dark-900`
                                    : `text-small color-dark-900`
                            }>
                            <RowNumber
                                rowNumber={index + 1}
                                className={styles['td']}
                            />
                            <CompetitorName
                                competitor={c}
                                className={styles['td']}
                                setData={setData}
                            />
                            {c.criterias.map((cr) => (
                                <CriteriaValueComponent
                                    competitor={c}
                                    criteria={cr}
                                    className={styles['td']}
                                    key={cr.id}
                                    setData={setData}
                                />
                            ))}
                            <RemoveRowButton
                                className={styles['td']}
                                setData={setData}
                                competitorId={c.id}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CompetitorTable;
