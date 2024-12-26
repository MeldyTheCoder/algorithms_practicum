import { TFibMethod } from "../types";

function fib(n: number): number[] {
    if (n < 0 || n > 40) {
        throw new Error('Значение должно быть от 1 до 40');
    }

    const fibArray = [0, 1];

    for (let i = 2; i <= n; i++) {
        fibArray[i] = fibArray[i - 1] + fibArray[i - 2];
    }

    return fibArray;
}

export default {
    label: "Фибоначе | Метод с массивами",
    fn: fib,
    type: 'fib',
} as TFibMethod

