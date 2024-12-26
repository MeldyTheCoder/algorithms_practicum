import { TMethod, TMethodResult } from "./types";


export function executeMethod(method: TMethod<unknown>, value: number | string, filePath?: string): TMethodResult {
    const timeStarted = performance.now();
    const result = method.type === 'fib' ? method.fn(value) : method.fn(value, filePath);
    const timeElapsed = performance.now() - timeStarted;

    return {
        method: method,
        result: result,
        time: timeElapsed,
    };
}