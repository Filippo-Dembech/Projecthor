import readline from 'readline';

export async function ask(prompt: string) {
	return (await new Promise(resolve => {
		const cliInterface = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		cliInterface.question(`${prompt}\n`, ans => {
			cliInterface.close();
			resolve(ans);
		});
	}) as string);
}
