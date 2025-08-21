import React from 'react';
import {Text, useFocus, useInput} from 'ink';
import {UncontrolledTextInput} from 'ink-text-input';
import {useState} from 'react';

interface RequiredInputProps {
	label: string;
	placeholder: string;
    errorMessage: string;
    onSubmit: (value: string) => void;
}

export default function RequiredInput({
	label,
	placeholder,
    errorMessage,
    onSubmit,
}: RequiredInputProps) {
	const {isFocused} = useFocus({id: label.toLowerCase()});
	const [error, setError] = useState('');

	useInput(() => {
		setError('');
	});

	return (
		<>
			<Text bold={!isFocused}>{label}: </Text>
			<UncontrolledTextInput
				focus={isFocused}
				placeholder={placeholder}
				onSubmit={value => {
					if (value === '') {
						setError(errorMessage);
					} else {
                        onSubmit(value);
					}
				}}
			/>
            {error && <Text color="red">{error}</Text>}
		</>
	);
}
