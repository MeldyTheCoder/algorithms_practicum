import { TFibMethod } from "../types";


function fib(n: number): number {
    let temp = 0;
    let prev = 1;
    let current = 1;

    if (n > 32) {
        throw new Error("Значение должно быть не более 32.")
    }
    
    if (n === 1 || n === 2) {
        return 1;
    }

    for (let i = 3; i <= n; i++) {
        temp = current;
        current = prev + current;
        prev = temp;
    }
    return current;
}

export default {
    label: 'Фибоначчи | Метод с циклами',
    fn: fib,
    type: 'fib',
} as TFibMethod