export const helpMessage = 
`
	Usage
	  $ projecthor <command> <args[]> <options> 

	Commands
		save\t\t\t\tSave a project workspace(s)
		\t --source <file_path>\tProject setup file (.psup file) to setup new projects quickly

		load <project_name[]>\t\tLoad the workspace of the passed project(s)
		\t--shell, -s\t\tWhich shell to use to run project setup commands

		delete <project_name[]>\t\tDelete the passed project workspace(s)

		list\t\t\t\tList of all the available projects
		\t--full, -f\t\tShow full projects data with

		setdf\t\t\t\tSet a default folder where all projects are stored

		getdf\t\t\t\tGet the current default folder
	
	Project Setup File
	
		Project setup files (.psup) are files with a specific syntax that can be used
		to save one or more projects without using 'projecthor' save interface. They require
		a specific format:

		PROJECT:
			NAME: <project_name>
			FOLDER: <project_folder_path>
			COMMANDS:
				<first_command>
				<second_command>
				...
				<nth_command>
		
		Multiple projects can be declared in a .psup file:

		PROJECT:
			NAME: ...
			FOLDER: ...
			COMMANDS:
				...

		PROJECT:
			NAME: ...
			FOLDER: ...
			COMMANDS:
				...

		PROJECT:
			NAME: ...
			FOLDER: ...
			COMMANDS:
				...
`
