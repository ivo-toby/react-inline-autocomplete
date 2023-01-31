import React from 'react';
import styled from 'styled-components';
import memoize from 'lodash.memoize';
import { KeyEnum } from './KeyEnum';
import { ShouldRenderSugestionFn, GetSuggestionValueFn } from './types';
import Suggestion from './components/Suggestion';
import Input from './components/Input';
import {
    filterSuggestions,
    getNeedleFromString,
    getNextSafeIndexFromArray,
    getPreviousSafeIndexFromArray,
} from './utils';

const Wrapper = styled.div`
    position: relative;
`;

export interface InlineSuggestProps<T = string> {
    className?: string;
    getSuggestionValue?: GetSuggestionValueFn<T>;
    ignoreCase?: boolean;
    inputValue?: string;
    navigate?: boolean;
    shouldRenderSuggestion?: ShouldRenderSugestionFn;
    suggestions: T[];
    onInputBlur?(value: string): void;
    onInputChange?(newValue: string): void;
    onMatch?(matchedValue: T): void;
}

export interface State {
    activeIndex: number;
    focused: boolean;
    value: string;
}

export function InlineSuggest<T>({
    className,
    getSuggestionValue,
    ignoreCase,
    inputValue,
    navigate,
    shouldRenderSuggestion,
    suggestions,
    onInputBlur,
    onInputChange,
    onMatch,
}: InlineSuggestProps<T>) {
    const [activeIndex, setActiveIndex] = React.useState(-1);
    // const [focused, setFocused] = React.useState(false);
    const [value, setValue] = React.useState(inputValue || '');
    const memoizedFilterSuggestions = memoize(filterSuggestions);

    const getMatchedSuggestions = () => {
        return memoizedFilterSuggestions(
            value,
            suggestions,
            Boolean(ignoreCase),
            getSuggestionValue,
        ) as T[];
    };

    const fireOnChange = (newValue: string) => {
        if (onInputChange) {
            onInputChange(newValue);
        }
    };

    const handleOnChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const valueFromEvent = e.currentTarget.value;

        const newMatchedArray = memoizedFilterSuggestions(
            valueFromEvent,
            suggestions,
            Boolean(ignoreCase),
            getSuggestionValue,
        );
        setActiveIndex(newMatchedArray.length > 0 ? 0 : -1);
        setValue(valueFromEvent);
        fireOnChange(valueFromEvent);
    };

    const handleOnBlur = () => {
        if (onInputBlur) {
            onInputBlur(value);
        }
    };

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (activeIndex === -1) {
            return;
        }

        const { keyCode } = e;

        const allowedKeyCodes = [
            KeyEnum.TAB,
            KeyEnum.ENTER,
            KeyEnum.UP_ARROW,
            KeyEnum.DOWN_ARROW,
        ];

        if (allowedKeyCodes.includes(keyCode)) {
            e.preventDefault();
        }

        if (
            navigate &&
            (keyCode === KeyEnum.DOWN_ARROW || keyCode === KeyEnum.UP_ARROW)
        ) {
            const matchedSuggestions = getMatchedSuggestions();
            setActiveIndex(
                keyCode === KeyEnum.DOWN_ARROW
                    ? getNextSafeIndexFromArray(matchedSuggestions, activeIndex)
                    : getPreviousSafeIndexFromArray(
                          matchedSuggestions,
                          activeIndex,
                      ),
            );
        }
    };

    const handleOnKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const { keyCode } = e;

        if (
            activeIndex >= 0 &&
            (keyCode === KeyEnum.TAB ||
                keyCode === KeyEnum.ENTER ||
                keyCode === KeyEnum.RIGHT_ARROW)
        ) {
            const matchedSuggestions = getMatchedSuggestions();
            const matchedValue = matchedSuggestions[activeIndex];

            const newValue = getSuggestionValue
                ? getSuggestionValue(matchedValue)
                : String(matchedValue);

            setValue(newValue);

            fireOnChange(newValue);

            if (onMatch) {
                onMatch(matchedValue);
            }
        }
    };

    const getNeedle = () => {
        const matchedSuggestions = getMatchedSuggestions();

        if (!matchedSuggestions[activeIndex]) {
            return '';
        }

        return getNeedleFromString(
            getSuggestionValue
                ? getSuggestionValue(matchedSuggestions[activeIndex])
                : String(matchedSuggestions[activeIndex]),
            value,
        );
    };

    return (
        <Wrapper className={className}>
            <Input
                value={value}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                onKeyDown={handleOnKeyDown}
                onKeyUp={handleOnKeyUp}
            />
            <Suggestion
                value={value}
                needle={getNeedle()}
                shouldRenderSuggestion={shouldRenderSuggestion}
            />
        </Wrapper>
    );
}
