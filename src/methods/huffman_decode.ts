import { readFileSync, existsSync } from "fs";
import { CodesType, THuffmanMethod } from "../types";
import { terminal } from "terminal-kit";

function huffman_decode(encodedString: string, filePath: string): string {
    if (!existsSync(filePath)) {
        throw new Error(`Запрашиваемый Вами файл "${filePath}" не найден.`)
    }

    const fileData = readFileSync(filePath, {encoding: 'utf-8'});
    if (!fileData) {
        throw new Error(
            `
                Для того, чтобы использовать данный метод, 
                сначала закодируйте любую строку, чтобы информация в файле "${filePath}" изменилась.
            `
        )
    }

    const codes: CodesType = JSON.parse(fileData);

    terminal.yellow.bold("\nНайденная таблица кодов:\n");
    terminal.table(
        [
            ['Символ', 'Код'],
            ...Object.entries(codes)
        ],
        {
            fit: true,
            contentHasMarkup: true,
            firstRowTextAttr: {
                bgColor: 'grey',
            },
            width: 30,
        }
        
    )

    const reversedCodes = Object.fromEntries(
        Object.entries(codes).map(([char, code]) => [code, char])
    );

    let decodedString = "";
    let buffer = "";

    for (const bit of encodedString) {
        buffer += bit;
        if (reversedCodes[buffer]) {
            decodedString += reversedCodes[buffer];
            buffer = "";
        }
    }

    return decodedString;
}


export default {
    label: "Хаффман | Декодирование",
    fn: huffman_decode,
    type: 'huffman',
} as THuffmanMethod