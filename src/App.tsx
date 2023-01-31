import React from 'react';
import logo from './logo.svg';
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
            username: 'xmazu',
            email: 'xmazu@yahoo.com',
        },
        {
            id: 2,
            username: 'john_doe',
            email: 'john@doe.com',
        },
    ];

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <InlineSuggest
                    suggestions={users}
                    inputValue={value}
                    onInputChange={onChangeValue}
                    onMatch={(v) => console.log(v)}
                    getSuggestionValue={(v) => v.username}
                />
            </header>
        </div>
    );
}

export default App;
