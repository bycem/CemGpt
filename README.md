# Generate Unit Test & Refactor Code Extension

This VS Code extension allows you to generate unit tests and refactor code snippets using OpenAI's API. It leverages the power of AI to automate the creation of unit tests and refactor code based on clean code principles and best practices.

## Features

- **Generate Unit Test**: Automatically generate unit tests for selected C# code using Moq, FluentAssertions, and AutoFixture if needed.
- **Refactor Code**: Refactor the selected C# code using clean code fundamentals and best practices.
- **Loading Indicator**: Displays a loading indicator while the API request is being processed.

## Installation

To install this extension:

1. Clone the repository or download the source code.
2. Navigate to the extension's root directory.
3. Run `npm install` to install the dependencies.
4. Package the extension using `vsce package`.
5. Install the extension in VS Code by opening the `.vsix` file or using the `Extensions: Install from VSIX...` command.

## Usage

### Generate Unit Test

1. Select the C# code in your editor that you want to generate a unit test for.
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac) to open the Command Palette.
3. Type `Generate Unit Test` and select the command.
4. The extension will send the selected code to OpenAI's API and generate a unit test based on the code. The generated test will be saved as a new file in your workspace.

### Refactor Code

1. Select the C# code in your editor that you want to refactor.
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac) to open the Command Palette.
3. Type `Refactor Code` and select the command.
4. The extension will send the selected code to OpenAI's API for refactoring. The refactored code will be saved as a new file in your workspace.

## Configuration

To use this extension, you need to set your OpenAI API key in the VS Code settings:

1. Open the settings (`Ctrl+,` or `Cmd+,`).
2. Search for `generateUnitTest.apiKey`.
3. Enter your OpenAI API key.

## Extension Settings

This extension contributes the following settings:

- `generateUnitTest.apiKey`: The API key used to authenticate with OpenAI's API.

## Requirements

- Visual Studio Code 1.60.0 or higher
- An OpenAI API key

## Known Issues

- The extension requires an active internet connection to communicate with OpenAI's API.
- Large code snippets may result in longer processing times.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
