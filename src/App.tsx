import React from 'react';
import './App.css';
import { InlineSuggest } from './inline-suggest';

function App() {
    const [value, setValue] = React.useState('');

    const onChangeValue = (newValue: string) => {
        setValue(newValue);
    };

    const users = [
        {
            id: 1,
            username: 'ivo toby',
            email: 'spam@me.com',
        },
        {
            id: 2,
            username: 'ivo test',
            email: 'john@doe.com',
        },

        {
            id: 2,
            username: 'john_doe',
            email: 'john@doe.com',
        },
        {
            id: 3,
            username: 'vikas kumar',
            email: 'john@doe.com',
        },
    ];

    return (
        <div className="App">
            <InlineSuggest
                suggestions={users}
                inputValue={value}
                onInputChange={onChangeValue}
                onMatch={(v) => console.log(v)}
                getSuggestionValue={(v) => v.username}
            />
        </div>
    );
}

export default App;
