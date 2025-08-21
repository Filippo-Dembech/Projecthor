import { Box, Text } from "ink";
import React from "react";

interface TitleProps {
    children: React.ReactNode;
}


export default function Title({ children }: TitleProps) {
    return (
			<Box
				borderTop={false}
				borderLeft={false}
				borderRight={false}
				borderStyle="single"
				justifyContent="center"
			>
				<Text bold backgroundColor="blue">
                    {children}
				</Text>
			</Box>
    )
}