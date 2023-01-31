import React from 'react';
import styled from 'styled-components';

import { commonStyles } from './common';

const StyledInput = styled.textarea`
    position: relative;
    z-index: 1;
    display: inline-block;
    background-color: transparent;
    width: 100%;
    height: 100%;

    ${commonStyles};
`;

export interface InputProps {
    value: string;
    onBlur?(e: React.FocusEvent<HTMLTextAreaElement>): void;
    onChange(e: React.FormEvent<HTMLTextAreaElement>): void;
    onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>): void;
    onKeyUp(e: React.KeyboardEvent<HTMLTextAreaElement>): void;
}

const Input: React.FunctionComponent<InputProps> = (props) => (
    <StyledInput {...props} />
);

export default Input;
