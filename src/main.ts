import { createEffect, createEvent, createStore} from "effector";
import {createTerminal} from 'terminal-kit';
import * as methods from './methods';
import { FunctionResult, MethodExecutionFx, TFibMethod, TMethod, TMethodResult } from './types';
import { executeMethod } from './executor';

const terminal = createTerminal();

const BASE_CODE_FILE_PATH = './codes.json';

const setMethodIndex = createEvent<number>();
const setValue = createEvent<number | string>();
const setFilePath = createEvent<string>();


const methodExecutionFx = createEffect<MethodExecutionFx>(({methodIndex, value, filePath}) => {
    return executeMethodByIndex(methodIndex, value, filePath);
});


const $indexStore = createStore<number>(-1)
    .on(setMethodIndex, (_, value) => value)
    .on(methodExecutionFx.doneData, () => -1)

const $valueStore = createStore<number | string>(-1)
    .on(setValue, (_, value) => value)
    .on(methodExecutionFx.doneData, () => -1)

const $filePathStore = createStore<string>(BASE_CODE_FILE_PATH)
    .on(setFilePath, (_, value) => value)
    .on(methodExecutionFx.doneData, () => BASE_CODE_FILE_PATH)

const selectOptions: string[] = Object.values(methods).map(
    (method: TMethod<unknown>, index: number) => `${index + 1}. ${method.label}.`,
)

function executeMethodByIndex(index: number, value: number | string, filePath?: string): TMethodResult {
    const method = getMethodByIndex(index);
    return executeMethod(method, value, filePath);
}

function getMethodByIndex(index: number): TMethod<unknown> {
    return Object.values(methods).find((_, methodIndex) => index === methodIndex)
}

function isFibMethod(method: TMethod<unknown>): method is TFibMethod {
    return method.type === 'fib';
} 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorHandler(callback: () => any): any | never {
    try {
        return callback();
    } catch (e) {
        terminal.red.bold("\nОшибка: ").white(`${e.message}\n`);
        terminal.processExit(1);
    }
}

function getOutputForValueType(value: FunctionResult): string {
    switch (typeof value) {
        case 'string':
            return value;
        case 'number':
            return `${value}`
        case 'object':
            return Array.from(value.values()).join(', ')
        default:
            return '???'
    }
}

function start(): void {
    terminal.clear();
    terminal.bold.yellow("Выберите метод для подсчета:\n")
    terminal.singleColumnMenu(
        selectOptions,
        (_, response) => setMethodIndex(response.selectedIndex),
    )
};

setMethodIndex.watch((methodIndex) => {
    const method = getMethodByIndex(methodIndex);
    if (isFibMethod(method)) {
        terminal.yellow.bold("\nВведите целое число для подсчета: ")
        terminal.inputField(
            {}, 
            (_, value) => {
                if (!Number.isInteger(+value)) {
                    throw new Error("Написанное Вами значение должно быть целым числом!");
                } else if (+value <= 0) {
                    throw new Error("Значение должно быть больше 0!");
                }

                setValue(+value)
            },
        );
    } else {
        terminal.yellow.bold("\nВведите строку для манипуляций: ")
        terminal.inputField(
            {}, 
            (_, value) => {
                setValue(value)
            },
        );
    }
});

setValue.watch((value) => {
    const methodIndex = $indexStore.getState();
    const method = getMethodByIndex(methodIndex);

    const validHuffmanMethod = method.type === 'huffman' && typeof value === 'string';
    const validFibbMethod = method.type === 'fib' && typeof value === 'number';

    if (validFibbMethod && value < 0) return;
    if (validHuffmanMethod && value.length <= 0) return;
    if (!validFibbMethod && !validHuffmanMethod) return;

    if (!method) {
        throw new Error("Запрашиваемый Вами метод алгоритма не найден.")
    }

    if (method.type === 'huffman') {
        terminal.cyan.bold("\nВведите название файла ")
            .grey("(по-умолчанию src/codes.json)")
            .cyan.bold(': ');
        
        terminal.fileInput({
            baseDir: './src'
        }, (_, filePath) => {
            console.log(filePath);
            setFilePath(filePath || BASE_CODE_FILE_PATH);
        })
    } else {
        terminal.magenta.bold("\nПодождите, я что-то делаю...");
        methodExecutionFx({methodIndex, value});
    }
})

setFilePath.watch((filePath) => {
    const methodIndex = $indexStore.getState();
    const value = $valueStore.getState();
    methodExecutionFx({methodIndex, value, filePath});
})

methodExecutionFx.done.watch(({params, result}) => {
    if (!result) {
        return;
    }

    terminal( '\n' );

    const output = getOutputForValueType(result.result);
    const elapsedTimeString = result.time < 1 ? `${(result.time * 1000).toFixed(3)} мс.` : `${result.time.toFixed(5)} сек.`

    terminal.table([
        ["^BЗначение", "^BРезультат", "^BВремя", "^BМетод"],
        [`${params.value}`, `^g${output}`, `^Y${elapsedTimeString}`, `^b${result.method.label}`]
    ], {
        fit: true,
        contentHasMarkup: true,
        firstRowTextAttr: {
            bgColor: 'grey',
        },
    });

    terminal.processExit(1);
})

start();