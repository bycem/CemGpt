const vscode = require('vscode');

function activate(context) {
    let generateUnitTestEvent = vscode.commands.registerCommand('extension.generateUnitTest', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        const apiKey = vscode.workspace.getConfiguration().get('generateUnitTest.apiKey');
        if (!apiKey) {
            vscode.window.showErrorMessage("OpenAI API key is not set. Please set it in the settings.");
            return;
        }

        const apiUrl = "https://api.openai.com/v1/chat/completions";

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Generating Unit Test...",
            cancellable: false
        }, async (progress) => {
            try {
                let messages = [
                    {
                        role: "system",
                        content: "write a unit test use moq, fluentassertion, autofixture if needed. " +
                            "Use clean code fundamentals. " +
                            "Return only code, without prefix and postfix like ```csharp ```."
                    },
                    {
                        role: "user",
                        content: selectedText
                    }
                ];

                const requestBody = {
                    model: "gpt-4o-mini",
                    messages: messages,
                    max_tokens: 2000
                };

                // Unit Test kodunu oluşturma isteği
                const codeResponse = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!codeResponse.ok) {
                    throw new Error(`HTTP error! status: ${codeResponse.status}`);
                }

                const codeResult = await codeResponse.json();
                const unitTestCode = codeResult.choices[0].message.content.trim();

                messages.push(codeResult.choices[0].message);
                messages.push({
                    role: "system",
                    content: "Get related filename of unit test. Just return filename with extension."
                });

                // Dosya adı için API isteği
                const fileNameRequest = {
                    model: "gpt-4o-mini",
                    messages: messages,
                    max_tokens: 200
                };

                const fileNameResponse = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(fileNameRequest)
                });

                if (!fileNameResponse.ok) {
                    throw new Error(`HTTP error! status: ${fileNameResponse.status}`);
                }

                const fileNameResult = await fileNameResponse.json();
                const newFileName = fileNameResult.choices[0].message.content.trim();

                const folderUri = await vscode.window.showOpenDialog({
                    canSelectFolders: true,
                    canSelectFiles: false,
                    canSelectMany: false,
                    openLabel: 'Select folder to save the Unit Test'
                });

                if (!folderUri || folderUri.length === 0) {
                    vscode.window.showErrorMessage('No folder selected. Operation cancelled.');
                    return;
                }

                const newFileUri = vscode.Uri.file(folderUri[0].fsPath + '/' + newFileName);

                // Create and open the new file
                await vscode.workspace.fs.writeFile(newFileUri, Buffer.from(''));

                vscode.workspace.openTextDocument(newFileUri).then((document) => {
                    const edit = new vscode.WorkspaceEdit();
                    edit.insert(newFileUri, new vscode.Position(0, 0), unitTestCode);
                    return vscode.workspace.applyEdit(edit).then(() => {
                        document.save().then(() => {
                            vscode.window.showInformationMessage("Unit test generated successfully!");
                        });
                    });
                });

                vscode.window.showInformationMessage("Unit test generated successfully!");
            } catch (error) {
                vscode.window.showErrorMessage("Failed to generate unit test: " + error.message);
            }
        });
    });

    let refactorCodeEvent = vscode.commands.registerCommand('extension.refactorCode', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        const apiKey = vscode.workspace.getConfiguration().get('generateUnitTest.apiKey');
        if (!apiKey) {
            vscode.window.showErrorMessage("OpenAI API key is not set. Please set it in the settings.");
            return;
        }

        const apiUrl = "https://api.openai.com/v1/chat/completions";

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Refactoring Code...",
            cancellable: false
        }, async (progress) => {
            try {

                const originalFilePath = editor.document.uri.fsPath;
                const originalDir = originalFilePath.substring(0, originalFilePath.lastIndexOf('/'));
                const originalFileName = originalFilePath.split('/').pop();
                const refactoredFileName = originalFileName.replace('.cs', 'Refactored.cs');
                const newFileUri = vscode.Uri.parse('untitled:' + originalDir + '/' + refactoredFileName);

                let messages = [
                    {
                        role: "system",
                        content: "Refactor the given code to follow clean code principles and best practices. " +
                            "Return only the refactored code, without prefix and postfix like ```csharp ```."
                    },
                    {
                        role: "user",
                        content: selectedText
                    }
                ];

                const requestBody = {
                    model: "gpt-4o-mini",
                    messages: messages,
                    max_tokens: 1000
                };

                // Refactoring code request
                const codeResponse = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!codeResponse.ok) {
                    throw new Error(`HTTP error! status: ${codeResponse.status}`);
                }
                
                const codeResult = await codeResponse.json();
                const refactoredCode = codeResult.choices[0].message.content.trim();



                // Creating a new file and inserting refactored code
                const document = await vscode.workspace.openTextDocument(newFileUri);
                const edit = new vscode.WorkspaceEdit();
                edit.insert(newFileUri, new vscode.Position(0, 0), refactoredCode);
                await vscode.workspace.applyEdit(edit);
                await document.save();

                vscode.window.showInformationMessage("Code refactored successfully!");
            } catch (error) {
                vscode.window.showErrorMessage("Failed to refactor code: " + error.message);
            }
        });
    });

    context.subscriptions.push(generateUnitTestEvent);
    context.subscriptions.push(refactorCodeEvent);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
