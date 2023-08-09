"use strict";

const vscode = require("vscode");

function onCommand() {
    let editor = vscode.window.activeTextEditor, 
        document = editor.document, 
        selections = editor.selections;
    
    editor.edit(function (editBuilder) {
        selections.forEach(function (selection) {
            if (!selection.isSingleLine) {
                return;
            }

            let range = new vscode.Range(selection.start, selection.end);

            if (!selection.isEmpty && selection.isSingleLine) {
                editBuilder.replace(
                    selection, 
                    toggleCase(document.getText(range))
                );
            }
        });
    });
}

function toggleCase(text) {
    if ( /_/.test(text) ) {
        return toCamelCase(text);
    } else {
        return toSnakeCase(text);
    }
}

function toCamelCase(text) {
    const words = text.split(/_+/);
    const Words = words.map(upFirstLetter);

    return [words[0], ...Words.slice(1)].join("");
}

function upFirstLetter(text) {
    if ( text.length === 0 ) {
        return text;
    }
    return text[0].toUpperCase() + text.slice(1);
}

function toSnakeCase(text) {
    return text.replace(/[A-ZА-ЯЁ]/g, letter => 
        "_" + letter.toLowerCase()
    ).replace(/^_/, "");
}

exports.activate = function activate(context) {
    let disposable = vscode.commands.registerCommand("extension.toggleCamelCase", onCommand);
    context.subscriptions.push(disposable);
};

exports.deactivate = function() {};