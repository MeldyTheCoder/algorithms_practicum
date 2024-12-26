import { TFibMethod } from "../types"


function fib(n: number): number {
    if (n > 24) {
        throw new Error("Значение должно быть не больше 24.")
    } else if (n <= 1) {
        return n;
    } else {
        return fib(n - 1) + fib(n - 2);
    }
}


export default {
    label: "Фибоначчи | Рекурсивный метод",
    fn: fib,
    type: 'fib',
} as TFibMethod